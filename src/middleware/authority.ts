import { Middleware, IMiddleware, Inject } from '@midwayjs/core'
import { NextFunction } from '@midwayjs/web'
import { JwtService } from '@midwayjs/jwt'
// import { CacheManager } from '@midwayjs/cache'

import { Context } from 'egg'
import { CustomHttpError } from '../common/CustomHttpError'
@Middleware()
export class AuthorityMiddleware implements IMiddleware<Context, NextFunction> {
  @Inject()
  jwt: JwtService
  // @Inject()
  // cache: CacheManager
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
        throw new CustomHttpError('token已过期或未授权')
      }
      const { secret } = ctx.app.config.jwt

      // 校验token是否合法
      const user = await this.jwt.verify(token, secret)
      // const cacheUser = await this.cache.get(`es:admin:user:${user.id}`)
      await next()
    }
  }
}
