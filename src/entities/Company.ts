import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm'

@Entity()
export class Company extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  name: string

  @Column()
  email: string

  @Column()
  phone: string

  @Column()
  smsID: string

  @Column({ nullable: true })
  logo: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
