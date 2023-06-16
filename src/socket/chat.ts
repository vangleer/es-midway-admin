import { WSController, OnWSConnection, Inject, OnWSMessage, WSEmit } from '@midwayjs/core'
import { Context } from '@midwayjs/socketio'
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

  /**
   * 聊天发送记录
   */
  @OnWSMessage('chat')
  @WSEmit('chat')
  async gotMessage(data) {
    const { fromUserId, toUserId, content } = data
    if (!fromUserId || !toUserId) return []

    const chatInfo = { fromUserId, toUserId, content }
    await this.service.add(chatInfo)

    // 使用聊天双方的id建立事件名称
    const ids = [fromUserId, toUserId]
    ids.sort((a, b) => a - b)
    const topic = `${ids[0]}-chat-${ids[1]}`

    // 发送给除了发送者聊天用户
    this.ctx.broadcast.emit(topic, chatInfo)

    // 这里返回的是给发送者
    return chatInfo
  }

  /**
   * 聊天者和聊天对象的记录
   */
  @OnWSMessage('chatList')
  @WSEmit('chatList')
  async chatList(data) {
    const list = await this.service.chatList(data)
    return list
  }

  /**
   * 聊天对象列表（通讯录）
   */
  @OnWSMessage('userList')
  @WSEmit('userList')
  async getUserList(data) {
    const list = await this.service.getUserList(data.userId)
    return list
  }
}
