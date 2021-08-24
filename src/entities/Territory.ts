import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm'
import { Outlet } from './Outlet'
import { User } from './User'
import { Region } from './Region'

@Entity()
export class Territory extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  locality: string

  @Column({ type: 'json' })
  coordinates: {
    lat: number
    lng: number
  }

  @Column()
  regionId: number

  @ManyToOne(() => Region, (region) => region.territories)
  @JoinColumn({ name: 'regionId' })
  region: Region

  @OneToMany(() => Outlet, (outlet) => outlet.territory)
  outlets: Outlet[]

  @OneToMany(() => User, (user) => user.territory)
  users: User[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
