# es-midway-admin

基于midwayjs搭建的一套基础后台管理系统(三)-自定义组件&装饰器

[github仓库地址](https://github.com/vangleer/es-midway-admin)

## 前言

在第一篇项目搭建的文章中，我们实现了`BaseEntity`和`BaseService`对一些公共的属性和方法进行抽离，但在`Controller`层很难直接做到对通用接口的抽离，只能将一些不是请求接口的方法封装起来。

这篇文章就来实现一个Controller装饰器，该装饰器同时具有middwayjs Controller的功能和我们自定义的功能

例如：大部分的`Controller`都会有添加、新增、删除、分页等接口，我想让这些接口使用简单的配置就能添加到路由表中

- 原本的方式
```typescript
// controller/user.ts
import { Body, Controller, Inject, Post } from '@midwayjs/core'
import { User } from '../entity/user'
import { UserService } from '../service/user'
import { BaseController } from './base'

@Controller('/user')
export class UserController extends BaseController {
  @Inject()
  service: UserService

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
    const res = await this.service.info(data)
    return this.success(res)
  }

  @Post('/add')
  async add(@Body() data: User) {
    const res = await this.service.add(data)
    return this.success(res)
  }

  @Post('/update')
  async update(@Body() data: User) {
    await this.service.update(data)
    return this.success()
  }

  @Post('/delete')
  async delete(@Body() data) {
    await this.service.delete(data.ids || [])
    return this.success()
  }
}
```

- 使用自定义装饰器后

```typescript
import { ESController } from '../components/es'
import { UserService } from '../service/user'
import { BaseController } from './base'

@ESController({
  prefix: '/user',
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  service: UserService
})
export class UserController extends BaseController { }
```

> 这样封装后对于一些通用的简单的接口还是挺方便的，对于逻辑复杂的接口可以进行重写


```typescript
import { ESController } from '../components/es'
import { UserService } from '../service/user'
import { BaseController } from './base'

@ESController({
  prefix: '/user',
  api: ['add', 'delete', 'update', 'info', 'page'],
  service: UserService
})
export class UserController extends BaseController {
  @Post('/list')
  async list() {
    return this.success('自定义list接口')
  }
}
```

话不多说，开始吧。。。


## 封装midwayjs组件

- 其实对于简单的逻辑可以直接在项目的 configuration.ts 中完成，刚开始我就是在主项目中，但后来发现有点乱就抽离成组件了

- 在midwayjs官方对组件的封装讲的非常详细，这里就不过多介绍了

- 新建 src/components/es/index.ts，需要导出一个名为Configuration的类

```typescript
// src/components/es/index.ts
import { Configuration, Logger } from '@midwayjs/core'
import { ILogger } from '@midwayjs/logger'

const COMPONENT_KEY = 'es'
@Configuration({
  namespace: COMPONENT_KEY
})
class ESConfiguration {
  @Logger('coreLogger')
  logger: ILogger

  async onReady() {
    this.logger.info(`\x1B[36m [${COMPONENT_KEY}] midwayjs es component ready \x1B[0m`)
  }

}
export {
  ESConfiguration as Configuration
}

```

- 在主项目中引入

```typescript
import { App, Configuration, ILifeCycle, Inject, MidwayWebRouterService } from '@midwayjs/core'
import { Application, Context } from 'egg'
import { join } from 'path'
import * as orm from '@midwayjs/typeorm'
import * as egg from '@midwayjs/web'
import * as jwt from '@midwayjs/jwt'
import * as cache from '@midwayjs/cache'
import * as captcha from '@midwayjs/captcha'
import * as staticFile from '@midwayjs/static-file'
import * as validate from '@midwayjs/validate'
import * as es from './components/es' // 自定义组件
import { ExceptionFilter } from './filter/exception'
import { AuthorityMiddleware } from './middleware/authority'
@Configuration({
  imports: [egg, orm, jwt, cache, captcha, staticFile, validate, es],
  importConfigs: [join(__dirname, './config')]
})
export class ContainerLifeCycle implements ILifeCycle {
  @Inject()
  webRouterService: MidwayWebRouterService
  @App()
  app: Application
  @Inject()
  ctx: Context

  async onReady() {
    this.app.useFilter(ExceptionFilter)
    this.app.useMiddleware([AuthorityMiddleware])
  }
}

```

项目重启成功后在控制台可以看到 `[es] midwayjs es component ready` 信息表示组件引入成功，接下来就可以封装我们的装饰器啦

## 自定义Controller装饰器

带有midwayjs Controller装饰的功能，添加我们自己的功能

- 新建 src/components/es/decorator/controller.ts

```typescript
// src/components/es/decorator/controller.ts
import { saveModule, saveClassMetadata, Scope, ScopeEnum, RouterOption, Controller } from '@midwayjs/core'

// 提供一个唯一 key
export const MODEL_KEY = 'decorator:es-controller'
export declare type ApiTypes = 'add' | 'delete' | 'update' | 'page' | 'info' | 'list'
export interface CurdOption {
  prefix?: string;
  api: ApiTypes[];
  entity?: any; // entity | service二选一
  service?: any; // entity | service二选一
}
export function ESController(curdOption?: CurdOption | string, routerOptions?: RouterOption): ClassDecorator {
  return (target) => {
    // 将装饰的类，绑定到该装饰器，用于后续能获取到 class
    saveModule(MODEL_KEY, target)
    // 处理options
    curdOption = curdOption || ''
    const options = typeof curdOption === 'string' ? { prefix: curdOption } : curdOption

    // 保存一些元数据信息，任意你希望存的东西
    saveClassMetadata(
      MODEL_KEY,
      {
        options
      },
      target
    )

    // 指定 IoC 容器创建实例的作用域，这里注册为请求作用域，这样能取到 ctx
    Scope(ScopeEnum.Request)(target)

    // 调用一下 Controller 装饰器，这样用户的 class 可以省略写 @Controller() 装饰器了
    if (!curdOption) {
      Controller()(target)
    } else {
      Controller(options.prefix, routerOptions)(target)
    }
  }
}
```

#### 步骤解析:

1. 定义 ESController 函数接收两个参数，第一个参数主要是我们需要的配置，也可以是一个字符串，如果是字符串就和midwayjs的Controller功能相同，第二个参数和midwayjs的Controller一样
2. saveModule 用于保存某个类到某个装饰器
3. 处理参数
4. saveClassMetadata 保存元信息到 class，后面会用到
5. 指定 IoC 容器创建实例的作用域，这里注册为请求作用域，这样能取到 ctx
6. 调用 Controller 装饰器，这样用户的 class 可以省略写 @Controller() 装饰器了，相当于集成了Controller本身的功能

可以看到整个封装还是挺简单的，需要熟悉 saveModule、saveClassMetadata、Controller这几个函数的基本使用，这在[midwayjs官网自定义装饰器](http://midwayjs.org/docs/custom_decorator)也有详细的介绍

### 在组件配置中进行初始化

```typescript
import { Configuration, listModule, getClassMetadata, App, Inject, MidwayWebRouterService, Logger, IMidwayContainer } from '@midwayjs/core'
import { Application, Context } from 'egg'
import { MODEL_KEY } from './decorator/controller'
import { BaseService } from '../../service/base'
import { BaseController } from '../../controller/base'
import { InjectDataSource } from '@midwayjs/typeorm'
import { DataSource } from 'typeorm'
import { ILogger } from '@midwayjs/logger'
// const defaultApis = ['add', 'delete', 'update', 'info', 'list', 'page']
const defaultApis = []
const COMPONENT_KEY = 'es'

@Configuration({
  namespace: 'es'
})
class ESConfiguration {
  // 注入默认数据源
  @InjectDataSource()
  defaultDataSource: DataSource;
  @Inject()
  webRouterService: MidwayWebRouterService
  @App()
  app: Application
  @Inject()
  ctx: Context
  @Logger('coreLogger')
  logger: ILogger

  baseController: BaseController
  async onReady(container: IMidwayContainer) {
    // 异步创建 BaseController 实例
    this.baseController = await container.getAsync(BaseController)
    // 初始化公共接口
    await this.crud()
    this.logger.info(`\x1B[36m [${COMPONENT_KEY}] midwayjs es component ready \x1B[0m`)
  }
  async crud() {
    // 可以获取到所有装饰了 @Model() 装饰器的 class
    const modules = listModule(MODEL_KEY);
    for (let mod of modules) {
      // 实现自定义能力
      // 比如，拿元数据 getClassMetadata(mod)
      // 比如，提前初始化 app.applicationContext.getAsync(mod);
      const data = getClassMetadata(MODEL_KEY, mod)

      // 得到配置信息
      const { options = {} } = data
      // 获取配置信息
      const { service, entity } = options

      // 添加的路由列表
      const apis = options.api || defaultApis

      if (apis.length && !service && !entity) {
        // service 和 entity都没有提供，提示报错
        return this.logger.error(`\x1B[36m [${COMPONENT_KEY}] ${mod.name} ESController decorator need an entity or a service \x1B[0m`)
      }
      const globalRouterPrefix = this.app.config?.egg?.globalPrefix || ''
      this.logger.info(`\x1B[36m [${COMPONENT_KEY}] auto router prefix "${globalRouterPrefix}${options.prefix}"  \x1B[0m`);
      for (const url of apis) {
        this.webRouterService.addRouter(async (ctx) => {
          // 获取 service
          let baseService
          if (service) {
            // 如果有配置的service就使用配置的
            baseService = await ctx.requestContext.getAsync(service)
          } else {
            // 没有就使用 BaseService, 创建一个
            baseService = await ctx.requestContext.getAsync(BaseService)
            // 设置service的entity（必须）
            baseService.entity = this.defaultDataSource.getRepository(entity)
          }

          const body = ctx.request.body
          switch (url) {
            case 'delete':
              return this.baseController.success(await baseService[url](body.ids || []))
            default:
              return this.baseController.success(await baseService[url](body))
          }
        }, {
          url: `${options.prefix}/${url}`,
          requestMethod: 'POST'
        })
      }
    }
  }
}

export {
  ESConfiguration as Configuration
}

export * from './decorator/controller'

```

当组件被加载后 midwayjs 会先调用组件的 onReady 钩子，在这个钩子进行组件的初始化工作，里面一步创建了一个BaseController实例、初始化crud和一条加载完成的打印语句，我们主要关注crud的初始化

#### crud方法步骤解析：

1. 使用 listModule 得到所有使用这个ESController装饰器的类
2. 循环处理每个类并初始化
3. getClassMetadata 获取到当前类的元数据，也就是在定义 ESController 的时候存的配置信息
4. 获取到传入的entity和service(二者传其一也可)
5. 得到全局的路由前缀
6. 使用 MidwayWebRouterService 循环添加路由
7. 如果用户传入的是service直接使用 ctx.requestContext.getAsync 创建实例
8. 只传了entity：使用BaseService创建service实例并手动设置entity
9. 最后根据api调用service对应的方法

## 最后

由于项目还在开发中，目前就实现了这些功能，后面会不断完善，也会出一些相关文章。

done...

