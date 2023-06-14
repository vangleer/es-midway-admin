import { defineStore } from 'pinia'
import {
  removeToken,
  setToken,
  setStorage,
  getStorage,
  removeStorage
} from '@/utils'
import router from '@/router'
type UserState = {
  token: string
  userid?: any
  username: string
  realname?: string
}

export const useUserStore = defineStore('user', {
  state: (): UserState => getStorage('userinfo') || {},
  actions: {
    async saveUser({ token, username, userid }: UserState) {
      this.username = username
      this.token = token
      this.userid = userid
      setToken(token)
      setStorage('userinfo', { token, username, userid })
    },
    removeUser() {
      removeToken()
      removeStorage('userinfo')
      // 删除根级路由
      router.removeRoute('/')
      this.username = ''
      this.token = ''
      this.userid = ''
    }
  }
})
