import {
  Middleware,
  IMiddleware,
  Inject,
  Scope,
  ScopeEnum
} from '@midwayjs/core'
import { NextFunction } from '@midwayjs/web'
import { LogService } from '../service/log'
import { Context } from 'egg'

@Scope(ScopeEnum.Request, { allowDowngrade: true })
@Middleware()
export class LogMiddleware implements IMiddleware<Context, NextFunction> {
  @Inject()
  logService: LogService

  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      this.logService.record(
        ctx,
        ctx.url.split('?')[0],
        ctx.req.method === 'GET' ? ctx.request.query : ctx.request.body,
        ctx.admin && ctx.admin?.user?.id || null
      )
      await next()
    }
  }

  ignore(ctx: Context): boolean {
    // 忽略接口，如：/open/login，/open/captcha 等
    return /.*open.*|.*socket.*/.test(ctx.path)
  }
}
