import { App, Configuration, ILifeCycle } from '@midwayjs/core'
import { Application } from 'egg'
import { join } from 'path'
import * as orm from '@midwayjs/typeorm'
import * as egg from '@midwayjs/web'
import * as jwt from '@midwayjs/jwt'
import * as cache from '@midwayjs/cache'
import * as captcha from '@midwayjs/captcha'
import * as staticFile from '@midwayjs/static-file'
import { ExceptionFilter } from './filter/exception'
import { AuthorityMiddleware } from './middleware/authority'

@Configuration({
  imports: [egg, orm, jwt, cache, captcha, staticFile],
  importConfigs: [join(__dirname, './config')]
})
export class ContainerLifeCycle implements ILifeCycle {
  @App()
  app: Application

  async onReady() {
    this.app.useFilter(ExceptionFilter)
    this.app.useMiddleware([AuthorityMiddleware])
  }
}
