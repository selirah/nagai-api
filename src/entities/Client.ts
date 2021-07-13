import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToMany
} from 'typeorm'
import { Territory } from './Territory'
import { Order } from './Order'

@Entity()
export class Client extends BaseEntity {
  @PrimaryGeneratedColumn()
  clientId: number

  @Column()
  businessName: string

  @Column()
  phoneNumber: string

  @Column()
  businessEmail: string

  @Column({ type: 'json', nullable: true })
  coordinates: {
    lat: number
    lng: number
  }

  @Column()
  location: string

  @Column()
  territoryId: number

  @Column({ nullable: true })
  logo: string

  @ManyToOne(() => Territory, (territory) => territory.clients)
  @JoinColumn({ name: 'territoryId' })
  territory: Territory

  @OneToMany(() => Order, (order) => order.client)
  orders: Order[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
