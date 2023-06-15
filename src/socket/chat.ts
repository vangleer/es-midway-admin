import { WSController, OnWSConnection, Inject, OnWSMessage, WSEmit } from '@midwayjs/core'
import { Context } from '@midwayjs/socketio'
import * as http from 'http'
import { ChatService } from '../service/chat'
@WSController()
export class HelloSocketController {
  @Inject()
  ctx: Context;

  @Inject()
  service: ChatService
  @OnWSConnection()
  async onConnectionMethod() {
    console.log('on client connect')
  }

  @OnWSMessage('chat')
  @WSEmit('chat')
  async gotMessage(data) {
    const { fromUserId, toUserId, content } = data
    console.log(data, 'datadatadata')
    if (fromUserId && toUserId) {
      const chatInfo = { fromUserId, toUserId, content }
      this.service.add(chatInfo)

      this.ctx.broadcast.emit('chat', chatInfo)
      return chatInfo
    }
  }
}
