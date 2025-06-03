import { ConflictException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SessionsService } from '../sessions/sessions.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { AuthProviderEnum } from './auth-provider.enum';
import { UserEntity, UserRoleEnum } from '../users/entity/user.entity';
import { SignInDto } from './dto/sign-in.dto';

@Injectable()
export class AuthService {

    private readonly logger = new Logger(AuthService.name)

    constructor(
        private readonly usersService: UsersService,
        private readonly sessionService: SessionsService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) { }

    async signUp(dto: SignUpDto) {
        const exisingUser = await this.usersService.findByEmail(dto.email)
        if (exisingUser) {
            throw new ConflictException('User with this email already exists');
        }
        const hashedPassword = await this.hashPassword(dto.password);

        const newUser = await this.usersService.createUser({
            firstName: dto.firstName,
            lastName: dto.lastName,
            email: dto.email.toLowerCase(),
            password: hashedPassword,
            provider: AuthProviderEnum.email,
            role: UserRoleEnum.CLIENT,
            confirmationToken: await this.generateConfirmationToken(),
            isActive: true,
        });

        this.logger.log(`User signed up successfully with ID: ${newUser.id}`);

        return await this.createAuthSession(newUser)
    }

    async signIn(dto: SignInDto) {
        try {
            const user = await this.usersService.findByEmail(dto.email)
            const isPasswordValid = await this.verifyPassword(dto.password, user.password)
            if (!isPasswordValid) {
                throw new UnauthorizedException('Invalid credentials')
            }
            this.logger.log(`User signed up successfully with ID: ${user.id}`);

            return await this.createAuthSession(user)
        } catch (error) {
            this.logger.log('Sign in error ', error)
            throw error
        }
    }

    async signOut(sessionId: string) {
        await this.sessionService.invalidate(sessionId)
    }

    private async generateTokens(user: UserEntity, sessionId: string): Promise<{ accessToken: string, refreshToken: string }> {
        const payload = {
            sub: user.id,
            email: user.email,
            sessionId
        }
        const accessToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>(''),
            expiresIn: this.configService.get<string>('')
        })
        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>(''),
            expiresIn: this.configService.get<string>('')
        })
        return {
            accessToken,
            refreshToken
        }
    }

    private async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 10)
    }

    private async generateConfirmationToken(): Promise<string> {
        return crypto.randomBytes(32).toString('hex');
    }

    private mapUserToResponse(userEntity: UserEntity) {
        return {
            id: userEntity.id,
            firstName: userEntity.firstName,
            lastName: userEntity.lastName,
            email: userEntity.email
        }
    }

    private async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(password, hashedPassword)
    }

    private async createAuthSession(user: UserEntity) {
        const session = await this.sessionService.create(user.id)
        const tokens = await this.generateTokens(user, session.id)
        return {
            user: this.mapUserToResponse(user),
            session: session.id,
            ...tokens
        }
    }

}
