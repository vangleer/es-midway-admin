import { MidwayConfig, MidwayAppInfo } from '@midwayjs/core'
import { uploadWhiteList } from '@midwayjs/upload'
// import * as redisStore from 'cache-manager-ioredis'
export default (appInfo: MidwayAppInfo) => {
  return {
    // use for cookie sign key, should change to your own and keep security
    keys: appInfo.name + '_1679997956683_5992',
    egg: {
      port: 7001,
      globalPrefix: '/v1'
    },
    typeorm: {
      dataSource: {
        default: {
          type: 'mysql',
          host: '127.0.0.1',
          port: 3306,
          username: 'root',
          password: 'root',
          database: 'db1',
          synchronize: true, // 如果第一次使用，不存在表，有同步的需求可以写 true，注意会丢数据
          logging: false,
          // 配置实体模型
          entities: ['**/entity/*.ts'],
          dateStrings: true
        }
      }
    },
    // security: {
    //   csrf: false,
    // },
    jwt: {
      secret: 'abc',
      expiresIn: '2h'
    },
    cache: {
      store: 'memory',
      options: {
        ttl: null // 过期时间单位毫秒，设置为null视为不过期，默认10000ms
      }

      // 使用 redis 缓存
      // store: redisStore,
      // options: {
      //   host: '192.168.98.241', // default value
      //   port: 6379, // default value
      //   password: '',
      //   db: 0,
      //   keyPrefix: 'cache:',
      //   ttl: null
      // }
    },
    captcha: {
      expirationTime: 3600 // 验证码过期时间，单位为秒s，默认一小时 3600
    },
    es: {
      defaultUserPassword: '123456',
      logKeep: 0 // 操作日志保存时间，单位为天
    },
    upload: {
      // mode: UploadMode, 默认为file，即上传到服务器临时目录，可以配置为 stream
      mode: 'file',
      whitelist: [...uploadWhiteList, '.xlsx', '.xls']
    },
    bull: {
      // 默认的队列配置
      defaultQueueOptions: {
        redis: 'redis://127.0.0.1:6379'
        // redis: { // 有账号和密码使用
        //   port: 6379,
        //   host: '127.0.0.1',
        //   password: 'foobared',
        // }
      }
    }
  } as MidwayConfig
}
