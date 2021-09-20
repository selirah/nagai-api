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
import { Region } from './Region'

@Entity()
export class Territory extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  locality: string

  @Column()
  regionId: number

  @Column({ type: 'text', nullable: true })
  description: string

  @ManyToOne(() => Region, (region) => region.territories)
  @JoinColumn({ name: 'regionId' })
  region: Region

  @OneToMany(() => Outlet, (outlet) => outlet.territory)
  outlets: Outlet[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
