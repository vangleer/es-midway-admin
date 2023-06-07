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
