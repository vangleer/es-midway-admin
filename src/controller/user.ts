import { Controller, Get, Inject } from '@midwayjs/core';
import { UserService } from '../service/user'

@Controller('/user')
export class HomeController {

  @Inject()
  service: UserService

  @Get('/list')
  async list() {
    const res = await this.service.list()
    console.log(res, 'res')
    return res;
  }
}
