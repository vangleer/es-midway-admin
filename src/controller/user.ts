import { Inject, Post } from '@midwayjs/core'
import { ESController } from '../components/es'
import { UserService } from '../service/user'
import { BaseController } from './base'

@ESController({
  prefix: '/user',
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  service: UserService
})
export class UserController extends BaseController {
  @Inject()
  service: UserService

  @Post('/getUserRole')
  async getUserRole() {
    return this.success(await this.service.getUserRole())
  }
}
