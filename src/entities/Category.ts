import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm'
import { Product } from './Product'

@Entity()
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  category!: string

  @OneToMany(() => Product, (product) => product.category)
  products: Product[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
