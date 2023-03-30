import { Catch } from "@midwayjs/core";
import { Context } from 'egg'
@Catch()
export class ExceptionFilter {
  async catch(err: Error, ctx: Context) {
    ctx.logger.error(err)
    return {
      code: ctx.response.status,
      message: err.message
    }
  }
}
