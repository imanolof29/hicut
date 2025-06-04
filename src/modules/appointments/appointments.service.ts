import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppointmentEntity, AppointmentStatus } from './entity/appointment.entity';
import { Between, In, Not, Repository } from 'typeorm';
import { BusinessEntity } from '../businesses/entities/business.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { AppointmentDto } from './dto/appointment.dto';
import { AppointmentAvailability } from './types/appointment-availability';

@Injectable()
export class AppointmentsService {

    constructor(
        @InjectRepository(AppointmentEntity)
        private readonly appointmentRepository: Repository<AppointmentEntity>,
        @InjectRepository(BusinessEntity)
        private readonly businessRepository: Repository<BusinessEntity>
    ) { }

    async create(dto: CreateAppointmentDto, userId: string) {
        const business = await this.businessRepository.findOneBy({ id: dto.businessId })
        if (!business) {
            throw new NotFoundException(`Business with ID ${dto.businessId} not found`)
        }
        await this.validateTimeSlotAvailability(dto.businessId, dto.appointmentDate, dto.startTime, dto.endTime)
        const appointment = this.appointmentRepository.create({
            ...dto,
            userId,
            status: AppointmentStatus.PENDING
        })
        await this.appointmentRepository.save(appointment)
    }

    async findOne(id: string): Promise<AppointmentDto> {
        const appointment = await this.findById(id)
        return this.convertToDto(appointment)
    }

    async confirm(id: string) {
        const appointment = await this.findById(id)
        if (appointment.status !== AppointmentStatus.PENDING) {
            throw new BadRequestException('Only pending appointments can be confirmed')
        }
        const updateData: Partial<AppointmentEntity> = {
            status: AppointmentStatus.CONFIRMED
        }
        await this.appointmentRepository.update(id, updateData)
    }

    async cancel(id: string, reason?: string): Promise<void> {
        const appointment = await this.findById(id)
        if (![AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED].includes(appointment.status)) {
            throw new BadRequestException('Cannot cancel this appointment')
        }
        const updateData: Partial<AppointmentEntity> = {
            status: AppointmentStatus.CANCELLED
        }
        await this.appointmentRepository.update(id, updateData)
    }

    async complete(id: string): Promise<void> {
        const appointment = await this.findById(id)
        if (appointment.status !== AppointmentStatus.CONFIRMED) {
            throw new BadRequestException('Cannot complete appointment')
        }
        const updateData: Partial<AppointmentEntity> = {
            status: AppointmentStatus.COMPLETED,
            completedAt: new Date()
        }
        await this.appointmentRepository.update(id, updateData)
    }

    async markAsNoShow(id: string): Promise<void> {
        const appointment = await this.findById(id)
        if (appointment.status !== AppointmentStatus.CONFIRMED) {
            throw new BadRequestException('Only confirmed appointments can be marked as no show')
        }
        const updateData: Partial<AppointmentEntity> = {
            status: AppointmentStatus.NO_SHOW
        }
        await this.appointmentRepository.update(id, updateData)
    }

    async getAvailability(
        businessId: string,
        dateFrom: Date,
        dateTo: Date
    ): Promise<AppointmentAvailability[]> {
        const business = await this.businessRepository.findOne({ where: { id: businessId } });
        if (!business) {
            throw new NotFoundException('Negocio no encontrado');
        }

        const existingAppointments = await this.appointmentRepository.find({
            where: {
                businessId,
                appointmentDate: Between(dateFrom, dateTo),
                status: Not(In([AppointmentStatus.CANCELLED, AppointmentStatus.NO_SHOW]))
            },
            select: ['appointmentDate', 'startTime', 'endTime']
        });

        const availability: AppointmentAvailability[] = [];
        const currentDate = new Date(dateFrom);

        while (currentDate <= dateTo) {
            const dateStr = currentDate.toISOString().split('T')[0];
            const dayAppointments = existingAppointments.filter(apt =>
                apt.appointmentDate.toISOString().split('T')[0] === dateStr
            );

            const allSlots = this.generateTimeSlots('09:00', '18:00', 30);
            const bookedSlots = dayAppointments.map(apt => apt.startTime);
            const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));

            availability.push({
                date: dateStr,
                availableSlots,
                bookedSlots
            });

            currentDate.setDate(currentDate.getDate() + 1);
        }

        return availability;
    }

    private async validateTimeSlotAvailability(
        businessId: string,
        appointmentDate: Date,
        startTime: string,
        endTime: string
    ) {
        const queryBuilder = this.appointmentRepository
            .createQueryBuilder('appointments')
            .where('appointment.businessId = :businessId', { businessId })
            .andWhere('DATE(appointment.appointmentDate) = DATE(:appointmentDate)', { appointmentDate })
            .andWhere('appointment.status NOT IN (:...excludedStatuses)', {
                excludedStatuses: [AppointmentStatus.CANCELLED, AppointmentStatus.NO_SHOW]
            })
            .andWhere(
                '(appointment.startTime < :endTime AND appointment.endTime > :startTime)',
                { startTime, endTime }
            )
        const conflictingAppointment = await queryBuilder.getOne()
        if (conflictingAppointment) {
            throw new ConflictException('The requested time is not available')
        }
    }

    private async findById(id: string): Promise<AppointmentEntity> {
        const appointment = await this.appointmentRepository.findOne({
            where: { id },
            relations: ['bussiness', 'user']
        })
        if (!appointment) {
            throw new NotFoundException(`Appointment with ID ${id} not found`)
        }
        return appointment
    }

    private generateTimeSlots(startTime: string, endTime: string, intervalMinutes: number): string[] {
        const slots: string[] = [];
        const start = new Date(`1970-01-01T${startTime}`);
        const end = new Date(`1970-01-01T${endTime}`);

        let current = new Date(start);
        while (current < end) {
            slots.push(current.toTimeString().slice(0, 5));
            current.setMinutes(current.getMinutes() + intervalMinutes);
        }

        return slots;
    }


    private convertToDto(entity: AppointmentEntity): AppointmentDto {
        return {
            id: entity.id,
            businessId: entity.businessId,
            businessName: entity.business.name,
            userId: entity.userId,
            userEmail: entity.user.email,
            appointmentDate: entity.appointmentDate,
            startTime: entity.startTime,
            endTime: entity.endTime,
            status: entity.status,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt
        }
    }

}
