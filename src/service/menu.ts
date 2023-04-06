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
    return list
  }
  list2tree(list, parentId?) {
    if (parentId) {
      return list.filter(item => item.parentId === parentId)
    } else {
      const result = []
      for (let i = 0; i < list.length; i++) {
        result[i] = list[i]
        const children = this.list2tree(list, list[i].id)
        if (children.length) {
          result[i].children = children
        }
      }
      return result.filter(item => item.children && item.parentId === null)
    }
  }
}
