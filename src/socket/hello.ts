import { WSController, OnWSConnection, OnWSMessage, OnWSDisConnection, Inject, App } from '@midwayjs/core'
import { Context, Application } from '@midwayjs/ws'
import * as http from 'http'
@WSController()
export class HelloSocketController {
  @App('webSocket')
  wsApp: Application
  @Inject()
  ctx: Context

  // 有客户端连接
  @OnWSConnection()
  async onConnectionMethod(socket: Context, request: http.IncomingMessage) {
    console.log(`namespace / got a connection ${this.ctx.readyState}`)
  }

  // 接收消息
  @OnWSMessage('message')
  async gotMessage(data) {
    return { name: 'harry', result: parseInt(data) + 5 }
  }

  // 断开连接
  @OnWSDisConnection()
  async disconnect(id: number) {
    console.log('disconnect ' + id)
  }
}
