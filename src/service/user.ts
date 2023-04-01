import { Provide, Inject } from '@midwayjs/core'
import { InjectEntityModel } from '@midwayjs/typeorm'
import { Repository } from 'typeorm'
import { BaseService } from './base'
import { User } from '../entity/user'
import * as md5 from 'md5'
import { CustomHttpError } from '../common/CustomHttpError'
import { Context } from '@midwayjs/web'
import { JwtService } from '@midwayjs/jwt'
import { CacheManager } from '@midwayjs/cache'
import { CaptchaService } from '@midwayjs/captcha'
@Provide()
export class UserService extends BaseService<User> {
  @InjectEntityModel(User)
  entity: Repository<User>

  @Inject()
  ctx: Context

  @Inject()
  jwt: JwtService

  @Inject()
  cache: CacheManager

  @Inject()
  captcha: CaptchaService;

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
  async login(data: any) {
    const passed = await this.checkCaptcha(data.captchaId, data.code)

    if (!passed) {
      throw new CustomHttpError('验证码有误或已过期')
    }

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
    await this.cache.set(`es:admin:user:${id}`, userInfo)
    return { token, userInfo }
  }

  async checkCaptcha(id, answer) {
    const passed: boolean = await this.captcha.check(id, answer)
    return passed
  }

  async getImageCaptcha() {
    const { id: captchaId, imageBase64: image } = await this.captcha.image({ width: 120, height: 40 });
    return {
      captchaId, // 验证码 id
      image, // 验证码 SVG 图片的 base64 数据，可以直接放入前端的 img 标签内
    }
  }

  generateToken() {
    return null
  }
}
