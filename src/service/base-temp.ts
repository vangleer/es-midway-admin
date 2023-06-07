import { Provide } from '@midwayjs/core'
import { Repository } from 'typeorm'
import { BaseEntity } from '../entity/base'
import * as _ from 'lodash'
import { Application, Context } from 'egg'
@Provide()
export class BaseService<T extends BaseEntity> {
  public entity: Repository<T>
  ctx: Context
  app: Application
  sqlParams: any[] = []
  setCtx(ctx) {
    this.ctx = ctx
  }
  setApp(app) {
    this.app = app
  }
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
  async list(data?, option?) {
    // const sql = await this.getOptionFind(data, option)
    // return this.nativeQuery(sql, [])
    return this.entity.find({ where: data } as any)
  }
  async nativeQuery(sql, params) {
    if (_.isEmpty(params)) {
      params = this.sqlParams
    }
    let newParams = []
    newParams = newParams.concat(params)
    this.sqlParams = []
    return await this.entity.query(sql, newParams || [])
  }
  async getOptionFind(query, option) {
    const { order = 'createTime', sort = 'desc' } = query
    console.log(query, 'query')
    const sqlArr = ['SELECT']
    const selects = ['a.*']
    const find = this.entity.createQueryBuilder('a')

    if (option) {
      if (typeof option === 'function') {
        option = await option()
      }

      if (option.leftJoin) {
        for (const item of option.leftJoin) {
          selects.push(`${item.alias}.*`)
          find.leftJoin(item.entity, item.alias, item.condition)
        }
      }

      if (option.where) {
        const wheres =
          typeof option.where === 'function'
            ? await option.where(this.ctx, this.app)
            : option.where
        if (!_.isEmpty(wheres)) {
          for (const item of wheres) {
            if (
              item.length == 2 ||
              (item.length == 3 &&
                (item[2] || (item[2] === 0 && item[2] != '')))
            ) {
              for (const key in item[1]) {
                this.sqlParams.push(item[1][key])
              }
              find.andWhere(item[0], item[1])
            }
          }
        }
      }

      // // 接口请求的排序
      // if (sort && order) {
      //   const sorts = sort.toUpperCase().split(',')
      //   const orders = order.split(',')
      //   if (sorts.length != orders.length) {
      //     throw new CustomHttpError('inequality between sort and order')
      //   }
      //   for (const i in sorts) {
      //     const o = orders[i].indexOf('.') === -1 ? `a.${orders[i]}` : orders[i]
      //     find.addOrderBy(o, sorts[i])
      //   }
      // }
      // 筛选字段
      if (!_.isEmpty(option.select)) {
        sqlArr.push(option.select.join(','))
        find.select(option.select)
      } else {
        sqlArr.push(selects.join(','))
      }
    } else {
      sqlArr.push(selects.join(','))
    }

    const sqls = find.getSql().split('FROM')
    sqlArr.push('FROM')
    sqlArr.push(sqls[1])
    return sqlArr.join(' ')
  }
}
