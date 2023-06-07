<script lang="ts">
import { defineComponent, h } from 'vue'
import { useAppStore, useAuthStore } from '@/store'
import { ElIcon, ElMenu, ElMenuItem, ElSubMenu } from 'element-plus'
import * as Icons from '@element-plus/icons-vue'
import { RouteRecordRaw } from 'vue-router'

const iconObj: any = Icons

export default defineComponent({
  setup() {
    const store = useAppStore()
    function mergeMeta(parentMeta: any = {}, childMeta: any = {}) {
      let obj = { ...childMeta }
      Object.keys(parentMeta).forEach(key => {
        if (!obj[key]) {
          obj[key] = parentMeta[key]
        }
      })
      return obj
    }
    function mapItems(routes: RouteRecordRaw[], parentPath: string = ''): any {
      return routes.map((item, index) => {
        const paths = [parentPath, item.path].filter(p => p)
        let meta: any = item.meta || {}
        // 如果只有一个子菜单
        if (item.children && item.children.length === 1 && !item.children[0].children) {
          meta = mergeMeta(item.meta, item.children[0].meta)
          paths.push(item.children[0].path)
        }
        const path = parentPath === '/' || item.path === '/' ? paths.join('') : paths.join('/')
        const title = meta.title
        const icon = meta.icon
        const Icon = iconObj[icon as string]
        
        if (item.children && item.children.length) {
          const items = mapItems(item.children, path)
          return h(ElSubMenu, {
            key: item.path,
            index: `/${item.meta?.id}`
          }, {
            title: () => [
              Icon && h(ElIcon, null, { default: () => h(Icon) }),
              h('div', { class: 'es-menu-sub-title' }, title)
            ],
            default: () => items
          })
          
        } else {
          return h(ElMenuItem, {
            key: path,
            index: path
          }, {
            default: () => [
              Icon && h(ElIcon, null, { default: () => h(Icon) }),
              h('div', { class: 'es-menu-sub-title' }, title)
            ]
          })
        }
      })
    }
    const d = mapItems(useAuthStore().routeList)

    return () => h(ElMenu, {
      collapse: store.collapse,
      mode: store.mode === 'top' ? 'horizontal' : 'vertical',
      defaultActive: store.route.path,
      router: true
    }, { default: () => d })
  }
})
</script>

