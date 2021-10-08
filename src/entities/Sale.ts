import {
  BaseEntity,
  Entity,
  PrimaryColumn,
  Column,
  OneToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn
} from 'typeorm'
import { Invoice } from './Invoice'
import { Order } from './Order'
import { Payment } from './Payment'

export enum SaleStatus {
  PENDING = 'PENDING',
  FAILED = 'FAILED',
  PAYING = 'PAYING',
  PAID = 'PAID',
  ALL = 'ALL'
}

@Entity()
export class Sale extends BaseEntity {
  @PrimaryColumn()
  id: string

  @Column({ unique: true })
  orderId: string

  @Column({ unique: true })
  invoiceId: string

  @Column('decimal', { precision: 15, scale: 2, default: 0.0 })
  amount: number

  @Column('decimal', { precision: 15, scale: 2, default: 0.0 })
  amountPaid: number

  @Column('decimal', { precision: 15, scale: 2, default: 0.0 })
  amountLeft: number

  @Column({ type: 'enum', enum: SaleStatus, default: SaleStatus.PENDING })
  status: string

  @Column({ type: 'text', nullable: true })
  comments: string

  @OneToOne(() => Order)
  @JoinColumn({ name: 'orderId' })
  order: Order

  @OneToOne(() => Invoice)
  @JoinColumn({ name: 'invoiceId' })
  invoice: Invoice

  @OneToMany(() => Payment, (payment) => payment.sale)
  payments: Payment[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
