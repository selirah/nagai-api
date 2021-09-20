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

  @Column('decimal', { precision: 15, scale: 2, default: 12.5 })
  vat: number

  @Column('decimal', { precision: 15, scale: 2, default: 0.0 })
  discount: number

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
