import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm'

@Entity()
export class Tax extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  tax: string

  @Column('decimal', { precision: 10, scale: 5, default: 0.0 })
  rate: number

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
