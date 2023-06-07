import { Provide, Inject } from '@midwayjs/core'
import { Context } from 'egg'
import * as ipdb from 'ipip-ipdb'
import * as _ from 'lodash'

@Provide()
export class Utils {
  /**
   * 获得请求IP
   */
  async getReqIP(ctx: Context) {
    const req = ctx.req
    return (
      req.headers['x-forwarded-for'] ||
      req.socket.remoteAddress.replace('::ffff:', '')
    )
  }

  /**
   * 根据ip获得请求地址
   * @param ip 为空时则为当前请求的IP地址
   */
  async getIpAddr(ctx: Context, ip?: string | string[]) {
    const baseDir = ctx.app.getBaseDir()
    try {
      if (!ip) {
        ip = await this.getReqIP(ctx)
      }
      const bst = new ipdb.BaseStation(`${baseDir}/common/ipipfree.ipdb`)
      const result = bst.findInfo(ip, 'CN')
      const addArr: any = []
      if (result) {
        addArr.push(result.countryName)
        addArr.push(result.regionName)
        addArr.push(result.cityName)
        return _.uniq(addArr).join('')
      }
    } catch (err) {
      return '无法获取地址信息'
    }
  }
}
