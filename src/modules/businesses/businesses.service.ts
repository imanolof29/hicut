import { Injectable } from '@nestjs/common';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessEntity } from './entities/business.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BusinessesService {
    constructor(
        @InjectRepository(BusinessEntity)
        private readonly businessRepository: Repository<BusinessEntity>
    ) { }

}
