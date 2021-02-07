import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { City } from './City';
import { Product } from './Product';

@Entity()
export class Manufacturer extends BaseEntity {
  @PrimaryGeneratedColumn()
  manufacturerId!: number;

  @Column()
  name!: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ type: 'json', nullable: true })
  coordinates: {
    lat: number;
    lng: number;
  };

  @Column()
  location: string;

  @Column()
  cityId: number;

  @Column({ nullable: true })
  logo: string;

  @ManyToOne(() => City, (city) => city.manufacturers)
  @JoinColumn({ name: 'cityId' })
  city: City;

  @OneToMany(() => Product, (product) => product.manufacturer)
  products: Product[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
