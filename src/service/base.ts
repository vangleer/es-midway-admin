import { Provide } from '@midwayjs/core'
import { Repository } from 'typeorm'
import { BaseEntity } from '../entity/base'

@Provide()
export abstract class BaseService<T extends BaseEntity> {
  public abstract entity: Repository<T>
  add(query) {
    return this.entity.save(query)
  }
  update(query) {
    return this.entity.update(query.id, query)
  }
  delete(ids: number | string | string[]) {
    return this.entity.delete(ids)
  }
  info(id: any) {
    return this.entity.findOne(id)
  }
  page() {
    return this.entity.findAndCount()
  }
  list() {
    return this.entity.find({})
  }
}
