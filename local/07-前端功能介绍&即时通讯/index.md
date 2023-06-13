# es-midway-admin

midwayjs基础后台管理系统(七)-前端功能介绍、websocket即时通讯

[github仓库地址](https://github.com/vangleer/es-midway-admin)

## 使用技术

midwayjs + typeorm + redis

## 现有功能

- 登录注册、验证码
- 用户管理
- 角色管理
- 权限管理
- 文件模块、excel导入导出
- swagger

## 具体使用

### 克隆代码到本地

```sh
git clone https://github.com/vangleer/es-midway-admin.git
```

### 启动后端

需提前安装mysql和redis，导入默认数据 src/entity/init.sql（默认路由、配置等）

```sh
cd es-midway-admin
yarn
yarn dev
```

### 启动前端

```sh
cd web
yarn
yarn dev
```
访问 http://localhost:3001/

![web.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ea02f1979bbe4c118103169b775f9174~tplv-k3u1fbpfcp-watermark.image?)

## 本章内容

- 前端功能介绍
- websocket即时通讯

## 前端功能介绍

- 使用技术

vue3 + pinia + element-plus + vite

- 目录结构

```
|-- web
  |-- index.html
  |-- package.json
  |-- vite.config.ts
  |-- src
    |-- App.vue
    |-- main.ts
    |-- vite-env.d.ts
    |-- api
    |   |-- common.ts
    |   |-- request.ts
    |-- assets
    |-- components
    |-- config
    |   |-- index.ts
    |   |-- layout.ts
    |-- layout
    |   |-- AppMain.vue
    |   |-- Header.vue
    |   |-- index.scss
    |   |-- index.vue
    |   |-- Sidebar.vue
    |-- router
    |   |-- index.ts
    |   |-- static.ts
    |-- store
    |   |-- auth.ts
    |   |-- index.ts
    |   |-- user.ts
    |-- utils
    |-- views
```

### 权限信息

登录成功后将用户基本信息保存到userStore，跳转到主页，会进入到路由守卫

```typescript
// src/router/index.ts
const whiteList = ['/login']
router.beforeEach(async (to, from, next) => {
  const store = useUserStore()
  const token = getToken()
  if (to.path === '/login') {
    // 访问登录页清空用户信息
    store.removeUser()
    next()
  } else {
    // 放行白名单
    if (whiteList.includes(to.path)) return next()

    // 无token重定向到登录页
    if (!token) return next({ path: '/login', replace: true })

    if (!useAuthStore().routeList.length) {
      // 如果authStore中没有权限信息，获取用户权限生成路由
      await addRoutes()
      return next({ ...to, replace: true })
    }

    // 保存当前路由
    useAppStore().saveCurrentRoute(to as any)
    next()
  }
})
```

## websocket即时通讯


