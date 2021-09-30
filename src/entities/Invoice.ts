import {
  BaseEntity,
  Entity,
  PrimaryColumn,
  Column,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne
} from 'typeorm'
import { Order } from './Order'
import { Tax } from './Tax'
import { Outlet } from './Outlet'

@Entity()
export class Invoice extends BaseEntity {
  @PrimaryColumn()
  id: string

  @Column()
  orderId: string

  @Column()
  outletId: number

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

  @ManyToOne(() => Outlet, (outlet) => outlet.orders)
  @JoinColumn({ name: 'outletId' })
  outlet: Outlet

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
