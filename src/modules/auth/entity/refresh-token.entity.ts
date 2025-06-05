import { SessionEntity } from "src/modules/sessions/entities/session.entity";
import { UserEntity } from "src/modules/users/entity/user.entity";
import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('refresh_tokens')
@Index(['sessionId', 'revoked'])
@Index(['userId', 'revoked'])
export class RefreshTokenEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'token_hash' })
    tokenHash: string;

    @Column({ name: 'user_id', type: 'uuid' })
    userId: string;

    @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;

    @Column({ name: 'session_id', type: 'uuid' })
    sessionId: string;

    @ManyToOne(() => SessionEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'session_id' })
    session: SessionEntity;

    @Column({ default: false })
    revoked: boolean;

    @Column({ name: 'device_info', type: 'text', nullable: true })
    deviceInfo: string;

    @Column({ name: 'ip_address', type: 'varchar', length: 45, nullable: true })
    ipAddress: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
