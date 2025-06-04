import { AppointmentEntity } from "src/modules/appointments/entity/appointment.entity";
import { UserEntity } from "src/modules/users/entity/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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

    @Column({ type: "uuid" })
    ownerId: string

    @ManyToOne(() => UserEntity, { eager: false })
    @JoinColumn({ name: 'ownerId' })
    owner: UserEntity

    @ManyToMany(() => UserEntity, user => user.workplaces, { eager: false })
    @JoinTable({
        name: 'business_employees',
        joinColumn: { name: 'businessId', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'userId', referencedColumnName: 'id' }
    })
    employees: UserEntity[]

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

}
