import { useAuthStore } from '@/store'
import { Directive } from 'vue'

// 判断权限的方法
export function hasPermission(perm: string) {
  const perms = useAuthStore().perms || []
  return perms.includes(perm)
}

// 权限指令
export const permission: Directive = {
  mounted(e: Element, binding) {
    const isShow = hasPermission(binding.value)
    if (!isShow) {
      e.parentElement?.removeChild(e)
    }
  }
}
