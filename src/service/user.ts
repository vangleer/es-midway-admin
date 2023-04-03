import { Provide, Inject } from '@midwayjs/core'
import { InjectEntityModel } from '@midwayjs/typeorm'
import { Repository } from 'typeorm'
import { BaseService } from './base'
import { User } from '../entity/user'
import * as md5 from 'md5'
import { CustomHttpError } from '../common/CustomHttpError'
import { Context } from '@midwayjs/web'

@Provide()
export class UserService extends BaseService<User> {
  @InjectEntityModel(User)
  entity: Repository<User>

  @Inject()
  ctx: Context

  async add(data: User) {
    const user = await this.entity.findOne({
      where: { username: data.username }
    })
    if (user) {
      throw new CustomHttpError('用户已存在')
    }
    if (data.password) {
      data.password = md5(data.password)
    }
    return await super.add(data)
  }
  async update(data: User) {
    if (data.password) {
      data.password = md5(data.password)
    }
    return await super.update(data)
  }
}
