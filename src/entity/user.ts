import { Entity, Column } from 'typeorm'
import { BaseEntity } from './base'
@Entity('user')
export class User extends BaseEntity {
  @Column({ comment: '用户名' })
  username: string

  @Column({ comment: '密码(md5加密)' })
  password: string

  @Column({ comment: '真实姓名', nullable: true })
  realname: string

  @Column({ comment: '昵称', nullable: true })
  nickname: string

  @Column({ comment: '角色Id(1,2,3)', nullable: true })
  roleId: string
}
