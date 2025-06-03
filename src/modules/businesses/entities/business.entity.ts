import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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

    @Column({ default: true })
    isActive: boolean

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

}
