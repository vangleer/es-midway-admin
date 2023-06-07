import { Provide, Inject } from '@midwayjs/core'
import { InjectEntityModel } from '@midwayjs/typeorm'
import { Repository } from 'typeorm'
import { BaseService } from './base'
import { ConfService } from './conf'
import { Log } from '../entity/log'
import { Utils } from '../common/utils'
import * as _ from 'lodash'
import { Context } from 'egg'
import * as moment from 'moment'
@Provide()
export class LogService extends BaseService<Log> {
  @InjectEntityModel(Log)
  entity: Repository<Log>

  @Inject()
  confService: ConfService

  @Inject()
  utils: Utils

  async record(context: Context, url, params, userId) {
    // 获取访问IP地址
    const ip = await this.utils.getReqIP(context)
    // 创建log实例
    const log = new Log()
    // 赋值
    log.userId = userId

    // 解析IP地址
    log.ip = typeof ip === 'string' ? ip : ip.join(',')
    log.ipAddr = await this.utils.getIpAddr(context, ip)

    // 保存请求地址
    log.action = url
    // 请求参数
    if (!_.isEmpty(params)) {
      log.params = JSON.stringify(params)
    }
    await this.entity.insert(log)
  }

  /**
   * 日志
   * @param isAll 是否清除全部
   */
  async clear(isAll?) {
    if (isAll) {
      // 清楚所有
      await this.entity.clear()
      return
    }

    // 清楚过期的日志
    const keepDay = await this.confService.getValue('logKeep')
    if (keepDay) {
      const beforeDate = `${moment()
        .add(-keepDay, 'days')
        .format('YYYY-MM-DD')} 00:00:00`
      await this.entity
        .createQueryBuilder()
        .where('createTime < :createTime', { createTime: beforeDate })
      await this.entity.query(' delete from log where createTime < ? ', [
        beforeDate
      ])
    } else {
      // 如果没有过期时间清除所有
      await this.entity.clear()
    }
  }
}
