import { Body, Controller, Inject, Post } from '@midwayjs/core'
import { Menu } from '../entity/menu'
import { MenuService } from '../service/menu'
import { BaseController } from './base'

@Controller('/menu')
export class MenuController extends BaseController {
  @Inject()
  service: MenuService

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
  async add(@Body() data: Menu) {
    const res = await this.service.add(data)
    return this.success(res)
  }

  @Post('/update')
  async update(@Body() data: Menu) {
    await this.service.update(data)
    return this.success()
  }

  @Post('/delete')
  async delete(@Body() data) {
    await this.service.delete(data.ids || [])
    return this.success()
  }

  @Post('/list/tree')
  async treeList() {
    const list = await this.service.treeList()
    return this.success(list)
  }
}
