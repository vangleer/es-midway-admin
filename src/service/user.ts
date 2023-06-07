import { Provide, Inject } from '@midwayjs/core'
import { InjectEntityModel } from '@midwayjs/typeorm'
import { In, Like, Repository } from 'typeorm'
import { BaseService } from './base'
import { User } from '../entity/user'
import { RoleService } from '../service/role'
import { MenuService } from '../service/menu'
import * as md5 from 'md5'
import { CustomHttpError } from '../common/CustomHttpError'
import { Context } from '@midwayjs/web'
import { CacheManager } from '@midwayjs/cache'
@Provide()
export class UserService extends BaseService<User> {
  @InjectEntityModel(User)
  entity: Repository<User>
  @Inject()
  roleService: RoleService
  @Inject()
  menuService: MenuService

  @Inject()
  ctx: Context

  @Inject()
  cache: CacheManager

  async info(data) {
    const user = await super.info(data)
    return user
  }

  async getUserRole() {
    const userId = this.ctx.admin.user.id
    const res = await super.info({ id: userId })

    const roles = res.roleId?.split(',') || []
    const roleList = await this.roleService.list({ id: In(roles) })
    const menuIds = []
    roleList.forEach(role => {
      menuIds.push(...(role.menuId?.split(',') || []))
    })

    // 页面菜单权限列表
    const menuList = await this.menuService.list({ id: In(menuIds) })

    const menus = await this.menuService.list2tree(
      menuList.filter(item => item.type !== 2)
    )

    // 接口权限保存到缓存中
    const perms = menuList
      .filter(item => item.type === 2)
      .map(item => item.perms)
    await this.cache.set(`es:admin:perms:${userId}`, JSON.stringify(perms))

    return { ...res, roleList, menus, perms }
  }

  async add(data: User) {
    const user = await this.entity.findOne({
      where: { username: data.username }
    })
    if (user) {
      throw new CustomHttpError('用户已存在')
    }

    if (data.password) {
      data.password = md5(data.password)
    } else {
      data.password = md5(
        this.ctx.app.config.es.defaultUserPassword || '123456'
      )
    }
    return await super.add(data)
  }
  async update(data: User) {
    if (data.password) {
      data.password = md5(data.password)
    }
    return await super.update(data)
  }
  async page(data) {
    const { username = '' } = data
    const where = username ? { username: Like(`%${username}%`) } : {}
    return super.page(data, where)
  }
}
