import { BusinessEntity } from "src/modules/businesses/entities/business.entity";
import { UserEntity } from "src/modules/users/entity/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("appointments")
export class AppointmentEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({ type: "uuid" })
    businessId: string

    @ManyToOne(() => BusinessEntity)
    @JoinColumn({ name: 'businessId' })
    business: BusinessEntity

    @Column({ type: "uuid" })
    userId: string

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: "userId" })
    user: UserEntity

    @Column({ type: "date" })
    appointmentDate: Date

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}