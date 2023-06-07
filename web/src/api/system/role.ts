import { post } from '../request'
import { IPage } from '../types'

export default {
  page(data: IPage) {
    return post('/role/page', data)
  },
  update(data) {
    return post('/role/update', data)
  },
  add(data) {
    return post('/role/add', data)
  },
  delete(data) {
    return post('/role/delete', data)
  },
  info(data) {
    return post('/role/info', data)
  },
  list(data) {
    return post('/role/list', data)
  }
}
