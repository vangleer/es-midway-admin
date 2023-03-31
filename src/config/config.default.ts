import { MidwayConfig, MidwayAppInfo } from '@midwayjs/core';
// import { User } from '../entity/user'
// import { Role } from '../entity/role'
// import { Menu } from '../entity/menu'

export default (appInfo: MidwayAppInfo) => {
  return {
    // use for cookie sign key, should change to your own and keep security
    keys: appInfo.name + '_1679997956683_5992',
    egg: {
      port: 7001,
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
          dateStrings: true,
        },
      },
    },
    // security: {
    //   csrf: false,
    // },
    jwt: {
      secret: 'abc',
    },
  } as MidwayConfig;
};
