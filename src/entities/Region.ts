import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany
} from 'typeorm'
import { City } from './City'
import { Territory } from './Territory'

@Entity()
export class Region extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  region: string

  @Column()
  abbreviation!: string

  @Column()
  capital: string

  @OneToMany(() => City, (city) => city.region)
  cities: City[]

  @OneToMany(() => Territory, (territories) => territories.region)
  territories: Territory[]
}
