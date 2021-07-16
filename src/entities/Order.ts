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
import { Client } from './Client'
import { Item } from './Item'

@Entity()
export class Order extends BaseEntity {
  @PrimaryColumn()
  id: string

  @Column({ type: 'json' })
  items: Item

  @Column('decimal', { precision: 10, scale: 2, default: 12.5 })
  vat: number

  @Column('decimal', { precision: 10, scale: 2, default: 0.0 })
  discount: number

  @Column()
  clientId: number

  @ManyToOne(() => Client, (client) => client.orders)
  @JoinColumn({ name: 'clientId' })
  client: Client

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
