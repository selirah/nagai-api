import {
  BaseEntity,
  Entity,
  PrimaryColumn,
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
  @PrimaryColumn()
  id: string

  @Column()
  orderId: string

  @Column({ type: 'json' })
  taxes: Tax[]

  @Column('decimal', { precision: 15, scale: 2, default: 0.0 })
  discount: number

  @Column('decimal', { precision: 15, scale: 2, default: 0.0 })
  deliveryFee: number

  @Column('decimal', { precision: 15, scale: 2, default: 0.0 })
  finalAmount: number

  @OneToOne(() => Order, (order) => order.invoice)
  @JoinColumn({ name: 'orderId' })
  order: Order

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
