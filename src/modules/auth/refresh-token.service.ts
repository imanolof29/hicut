import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RefreshTokenEntity } from "./entity/refresh-token.entity";
import { Repository } from "typeorm";
import * as bcrypt from 'bcrypt';

@Injectable()
export class RefreshTokenService {

    private readonly logger = new Logger(RefreshTokenService.name)

    constructor(
        @InjectRepository(RefreshTokenEntity)
        private readonly refreshTokenRepository: Repository<RefreshTokenEntity>
    ) { }

    async create(
        userId: string,
        sessionId: string,
        token: string,
        deviceInfo?: string,
        ipAddress?: string
    ): Promise<RefreshTokenEntity> {
        const tokenHash = await bcrypt.hash(token, 10);

        const refreshToken = this.refreshTokenRepository.create({
            userId,
            sessionId,
            tokenHash,
            deviceInfo,
            ipAddress,
            revoked: false
        });

        const savedToken = await this.refreshTokenRepository.save(refreshToken);
        this.logger.log(`Refresh token created for session: ${sessionId}`);
        return savedToken;
    }

    async findBySessionId(sessionId: string): Promise<RefreshTokenEntity | null> {
        return this.refreshTokenRepository.findOne({
            where: { sessionId, revoked: false },
        });
    }

    async verifyToken(token: string, sessionId: string): Promise<RefreshTokenEntity | null> {
        const refreshTokenEntity = await this.findBySessionId(sessionId);

        if (!refreshTokenEntity) {
            return null;
        }

        const isValid = await bcrypt.compare(token, refreshTokenEntity.tokenHash);
        return isValid ? refreshTokenEntity : null;
    }

    async updateToken(sessionId: string, newToken: string): Promise<void> {
        const tokenHash = await bcrypt.hash(newToken, 10);

        await this.refreshTokenRepository.update(
            { sessionId, revoked: false },
            { tokenHash, updatedAt: new Date() }
        );

        this.logger.log(`Refresh token updated for session: ${sessionId}`);
    }

    async revokeBySessionId(sessionId: string): Promise<void> {
        await this.refreshTokenRepository.update(
            { sessionId },
            { revoked: true }
        );

        this.logger.log(`Refresh token revoked for session: ${sessionId}`);
    }

    async revokeAllForUser(userId: string): Promise<void> {
        await this.refreshTokenRepository.update(
            { userId },
            { revoked: true }
        );

        this.logger.log(`All refresh tokens revoked for user: ${userId}`);
    }

}