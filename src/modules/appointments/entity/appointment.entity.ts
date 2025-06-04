import { BusinessEntity } from "src/modules/businesses/entities/business.entity";
import { UserEntity } from "src/modules/users/entity/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum AppointmentStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
    NO_SHOW = 'no_show'
}

@Entity("appointments")
export class AppointmentEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({ type: "uuid" })
    businessId: string

    @ManyToOne(() => BusinessEntity, { eager: false })
    @JoinColumn({ name: 'businessId' })
    business: BusinessEntity

    @Column({ type: "uuid" })
    userId: string

    @ManyToOne(() => UserEntity, { eager: false })
    @JoinColumn({ name: "userId" })
    user: UserEntity

    @Column({ type: "date" })
    appointmentDate: Date

    @Column({ type: "time" })
    startTime: string

    @Column({ type: "time" })
    endTime: string

    @Column({
        type: "enum",
        enum: AppointmentStatus,
        default: AppointmentStatus.PENDING
    })
    status: AppointmentStatus

    @Column({ type: "decimal", precision: 8, scale: 2, nullable: true })
    estimatedPrice: number

    @Column({ type: "int" })
    estimatedDurationMinutes: number

    @Column({ type: "text", nullable: true })
    clientNotes: string

    @Column({ type: "timestamp", nullable: true })
    completedAt: Date

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}