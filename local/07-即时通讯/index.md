# es-midway-admin

midwayjs基础后台管理系统(七)-即时通讯、使用SocketIO开发聊天功能

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
- 聊天功能

## 具体使用

### 克隆代码到本地

```sh
git clone https://github.com/vangleer/es-midway-admin.git
```

### 启动后端

需提前安装mysql和redis，导入默认数据 src/entity/init.sql（默认路由、配置等）

> 注意：没安装 redis 需要把任务队列相关功能注释

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

## midwayjs 项目引入 SocketIO

[midwayjs官方介绍](http://midwayjs.org/docs/extensions/socketio)

Socket.io 是一个业界常用库，可用于在浏览器和服务器之间进行实时，双向和基于事件的通信。

![](https://img.alicdn.com/imgextra/i2/O1CN01YTye6U22gICvarVur_!!6000000007149-2-tps-1204-352.png)

### 安装依赖

```sh
npm i @midwayjs/socketio@3 --save
## 客户端可选
npm i @types/socket.io-client socket.io-client --save-dev
```

### 开启组件

```typescript
import { Configuration } from '@midwayjs/core'
import * as socketio from '@midwayjs/socketio'

@Configuration({
  imports: [socketio],
  // ...
})
export class MainConfiguration {
  async onReady() {
    // ...
  }
}

```

Socket.io 实现了两种 Transports（传输方式）

第一种是 HTTP 长轮询。HTTP Get 请求用于 long-running（长连接），Post 请求用于 short-running（短连接）。

第二种是 WebSocket 协议，直接基于 WebSocket [Connection](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) 实现。它在服务器和客户端之间提供了双向且低延迟的通信通道。

我们这里使用的是第二种方式 WebSocket，需要添加一下配置

```typescript
// src/config/config.default.ts

import { MidwayConfig, MidwayAppInfo } from '@midwayjs/core'
export default (appInfo: MidwayAppInfo) => {
  return {
    // ...
    socketIO: {
      transports: ['websocket'],
      // cors: { // 长轮询开启跨域
      //   origin: '*'
      // }
    }
  } as MidwayConfig
}

```

### 目录结构

下面是 Socket.io 项目的基础目录结构，和传统应用类似，我们创建了 socket 目录，用户存放 Soscket.io 业务的服务代码。

```
.
├── package.json
├── src
│   ├── configuration.ts          ## 入口配置文件
│   ├── interface.ts
│   └── socket                      ## socket.io 服务的文件
│       └── hello.ts
├── test
├── bootstrap.js                  ## 服务启动入口
└── tsconfig.json
```

### 基本使用

```typescript
// src/socket/hello.ts

import { WSController, OnWSConnection, Inject } from '@midwayjs/core';
import { Context } from '@midwayjs/socketio';

@WSController('/hello')
export class HelloSocketController {

  @Inject()
  ctx: Context;

  @OnWSConnection()
  async onConnectionMethod() {
    console.log('on client connect', this.ctx.id);
  }
}

```

## 聊天服务端

### chat 表设计

chat 表包含字段有 发送人id、接收人id、发送内容、消息类型 （0:文字 1:图片 2:文件）、状态 （0:未读 1:已读）

新建 `src/entity/chat.ts`

```typescript
import { Entity, Column } from 'typeorm'
import { BaseEntity } from './base'

@Entity('chat')
export class Chat extends BaseEntity {
  @Column({ comment: '发送人id', type: 'int' })
  fromUserId: number
  @Column({ comment: '接收人id', type: 'int' })
  toUserId: number

  @Column({ comment: '发送内容', length: 100 })
  content: string

  @Column({ comment: '消息类型 0:文字 1:图片 2:文件', default: 0, type: 'tinyint'  })
  type: string

  @Column({ comment: '状态 0:未读 1:已读', default: 0, type: 'tinyint'  })
  status: string
}
```


