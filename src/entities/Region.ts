import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { City } from './City';

@Entity()
export class Region extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  region!: string;

  @Column()
  abbreviation!: string;

  @Column()
  capital!: string;

  @OneToMany(() => City, (city) => city.region)
  cities: City[];
}
