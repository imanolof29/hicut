import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessEntity } from './entities/business.entity';
import { Repository } from 'typeorm';
import { UserEntity, UserRoleEnum } from '../users/entity/user.entity';
import { BusinessDto } from './dto/business.dto';
import { CreateBusinessDto } from './dto/create-business.dto';

@Injectable()
export class BusinessesService {
    constructor(
        @InjectRepository(BusinessEntity)
        private readonly businessRepository: Repository<BusinessEntity>,
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>
    ) { }

    async create(dto: CreateBusinessDto, userId: string): Promise<void> {
        const owner = await this.userRepository.findOneBy({ id: userId })
        if (!owner) {
            throw new NotFoundException('User not found')
        }
        const existingBusiness = await this.businessRepository.findOne({
            where: {
                email: dto.email
            }
        })
        if (existingBusiness) {
            throw new ConflictException(`Business with email ${dto.email} already exists`)
        }
        const business = this.businessRepository.create({
            ...dto,
            owner
        })
        await this.businessRepository.save(business)
        await this.userRepository.update(userId, {
            role: UserRoleEnum.SALON_OWNER
        })
    }

    async findOne(id: string): Promise<BusinessDto> {
        const business = await this.businessRepository.findOne({
            where: { id },
        })
        if (!business) {
            throw new NotFoundException(`Business with ID ${id} not found`)
        }
        return this.mapEntityToDto(business)
    }

    private mapEntityToDto(business: BusinessEntity): BusinessDto {
        return {
            id: business.id
        }
    }

}
