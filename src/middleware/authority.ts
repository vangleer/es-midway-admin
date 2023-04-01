import { Middleware, IMiddleware, Inject } from '@midwayjs/core'
import { NextFunction } from '@midwayjs/web'
import { JwtService } from '@midwayjs/jwt'
import { CacheManager } from '@midwayjs/cache'

import { Context } from 'egg'
import { CustomHttpError } from '../common/CustomHttpError'
@Middleware()
export class AuthorityMiddleware implements IMiddleware<Context, NextFunction> {
  @Inject()
  jwt: JwtService
  @Inject()
  cache: CacheManager
  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      const token = ctx.get('Authorization')

      const { url } = ctx

      // 放行接口
      if (/.*login.*|.*add.*|.*getCaptchaImage.*/.test(url)) {
        return await next()
      }

      const { secret } = ctx.app.config.jwt
      if (!token) {
        throw new CustomHttpError('token已过期或未授权')
      }
      try {
        console.log('token:', token)
        const user: any = await this.jwt.verify(token, secret)
        console.log('userInfo:', user)
        const cacheUser = await this.cache.get(`es:admin:user:${user.id}`)
        console.log('cacheUser: ', cacheUser)
        await next()
      } catch (error) {
        throw new CustomHttpError('token 已过期')
      }
    }
  }
}
