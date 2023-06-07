import axios, { AxiosRequestConfig } from 'axios'
import { BASE_URL, TIME_OUT } from '@/config'
import { TokenKey } from '@/utils/auth'
import { useUserStore } from '@/store'
import { ElMessage } from 'element-plus'
import router from '@/router'
interface ResponseType {
  code: number
  data: any
  message: string
}
// const instance = axios.create({
//   baseURL: BASE_URL,
//   timeout: TIME_OUT
// })

const instance = axios.create({
  baseURL: '/v1',
  timeout: 50000
})

// 请求拦截
instance.interceptors.request.use(config => {
  config.headers[TokenKey] = useUserStore().token
  return config
})

// 响应拦截
instance.interceptors.response.use(res => {
  const data = res.data
  switch (data.code) {
    case 200:
      return data
    case 401:
      ElMessage.closeAll()
      ElMessage.error({
        message: '登录已过期，请从新登录！',
        duration: 3000
      })
      return router.replace('/login')
    default:
      ElMessage.error({
        message: data.message,
        duration: 3000
      })
      return
  }
})

export function post<T = any, R = ResponseType>(
  url: string,
  data?: T,
  config?: AxiosRequestConfig
) {
  return instance.post<R, R>(url, data, config)
}

export { instance }

export default instance
