import { WSController, OnWSConnection, Inject, OnWSMessage, WSEmit } from '@midwayjs/core'
import { Context } from '@midwayjs/socketio'

@WSController('/hello')
export class HelloSocketController {

  @Inject()
  ctx: Context

  /**
   * 监听连接
   */
  @OnWSConnection()
  async onConnectionMethod() {
    console.log('on client connect', this.ctx.id)
  }

  /**
   * 接收消息
   */
  @OnWSMessage('words')
  @WSEmit('words')
  async gotMessage(data) {
    console.log('client data: ', data)
    const message = 'hello world from server'
    this.ctx.broadcast.emit('words', message)
    return message
  }
}
