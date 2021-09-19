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
export class Outlet extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  ownerName: string

  @Column()
  outletName: string

  @Column()
  mobile: string

  @Column({ nullable: true })
  telephone: string

  @Column({ nullable: true })
  email: string

  @Column()
  locality: string

  @Column()
  barcode: string

  @Column()
  subLocality: string

  @Column({ type: 'text', nullable: true })
  landmark: string

  @Column()
  territoryId: number

  @Column({ nullable: true })
  photo: string

  @Column({ type: 'json', nullable: true })
  coordinates: {
    lat: number
    lng: number
  }

  @ManyToOne(() => Territory, (territory) => territory.outlets)
  @JoinColumn({ name: 'territoryId' })
  territory: Territory

  @OneToMany(() => Order, (order) => order.outlet)
  orders: Order[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
