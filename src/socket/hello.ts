import { WSController, OnWSConnection, Inject, OnWSMessage } from '@midwayjs/core'
import { Context } from '@midwayjs/socketio'
@WSController('/socket')
export class HelloSocketController {

  @Inject()
  ctx: Context

  @OnWSConnection()
  async onConnectionMethod() {
    console.log('on client connect', this.ctx.id)
  }

  @OnWSMessage('chat')
  async gotMessage(data) {
    // this.ctx.emit('chat', data)
    this.ctx.broadcast.emit('chat', data)
  }
}
