import {
  BaseEntity,
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn
} from 'typeorm'
import { Transaction } from './Transaction'
import { User } from './User'

@Entity()
export class Payment extends BaseEntity {
  @PrimaryColumn()
  id: string

  @Column()
  transactionId: string

  @Column('decimal', { precision: 15, scale: 2 })
  amount: number

  @Column()
  payer: string

  @Column()
  payerPhone: string

  @Column()
  payeeId: number

  @ManyToOne(() => Transaction, (transaction) => transaction.payments)
  @JoinColumn({ name: 'transactionId' })
  transaction: Transaction

  @ManyToOne(() => User, (payee) => payee.payments)
  @JoinColumn({ name: 'payeeId' })
  payee: User

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
