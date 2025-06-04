import { AppointmentEntity } from "src/modules/appointments/entity/appointment.entity";
import { AuthProviderEnum } from "src/modules/auth/auth-provider.enum";
import { BusinessEntity } from "src/modules/businesses/entities/business.entity";
import { SessionEntity } from "src/modules/sessions/entities/session.entity";
import { Column, CreateDateColumn, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum UserRoleEnum {
    CLIENT = "client",
    SALON_OWNER = "salon_owner",
    SALON_WORKER = "salon_worker",
    ADMIN = "admin"
}

@Entity("users")
export class UserEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "varchar", length: 100 })
    firstName: string;

    @Column({ type: "varchar", length: 100 })
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

    @Column({ type: "varchar", length: 255, nullable: true })
    confirmationToken: string;

    @Column({ type: "boolean", default: true })
    isActive: boolean;

    @OneToMany(() => SessionEntity, session => session.user)
    sessions: SessionEntity[];

    @OneToMany(() => AppointmentEntity, appointment => appointment.user)
    appointments: AppointmentEntity[]

    @OneToMany(() => BusinessEntity, business => business.owner)
    ownedBusinesses: BusinessEntity[];

    @ManyToMany(() => BusinessEntity, business => business.employees)
    workplaces: BusinessEntity[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}