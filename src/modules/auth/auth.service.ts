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
import { RefreshTokenService } from './refresh-token.service';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {

    private readonly logger = new Logger(AuthService.name)

    constructor(
        private readonly usersService: UsersService,
        private readonly refreshTokenService: RefreshTokenService,
        private readonly sessionService: SessionsService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) { }

    async signUp(dto: SignUpDto, deviceInfo?: string, ipAddress?: string): Promise<AuthDto> {
        const existingUser = await this.usersService.findByEmail(dto.email);
        if (existingUser) {
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

        return await this.createAuthSession(newUser, deviceInfo, ipAddress);
    }

    async signIn(dto: SignInDto, deviceInfo?: string, ipAddress?: string): Promise<AuthDto> {
        try {
            const user = await this.usersService.findByEmail(dto.email);

            if (!user) {
                throw new UnauthorizedException('Invalid credentials');
            }

            const isPasswordValid = await this.verifyPassword(dto.password, user.password);
            if (!isPasswordValid) {
                throw new UnauthorizedException('Invalid credentials');
            }

            this.logger.log(`User signed in successfully with ID: ${user.id}`);

            return await this.createAuthSession(user, deviceInfo, ipAddress);
        } catch (error) {
            this.logger.error('Sign in error:', error.message);
            throw error;
        }
    }

    async signOut(sessionId: string): Promise<void> {
        try {
            await this.sessionService.invalidate(sessionId);
            await this.refreshTokenService.revokeBySessionId(sessionId);
            this.logger.log(`User signed out successfully from session: ${sessionId}`);
        } catch (error) {
            this.logger.error('Sign out error:', error.message);
            throw error;
        }
    }

    async refreshTokens(refreshToken: string): Promise<AuthDto> {
        try {
            const payload = this.jwtService.verify(refreshToken, {
                secret: this.configService.get<string>('REFRESH_SECRET')
            });

            const tokenEntity = await this.refreshTokenService.verifyToken(refreshToken, payload.sessionId);
            if (!tokenEntity) {
                throw new UnauthorizedException('Invalid refresh token');
            }

            const sessionValid = await this.sessionService.isValid(payload.sessionId);
            if (!sessionValid) {
                throw new UnauthorizedException('Session expired');
            }

            const user = await this.usersService.findEntityById(payload.sub);
            if (!user) {
                throw new UnauthorizedException('User not found');
            }

            const newTokens = await this.generateTokens(user, payload.sessionId);

            await this.refreshTokenService.updateToken(payload.sessionId, newTokens.refreshToken);

            await this.sessionService.updateRefreshedAt(payload.sessionId);

            this.logger.log(`Tokens refreshed for session: ${payload.sessionId}`);

            return {
                user: this.mapUserToResponse(user),
                session: payload.sessionId,
                ...newTokens
            };

        } catch (error) {
            this.logger.error('Refresh token error:', error.message);
            throw new UnauthorizedException('Invalid refresh token');
        }
    }

    private async generateTokens(user: UserEntity, sessionId: string): Promise<{ accessToken: string, refreshToken: string }> {
        const payload = {
            sub: user.id,
            email: user.email,
            sessionId,
            role: user.role
        };
        const accessToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('JWT_SECRET'),
            expiresIn: this.configService.get<string>('JWT_EXPIRES_IN')
        });

        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('REFRESH_SECRET'),
            expiresIn: this.configService.get<string>('REFRESH_EXPIRES_IN')
        });

        return {
            accessToken,
            refreshToken
        };
    }

    private async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 10);
    }

    private async generateConfirmationToken(): Promise<string> {
        return crypto.randomBytes(32).toString('hex');
    }

    private mapUserToResponse(userEntity: UserEntity) {
        return {
            id: userEntity.id,
            firstName: userEntity.firstName,
            lastName: userEntity.lastName,
            email: userEntity.email,
            role: userEntity.role
        };
    }

    private async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(password, hashedPassword);
    }

    private async createAuthSession(user: UserEntity, deviceInfo?: string, ipAddress?: string): Promise<AuthDto> {
        try {
            const session = await this.sessionService.create(user.id);

            const tokens = await this.generateTokens(user, session.id);

            await this.refreshTokenService.create(
                user.id,
                session.id,
                tokens.refreshToken,
                deviceInfo,
                ipAddress
            );

            return {
                user: this.mapUserToResponse(user),
                session: session.id,
                ...tokens
            };
        } catch (error) {
            this.logger.error('Create auth session error:', error.message);
            throw error;
        }
    }
}