import { Column, CreateDateColumn, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { BusinessEntity } from "./business.entity";

export class BusinessServiceEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({ type: "varchar", length: 200 })
    name: string

    @Column({ type: "text", nullable: true })
    description: string

    @Column({ type: "decimal", precision: 8, scale: 2 })
    price: number

    @Column({ type: "uuid" })
    businessId: string

    @ManyToOne(() => BusinessEntity, { eager: true })
    @JoinColumn({ name: "businessId" })
    business: BusinessEntity

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

}