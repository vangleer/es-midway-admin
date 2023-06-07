<template>
  <el-table :data="data" border stripe style="width: 100%" v-bind="$attrs">
    <template v-for="item in columns">
      <el-table-column v-if="item.type === 'op'" :min-width="120" fixed="right" v-bind="item">
        <template #="{ row }">
          <slot name="op" v-bind="row" />
          <el-button v-for="button in opList" :key="button.type" :type="button.buttonType" link
            @click="handleOp(button.type, row)">
            {{ button.label }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column v-else-if="item.slot || item.type === 'slot'" v-bind="item">
        <template #="{ row }">
          <slot :name="item.prop" :row="row"></slot>
        </template>
      </el-table-column>
      <el-table-column v-else v-bind="item" />
    </template>
  </el-table>
</template>

<script setup lang='ts'>
import { computed } from 'vue'
import { TableProps, OperateType, ColumnsProps } from '.'

const defaultButtonObj: any = {
  update: { label: '编辑' },
  delete: { label: '删除', buttonType: 'danger' },
  default: { label: '按钮' },
  info: { label: '查看' }
}

const props = defineProps(TableProps)
const emit = defineEmits(['op'])

const opList = computed(() => {
  const op = props.columns.find(item => item.type === 'op')
  return op ? getOpList(op) : []
})

function handleOp(type: OperateType, row: any) {
  emit('op', { type, row })
}

function getOpList(op: ColumnsProps) {
  return op.buttons!.map((typeOrObj: any) => {
    let obj: any
    if (typeof typeOrObj === 'string') {
      obj = defaultButtonObj[typeOrObj]
      obj.type = typeOrObj
    } else {
      obj = typeOrObj
    }
    obj.buttonType = obj.buttonType || 'primary'
    return obj
  })
}

</script>

