import { Provide } from '@midwayjs/core'
import { InjectEntityModel } from '@midwayjs/typeorm'
import { Repository } from 'typeorm'
import { BaseService } from './base'
import { Conf } from '../entity/conf'

@Provide()
export class ConfService extends BaseService<Conf> {
  @InjectEntityModel(Conf)
  entity: Repository<Conf>

  async getValue(key) {
    const conf = await this.entity.findOne({ where: { cKey: key } })
    if (conf) {
      return conf.cValue
    }
  }
}
