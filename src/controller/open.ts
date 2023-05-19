import { Body, Inject, Post, Controller, Files } from '@midwayjs/core'
import { LoginService } from '../service/login'
import { BaseController } from './base'
import { LoginDTO } from '../dto/login'
import xlsx from 'node-xlsx'
import { FileService } from '../service/file'
import { Get } from '@midwayjs/decorator'
@Controller('/open')
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

  @Post('/import')
  async import(@Files() files) {
    const file = files[0]
    const data = await this.file.importExcel(file)
    // 将数据保存到数据库或者其它地方
    data.forEach(element => {
      console.log(element.data)
    });
		return this.success(data)
  }

  @Get('/export')
  async export() {
    // 数据可以来自数据库或其它地方
    const data = [ [ 'id', 'name' ], [ 1, '张三' ], [ 2, '李四' ] ]
    await this.file.exportExcel(data)
  }
}
