import { RefreshTokenEntity } from "src/modules/auth/entity/refresh-token.entity";
import { UserEntity } from "src/modules/users/entity/user.entity";
import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("sessions")
@Index(['userId', 'active'])
export class SessionEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ name: 'user_id', type: "uuid" })
    userId: string;

    @ManyToOne(() => UserEntity, user => user.sessions, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;

    @Column({ type: "boolean", default: true })
    active: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @Column({ name: 'refreshed_at', type: "timestamp", nullable: true })
    refreshedAt: Date;

    @OneToMany(() => RefreshTokenEntity, refreshToken => refreshToken.session)
    refreshTokens: RefreshTokenEntity[];
}