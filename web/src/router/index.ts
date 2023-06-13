import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { useUserStore, useAuthStore, useAppStore } from '../store'
import Layout from '@/layout/index.vue'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
// 导入所有路由页面，格式应该是 { '/src/views/Home.vue': Module }
export const views = import.meta.glob('/src/**/views/**/*.vue', { eager: true })
import ErrorPage from '@/views/error-page/ErrorPage.vue'
import { getToken } from '@/utils'

// 共享路由
const commonRoutes = [
  {
    path: '/home',
    component: Home,
    meta: {
      title: '首页',
      icon: 'HomeFilled'
    }
  }
]

const notFoundPage = {
  path: '/:pathMatch(.*)',
  component: ErrorPage
}

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    component: Login
  },
  {
    path: '/im',
    component: () => import('@/components/IM.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 路由白名单
const whiteList = ['/login', '/im']
router.beforeEach(async (to, from, next) => {
  const store = useUserStore()
  const token = getToken()
  if (to.path === '/login') {
    // 访问登录页清空用户信息
    store.removeUser()
    next()
  } else {
    // 放行白名单
    if (whiteList.includes(to.path)) return next()

    // 无token重定向到登录页
    if (!token) return next({ path: '/login', replace: true })

    if (!useAuthStore().routeList.length) {
      // 如果authStore中没有权限信息，获取用户权限生成路由
      await addRoutes()
      return next({ ...to, replace: true })
    }

    // 保存当前路由
    useAppStore().saveCurrentRoute(to as any)
    next()
  }
})

// 动态添加路由
async function addRoutes() {
  const authStore = useAuthStore()
  const { menus } = await authStore.getUserRole()

  // 遍历菜单生成路由项
  const routes = mapRoutes(menus)
  // 附加共享路由
  const routeList = [...commonRoutes, ...routes] as any

  // 保存动态生成路由宝store中，渲染侧边栏的时候可以使用
  authStore.$patch({ routeList })
  // 添加路由
  router.addRoute({
    path: '/',
    component: Layout,
    redirect: '/home',
    children: routeList
  })
  // 添加404
  router.addRoute(notFoundPage)
}

// 后台返回的menus菜单转换为路由
function mapRoutes(menus: any[] = []): RouteRecordRaw[] {
  return menus.map(menu => {
    let children: RouteRecordRaw[] = []
    if (menu.children && menu.children.length) {
      children = mapRoutes(menu.children)
    }
    const url = menu.viewPath ? `/src/${menu.viewPath}` : ''
    const path = menu.router ? menu.router : ''
    const component = views[url] ? () => Promise.resolve(views[url]) : null

    return {
      // ...menu,
      meta: {
        title: menu.name,
        icon: menu.icon,
        id: menu.id
      },
      path,
      component,
      children
    }
  })
}

export default router
