
import Layout from '@/layout/index.vue'
import ErrorPage from '@/views/error-page/ErrorPage.vue'
export const routes = [
  {
    path: '/system',
    component: Layout,
    meta: {
      title: '系统管理',
      icon: 'Setting'
    },
    children: [
      {
        path: 'user',
        component: () => import('@/views/system/User.vue'),
        meta: {
          title: '用户列表'
        }
      },
      {
        path: 'menu',
        component: () => import('@/views/system/Menu.vue'),
        meta: {
          title: '菜单列表'
        }
      },
      {
        path: 'role',
        component: () => import('@/views/system/Role.vue'),
        meta: {
          title: '角色列表'
        }
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    meta: {
      title: '数据展示',
      icon: 'Collection'
    },
    redirect: '/table',
    children: [
      {
        path: 'table',
        component: () => import('@/views/data/Table.vue'),
        meta: {
          title: '表格'
        },
      },
      {
        path: 'form',
        component: () => import('@/views/data/Form.vue'),
        meta: {
          title: '表单'
        },
      }
    ]
  },
  {
    path: '/menu',
    component: Layout,
    meta: {
      title: '菜单',
      icon: 'Menu'
    },
    children: [
      {
        path: 'menu1',
        component: () => import('@/views/menus/Menu1.vue'),
        meta: {
          title: 'Menu1'
        }
      },
      {
        path: 'nested',
        meta: {
          title: '嵌套菜单',
          icon: 'Menu'
        },
        children: [
          {
            path: '1',
            component: () => import('@/views/menus/nested/Nested1.vue'),
            meta: {
              title: 'Nested1'
            }
          },
          {
            path: '2',
            component: () => import('@/views/menus/nested/Nested2.vue'),
            meta: {
              title: 'Nested2'
            }
          }
        ]
      }
    ]
  },
  {
    path: '/error',
    component: Layout,
    meta: {
      title: '错误页面',
      icon: 'Collection'
    },
    children: [
      {
        path: '404',
        component: ErrorPage,
      }
    ]
  }
]