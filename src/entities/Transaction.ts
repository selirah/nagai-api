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

@Entity()
export class Transaction extends BaseEntity {
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

  @OneToOne(() => Order)
  @JoinColumn({ name: 'orderId' })
  order: Order

  @OneToOne(() => Invoice)
  @JoinColumn({ name: 'invoiceId' })
  invoice: Invoice

  @OneToMany(() => Payment, (payment) => payment.transaction)
  payments: Payment[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
