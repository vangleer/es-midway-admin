import { post } from '../request'
import { IPage } from '../types'

export default {
  page(data: IPage) {
    return post('/menu/page', data)
  },
  update(data) {
    return post('/menu/update', data)
  },
  add(data) {
    return post('/menu/add', data)
  },
  delete(data) {
    return post('/menu/delete', data)
  },
  info(data) {
    return post('/menu/info', data)
  },
  list(data) {
    return post('/menu/list', data)
  },
  treeList() {
    return post('/menu/list/tree')
  }
}
