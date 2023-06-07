import { defineStore } from 'pinia'
import { removeToken, setToken, setStorage, getStorage, removeStorage } from '@/utils'
import router from '@/router'
type UserState = {
  token: string
  userid?: any
  username: string
  realname?: string
}

export const useUserStore = defineStore('user', {
  state: (): UserState => (getStorage('userinfo') || {}),
  actions: {
    async saveUser({ token, username }: UserState) {
      this.username = username
      this.token = token
      setToken(token)
      setStorage('userinfo', { token, username })
    },
    removeUser() {
      removeToken()
      removeStorage('userinfo')
      // 删除根级路由
      router.removeRoute('/')
      this.username = ''
      this.token = ''
    }
  }
})
