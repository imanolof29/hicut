import { AppointmentEntity } from "src/modules/appointments/entity/appointment.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("businesses")
export class BusinessEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({ type: "varchar", length: 200 })
    name: string

    @Column({ type: "varchar", unique: true })
    email: string

    @Column()
    logo: string

    @Column()
    address: string

    @OneToMany(() => AppointmentEntity, appointment => appointment.business)
    appointments: AppointmentEntity[]

    @Column({ default: true })
    isActive: boolean

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

}
