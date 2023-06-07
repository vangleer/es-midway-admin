<template>
  <el-card>
    <div style="margin-bottom: 10px;">
      <el-button type="primary" @click="handleOp({ type: 'add' })">新建</el-button>
    </div>
    <ESTable row-key="id" v-bind="table" @op="handleOp">
      <template #op="row">
        <el-button v-if="row.type !== 2" type="primary" link @click="handleOp({ type: 'add', row })">新增</el-button>
      </template>
      <template #type="{ row }">
        <el-tag :type="tagList[row.type]">{{ typeList.find(o => o.value ===
          row.type)?.label }}</el-tag>
      </template>
    </ESTable>
  </el-card>

  <ESDialog width="500px" v-model="dialog.show" :title="type === 'add' ? '新建' : '编辑'" destroy-on-close
    @confirm="handleSubmit">
    <ESForm ref="formRef" v-model="dialog.form" :options="formOptions" :label-width="100" @submit="handleSubmit">
      <template #parentId="item">
        <el-form-item v-bind="item">
          <el-tree-select v-model="dialog.form[item.prop]" :data="table.data" check-strictly
            :render-after-expand="false" />
        </el-form-item>
      </template>
    </ESForm>
  </ESDialog>
</template>

<script setup lang='ts'>
import { reactive, ref, computed } from 'vue'
import ESTable from '@/components/table/Table.vue'
import ESDialog from '@/components/Dialog.vue'
import ESForm from '@/components/form/Form.vue'
import service from '@/api/system/menu'
import { ElMessage, ElMessageBox } from 'element-plus'
import { FormOption, OperateItemType, TableTypes } from '@/components'
import { viewList } from '@/config'

const tagList = ['', 'success', 'danger', 'warning', 'info'] as any
const typeList = [
  { label: '目录', value: 0 },
  { label: '菜单', value: 1 },
  { label: '按钮', value: 2 }
]
const defaultFormOptions = [
  { label: '节点类型', prop: 'type', required: true, defaultValue: 0, component: 'el-radio-group', props: { options: typeList } },
  { label: '节点名称', prop: 'name', required: true },
  { label: '上级节点', prop: 'parentId', slot: 'parentId' },
  { label: '排序号', prop: 'orderNum', component: 'el-input-number', defaultValue: 0 },
  { label: '图标', prop: 'icon' },
  { label: '是否显示', prop: 'isShow', component: 'el-switch', defaultValue: true },
]

const table = reactive<TableTypes>({
  columns: [
    { label: 'ID', prop: 'id' },
    { label: '名称', prop: 'name' },
    { label: '类型', prop: 'type', slot: true },
    { label: '节点路由', prop: 'router' },
    { label: '文件路径', prop: 'viewPath' },
    { label: '权限', prop: 'perms' },
    { label: '操作', prop: '', type: 'op', minWidth: 120, buttons: ['update', 'delete'] }
  ],
  data: []
})

const type = ref('add')
const formRef = ref()
const dialog = reactive({
  show: false,
  form: {} as any
})
const formOptions = computed<FormOption[]>(() => {
  switch (dialog.form.type) {
    case 1:
      return [
        ...defaultFormOptions,
        { label: '节点路由', prop: 'router' },
        { label: '文件路径', prop: 'viewPath', component: 'el-select', props: { options: viewList(), filterable: true } },
      ]
    case 2:
      return [...defaultFormOptions.slice(0, 4), { label: '权限', prop: 'perms' }]
  }
  return defaultFormOptions
})
function handleSubmit() {
  const form = {
    ...dialog.form,
    parentId: +dialog.form.parentId || null
  }

  formRef.value?.validate(async (valid: Boolean, fields: string[]) => {
    if (valid) {
      let res
      if (type.value === 'add') {
        res = await service.add(form)
      } else {
        res = await service.update(form)
      }
      if (res.code === 200) {
        ElMessage.success('操作成功')
        dialog.show = false
        getTreeList()
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}
function handleOp(item: OperateItemType) {
  if (['add', 'update'].includes(item.type)) {
    const isUpdate = item.type === 'update' && item.row
    const isAddRow = item.type === 'add' && item.row
    // 清空表单值
    formOptions.value.forEach(o => {
      dialog.form[o.prop] = typeof o.defaultValue === 'undefined' ? '' : o.defaultValue
    })
    if (isUpdate) {
      dialog.form.type = item.row.type
      formOptions.value.forEach(o => {
        dialog.form[o.prop] = item.row[o.prop]
      })
      dialog.form.id = item.row.id
    }
    if (isAddRow) {
      // 点击当前行的新增
      dialog.form.type = item.row.type + 1
      dialog.form.parentId = item.row.id
    }
    type.value = item.type
    dialog.show = true
  } else if (item.type === 'delete') {
    handleDelete(item.row)
  }
}

async function getTreeList() {
  const res = await service.treeList()
  if (res.code === 200) {
    table.data = res.data
  }
}

function handleDelete(row: RowType) {
  ElMessageBox.confirm('数据删除后无法恢复，请确认？', '删除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      const res = await service.delete({
        ids: [row.id]
      })
      if (res.code === 200) {
        ElMessage.success('删除成功')
        getTreeList()
      }
    })
    .catch(() => { })
}

getTreeList()

</script>

<style lang='scss' scoped></style>
