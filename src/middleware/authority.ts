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

      // 没传token抛出异常
      if (!token) {
        throw new CustomHttpError('token已过期或未授权', 401)
      }
      try {
        const { secret } = ctx.app.config.jwt

        // 校验token是否合法
        const user: any = await this.jwt.verify(token, secret)
        if (adminUsers.includes(user.username)) {
          return await next()
        }

        // // 从缓存中获取当前用户接口权限信息
        // const perms: string[] = await this.cache.get(
        //   `es:admin:perms:${user.id}`
        // )
        // 判断是否存在当前接口权限
        // if (perms && !perms.includes(url)) {
        //   throw new CustomHttpError('无权限访问~', 1001)
        // }
        ctx.admin = { user }
        await next()
      } catch (error) {
        throw new CustomHttpError(error.message, 401)
      }
    }
  }

  ignore(ctx: Context): boolean {
    // 忽略接口，如：/open/login，/open/captcha 等
    return /.*open.*|.*socket.*/.test(ctx.path)
  }
}
