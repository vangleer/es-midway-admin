import { Provide } from '@midwayjs/core'
import { InjectEntityModel, } from '@midwayjs/typeorm'
import { Repository } from 'typeorm'
import { BaseEntity } from '../entity/base'

@Provide()
export class BaseService<T extends BaseEntity> {

  @InjectEntityModel(Repository<T>)
  entity: Repository<T>

  async add(query) {
    return await this.entity.save(query)
  }
  async update(query) {
    return await this.entity.update(query.id, query)
  }
  async delete(ids: number | string | string[]) {
    return await this.entity.delete(ids)
  }
  async info(id: any) {
    return await this.entity.findOne(id)
  }
  async page() {
    return await this.entity.findAndCount()
  }
  async list() {
    return await this.entity.find({})
  }
}
