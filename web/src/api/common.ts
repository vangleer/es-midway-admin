import { post } from './request'

export default {
  upload(data) {
    return post('/common/upload', data)
  },
  removeFile(data) {
    return post('/common/removeFile', data)
  }
}
