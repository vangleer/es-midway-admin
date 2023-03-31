import { Middleware, IMiddleware } from '@midwayjs/core'
import { NextFunction } from '@midwayjs/web'
import { Context } from 'egg'
// import * as jwt from 'jsonwebtoken';
@Middleware()
export class AuthorityMiddleware implements IMiddleware<Context, NextFunction> {
  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      // const token = ctx.get('Authorization')
      // const { url } = ctx
      // const { secret } = ctx.app.config.jwt
      // if (/.*login.*/.test(url)) {
      //   return await next()
      // }
      // console.log(token)
      // const user = await jwt.verify(token, secret)
      // console.log(user)
      await next()
    }
  }
}
