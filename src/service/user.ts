import { Provide } from '@midwayjs/core';
import { InjectEntityModel, } from '@midwayjs/typeorm'
import { Repository } from 'typeorm'

import { IUserOptions } from '../interface';
import { BaseService } from './base'
import { User } from '../entity/user'

@Provide()
export class UserService extends BaseService<User> {

  @InjectEntityModel(User)
  entity: Repository<User>

  async getUser(options: IUserOptions) {
    return {
      uid: options.uid,
      username: 'mockedName',
      phone: '12345678901',
      email: 'xxx.xxx@xxx.com',
    };
  }

  async list() {
    return await this.entity.find({})
  }

}
