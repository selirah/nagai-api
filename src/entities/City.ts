import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Region } from './Region';
import { Manufacturer } from './Manufacturer';
import { Client } from './Client';

@Entity()
export class City extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  city!: string;

  @Column()
  regionId: number;

  @ManyToOne(() => Region, (region) => region.cities)
  @JoinColumn({ name: 'regionId' })
  region: Region;

  @OneToMany(() => Manufacturer, (manufacturer) => manufacturer.city)
  manufacturers: Manufacturer[];

  @OneToMany(() => Client, (client) => client.city)
  clients: Client[];
}
