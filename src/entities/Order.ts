import {
  BaseEntity,
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToOne
} from 'typeorm'
import { Outlet } from './Outlet'
import { Item } from './Item'
import { User } from './User'
import { Invoice } from './Invoice'
import { Delivery } from './Delivery'

export enum Status {
  PENDING = 'PENDING',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
  TRANSIT = 'TRANSIT',
  ALL = 'ALL',
  DISPATCH = 'DISPATCH'
}

@Entity()
export class Order extends BaseEntity {
  @PrimaryColumn()
  id: string

  @Column({ type: 'json' })
  items: Item[]

  @Column('decimal', { precision: 15, scale: 2, default: 0.0 })
  orderTotal: number

  @Column()
  outletId: number

  @Column()
  agentId: number

  @Column({ type: 'enum', enum: Status, default: Status.PENDING })
  status: string

  @Column({ type: 'text', nullable: true })
  comments: string

  @ManyToOne(() => Outlet, (outlet) => outlet.orders)
  @JoinColumn({ name: 'outletId' })
  outlet: Outlet

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'agentId' })
  agent: User

  @OneToOne(() => Invoice, (invoice) => invoice.order)
  invoice: Invoice

  @OneToOne(() => Delivery, (delivery) => delivery.order)
  delivery: Delivery

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
