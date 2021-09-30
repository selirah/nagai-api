import {
  BaseEntity,
  Entity,
  Column,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  PrimaryColumn
} from 'typeorm'
import { Order } from './Order'
import { User } from './User'

@Entity()
export class Delivery extends BaseEntity {
  @PrimaryColumn()
  id: string

  @Column()
  orderId: string

  @Column()
  dispatchId: number

  @Column({ default: false })
  isDelivered: boolean

  @Column({ type: 'json', nullable: true })
  coordinates: {
    lat: number
    lng: number
  }

  @Column({ nullable: true })
  deliveryDate: Date

  @Column({ type: 'text', nullable: true })
  comments: string

  @OneToOne(() => Order, (order) => order.delivery)
  @JoinColumn({ name: 'orderId' })
  order: Order

  @ManyToOne(() => User, (user) => user.deliveries)
  @JoinColumn({ name: 'dispatchId' })
  dispatch: User

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
