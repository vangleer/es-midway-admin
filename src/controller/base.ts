import { Inject } from '@midwayjs/core';
import { Controller } from '@midwayjs/decorator';
import { Context } from '@midwayjs/web'

// interface R<T = any> {
//   code: number
//   data: T
//   message: string
// }

@Controller()
export abstract class BaseController {
  @Inject()
  ctx: Context

  success<T>(data: T, message = 'success', code = 200) {
    return {
      code,
      data,
      message
    }
  }
  error(data = null, message = 'error', code = 900) {
    return {
      code,
      data,
      message
    }
  }
}
