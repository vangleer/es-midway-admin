# es-midway-admin

基于midwayjs搭建的一套基础后台管理系统(二)-登录功能

上期主要介绍了使用midwayjs搭建项目的流程，和抽离公共类。

这篇文章主要来实现登录功能，内容包括jwt、缓存、验证码、中间件拦截

[github仓库地址](https://github.com/vangleer/es-midway-admin)

## 使用技术

midwayjs + typeorm + redis

## 现有功能

- 登录注册、验证码
- 用户管理
- 角色管理
- 权限管理

## 登录接口

## 验证码

- 获取验证码
- 校验验证码

### 安装依赖

- 验证码具体使用细节请参考官网

```sh
npm i @midwayjs/captcha@3 --save
```

### 启用组件
```typescript
import * as captcha from '@midwayjs/captcha'

@Configuration({
  imports: [
    // ...other components
    captcha
  ]
})
export class MainConfiguration {}
```

### 验证码接口

- 在service下新增login.ts，提供获取和校验方法

```typescript
// src/service/login.ts
import { Provide, Inject } from '@midwayjs/core'
import { CaptchaService } from '@midwayjs/captcha'
@Provide()
export class LoginService {
  @Inject()
  captcha: CaptchaService;

  /**
   * 校验验证码
   */
  async checkCaptcha(id, answer) {
    const passed: boolean = await this.captcha.check(id, answer)
    return passed
  }

  /**
   * 获取验证码
   */
  async getCaptcha() {
    const { id: captchaId, imageBase64: image } = await this.captcha.image({ width: 120, height: 40 });
    return {
      captchaId, // 验证码 id
      image, // 验证码 SVG 图片的 base64 数据，可以直接放入前端的 img 标签内
    }
  }
}

```

- 获取验证码接口，在controller目录下新增open.ts

```typescript
// src/controller/open.ts
import { Body, Controller, Inject, Post } from '@midwayjs/core'
import { User } from '../entity/user'
import { LoginService } from '../service/login'
import { BaseController } from './base'

@Controller('/open')
export class UserController extends BaseController {
  @Inject()
  service: LoginService

  @Post('/captcha')
  async captcha() {
    const res = await this.service.getCaptcha()
    return this.success(res)
  }
}

```
## 引入jwt

### 安装依赖

```sh
npm i @midwayjs/jwt@3 --save
```

### 基础配置

```typescript
// src/config/config.default.ts
export default {
  // ...
  jwt: {
    secret: 'abc',
    expiresIn: '2h'
  }
}
```

## 引入缓存（cache）

### 安装依赖

```sh
npm i @midwayjs/cache@3 cache-manager --save
npm i @types/cache-manager --save-dev
```

### 使用 Cache

Midway 为不同的 cache 存储提供了统一的 API。默认内置了一个基于内存数据存储的数据中心。如果想要使用别的数据中心，开发者也可以切换到例如 mongodb、fs 等模式。

首先，引入 Cache 组件，在 configuration.ts 中导入：

```typescript
// src/configuration.ts
import { Configuration, App } from '@midwayjs/core'
import * as cache from '@midwayjs/cache'
import { join } from 'path'

@Configuration({
  imports: [
    // ...
    cache // 导入 cache 组件
  ],
  importConfigs: [
    join(__dirname, 'config')
  ]
})
export class MainConfiguration {
}
```

> 注意：默认缓存只保持在内存中，服务器重启数据就会失效

### 使用redis替换默认缓存
- 安装相关依赖
```sh
npm i cache-manager-ioredis
```

修改 store 方式，在 config.default.ts 中进行组件的配置：
```typescript
import * as redisStore from 'cache-manager-ioredis'

export default {
  // ...
  cache: {
    // store: 'memory',
    // options: {
    //   ttl: null // 过期时间单位毫秒，设置为null视为不过期，默认10000ms
    // }

    // 使用 redis 缓存
    store: redisStore,
    options: {
      host: '192.168.98.241', // default value
      port: 6379, // default value
      password: '',
      db: 0,
      keyPrefix: 'cache:',
      ttl: null
    }
  }
}
```

## 登录接口

- 梳理一下整个流程

1. 进入登录页面后前端需要调用获取验证码接口得到验证码图片并把captchaId保存起来，校验验证码的时候需要
2. 用户提交信息时，把captchaId一并带上
3. 后端先判断验证码是否正确
4. 判断用户是否存在
5. 判断密码是否正确
6. 使用用户的基本信息生成token
7. 保存用户信息到缓存
8. 返回用户信息和token

在 service/login.ts中新增login方法
```typescript
import { Provide, Inject } from '@midwayjs/core'
import { InjectEntityModel } from '@midwayjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '../entity/user'
import * as md5 from 'md5'
import { CustomHttpError } from '../common/CustomHttpError'
import { Context } from '@midwayjs/web'
import { JwtService } from '@midwayjs/jwt'
import { CacheManager } from '@midwayjs/cache'
import { CaptchaService } from '@midwayjs/captcha'
import { LoginDTO } from '../dto/login'
@Provide()
export class LoginService {
  @InjectEntityModel(User)
  entity: Repository<User>

  @Inject()
  ctx: Context

  @Inject()
  jwt: JwtService

  @Inject()
  cache: CacheManager

  @Inject()
  captcha: CaptchaService;

  /**
   * 登录
   * @param data
   * @returns
   */
  async login(data: LoginDTO) {
    // 校验验证码是否正确
    const passed = await this.checkCaptcha(data.captchaId, data.code)
    if (!passed) {
      throw new CustomHttpError('验证码有误或已过期')
    }

    // 根据用户名称获取
    const user = await this.entity.findOne({
      where: { username: data.username }
    })
    // 用户是否存在
    if (!user) {
      throw new CustomHttpError('用户名或密码有误')
    }

    // 如果存在判断密码是否正确
    if (user.password !== md5(data.password)) {
      throw new CustomHttpError('用户名或密码有误')
    }

    const { id, username, realname, nickname, roleId } = user
    const userInfo = {
      id,
      username,
      realname,
      nickname,
      roleId
    }
    // 使用用户一些基本信息生成 token
    const token = await this.jwt.sign(userInfo)

    // 将用户信息保存到缓存中，这部分后面角色权限的时候会用到
    await this.cache.set(`es:admin:user:${id}`, userInfo)
    return { token, userInfo }
  }

  /**
   * 校验验证码
   */
  async checkCaptcha(id, answer) {
    const passed: boolean = await this.captcha.check(id, answer)
    return passed
  }

  /**
   * 获取验证码
   */
  async getCaptcha() {
    const { id: captchaId, imageBase64: image } = await this.captcha.image({ width: 120, height: 40 });
    return {
      captchaId, // 验证码 id
      image, // 验证码 SVG 图片的 base64 数据，可以直接放入前端的 img 标签内
    }
  }
}

```

### 添加登录 controller

```typescript
// src/controller/open.ts
import { Body, Controller, Inject, Post } from '@midwayjs/core'
import { LoginService } from '../service/login'
import { BaseController } from './base'
import { LoginDTO } from '../dto/login'

@Controller('/open')
export class OpenController extends BaseController {
  @Inject()
  service: LoginService

  @Post('/login')
  async login(@Body() data: LoginDTO) {
    const res = await this.service.login(data)
    return this.success(res)
  }
  // ...
}

```

上面使用到了midwayjs的参数校验功能，这部分内容比较简单，直接查文档即可 [midwayjs参数校验](http://midwayjs.org/docs/extensions/validate)

## 中间件拦截未登录用户

前端登录成功后需要把token保存起来，每次发送请求的时候需要带到（Authorization）请求头上，当然你也可以自己决定用什么名称，前后端商量好就行了

### 编写中间件

- 主要功能就是获取传递过来的token并校验是否合法，不合法抛出异常。

在 middleware下新增 authority.ts 文件
```typescript
import { Middleware, IMiddleware, Inject } from '@midwayjs/core'
import { NextFunction } from '@midwayjs/web'
import { JwtService } from '@midwayjs/jwt'

import { Context } from 'egg'
import { CustomHttpError } from '../common/CustomHttpError'
@Middleware()
export class AuthorityMiddleware implements IMiddleware<Context, NextFunction> {
  @Inject()
  jwt: JwtService
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
        throw new CustomHttpError('token已过期或未授权')
      }
      const { secret } = ctx.app.config.jwt

      try {
        // 校验token是否合法
        const user = await this.jwt.verify(token, secret)
        await next()
      } catch (error) {
        throw new CustomHttpError('token 已过期')
      }
    }
  }
}

```

> 最后不要忘记把这个中间件添加到 configuration.ts 里
```typescript
import { App, Configuration, ILifeCycle } from '@midwayjs/core'
import { Application } from 'egg'
import { join } from 'path'
import * as orm from '@midwayjs/typeorm'
import * as egg from '@midwayjs/web'
import * as jwt from '@midwayjs/jwt'
import * as cache from '@midwayjs/cache'
import * as captcha from '@midwayjs/captcha'
import * as staticFile from '@midwayjs/static-file'
import * as validate from '@midwayjs/validate'
import { ExceptionFilter } from './filter/exception'
import { AuthorityMiddleware } from './middleware/authority'

@Configuration({
  imports: [egg, orm, jwt, cache, captcha, staticFile, validate],
  importConfigs: [join(__dirname, './config')]
})
export class ContainerLifeCycle implements ILifeCycle {
  @App()
  app: Application

  async onReady() {
    this.app.useFilter(ExceptionFilter)
    this.app.useMiddleware([AuthorityMiddleware]) // 新增
  }
}

```

## 最后

由于项目还在开发中，目前就实现了这些功能，后面会不断完善，也会出一些相关文章。

done...

点个赞在走呗！！！(●'◡'●)
