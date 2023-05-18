import { Body, Inject, Post, Controller } from '@midwayjs/core'
import { LoginService } from '../service/login'
import { BaseController } from './base'
import { LoginDTO } from '../dto/login'
@Controller('/open')
export class OpenController extends BaseController {
  @Inject()
  service: LoginService

  @Post('/login')
  async login(@Body() data: LoginDTO) {
    const res = await this.service.login(data)
    return this.success(res)
  }

  @Post('/captcha')
  async captcha() {
    const res = await this.service.getCaptcha()
    return this.success(res)
  }
}
