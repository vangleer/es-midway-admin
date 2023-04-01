import { Provide, Inject } from '@midwayjs/core'
import { InjectEntityModel } from '@midwayjs/typeorm'
import { Repository } from 'typeorm'
import { BaseService } from './base'
import { User } from '../entity/user'
import * as md5 from 'md5'
import { CustomHttpError } from '../common/CustomHttpError'
import { Context } from '@midwayjs/web'
import { JwtService } from '@midwayjs/jwt'

@Provide()
export class UserService extends BaseService<User> {
  @InjectEntityModel(User)
  entity: Repository<User>

  @Inject()
  ctx: Context

  @Inject()
  jwt: JwtService

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

  /**
   * 登录
   * @param data
   * @returns
   */
  async login(data: User) {
    const user = await this.entity.findOne({
      where: { username: data.username }
    })
    if (!user) {
      throw new CustomHttpError('用户名或密码有误')
    }

    if (user.password !== md5(data.password)) {
      throw new CustomHttpError('用户名或密码有误')
    }

    const { id, username, realname, nickname, roleId } = user
    const userInfo = {
      id,
      username,
      realname,
      nickname,
      roleId
    }
    const token = await this.jwt.sign(userInfo)
    return { token, userInfo }
  }

  generateToken() {
    return null
  }
}
