import { Body, Inject, Post, Files, Fields } from '@midwayjs/core'
import { LoginService } from '../service/login'
import { FileService } from '../service/file'
import { BaseController } from './base'
import { LoginDTO } from '../dto/login'
import { ESController } from '../components/es'
import { UserService } from '../service/user'
@ESController({
  prefix: '/open',
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  service: UserService
})
export class OpenController extends BaseController {
  @Inject()
  service: LoginService
  @Inject()
  file: FileService

  @Post('/login')
  async login(@Body() data: LoginDTO) {
    const res = await this.service.login(data)
    return this.success(res)
  }

  @Post('/captcha')
  async captcha() {
    const res = await this.service.getCaptcha()
    return this.success(res)
  }

  @Post('/upload')
  async upload(@Files() files, @Fields() fields) {
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
    return this.success(await this.file.removeFile(data.url))
  }
}
