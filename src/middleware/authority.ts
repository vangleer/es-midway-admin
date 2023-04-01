import { Middleware, IMiddleware, Inject } from '@midwayjs/core'
import { NextFunction } from '@midwayjs/web'
import { JwtService } from '@midwayjs/jwt';
import { Context } from 'egg'
import { CustomHttpError } from '../common/CustomHttpError';
@Middleware()
export class AuthorityMiddleware implements IMiddleware<Context, NextFunction> {
  @Inject()
  jwt: JwtService
  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      const token = ctx.get('Authorization')

      const { url } = ctx

      // 放行接口
      if (/.*login.*|.*add.*/.test(url)) {
        return await next()
      }

      const { secret } = ctx.app.config.jwt
      if (!token) {
        throw new CustomHttpError('token已过期或未授权')
      }
      try {
        console.log(token)
        const user = await this.jwt.verify(token, secret)
        console.log(user)
        await next()
      } catch (error) {
        throw new CustomHttpError('token 已过期')
      }
    }
  }
}
