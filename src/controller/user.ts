import { Body, Controller, Inject, Post } from '@midwayjs/core';
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

  @Post('/page')
  async page(@Body() data) {
    const res = await this.service.page(data)
    return this.success(res)
  }

  @Post('/info')
  async info(@Body() data) {
    console.log(data, 'data')
    const res = await this.service.info(data)
    return this.success(res)
  }

  @Post('/add')
  async add(@Body() data) {
    const res = await this.service.add(data)
    if (!res) return this.error('用户已存在')
    return this.success(res)
  }

  @Post('/update')
  async update(@Body() data) {
    const res = await this.service.update(data)
    return this.success(res)
  }

  @Post('/login')
  async login(@Body() data) {
    const res = await this.service.login(data)
    return this.success(res)
  }
}
