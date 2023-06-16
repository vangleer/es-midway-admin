import { Provide, Inject } from '@midwayjs/core'
import { InjectEntityModel } from '@midwayjs/typeorm'
import { Not, Repository } from 'typeorm'
import { BaseService } from './base'
import { Chat } from '../entity/chat'
import { User } from '../entity/user'
import { Context } from '@midwayjs/web'
@Provide()
export class ChatService extends BaseService<Chat> {
  @InjectEntityModel(Chat)
  entity: Repository<Chat>

  @InjectEntityModel(User)
  userEntity: Repository<User>

  @Inject()
  ctx: Context

  /**
   * 获取和当前聊天对象的聊天记录
   * @param data 用户id和聊天对象id
   * @returns
   */
  async chatList(data) {
    const { fromUserId, toUserId } = data
    // 查询的是 我和你或者你和我的所有聊天记录
    const list = await this.entity
      .createQueryBuilder()
      .where('(fromUserId = :fromUserId AND toUserId = :toUserId) OR (fromUserId = :toUserId AND toUserId = :fromUserId)', { fromUserId, toUserId })
      .getMany()

    return list
  }

  /**
   * 获取用户列表（通讯录）
   * @param userId
   * @returns
   */
  async getUserList(userId) {
    const userList = await this.userEntity.find({ where: { id: Not(userId) } })

    const list = []
    // 遍历查询每个用户最新一条记录
    for (let i = 0; i < userList.length; i++) {
      const user = userList[i]
      const message = await this.entity
        .createQueryBuilder()
        .where('fromUserId = :userId OR toUserId = :userId', { userId: user.id })
        .orderBy('createTime', 'DESC')
        .getOne() || {}

      list.push({ ...user, message })
    }

    return list
  }
}
