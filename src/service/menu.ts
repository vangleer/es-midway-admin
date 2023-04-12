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

  async treeList(where = {}) {
    const list = await this.entity.find({ order: { parentId: 'ASC' }, where })
    return this.list2tree(list)
  }
  list2tree(list, parent = null) {
    const tree: any = []
    let temp
    for (let i = 0; i < list.length; i++) {
      if (list[i].parentId === parent) {
        const obj = list[i]
        obj.label = list[i].name
        obj.value = list[i].id
        const newList = list.filter(item => item.parentId !== parent)
        temp = this.list2tree(newList, list[i].id)
        if (temp.length > 0) {
          obj.children = temp
        }
        tree.push(obj)
      }
    }
    return tree
  }
}
