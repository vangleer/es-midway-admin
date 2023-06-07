import { Entity, Column } from 'typeorm'
import { BaseEntity } from './base'

@Entity('log')
export class Log extends BaseEntity {
  @Column({ comment: '用户ID', nullable: true, type: 'bigint' })
  userId: number

  @Column({ comment: '行为', length: 100 })
  action: string

  @Column({ comment: 'ip', nullable: true, length: 50 })
  ip: string

  @Column({ comment: 'ip地址', nullable: true, length: 50 })
  ipAddr: string

  @Column({ comment: '参数', nullable: true, type: 'text' })
  params: string
}
