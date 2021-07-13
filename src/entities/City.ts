import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm'
import { Region } from './Region'

@Entity()
export class City extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  city!: string

  @Column()
  regionId: number

  @ManyToOne(() => Region, (region) => region.cities)
  @JoinColumn({ name: 'regionId' })
  region: Region
}
