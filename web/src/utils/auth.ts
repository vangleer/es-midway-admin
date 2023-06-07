import Cookies from 'js-cookie'

export const TokenKey = 'Authorization'

// 获取token
export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token: string) {
  Cookies.set(TokenKey, token)
}

// 删除token
export function removeToken() {
  Cookies.remove(TokenKey)
}
