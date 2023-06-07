import { createApp } from 'vue'
import router from './router'
import { createPinia } from 'pinia'
import Element from './plugins/element'
import Echarts from './plugins/echarts'

import esComponent from './components'
import './assets/css/index.scss'

import App from './App.vue'
import { permission } from '@/utils/permission'

const app = createApp(App)

// 注册权限指令
app.directive('perm', permission)

app.use(router)
  .use(createPinia())
  .use(Element)
  .use(Echarts)
  .use(esComponent)
app.mount('#app')

console.log(import.meta.env)