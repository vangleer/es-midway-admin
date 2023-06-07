import { Entity, Column } from 'typeorm'
import { BaseEntity } from './base'

@Entity('conf')
export class Conf extends BaseEntity {
  @Column({ comment: '配置键' })
  cKey: string

  @Column({ comment: '配置值' })
  cValue: string
}
