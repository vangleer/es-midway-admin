import { Provide, Inject } from '@midwayjs/core'
import { InjectEntityModel } from '@midwayjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '../entity/user'
import * as md5 from 'md5'
import { CustomHttpError } from '../common/CustomHttpError'
import { Context } from '@midwayjs/web'
import { JwtService } from '@midwayjs/jwt'
import { CacheManager } from '@midwayjs/cache'
import { CaptchaService } from '@midwayjs/captcha'
import { LoginDTO } from '../dto/login'
@Provide()
export class LoginService {
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

  /**
   * 登录
   * @param data
   * @returns
   */
  async login(data: LoginDTO) {
    // 校验验证码是否正确
    const passed = await this.checkCaptcha(data.captchaId, data.code)
    if (!passed) {
      throw new CustomHttpError('验证码有误或已过期')
    }

    // 根据用户名称获取
    const user = await this.entity.findOne({
      where: { username: data.username }
    })
    // 用户是否存在
    if (!user) {
      throw new CustomHttpError('用户名或密码有误')
    }

    // 如果存在判断密码是否正确
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
    // 使用用户一些基本信息生成 token
    const token = await this.jwt.sign(userInfo)

    // 将用户信息保存到缓存中，这部分后面角色权限的时候会用到
    await this.cache.set(`es:admin:user:${id}`, userInfo)
    return { token, userInfo }
  }

  /**
   * 校验验证码
   */
  async checkCaptcha(id, answer) {
    const passed: boolean = await this.captcha.check(id, answer)
    return passed
  }

  /**
   * 获取验证码
   */
  async getCaptcha() {
    const { id: captchaId, imageBase64: image } = await this.captcha.image({ width: 120, height: 40 });
    return {
      captchaId, // 验证码 id
      image, // 验证码 SVG 图片的 base64 数据，可以直接放入前端的 img 标签内
    }
  }
}
