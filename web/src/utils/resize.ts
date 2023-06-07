import { useAppStore } from '../store'

function update() {
  const store = useAppStore()
  const { clientWidth, clientHeight } = document.documentElement
  if (clientWidth <= 768) {
    store.collapse = true
  } else {
    store.collapse = false
  }
  store.$patch({
    tableHeight: clientHeight - 236
  })
  store.browser.isMini = store.collapse
}

export function resize() {
  window.addEventListener('resize', update)
  update()
}
