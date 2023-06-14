import { Provide, Inject } from '@midwayjs/core'
import { InjectEntityModel } from '@midwayjs/typeorm'
import { Repository } from 'typeorm'
import { BaseService } from './base'
import { Chat } from '../entity/chat'
import { Context } from '@midwayjs/web'
@Provide()
export class ChatService extends BaseService<Chat> {
  @InjectEntityModel(Chat)
  entity: Repository<Chat>

  @Inject()
  ctx: Context
}
