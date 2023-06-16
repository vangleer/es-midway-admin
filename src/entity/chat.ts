import { Entity, Column } from 'typeorm'
import { BaseEntity } from './base'

@Entity('chat')
export class Chat extends BaseEntity {
  @Column({ comment: '发送人id', type: 'int' })
  fromUserId: number
  @Column({ comment: '接收人id', type: 'int' })
  toUserId: number

  @Column({ comment: '发送内容', length: 100 })
  content: string

  @Column({ comment: '消息类型 0:文字 1:图片 2:文件', default: 0, type: 'tinyint'  })
  type: string

  @Column({ comment: '状态 0:未读 1:已读', default: 0, type: 'tinyint'  })
  status: string
}
