import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn
} from 'typeorm'
import { Order } from './Order'
import { Tax } from './Tax'

@Entity()
export class Invoice extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  invoiceNumber: string

  @Column()
  orderNumber: string

  @Column({ type: 'json' })
  taxes: Tax[]

  @Column('decimal', { precision: 15, scale: 2, default: 0.0 })
  discount: number

  @Column('decimal', { precision: 15, scale: 2, default: 0.0 })
  deliveryFee: number

  @Column('decimal', { precision: 15, scale: 2, default: 0.0 })
  finalAmount: number

  @OneToOne(() => Order)
  @JoinColumn({ name: 'orderNumber' })
  order: Order

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
