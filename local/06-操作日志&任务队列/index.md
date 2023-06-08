# es-midway-admin

midwayjs基础后台管理系统(六)-操作日志、任务队列

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

- 用户操作日志记录
- 任务队列

## 用户操作日志记录

在midwayjs中有对系统日志的详细介绍，如果想深入了解系统日志可以参考官网 [midwayjs日志具体使用](http://midwayjs.org/docs/logger)

今天我们主要实现操作日志，操作日志，顾名思义就是将用户操作记录下来，最直观的方式就是将用户访问了什么接口、传递的参数、访问主机的ip、访问的时间等记录下来。
一般我们会将这些信息保存到数据库中，做到有迹可循。还可以针对日志记录编写前端界面，这样用户操作了什么就更加清晰了


### 日志表结构

可根据我们想要记录的内容自行增加或删减

```typescript
// src/entity/log.ts
import { Entity, Column } from 'typeorm'
import { BaseEntity } from './base'

@Entity('log')
export class Log extends BaseEntity {
  @Column({ comment: '用户ID', nullable: true, type: 'bigint' })
  userId: number

  @Column({ comment: '行为', length: 100 })
  action: string

  @Column({ comment: 'ip', nullable: true, length: 50 })
  ip: string

  @Column({ comment: 'ip地址', nullable: true, length: 50 })
  ipAddr: string

  @Column({ comment: '参数', nullable: true, type: 'text' })
  params: string
}

```

### logService 实现

```typescript
import { Provide, Inject } from '@midwayjs/core'
import { InjectEntityModel } from '@midwayjs/typeorm'
import { Repository } from 'typeorm'
import { BaseService } from './base'
import { ConfService } from './conf'
import { Log } from '../entity/log'
import { Utils } from '../common/utils'
import * as _ from 'lodash'
import { Context } from 'egg'
import * as moment from 'moment'
@Provide()
export class LogService extends BaseService<Log> {
  @InjectEntityModel(Log)
  entity: Repository<Log>

  @Inject()
  confService: ConfService

  @Inject()
  utils: Utils

  async record(context: Context, url, params, userId) {
    // 获取访问IP地址
    const ip = await this.utils.getReqIP(context)
    // 创建log实例
    const log = new Log()
    // 赋值
    log.userId = userId

    // 解析IP地址
    log.ip = typeof ip === 'string' ? ip : ip.join(',')
    log.ipAddr = await this.utils.getIpAddr(context, ip)

    // 保存请求地址
    log.action = url
    // 请求参数
    if (!_.isEmpty(params)) {
      log.params = JSON.stringify(params)
    }
    await this.entity.insert(log)
  }

  /**
   * 日志
   * @param isAll 是否清除全部
   */
  async clear(isAll?) {
    if (isAll) {
      // 清楚所有
      await this.entity.clear()
      return
    }

    // 清楚过期的日志
    const keepDay = await this.confService.getValue('logKeep')
    if (keepDay) {
      const beforeDate = `${moment()
        .add(-keepDay, 'days')
        .format('YYYY-MM-DD')} 00:00:00`
      await this.entity
        .createQueryBuilder()
        .where('createTime < :createTime', { createTime: beforeDate })
      await this.entity.query(' delete from log where createTime < ? ', [
        beforeDate
      ])
    } else {
      // 如果没有过期时间清除所有
      await this.entity.clear()
    }
  }
}

```

LogService 额外实现了两个方法 record(记录)、和clear(清空)

- record 解析
    1. 从请求上下问中获取访问IP地址,所使用的是utils的getReqIP方法（utils实现见下文）
    2. 创建Log实例
    3. 解析IP地址（使用了 `ipip-ipdb` 这个包）
    4. 为log实例赋值后保存到数据库

- clear 解析
    1. 如果是isAll则清空所有
    2. 获取日志过期时间配置（配置表见下文）
    3. 如果没有配置清空所有日志
    4. 有则删除配置时间之前的数据


### utils实现

用到了 `ipip-ipdb`，具体使用可查看相关文档

```typescript
import { Provide, Inject } from '@midwayjs/core'
import { Context } from 'egg'
import * as ipdb from 'ipip-ipdb'
import * as _ from 'lodash'

@Provide()
export class Utils {
  /**
   * 获得请求IP
   */
  async getReqIP(ctx: Context) {
    const req = ctx.req
    return (
      req.headers['x-forwarded-for'] ||
      req.socket.remoteAddress.replace('::ffff:', '')
    )
  }

  /**
   * 根据ip获得请求地址
   * @param ip 为空时则为当前请求的IP地址
   */
  async getIpAddr(ctx: Context, ip?: string | string[]) {
    const baseDir = ctx.app.getBaseDir()
    try {
      if (!ip) {
        ip = await this.getReqIP(ctx)
      }
      const bst = new ipdb.BaseStation(`${baseDir}/common/ipipfree.ipdb`)
      const result = bst.findInfo(ip, 'CN')
      const addArr: any = []
      if (result) {
        addArr.push(result.countryName)
        addArr.push(result.regionName)
        addArr.push(result.cityName)
        return _.uniq(addArr).join('')
      }
    } catch (err) {
      return '无法获取地址信息'
    }
  }
}
```

### conf表结构和service实现

```typescript
// src/entity/conf.ts
import { Entity, Column } from 'typeorm'
import { BaseEntity } from './base'

@Entity('conf')
export class Conf extends BaseEntity {
  @Column({ comment: '配置键' })
  cKey: string

  @Column({ comment: '配置值' })
  cValue: string
}

```

```typescript
// src/service/conf.ts
import { Provide } from '@midwayjs/core'
import { InjectEntityModel } from '@midwayjs/typeorm'
import { Repository } from 'typeorm'
import { BaseService } from './base'
import { Conf } from '../entity/conf'

@Provide()
export class ConfService extends BaseService<Conf> {
  @InjectEntityModel(Conf)
  entity: Repository<Conf>

  async getValue(key) {
    const conf = await this.entity.findOne({ where: { cKey: key } })
    if (conf) {
      return conf.cValue
    }
  }
}
```

关于日志的表结构和业务都实现了，接下来我们就需要考虑：什么时候记录？什么时候删除呢？

因为操作日志是要记录用户的接口访问，我们可以使用中间件拦截每次请求并进行记录，具体实现如下

```typescript
// src/middleware/log.ts
import {
  Middleware,
  IMiddleware,
  Inject,
  Scope,
  ScopeEnum
} from '@midwayjs/core'
import { NextFunction } from '@midwayjs/web'
import { LogService } from '../service/log'
import { Context } from 'egg'

@Scope(ScopeEnum.Request, { allowDowngrade: true })
@Middleware()
export class LogMiddleware implements IMiddleware<Context, NextFunction> {
  @Inject()
  logService: LogService

  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      this.logService.record(
        ctx,
        ctx.url.split('?')[0],
        ctx.req.method === 'GET' ? ctx.request.query : ctx.request.body,
        ctx.admin && ctx.admin?.user?.id || null
      )
      await next()
    }
  }
}

```

配置将中间件，这里是放在全局的，默认会拦截所有请求

```typescript
// src/configuration.ts
export class ContainerLifeCycle implements ILifeCycle {
  async onReady() {
    this.app.useMiddleware([LogMiddleware])
  }
}
```

有时候我们并不想记录所有的操作，那就需要在每个controller上单独使用了

```typescript
@Controller('/open', { middleware: [LogMiddleware] })
export class OpenController extends BaseController {
  // ...
}
```


到这里用户访问接口时，我们在数据库就可以看到对应的操作记录了，如果需要前台展示，需要编写相应的controller，这里就不展开了。

## 定时任务

[midwayjs任务队列](http://midwayjs.org/docs/extensions/bull)

定时任务只是midwayjs任务队列的一小部分，讲这部分功能主要是为了定时清除过期日志

如果想要了解midwayjs任务队列更多的内容请参考官网

### 安装依赖

```sh
npm i @midwayjs/bull@3 --save
```

### 使用组件

```typescript
// src/configuration.ts
import { Configuration } from '@midwayjs/core'
import * as bull from '@midwayjs/bull'

@Configuration({
  imports: [
    // ...
    bull
  ]
})
export class MainConfiguration {
  //...
}
```

### 配置 redis

```typescript
// src/config/config.default.ts

import { MidwayConfig, MidwayAppInfo } from '@midwayjs/core'
export default (appInfo: MidwayAppInfo) => {
  return {
    // ...
    bull: {
      // 默认的队列配置
      defaultQueueOptions: {
        redis: 'redis://127.0.0.1:6379'
        // redis: { // 有账号和密码使用
        //   port: 6379,
        //   host: '127.0.0.1',
        //   password: 'foobared',
        // }
      }
    }
  } as MidwayConfig
}

```

### 编写任务处理器

在src目录下新建queue目录存放所有任务队列

使用 `@Processor` 装饰器装饰一个类，用于快速定义一个任务处理器

```typescript
// sec/queue/log.ts

import { Inject, ILogger } from '@midwayjs/core'
import { FORMAT } from '@midwayjs/core'
import { Processor, IProcessor } from '@midwayjs/bull'
import { LogService } from '../service/log'
@Processor('log', {
  repeat: {
    cron: FORMAT.CRONTAB.EVERY_DAY
  }
})
export class LogProcessor implements IProcessor {
  @Inject()
  logService: LogService

  @Inject()
  logger: ILogger
  async execute() {
    this.logger.info('清除日志定时任务开始执行')
    const startTime = Date.now()
    await this.logService.clear()
    this.logger.info(`清除日志定时任务结束，耗时:${Date.now() - startTime}ms`)
  }
}

```
`@Processor` 装饰器需要传递一个 Queue （队列）的名字，在框架启动时，如果没有名为 log 的队列，则会自动创建

第二个参数是任务的配置选项 `repeat` 表示重复执行，可以使用 cron 表达式， 这里设置的是每隔一天清除一次

在启动时，框架会自动查找并初始化上述处理器代码，同时自动创建一个名为 log 的 Queue

- 有时候我们可能想要暂停和重启定时任务，我们可以提供相关的接口调用

```typescript
import { InjectQueue, BullQueue } from '@midwayjs/bull'
import { Post } from '@midwayjs/decorator'
import { ESController } from '../components/es'
import { LogService } from '../service/log'
import { BaseController } from './base'

@ESController({
  prefix: '/open/log',
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  service: LogService
})
export class LogController extends BaseController {
  @InjectQueue('log')
  logQueue: BullQueue

  @Post('/start')
  async start() {
    // 继续任务
    await this.logQueue.resume()
    return this.success()
  }

  @Post('/stop')
  async stop() {
    // 暂停任务
    await this.logQueue.pause()
    return this.success()
  }
}

```

## 最后

本来还想介绍一下前端的相关界面和功能的，但发现篇幅太长，就留到下期吧

不过相关代码已提交到仓库中 `web` 中，大家可作参考
