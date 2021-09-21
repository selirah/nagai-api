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
import { Outlet } from './Outlet'
import { Item } from './Item'
import { User } from './User'

@Entity()
export class Order extends BaseEntity {
  @PrimaryColumn()
  id: string

  @Column({ type: 'json' })
  items: Item

  @Column('decimal', { precision: 15, scale: 2, default: 0.0 })
  orderTotal: number

  @Column('decimal', { precision: 15, scale: 2, default: 0.04 })
  vat: number

  @Column('decimal', { precision: 15, scale: 2, default: 0.035 })
  nhil: number

  @Column('decimal', { precision: 15, scale: 2, default: 0.01 })
  covid19: number

  @Column('decimal', { precision: 15, scale: 2, default: 0.0 })
  sanitation: number

  @Column('decimal', { precision: 15, scale: 2, default: 0.0 })
  energy: number

  @Column('decimal', { precision: 15, scale: 2, default: 0.0 })
  financialCleanup: number

  @Column('decimal', { precision: 15, scale: 2, default: 0.0 })
  discount: number

  @Column('decimal', { precision: 15, scale: 2, default: 0.0 })
  deliveryFee: number

  @Column('decimal', { precision: 15, scale: 2, default: 0.0 })
  totalAmount: number

  @Column()
  outletId: number

  @Column()
  agentId: number

  @ManyToOne(() => Outlet, (outlet) => outlet.orders)
  @JoinColumn({ name: 'outletId' })
  outlet: Outlet

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'agentId' })
  agent: User

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
