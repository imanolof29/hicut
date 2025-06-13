import { AppointmentEntity } from "src/modules/appointments/entity/appointment.entity";
import { AuthProviderEnum } from "src/modules/auth/auth-provider.enum";
import { RefreshTokenEntity } from "src/modules/auth/entity/refresh-token.entity";
import { BusinessEntity } from "src/modules/businesses/entities/business.entity";
import { SessionEntity } from "src/modules/sessions/entities/session.entity";
import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum UserRoleEnum {
    CLIENT = "client",
    SALON_OWNER = "salon_owner",
    SALON_WORKER = "salon_worker",
    ADMIN = "admin"
}

@Entity("users")
@Index(['email'])
@Index(['phone'])
export class UserEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ name: 'first_name', type: "varchar", length: 100 })
    firstName: string;

    @Column({ name: 'last_name', type: "varchar", length: 100 })
    lastName: string;

    @Column({ type: "varchar", length: 255, unique: true })
    email: string;

    @Column({ type: "varchar", length: 15, unique: true, nullable: true })
    phone: string;

    @Column({ type: "varchar", nullable: true })
    password: string;

    @Column({
        type: "enum",
        enum: AuthProviderEnum,
        default: AuthProviderEnum.email
    })
    provider: AuthProviderEnum;

    @Column({
        type: "enum",
        enum: UserRoleEnum,
        default: UserRoleEnum.CLIENT
    })
    role: UserRoleEnum;

    @Column({ type: "varchar", length: 255, nullable: true })
    avatar: string;

    @Column({ name: 'confirmation_token', type: "varchar", length: 255, nullable: true })
    confirmationToken: string;

    @Column({ name: 'is_active', type: "boolean", default: true })
    isActive: boolean;

    @OneToMany(() => SessionEntity, session => session.user)
    sessions: SessionEntity[];

    @OneToMany(() => RefreshTokenEntity, refreshToken => refreshToken.user)
    refreshTokens: RefreshTokenEntity[];

    @OneToMany(() => AppointmentEntity, appointment => appointment.user)
    appointments: AppointmentEntity[];

    @OneToOne(() => BusinessEntity, business => business.owner)
    ownedBusiness: BusinessEntity;

    @Column({ type: "uuid", nullable: true, name: 'workplace_id' })
    workplaceId: string;

    @ManyToOne(() => BusinessEntity, business => business.employees, { nullable: true })
    @JoinColumn({ name: 'workplace_id' })
    workplace: BusinessEntity;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}