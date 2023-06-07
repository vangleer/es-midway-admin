import {
  Configuration,
  listModule,
  getClassMetadata,
  App,
  Inject,
  MidwayWebRouterService,
  Logger,
  IMidwayContainer
} from '@midwayjs/core'
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
  defaultDataSource: DataSource
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
    this.baseController = await container.getAsync(BaseController)
    await this.crud()
    this.logger.info(
      `\x1B[36m [${COMPONENT_KEY}] midwayjs es component ready \x1B[0m`
    )
  }
  async crud() {
    // 可以获取到所有装饰了 @Model() 装饰器的 class
    const modules = listModule(MODEL_KEY)
    for (const mod of modules) {
      // 实现自定义能力
      // 比如，拿元数据 getClassMetadata(mod)
      // 比如，提前初始化 app.applicationContext.getAsync(mod);
      const data = getClassMetadata(MODEL_KEY, mod)

      // 得到配置信息
      const { options = {}, routerOptions = {} } = data
      if (routerOptions?.middleware) {
        console.log(routerOptions, 'routerOptions')
      }
      // 获取配置信息
      const { service, entity } = options

      // 添加的路由列表
      const apis = options.api || defaultApis

      if (apis.length && !service && !entity) {
        // service 和 entity都没有提供，提示报错
        return this.logger.error(
          `\x1B[36m [${COMPONENT_KEY}] ${mod.name} ESController decorator need an entity or a service \x1B[0m`
        )
      }
      const globalRouterPrefix = this.app.config?.egg?.globalPrefix || ''
      const routePrefix = `${globalRouterPrefix}${options.prefix}`
      this.logger.info(
        `\x1B[36m [${COMPONENT_KEY}] auto router prefix "${routePrefix}"  \x1B[0m`
      )
      for (const url of apis) {
        this.webRouterService.addRouter(
          async ctx => {
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
                return this.baseController.success(
                  await baseService[url](body.ids || [])
                )
              default:
                return this.baseController.success(await baseService[url](body))
            }
          },
          {
            url: `${routePrefix}/${url}`,
            requestMethod: 'POST'
          }
        )
      }
    }
  }
}

export { ESConfiguration as Configuration }

export * from './decorator/controller'
