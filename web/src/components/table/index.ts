import { PropType, ExtractPropTypes } from 'vue'
import { TableProps as ElTableProps } from 'element-plus'
type OpButtonType = {
  label?: string
  type?: string
}
export type ColumnsProps = {
  slot?: boolean
  type?: string
  prop: string
  label?: string
  minWidth?: string | number
  buttons?: any[]
}

export type OperateType = 'add' | 'update' | 'delete' | 'info' | 'check'
export type OperateItemType = {
  type: OperateType
  row?: any
}

export const TableProps = {
  data: {
    type: Array,
    required: true
  },
  columns: {
    type: Array as PropType<ColumnsProps[]>,
    default: () => []
  }
}

export type TableTypes = Partial<ExtractPropTypes<typeof TableProps>>
