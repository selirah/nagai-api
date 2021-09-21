import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne
} from 'typeorm'
import { Order } from './Order'
import { User } from './User'

@Entity()
export class Delivery extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  orderId: string

  @Column()
  dispatchId: number

  @Column({ default: false })
  isDelivered: boolean

  @Column({ nullable: true })
  deliveryDate: Date

  @Column({ type: 'text', nullable: true })
  reason: string

  @OneToOne(() => Order)
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
