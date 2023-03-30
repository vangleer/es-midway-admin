import { Catch } from "@midwayjs/core";
import { Context } from 'egg'
@Catch()
export class ExceptionFilter {
  async catch(err, ctx: Context) {
    ctx.logger.error(err)
    return {
      code: err.status ?? 500,
      message: err.message
    }
  }
}
