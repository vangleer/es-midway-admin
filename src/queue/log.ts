// import { Inject, ILogger } from '@midwayjs/core'
// import { FORMAT } from '@midwayjs/core'
// import { Processor, IProcessor } from '@midwayjs/bull'
// import { LogService } from '../service/log'
// @Processor('log', {
//   repeat: {
//     cron: FORMAT.CRONTAB.EVERY_DAY
//   }
// })
// export class LogProcessor implements IProcessor {
//   @Inject()
//   logService: LogService

//   @Inject()
//   logger: ILogger
//   async execute() {
//     this.logger.info('清除日志定时任务开始执行')
//     const startTime = Date.now()
//     await this.logService.clear()
//     this.logger.info(`清除日志定时任务结束，耗时:${Date.now() - startTime}ms`)
//   }
// }
