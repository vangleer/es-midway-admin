import { Provide, Inject } from '@midwayjs/core'
import { InjectEntityModel } from '@midwayjs/typeorm'
import { Repository } from 'typeorm'
import { BaseService } from './base'
import { Menu } from '../entity/menu'
import { Context } from '@midwayjs/web'
@Provide()
export class MenuService extends BaseService<Menu> {
  @InjectEntityModel(Menu)
  entity: Repository<Menu>

  @Inject()
  ctx: Context

  async treeList() {
    const list = await this.entity.find()
    return this.list2tree(list)
  }
  list2tree(list) {
    const result: any[] = []
    for (let i = 0; i < list.length; i++) {
      result[i] = list[i]
      const children = list.filter(item => item.parentId == result[i].id)

      if (children.length) {
        result[i].children = children
      }

      result[i].label = result[i].name
      result[i].value = result[i].id
    }
    return result.filter((item: any) => item.children && item.parentId === null)
  }
}
