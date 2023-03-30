import { Provide } from '@midwayjs/core';
import { InjectEntityModel, } from '@midwayjs/typeorm'
import { Repository } from 'typeorm'
import { BaseService } from './base'
import { User } from '../entity/user'
import * as md5 from 'md5'
import { CustomHttpError } from '../common/CustomHttpError';

@Provide()
export class UserService extends BaseService<User> {
  @InjectEntityModel(User)
  entity: Repository<User>

  async add(data) {
    const user = await this.entity.findOne({ where: { username: data.username } })
    if (user) {
      return false
    }
    if (data.password) {
      data.password = md5(data.password)
    }
    return await super.add(data)
  }
  async update(data) {
    if (data.password) {
      data.password = md5(data.password)
    }
    return await super.update(data)
  }

  async login(data) {
    const user = await this.entity.findOne({ where: { username: data.username } })
    if (!user) {
      throw new CustomHttpError('用户名或密码有误')
    }

    if (user.password !== md5(data.password)) {
      throw new CustomHttpError('用户名或密码有误')
    }

    return user
  }
}
