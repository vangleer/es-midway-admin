# es-midway-admin

基于midwayjs搭建的一套基础后台管理系统(五)-文件模块和swagger接口文档生成

[github仓库地址](https://github.com/vangleer/es-midway-admin)

## 使用技术

midwayjs + typeorm + redis

## 现有功能

- 登录注册、验证码
- 用户管理
- 角色管理
- 权限管理
- 文件模块
- swagger

## 文件模块

主要功能是文件上传和文件删除，同时支持file和stream流的方式

### 准备工作

- 安装依赖

```
npm i @midwayjs/upload@3 --save
```

- 启用组件

```typescript
// configuration.ts
import { Configuration } from '@midwayjs/core'
import * as upload from '@midwayjs/upload'

@Configuration({
  imports: [
    // ...other components
    upload
  ],
  // ...
})
export class MainConfiguration {}
```

### 接口实现

```typescript
// controller/common.ts
import { Body, Inject, Post, Files, Controller } from '@midwayjs/core'
import { FileService } from '../service/file'
import { BaseController } from './base'

@Controller('/common')
export class CommonController extends BaseController {

  @Inject()
  file: FileService

  @Post('/upload')
  async upload(@Files() files) {
    /*
      files = [
        {
          filename: 'test.pdf',        // 文件原名
          data: '/var/tmp/xxx.pdf',    // mode 为 file 时为服务器临时文件地址
          fieldname: 'test1',          // 表单 field 名
          mimeType: 'application/pdf', // mime
        },
        {
          filename: 'test.pdf',        // 文件原名
          data: ReadStream,    // mode 为 stream 时为服务器临时文件地址
          fieldname: 'test2',          // 表单 field 名
          mimeType: 'application/pdf', // mime
        },
        // ...file 下支持同时上传多个文件
      ]
    */
    return this.success(await this.file.upload(files))
  }
  @Post('/removeFile')
  async removeFile(@Body() data) {
    if (!data.url) return this.error('文件地址不可为空')
    return this.success(await this.file.removeFile(data.url))
  }
}

```

- 添加/common/upload和/common/removeFile两个接口，在这两个接口中调用了FileService对应的上传和删除方法

### FileService 实现

```typescript
// service/file.ts

import { Provide, Inject } from '@midwayjs/core'
import { Context } from '@midwayjs/web'
import * as fs from 'fs'
import * as path from 'path'
import * as uuid from 'uuid'
import * as moment from 'moment'
const uploadDir = 'uploads'
@Provide()
export class FileService {
  @Inject()
  ctx: Context

  // 上传文件
  async upload(files: any[]) {
    const mode = await this.getMode()

    const { ctx } = this

    const fileDir = this.getUploadFolder()
    // 存储目录名称
    const dir = `${moment().format('YYYY')}/${moment().format('MM-DD')}`
    // 最终文件目录
    const url = path.join(fileDir, dir)
    const list = []
    // 如果目录不存在就创建
    if (!fs.existsSync(url)) fs.mkdirSync(url, { recursive: true })

    if (mode === 'file') {

      for (let i = 0; i < files.length; i++) {
        // 当前文件
        const file = files[i]
        // 文件后缀
        const extname: string = path.extname(file.filename).toLowerCase()

        // 根据临时路径读取文件
        const data = fs.readFileSync(file.data)
        // 生成文件名称
        const fileName = uuid.v1()
        // 文件最终路径
        const target = path.join(url, `${fileName}${extname}`)
        // 写入文件
        fs.writeFileSync(target, data)

        list.push(`${uploadDir}/${dir}/${fileName}${extname}`)
      }
      // 返回路径列表
      return list
    } else {
      // 模式为stream，一次只能上传一个文件，但参数还是一个数组
      const file = files[0]
      const extname: string = path.extname(file.filename).toLowerCase()
      // 生成文件名称
      const fileName = uuid.v1()
      const target = path.join(url, `${fileName}${extname}`)
      const writeStream = fs.createWriteStream(target)

      for await (const chunk of file.data) {
        writeStream.write(chunk)
      }

      list.push(`${uploadDir}/${dir}/${fileName}${extname}`)
    }
    return list
  }
  // 删除文件
  async removeFile(url) {
    const fileDir = this.getUploadFolder()
    // fileDir包含了uploads，如果url也包含，需要去掉其中一个
    if (url.indexOf(uploadDir) > -1) {
      url = url.replace(uploadDir, '')
    }
    const fileUrl = path.join(fileDir, url)
    // 如果文件存在删除
    if (fs.existsSync(fileUrl)) {
      fs.unlinkSync(fileUrl)
    }
    return true
  }
  // 获取上传文件模式 file/stream
  async getMode() {
    return this.ctx.app.config?.upload?.mode || 'file'
  }

  // 获取uploads目录
  getUploadFolder() {
    const baseDir = this.ctx.app.getBaseDir()
    return path.join(baseDir, '..', `public/${uploadDir}`)
  }
}

```

- upload 说明

  1. midwayjs接收文件参数的时候始终是一个数组，如果mode为file可以接收多个，mode为stream数组中只有一个
  2. file模式支持多文件上传，循环遍历文件列表，根据日期生成上传目录，uuid生成文件名称。在file模式下，文件项的data属性存储的是上传文件的临时路径，使用fs读取然后根据生成的目录和文件名写入即可
  3. stream模式直接获取到索引0的数据即可，data属性上存储的是ReadStream，使用流的方式写入

### 前端调用

```html
<template>
  <input type="file" name="testFile" @change="handleChange" />
</template>
<script lang="ts" setup>
import axios from 'axios'
const handleChange = (e) => {
  const formData = new FormData()
  formData.append('file', e.target.files[0])

  axios.post('/common/upload', formData).then(res => {
    console.log(res.data)
  })
}
</script>
```

## 引入 swagger

### 安装依赖

```sh
npm install @midwayjs/swagger@3 --save
npm install swagger-ui-dist --save-dev
```

如果想要在服务器上输出 Swagger API 页面，则需要将 swagger-ui-dist 安装到依赖中。

```sh
npm install swagger-ui-dist --save
```

### 开启组件

```typescript
import { Configuration } from '@midwayjs/core'
import * as swagger from '@midwayjs/swagger'

@Configuration({
  imports: [
    // ...
    swagger
  ]
})
export class MainConfiguration {

}
```

然后启动项目，访问地址：

- UI: http://127.0.0.1:7001/swagger-ui/index.html
- JSON: http://127.0.0.1:7001/swagger-ui/index.json

路径可以通过 swaggerPath 参数配置。

> 更多使用方式请参考官网 http://midwayjs.org/docs/extensions/swagger


使用swagger后不会显示动态生成的增删改查api，目前还没找到好的解决办法，如果有好的方案，欢迎朋友们讨论啊

