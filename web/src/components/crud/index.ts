import { PropType, ExtractPropTypes } from 'vue'
import { FormOption } from '../form'
import { ColumnsProps } from '../table'
export type SearchType = {
  form: Object
  options: FormOption[]
}

export const CrudProps = {
  service: {
    type: Object,
    default: () => ({})
  },
  columns: {
    type: Array as PropType<ColumnsProps[]>,
    default: () => []
  },
  search: {
    type: Object as PropType<SearchType>,
    default: () => ({})
  },
  defaultParams: {
    type: Object,
    default: () => ({})
  },
  deleteKey: {
    type: String,
    default: 'id'
  },
  showPagination: {
    type: Boolean,
    default: true
  },
  tableProps: {
    type: Object
  },
  mapData: {
    type: Function
  }
}

export type CrudTypes = Partial<ExtractPropTypes<typeof CrudProps>>
