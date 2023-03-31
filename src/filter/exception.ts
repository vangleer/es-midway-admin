import { Catch } from '@midwayjs/core'
import { Context } from 'egg'
import { Result } from '../utils'
@Catch()
export class ExceptionFilter {
  async catch(err, ctx: Context) {
    ctx.logger.error(err)
    return Result.error({
      code: err.status ?? 500,
      message: err.message
    })
  }
}
