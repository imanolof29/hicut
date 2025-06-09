import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BusinessServiceEntity } from "./entities/business-services.entity";
import { Repository } from "typeorm";
import { BusinessEntity } from "./entities/business.entity";
import { CreateBusinessServiceDto } from "./dto/create-business-service.dto";
import { BusinessServiceDto } from "./dto/business-service.dto";

@Injectable()
export class BusinessServicesService {
    constructor(
        @InjectRepository(BusinessServiceEntity)
        private readonly businessServicesRepository: Repository<BusinessServiceEntity>,
        @InjectRepository(BusinessEntity)
        private readonly businessRepository: Repository<BusinessEntity>
    ) { }

    async find(id: string): Promise<BusinessServiceDto[]> {
        const business = await this.businessServicesRepository.findOneBy({ id })
        if (!business) {
            throw new NotFoundException(`Business with ID ${id} not found`)
        }
        const services = await this.businessServicesRepository.find({
            where: {
                business
            }
        })
        return this.mapToDto(services)
    }

    async create(id: string, dto: CreateBusinessServiceDto): Promise<void> {
        const business = await this.businessRepository.findOneBy({ id })
        if (!business) {
            throw new NotFoundException(`Business with ID ${id} not found`)
        }
        await this.businessServicesRepository.create({
            ...dto,
            business
        })
    }

    private mapToDto(entities: BusinessServiceEntity[]): BusinessServiceDto[] {
        return entities.map((entity) => ({
            id: entity.id,
            name: entity.name,
            price: entity.price
        }))
    }

}