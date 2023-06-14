import { post } from '../request'
import { IPage } from '../types'

export default {
  page(data: IPage) {
    return post('/user/page', data)
  },
  update(data) {
    return post('/user/update', data)
  },
  add(data) {
    return post('/user/add', data)
  },
  delete(data) {
    return post('/user/delete', data)
  },
  info(data) {
    return post('/user/info', data)
  },
  list(data?) {
    return post('/user/list', data)
  },
  getUserRole() {
    return post('/user/getUserRole')
  }
}
