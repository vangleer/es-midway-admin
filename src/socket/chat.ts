import { WSController, OnWSConnection, Inject, OnWSMessage, WSEmit } from '@midwayjs/core'
import { Context } from '@midwayjs/ws'
import * as http from 'http'
import { ChatService } from '../service/chat'
@WSController()
export class HelloSocketController {
  @Inject()
  ctx: Context;

  @OnWSConnection()
  async onConnectionMethod(socket: Context, request: http.IncomingMessage) {
    console.log(`namespace / got a connection ${this.ctx.readyState}`);
  }
  // @Inject()
  // ctx: Context

  // @Inject()
  // service: ChatService
  // @OnWSConnection()
  // async onConnectionMethod(socket: Context, request: http.IncomingMessage) {
  //   console.log('on client connect', socket, request)
  // }

  // @OnWSMessage('chat')
  // @WSEmit('chat')
  // async gotMessage(data) {
  //   const { fromUserId, toUserId, content } = data
  //   if (fromUserId && toUserId) {
  //     const chatInfo = { fromUserId, toUserId, content }
  //     this.service.add(chatInfo)

  //     // this.ctx.broadcast.emit('chat', chatInfo)
  //     return chatInfo
  //   }
  // }
}
