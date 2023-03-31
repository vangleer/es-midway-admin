import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm'

@Entity('role')
export class BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @CreateDateColumn({ comment: '创建时间', type: 'timestamp' })
  createTime: Date

  @UpdateDateColumn({ comment: '更新时间', type: 'timestamp' })
  updateTime: Date
}
