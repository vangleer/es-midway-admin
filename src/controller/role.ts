import { Body, Controller, Inject, Post } from '@midwayjs/core'
import { ESController } from '../components/es'
import { Role } from '../entity/role'
import { RoleService } from '../service/role'
import { BaseController } from './base'

@ESController({
  prefix: '/role',
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  service: RoleService
})
// @Controller()
export class MenuController extends BaseController {
  // @Inject()
  // service: RoleService
  // @Post('/list')
  // async list() {
  //   const list = await this.service.list()
  //   return this.success(list)
  // }
  // @Post('/page')
  // async page(@Body() data) {
  //   const res = await this.service.page(data)
  //   return this.success(res)
  // }
  // @Post('/info')
  // async info(@Body() data) {
  //   console.log(data, 'data')
  //   const res = await this.service.info(data)
  //   return this.success(res)
  // }
  // @Post('/add')
  // async add(@Body() data: Role) {
  //   const res = await this.service.add(data)
  //   return this.success(res)
  // }
  // @Post('/update')
  // async update(@Body() data: Role) {
  //   console.log(data, 'data')
  //   await this.service.update(data)
  //   return this.success()
  // }
  // @Post('/delete')
  // async delete(@Body() data) {
  //   await this.service.delete(data.ids || [])
  //   return this.success()
  // }
}
