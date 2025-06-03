import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity, UserRoleEnum } from './entity/user.entity';
import { Repository } from 'typeorm';
import { UserDto } from './dto/user.dto';
import { AuthProviderEnum } from '../auth/auth-provider.enum';
import { UpdateUserDto } from './dto/update-user.dto';

interface UserData {
    firstName: string,
    lastName: string,
    email: string
    password: string
    provider: AuthProviderEnum
    role: UserRoleEnum,
    confirmationToken: string
    isActive: true
}

@Injectable()
export class UsersService {

    private readonly logger = new Logger(UsersService.name)

    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>
    ) { }

    async findById(id: string): Promise<UserDto> {
        try {
            const user = await this.userRepository.findOneBy({ id })
            if (!user) {
                throw new NotFoundException(`User with ID ${id} not found`)
            }
            return this.mapToDto(user)
        } catch (error) {
            this.logger.error(`Error checking if the user exists with ID ${id}: `, error)
            throw error
        }
    }

    async findByEmail(email: string): Promise<UserEntity> {
        try {
            const user = await this.userRepository.findOneBy({ email })
            if (!user) {
                throw new NotFoundException(`User with EMAIL ${email} not found`)
            }
            return user
        } catch (error) {
            this.logger.error(`Error checking if the user exists with EMAIL ${email}: `, error)
            throw error
        }
    }

    async createUser(userData: UserData): Promise<UserEntity> {
        try {
            const newUser = await this.userRepository.create({
                ...userData
            })
            return this.userRepository.save(newUser)
        } catch (error) {
            this.logger.error('Error creating user: ', error)
            throw error
        }
    }

    async updateUser(id: string, dto: UpdateUserDto): Promise<void> {
        try {
            const user = await this.userRepository.findOneBy({ id })
            if (!user) throw new NotFoundException(`User with ID ${id} not found`)
            Object.assign(user, dto)
            await this.userRepository.save(user)
        } catch (error) {
            this.logger.error('Error updating user: ', error)
            throw error
        }
    }

    private mapToDto(user: UserEntity): UserDto {
        return {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        }
    }

}
