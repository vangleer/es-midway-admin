import { Entity, Column } from 'typeorm'
import { BaseEntity } from './base'

@Entity('role')
export class Role extends BaseEntity {
  @Column({ comment: '名称' })
  name: string

  @Column({ comment: '名称: 1,2,3', nullable: true })
  menuId: string

  @Column({ comment: '备注', nullable: true })
  remark: string
}
