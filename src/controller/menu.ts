import { Inject, Post } from '@midwayjs/core'
import { ESController } from '../components/es'
import { MenuService } from '../service/menu'
import { BaseController } from './base'
@ESController({
  prefix: '/menu',
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  service: MenuService
})
export class MenuController extends BaseController {
  @Inject()
  service: MenuService

  @Post('/list/tree')
  async treeList() {
    const list = await this.service.treeList()
    return this.success(list)
  }
}
