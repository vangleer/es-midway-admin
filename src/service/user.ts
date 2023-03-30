import { Provide } from '@midwayjs/core';
import { InjectEntityModel, } from '@midwayjs/typeorm'
import { Repository } from 'typeorm'
import { BaseService } from './base'
import { User } from '../entity/user'

@Provide()
export class UserService extends BaseService<User> {
  @InjectEntityModel(User)
  entity: Repository<User>
}
