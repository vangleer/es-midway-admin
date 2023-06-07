import { type App } from 'vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

export function setupElement(app: App) {
  app.use(ElementPlus, {
    size: 'small'
  })
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
}

export default {
  install: setupElement
}
