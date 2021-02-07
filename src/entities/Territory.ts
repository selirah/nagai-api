import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Client } from './Client';

@Entity()
export class Territory extends BaseEntity {
  @PrimaryGeneratedColumn()
  territoryId: number;

  @Column()
  territoryName: string;

  @Column({ type: 'json' })
  coordinates: {
    lat: number;
    lng: number;
  };

  @OneToMany(() => Client, (client) => client.territory)
  clients: Client[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
