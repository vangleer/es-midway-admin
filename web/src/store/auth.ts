import { defineStore } from 'pinia'
import { RouteRecordRaw } from 'vue-router'
import service from '@/api/system/user'

interface AuthState {
  perms: string[]
  menus: any[]
  routeList: RouteRecordRaw[]
}
export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    perms: [], // 接口权限列表
    menus: [], // 后台返回的菜单权限列表
    routeList: [] // 动态生成的路由
  }),
  actions: {
    async getUserRole() {
      // 获取用户信息&权限
      const res = await service.getUserRole()
      if (res.code === 200) {
        // 保存数据
        this.perms = res.data.perms || []
        this.menus = res.data.menus || []
        return res.data
      }
    }
  }
})
