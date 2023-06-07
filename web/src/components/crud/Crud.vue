<template>
  <div class="es-table">
    <el-card class="es-table-card">
      <template #header>
        <div class="es-table-header">
          <From v-model="search.form" :options="search.options" label-position="left" inline>
            <slot></slot>
            <el-form-item>
              <el-button type="primary" @click="handleSearch" icon="Search">查询</el-button>
              <el-button @click="handleReset" icon="Refresh">重置</el-button>
            </el-form-item>
          </From>
        </div>
      </template>

      <div class="es-table-top">
        <slot name="top">
          <el-button type="primary" @click="handleOp({ type: 'add' })">新建</el-button>
        </slot>
      </div>
      <Table v-bind="tableProps" :data="tableData" :columns="columns" border stripe style="width: 100%"
        @row-click="(row: any) => emit('row-click', row)" @op="handleOp">
        <template v-for="item in slotColumns" #[item.prop]="{ row }">
          <slot :name="item.prop" :row="row" />
        </template>
      </Table>
      <template v-if="showPagination">
        <el-pagination v-model:currentPage="pageInfo.page" v-model:page-size="pageInfo.size" background
          :page-sizes="[10, 15, 20, 25, 30]" layout="sizes, total, prev, pager, next" :total="pageInfo.total"
          @current-change="handleCurrentChange" @size-change="handleSizeChange" />
      </template>
    </el-card>
  </div>
</template>

<script setup lang='ts'>
import { reactive, ref, computed } from 'vue'
import From from '@/components/form/Form.vue'
import { CrudProps } from '.'
import { ElMessage, ElMessageBox } from 'element-plus'
import Table from '@/components/table/Table.vue'
import { OperateItemType } from '@/components/table'

const props = defineProps(CrudProps)
const emit = defineEmits(['op', 'delete-success', 'page-change', 'reset', 'row-click'])
const tableData = ref([])

const pageInfo = reactive({
  page: 1,
  size: 10,
  total: 0
})
const slotColumns = computed(() => props.columns.filter(item => item.type === 'slot' || item.slot))
async function getList(params = {}) {
  if (!props.service.page) return
  const res: any = await props.service.page({
    ...props.defaultParams,
    ...params,
    ...pageInfo,
    ...props.search.form
  })

  if (res.code === 200) {
    if (props.mapData) {
      tableData.value = props.mapData(res.data.list)
    } else {
      tableData.value = res.data.list || []
    }
    pageInfo.total = res.data.pagination.total
  }
}

// 分页页码改变
function handleCurrentChange(e: number) {
  emit('page-change')
  pageInfo.page = e
  getList()
}

function handleSizeChange(e: number) {
  emit('page-change')
  pageInfo.size = e
  getList()
}

function handleSearch() {
  getListByPage()
}
function handleReset() {
  Object.keys(props.search.form).forEach(key => {
    (props.search.form as any)[key] = ''
  })
  emit('reset')
  getListByPage()
}

function getListByPage() {
  pageInfo.page = 1
  getList()
}
function handleOp({ type, row }: OperateItemType) {
  if (type === 'delete') {
    handleDelete(row)
  }
  emit('op', { type, row })
}
function handleDelete(row: any) {
  ElMessageBox.confirm('数据删除后无法恢复，请确认？', '删除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      if (!props.service.delete) return
      const res = await props.service.delete({
        ids: [row[props.deleteKey]]
      })
      if (res.code === 200) {
        ElMessage.success('删除成功')
        getList()
        emit('delete-success')
      }
    })
    .catch(() => { })
}

getList()

defineExpose({
  getList,
  list: tableData
})
</script>

<style lang='scss' scoped>
.es-table-search {
  margin-bottom: 20px;
}

.es-table-top {
  margin-bottom: 10px;
}
</style>
