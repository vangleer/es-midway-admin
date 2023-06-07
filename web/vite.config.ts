import { defineConfig, UserConfig, loadEnv } from 'vite'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'
import { createHtmlPlugin } from 'vite-plugin-html'
// 路径查找
const pathResolve = (dir: string): string => {
  return resolve(__dirname, '.', dir)
}
// https://vitejs.dev/config/
export default defineConfig(({ mode }): UserConfig => {
  const env = loadEnv(mode, '')
  return {
    plugins: [
      vue(),
      createHtmlPlugin({
        inject: {
          data: env
        }
      })
    ],
    resolve: {
      alias: {
        '/@': pathResolve('src'),
        '@': pathResolve('src')
      }
    },
    server: {
      // 端口号
      port: 3001,
      host: '0.0.0.0',
      // // 本地跨域代理
      proxy: {
        '/v1': {
          target: 'http://127.0.0.1:7001',
          changeOrigin: true
          // rewrite: (path) => path.replace('/v1', '')
        },
        '/uploads': {
          target: 'http://127.0.0.1:7001/public',
          changeOrigin: true
        }
      }
    }
  }
})
