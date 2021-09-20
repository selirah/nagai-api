import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm'
import { Delivery } from './Delivery'
import { StockTrail } from './StockTrail'
import { Payment } from './Payment'
import { Order } from './Order'

export enum UserRole {
  ADMIN = 'admin',
  AGENT = 'agent',
  DISPATCH = 'dispatch'
}

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  email: string

  @Column({ unique: true })
  phone: string

  @Column()
  password: string

  @Column({ nullable: true })
  firstName: string

  @Column({ nullable: true })
  lastName: string

  @Column({ nullable: true })
  avatar: string

  @Column({ default: false })
  isVerified: boolean

  @Column({ type: 'enum', enum: UserRole, default: UserRole.ADMIN })
  role: string

  @OneToMany(() => StockTrail, (trail) => trail.user)
  stockTrails: StockTrail[]

  @OneToMany(() => Delivery, (delivery) => delivery.dispatch)
  deliveries: Delivery[]

  @OneToMany(() => Delivery, (delivery) => delivery.agent)
  agents: Delivery[]

  @OneToMany(() => Payment, (payment) => payment.payee)
  payments: Payment[]

  @OneToMany(() => Order, (order) => order.agent)
  orders: Order[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
