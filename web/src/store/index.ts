import { defineStore } from 'pinia'
import { LayoutModeType, layouts, colors } from '@/config/layout'
import { RouteRecordRaw } from 'vue-router'
import service from '@/api/system/user'
export * from './user'
export * from './auth'

interface AppState {
  route: {
    path: string
    index: string
    meta?: any
  }
  menuMode?: 'horizontal' | 'vertical'
  collapse?: boolean
  browser: any
  tableHeight: number
  mode: LayoutModeType
  primaryColor: string
  tabs: RouteRecordRaw[]
}
export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    route: {
      path: '',
      index: '',
      meta: {}
    },
    menuMode: 'vertical',
    collapse: false,
    browser: {
      isMini: false
    },
    tableHeight: 650,
    mode: layouts[0].value,
    primaryColor: colors[0].value,
    tabs: []
  }),
  actions: {
    setState(payload: any) {
      Object.keys(payload).forEach(key => {
        (this as any)[key] = payload[key]
      })
    },
    saveCurrentRoute(to: RouteRecordRaw) {
      this.route.path = to.path
      this.route.meta = to.meta

      const index = this.tabs.findIndex(route => route.path === to.path)
      if (index === -1) {
        this.tabs.push(to)
      }
    },
    async getUserRole() {
      const res = await service.getUserRole()
      if (res.code === 200) {
        return res.data
      }
    }
  }
})
