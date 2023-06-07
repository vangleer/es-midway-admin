import Cookies from 'js-cookie'

export const isObject = (obj: any) => {
  return obj !== null && typeof obj === 'object'
}
// cookie
export const setCookie = (key: string, data: any) => {
  if (isObject(data)) {
    data = JSON.stringify(data)
  }
  return Cookies.set(key, data)
}
export const getCookie = (key: string) => {
  return Cookies.get(key)
}
export const removeCookie = (key: string) => {
  return Cookies.remove(key)
}

// localStorage
export const setStorage = (key: string, data: any) => {
  if (isObject(data)) {
    data = JSON.stringify(data)
  }
  localStorage.setItem(key, data)
}
export const getStorage = (key: string) => {
  const data = localStorage.getItem(key)
  return data && JSON.parse(data)
}
export const removeStorage = (key: string) => {
  return localStorage.removeItem(key)
}
