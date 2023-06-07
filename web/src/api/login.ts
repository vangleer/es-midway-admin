import { post } from './request'

export interface ILogin {
  username: string
  password: string
  code: string
  captchaId: string
}

export default {
  login(data: ILogin) {
    return post('/open/login', data)
  },
  getImageCode() {
    return post('/open/captcha')
  }
}
