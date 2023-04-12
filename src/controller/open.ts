import { Body, Controller, Inject, Post } from '@midwayjs/core'
import { LoginService } from '../service/login'
import { BaseController } from './base'
import { LoginDTO } from '../dto/login'
import { ESController } from '../components/es'
import { UserService } from '../service/user'
@ESController({
  prefix: '/open',
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  service: UserService
})
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
