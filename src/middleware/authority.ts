import { Middleware, IMiddleware, Inject } from '@midwayjs/core'
import { NextFunction } from '@midwayjs/web'
import { JwtService } from '@midwayjs/jwt'
import { CacheManager } from '@midwayjs/cache'

import { Context } from 'egg'
import { CustomHttpError } from '../common/CustomHttpError'
const adminUsers = ['admin', 'administrator', 'Administrator']
@Middleware()
export class AuthorityMiddleware implements IMiddleware<Context, NextFunction> {
  @Inject()
  jwt: JwtService
  @Inject()
  cache: CacheManager
  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      // 获取token
      const token = ctx.get('Authorization')
      const { url } = ctx
      // 放行接口，如：/open/login，/open/captcha 等
      if (/.*open.*/.test(url)) {
        return await next()
      }
      // 没传token抛出异常
      if (!token) {
        throw new CustomHttpError('token已过期或未授权', 401)
      }
      const { secret } = ctx.app.config.jwt

      // 校验token是否合法
      const user: any = await this.jwt.verify(token, secret)
      if (adminUsers.includes(user.username)) {
        return await next()
      }

      const perms: string[] = await this.cache.get(`es:admin:perms:${user.id}`)
      // if (perms && !perms.includes(url)) {
      //   throw new CustomHttpError('无权限访问~', 1001)
      // }
      console.log(perms, 'perms')
      ctx.admin = { user }
      await next()
    }
  }
}
