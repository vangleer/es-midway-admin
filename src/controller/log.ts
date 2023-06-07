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
    await this.logQueue.resume()
    return this.success()
  }
  @Post('/stop')
  async stop() {
    await this.logQueue.pause()
    return this.success()
  }
}
