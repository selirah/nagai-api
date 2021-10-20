import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn
} from 'typeorm'
import { Sale } from './Sale'
import { User } from './User'

@Entity()
export class Payment extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  saleId: string

  @Column('decimal', { precision: 15, scale: 2 })
  amount: number

  @Column()
  payer: string

  @Column()
  payerPhone: string

  @Column()
  payeeId: number

  @Column({ nullable: true })
  comments: string

  @ManyToOne(() => Sale, (sale) => sale.payments)
  @JoinColumn({ name: 'saleId' })
  sale: Sale

  @ManyToOne(() => User, (payee) => payee.payments)
  @JoinColumn({ name: 'payeeId' })
  payee: User

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
