# es-midway-admin

基于midwayjs搭建的一套基础后台管理系统(四)-权限管理

[github仓库地址](https://github.com/vangleer/es-midway-admin)

## 主要内容

- 前端/后端权限（菜单&按钮级别）前端使用的是（vue + vue-router + pinia）

- 由于前后端相对独立，只对前端感兴趣的朋友可以直接跳转到前端部分

### 大体流程

前后端可提前约定好什么时候返回用户权限，比如在登录接口中返回，或另外提供一个获取权限信息的接口，用户登录成功后再调用获取权限信息

后端：

  1. 将菜单权限生成树状结构，前端用于生成动态路由
  2. 按钮或接口权限（后面统一叫接口权限）保存到缓存中，在authority中间件中token校验成功后判断当前用户是否拥有该接口权限

前端：

  1. 用户登录成功后，需要调用获取权限信息的接口（包含所有的接口权限，和路由/菜单信息）
  2. 将数据保存到全局状态中，同时需要根据菜单权限生成路由
  3. 封装接口权限校验函数 hasPermission 用于判断当前登录用户是否拥有该权限（也可已是否显示按钮），也可以基于 hasPermission 封装vue指令校验

## 后端：表结构

- 为了便于理解这里只会涉及3个表User、Role、Menu，权限比较复杂的可以自行扩展

### User（用户） 表

- 用户可以添加多个角色，roleId 为字符串，使用逗号分割角色id

```typescript
// src/entity/user.ts
import { Entity, Column } from 'typeorm'
import { BaseEntity } from './base'
@Entity('user')
export class User extends BaseEntity {
  @Column({ comment: '用户名' })
  username: string

  @Column({ comment: '密码(md5加密)' })
  password: string

  @Column({ comment: '真实姓名', nullable: true })
  realname: string

  @Column({ comment: '昵称', nullable: true })
  nickname: string

  @Column({ comment: '角色Id(1,2,3)', nullable: true })
  roleId: string
}
```

### Role（角色）表

- 一个角色可以添加多个权限，使用逗号分割权限id

```typescript
// src/entity/role.ts
import { Entity, Column } from 'typeorm'
import { BaseEntity } from './base'

@Entity('role')
export class Role extends BaseEntity {
  @Column({ comment: '名称' })
  name: string

  @Column({ comment: '名称: 1,2,3', nullable: true })
  menuId: string

  @Column({ comment: '备注', nullable: true })
  remark: string
}
```

### Menu（菜单权限） 表

- Menu有3种类型（0表示目录 1表示菜单 2表示接口）
- 菜单需要菜单的路由地址 router和对应的视图地址 viewPath字段
- 接口类型需要权限标识perms字段，格式可自行选择，我们这里存放接口的地址

```typescript
// src/entity/menu.ts
import { Entity, Column } from 'typeorm'
import { BaseEntity } from './base'

@Entity('menu')
export class Menu extends BaseEntity {
  // 公共字段
  @Column({ comment: '父菜单ID', type: 'int', nullable: true })
  parentId: number
  @Column({ comment: '菜单名称' })
  name: string
  @Column({
    comment: '类型 0:目录 1:菜单 2:接口',
    default: 0,
    type: 'tinyint'
  })
  type: number
  @Column({ comment: '排序', default: 0 })
  orderNum: number

  // 目录和菜单
  @Column({ comment: '图标', nullable: true })
  icon: string

  // 菜单独有
  @Column({ comment: '菜单地址', nullable: true })
  router: string
  @Column({ comment: '视图地址', nullable: true })
  viewPath: string

  // 接口权限独有
  @Column({ comment: '权限标识', nullable: true })
  perms: string
}

```

## 后端：菜单权限接口实现

登录相关逻辑在前面的文章中有讲到，就不在这里讲解了

### Controller层添加接口 getUserRole

```typescript
// src/controller/user.ts
import { Inject, Post } from '@midwayjs/core'
import { ESController } from '../components/es'
import { UserService } from '../service/user'
import { BaseController } from './base'

@ESController({
  prefix: '/user',
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  service: UserService
})
export class UserController extends BaseController {
  @Inject()
  service: UserService

  @Post('/getUserRole')
  async getUserRole() {
    return this.success(await this.service.getUserRole())
  }
}
```

### 相关service方法实现

```typescript
// src/service/user.ts
import { Provide, Inject } from '@midwayjs/core'
import { InjectEntityModel } from '@midwayjs/typeorm'
import { In, Repository } from 'typeorm'
import { BaseService } from './base'
import { User } from '../entity/user'
import { RoleService } from '../service/role'
import { MenuService } from '../service/menu'
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

  async getUserRole() {
    // 获取到当前用户id，在校验用户登录状态的接口中，如果通过就将用户信息放在当前请求上下文的ctx.admin.user里，参考 src/middleware/authority.ts
    const userId = this.ctx.admin.user.id
    // 获取到当前用户信息（主要是为了获取最新的角色）
    const res = await super.info({ id: userId })

    // 查询角色列表
    const roles = res.roleId?.split(',') || []
    const roleList = await this.roleService.list({ id: In(roles) })

    // 得到所有菜单权限id列表
    const menuIds = []
    roleList.forEach(role => {
      menuIds.push(...(role.menuId?.split(',') || []))
    })

    // 页面菜单权限列表
    const menuList = await this.menuService.list({ id: In(menuIds) })

    // 菜单权限：将列表转换为树状结构，（转换前过滤调接口权限）
    const menus = await this.menuService.list2tree(menuList.filter(item => item.type !== 2))

    // 接口权限：保存到缓存中
    const perms = menuList.filter(item => item.type === 2).map(item => item.perms)
    await this.cache.set(`es:admin:perms:${userId}`, JSON.stringify(perms))

    return { ...res, roleList, menus, perms }
  }

  // ...
}
```

步骤解析：

1. 用户调用接口会先到全局校验中间件中，解析token得到用户的基本信息保存到当前请求的上下文中 `参考 src/middleware/authority.ts`
2. 拿到上下文的用户id获取用户角色信息
3. 根据角色信息获取所有的菜单权限
4. 将菜单权限生成树状结构，前端用于生成动态路由
5. 接口权限保存到缓存中，在token校验成功后判断当前用户是否拥有该接口权限

```typescript
// src/middleware/authority.ts
import { Middleware, IMiddleware, Inject } from '@midwayjs/core'
import { NextFunction } from '@midwayjs/web'
import { JwtService } from '@midwayjs/jwt'
import { CacheManager } from '@midwayjs/cache'

import { Context } from 'egg'
import { CustomHttpError } from '../common/CustomHttpError'
const adminUsers = ['admin', 'administrator', 'Administrator']
@Middleware()
export class AuthorityMiddleware implements IMiddleware<Context, NextFunction> {
  @Inject()
  jwt: JwtService
  @Inject()
  cache: CacheManager
  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      // 获取token
      const token = ctx.get('Authorization')
      const { url } = ctx
      // 放行接口，如：/open/login，/open/captcha 等
      if (/.*open.*/.test(url)) {
        return await next()
      }
      // 没传token抛出异常
      if (!token) {
        throw new CustomHttpError('token已过期或未授权', 401)
      }
      try {
        const { secret } = ctx.app.config.jwt

        // 校验token是否合法
        const user: any = await this.jwt.verify(token, secret)
        if (adminUsers.includes(user.username)) {
          return await next()
        }

        // 从缓存中获取当前用户接口权限信息
        const perms: string[] = await this.cache.get(`es:admin:perms:${user.id}`)
        // 判断是否存在当前接口权限
        if (perms && !perms.includes(url)) {
          throw new CustomHttpError('无权限访问~', 1001)
        }

        ctx.admin = { user }
        await next()
      } catch (error) {
        throw new CustomHttpError(error.message, 401)
      }
    }
  }
}

```


## 前端：根据菜单权限生成动态路由

先看看后端返回的数据结构，生成动态路由会使用到返回的menus

```json
{
  "code": 200,
  "data": {
    "id": 3,
    "username": "lisi",
    "realname": "李四",
    "nickname": null,
    "roleId": "3",
    "menus": [
      {
        "id": 5,
        "parentId": null,
        "name": "系统管理",
        "type": 0,
        "orderNum": 0,
        "icon": "",
        "router": null,
        "viewPath": null,
        "perms": null,
        "label": "系统管理",
        "value": 5,
        "children": [
          {
            "id": 6,
            "parentId": 5,
            "name": "用户列表",
            "type": 1,
            "orderNum": 0,
            "icon": "",
            "router": "/system/user",
            "viewPath": "views/system/User.vue",
            "perms": null,
            "label": "用户列表",
            "value": 6
          },
          {
            "id": 18,
            "parentId": 5,
            "name": "菜单管理",
            "type": 1,
            "orderNum": 0,
            "icon": "",
            "router": "/system/menu",
            "viewPath": "views/system/Menu.vue",
            "perms": null,
            "label": "菜单管理",
            "value": 18
          },
          {
            "id": 19,
            "parentId": 5,
            "name": "角色列表",
            "type": 1,
            "orderNum": 0,
            "icon": "",
            "router": "/system/role",
            "viewPath": "views/system/Role.vue",
            "perms": null,
            "label": "角色列表",
            "value": 19
          }
        ]
      }
    ],
    "perms": [
      "/system/user/add",
      "/system/user/update"
    ]
  },
  "message": "success"
}
```


### userStore

- 保存用户相关信息

```typescript
// src/store/user.ts
import { defineStore } from 'pinia'
import { removeToken, setToken, setStorage, getStorage, removeStorage } from '@/utils'
import router from '@/router'
type UserState = {
  token: string
  userid?: any
  username: string
  realname?: string
}

export const useUserStore = defineStore('user', {
  state: (): UserState => (getStorage('userinfo') || {}),
  actions: {
    async saveUser({ token, username }: UserState) {
      this.username = username
      this.token = token
      setToken(token)
      setStorage('userinfo', { token, username })
    },
    removeUser() {
      removeToken()
      removeStorage('userinfo')
      // 删除根级路由
      router.removeRoute('/')
      this.username = ''
      this.token = ''
    }
  }
})
```

### authStore

- 保存权限相关信息

```typescript
// src/store/auth.ts
import { defineStore } from 'pinia'
import { RouteRecordRaw } from 'vue-router'
import service from '@/api/system/user'

interface AuthState {
  perms: string[]
  menus: any[]
  routeList: RouteRecordRaw[]
}
export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    perms: [], // 接口权限列表
    menus: [], // 后台返回的菜单权限列表
    routeList: [] // 动态生成的路由
  }),
  actions: {
    async getUserRole() {
      // 获取用户信息&权限
      const res = await service.getUserRole()
      if (res.code === 200) {
        // 保存数据
        this.perms = res.data.perms || []
        this.menus = res.data.menus || []
        return res.data
      }
    }
  }
})

```

### 定义路由

- 前端得到数据后保存到store中，在遍历menus动态添加路由

```typescript
// src/router/index.ts
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { useUserStore, useAuthStore } from '../store'
import Layout from '@/layout/index.vue'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
// 导入所有路由页面，格式应该是 { '/src/views/Home.vue': Module }
export const views = import.meta.glob('/src/**/views/**/*.vue', { eager: true })
import ErrorPage from '@/views/error-page/ErrorPage.vue'
import { getToken } from '@/utils'

// 共享路由
const commonRoutes = [
  {
    path: '/home',
    component: Home,
    meta: {
      title: '首页',
      icon: 'HomeFilled'
    }
  }
]

const notFoundPage = {
  path: '/:pathMatch(.*)',
  component: ErrorPage
}

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    component: Login
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 路由白名单
const whiteList = ['/login']
router.beforeEach(async (to, from, next) => {
  const store = useUserStore()
  const token = getToken()
  if (to.path === '/login') {
    store.removeUser()
    next()
  } else {
    if (whiteList.includes(to.path)) return next()

    if (!token) return next({ path: '/login', replace: true })

    if (!useAuthStore().routeList.length) {
      await addRoutes()
      return next({ ...to, replace: true })
    }
    next()
  }
})

// 动态添加路由
async function addRoutes() {
  const authStore = useAuthStore()
  const { menus } = await authStore.getUserRole()

  // 遍历菜单生成路由项
  const routes = mapRoutes(menus)
  // 附加共享路由
  const routeList = [...commonRoutes, ...routes] as any

  // 保存动态生成路由宝store中，渲染侧边栏的时候可以使用
  authStore.$patch({ routeList })
  // 添加路由
  router.addRoute({
    path: '/',
    component: Layout,
    redirect: '/home',
    children: routeList
  })
  // 添加404
  router.addRoute(notFoundPage)
}

// 后台返回的menus菜单转换为路由
function mapRoutes(menus: any[] = []): RouteRecordRaw[] {
  return menus.map(menu => {
    let children: RouteRecordRaw[] = []
    if (menu.children && menu.children.length) {
      children = mapRoutes(menu.children)
    }
    const url = menu.viewPath ? `/src/${menu.viewPath}` : ''
    const path = menu.router ? menu.router : ''
    const component = views[url] ? () => Promise.resolve(views[url]) : null

    return {
      // ...menu,
      meta: {
        title: menu.name,
        icon: menu.icon,
        id: menu.id
      },
      path,
      component,
      children
    }
  })
}

export default router

```

解析：

- 初始化只注册登录页面路由

```typescript
const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    component: Login
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})
```

- 用户访问页面后会进入到路由守卫中，如果访问的是登录页面清除用户缓存放行
- 没有token重定向到login页面，访问白名单放行
- 如果auth状态中没有授权路由信息，调用addRoutes函数

    1. 获取用户权限信息
    2. 使用mapRoutes函数将menus生成转换伟路由项
    3. 使用router.addRoute将动态路由和共享路由添加到路由列表
    4. 添加404页面

## 前端：按钮级别权限控制

有了前面的铺垫，按钮级别控制就简单多了，前面已经将用户所有接口权限存储到authStore的perms里了，直接用其封装校验函数和指令即可

```typescript
// src/utils/permission.ts
import { useAuthStore } from '@/store'
import { Directive } from 'vue'

// 判断权限的方法
export function hasPermission(perm: string) {
  const perms = useAuthStore().perms || []
  return perms.includes(perm)
}

// 权限指令
export const permission: Directive = {
  mounted(e: Element, binding) {
    const isShow = hasPermission(binding.value)
    if (!isShow) {
      e.parentElement?.removeChild(e)
    }
  }
}
```

- 注册指令

```typescript
// src/main.ts
import { permission } from '@/utils/permission'

const app = createApp(App)

// 注册权限指令
app.directive('perm', permission)

// ...
```

- 使用

```html
<el-button v-perm="'/system/user/add'" type="primary">新增</el-button>
<el-button v-if="hasPermission('/system/user/update')" type="primary">编辑</el-button>
```

权限值也可以使用数值(权限点)或其它方式，这里直接使用接口地址主要是便于理解

## 最后

还有一种方式是返回菜单列表的时候将菜单页面的权限放到里面，每次切换路由得到当前的页面的权限列表，再使用判断即可。


由于项目还在开发中，目前就实现了这些功能，后面会不断完善，也会出一些相关文章。

done...

