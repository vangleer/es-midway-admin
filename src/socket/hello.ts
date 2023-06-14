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

  @OnWSMessage('myEvent')
  async gotMessage(data) {
    console.log('on data got', this.ctx.id, data)
  }
}
