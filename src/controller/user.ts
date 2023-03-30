import { Controller, Inject, Post } from '@midwayjs/core';
import { UserService } from '../service/user'
import { BaseController } from './base';

@Controller('/user')
export class UserController extends BaseController {
  @Inject()
  service: UserService
  @Post('/list')
  async list() {
    const list = await this.service.list()
    return this.success(list)
  }
}
