export type LayoutModeType = 'top' | 'mix' | 'side'
export type ColorsType = {
  value: string
  label: string
}
export const colors: ColorsType[] = [
  {
    value: '#1890ff',
    label: '蓝色'
  },
  {
    value: 'rgb(245, 34, 45)',
    label: '红色'
  },
  {
    value: 'rgb(250, 84, 28)',
    label: '橘黄色'
  },
  {
    value: 'rgb(19, 194, 194)',
    label: '青色'
  }
]

export type LayoutsType = {
  value: LayoutModeType
  label: string
}
export const layouts: LayoutsType[] = [
  { value: 'side', label: '侧边菜单布局' },
  { value: 'mix', label: '混合菜单布局' },
  { value: 'top', label: '顶部菜单布局' }
]
