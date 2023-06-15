// import { WSController, OnWSConnection, Inject, OnWSMessage, WSEmit } from '@midwayjs/core'
// import { Context } from '@midwayjs/socketio'
// import { ChatService } from '../service/chat'
// @WSController('/socket')
// export class HelloSocketController {

//   @Inject()
//   ctx: Context

//   @Inject()
//   service: ChatService
//   @OnWSConnection()
//   async onConnectionMethod() {
//     console.log('on client connect', this.ctx.id)
//   }

//   @OnWSMessage('chat')
//   @WSEmit('chat')
//   async gotMessage(data) {
//     const { fromUserId, toUserId, content } = data
//     if (fromUserId && toUserId) {
//       const chatInfo = { fromUserId, toUserId, content }
//       this.service.add(chatInfo)

//       this.ctx.broadcast.emit('chat', chatInfo)
//       return chatInfo
//     }
//   }
// }
