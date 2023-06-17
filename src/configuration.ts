import {
  App,
  Configuration,
  ILifeCycle,
  Inject,
  MidwayWebRouterService
} from '@midwayjs/core'
import { Application, Context } from 'egg'
import { join } from 'path'
import * as orm from '@midwayjs/typeorm'
import * as egg from '@midwayjs/web'
import * as jwt from '@midwayjs/jwt'
import * as cache from '@midwayjs/cache'
import * as captcha from '@midwayjs/captcha'
import * as staticFile from '@midwayjs/static-file'
import * as validate from '@midwayjs/validate'
import * as upload from '@midwayjs/upload'
import * as swagger from '@midwayjs/swagger'
import * as es from './components/es'
// import * as bull from '@midwayjs/bull'
import * as socketio from '@midwayjs/socketio'
import { ExceptionFilter } from './filter/exception'
import { AuthorityMiddleware } from './middleware/authority'
import { LogMiddleware } from './middleware/log'
@Configuration({
  imports: [
    egg,
    orm,
    jwt,
    cache,
    captcha,
    staticFile,
    validate,
    upload,
    es,
    // bull,
    socketio,
    {
      component: swagger,
      enabledEnvironment: ['local']
    }
  ],
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
    this.app.useFilter(ExceptionFilter as any)
    this.app.useMiddleware([AuthorityMiddleware, LogMiddleware] as any)
  }
}
