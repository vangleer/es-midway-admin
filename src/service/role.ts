import { Provide } from '@midwayjs/core'
import { InjectEntityModel } from '@midwayjs/typeorm'
import { Repository } from 'typeorm'
import { BaseService } from './base'
import { Role } from '../entity/role'

@Provide()
export class RoleService extends BaseService<Role> {
  @InjectEntityModel(Role)
  entity: Repository<Role>
}
