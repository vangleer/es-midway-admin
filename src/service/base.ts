import { Provide } from '@midwayjs/core'
import { Repository } from 'typeorm'
import { BaseEntity } from '../entity/base'

@Provide()
export class BaseService<T extends BaseEntity> {
  public entity: Repository<T>
  add(query) {
    return this.entity.save(query)
  }
  update(query) {
    return this.entity.update(query.id, query)
  }
  delete(ids: number | string | string[]) {
    return this.entity.delete(ids)
  }
  info(data) {
    return this.entity.findOne({ where: data })
  }
  async page(data, where = {}) {
    const { page = 1, size = 10 } = data
    const [list, total] = await this.entity.findAndCount({
      where: where,
      take: size,
      skip: (page - 1) * size
    })
    return { list, pagination: { total, size, page } }
  }
  list(data?) {
    return this.entity.find({ where: data } as any)
  }
}
