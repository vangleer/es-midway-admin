<template>
  <ESCrud ref="crudRef" v-bind="crud" @op="handleOp">
  </ESCrud>
  <ESDialog width="500px" v-model="dialog.show" :title="type === 'add' ? '新建' : '编辑'" destroy-on-close
    @confirm="handleSubmit">
    <ESForm ref="formRef" v-model="dialog.form" :options="dialog.options" :label-width="100" @submit="handleSubmit">
      <el-form-item label="功能权限">
        <el-input v-model="filterText" placeholder="请输入关键字过滤" />
        <el-tree ref="treeRef" node-key="id" class="es-menu-tree" :data="menuTree"
          :default-checked-keys="defaultCheckedKeys" :default-expanded-keys="defaultCheckedKeys" show-checkbox
          :filter-node-method="filterNode" />
      </el-form-item>
    </ESForm>
  </ESDialog>
</template>

<script setup lang='ts'>
import { reactive, ref, watch } from 'vue'
import ESCrud from '@/components/crud/Crud.vue'
import ESDialog from '@/components/Dialog.vue'
import ESForm from '@/components/form/Form.vue'
import service from '@/api/system/role'
import menuService from '@/api/system/menu'
import { ElMessage } from 'element-plus'
import { CrudTypes, FormOption, OperateItemType } from '@/components'

const crud = reactive<CrudTypes>({
  service: service,
  search: {
    form: { username: '' },
    options: [
      { label: 'username', prop: 'username' }
    ]
  },
  columns: [
    { label: 'ID', prop: 'id' },
    { label: '名称', prop: 'name' },
    { label: '备注', prop: 'remark' },
    { label: '创建时间', prop: 'createTime' },
    { label: '更新时间', prop: 'updateTime' },
    { label: '操作', prop: '', type: 'op', minWidth: 120, buttons: ['update', 'delete'] }
  ]
})

const type = ref('add')
const crudRef = ref()
const formRef = ref()
const menuTree = ref<any[]>([])
const filterText = ref('')
const treeRef = ref()
const defaultCheckedKeys = ref([])
const dialog = reactive({
  show: false,
  form: {} as any,
  options: [
    { label: '名称', prop: 'name', required: true },
    { label: '备注', prop: 'remark', required: true }
  ] as FormOption[]
})
watch(filterText, (val) => {
  treeRef.value!.filter(val)
})
const filterNode = (value: string, data) => {
  if (!value) return true
  return data.label.includes(value)
}
function handleSubmit() {
  formRef.value?.validate(async (valid: Boolean, fields: string[]) => {
    if (valid) {
      const checkedKeys = treeRef.value!.getCheckedKeys() || []
      const form = {
        ...dialog.form,
        menuId: checkedKeys.join(',')
      }

      let res
      if (type.value === 'add') {
        res = await service.add(form)
      } else {
        res = await service.update(form)
      }
      if (res.code === 200) {
        ElMessage.success('操作成功')
        dialog.show = false
        crudRef.value?.getList()
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}
function handleOp(item: OperateItemType) {
  if (['add', 'update'].includes(item.type)) {
    defaultCheckedKeys.value = []
    const isUpdate = item.type === 'update' && item.row
    // 清空表单值
    dialog.options.forEach(o => {
      dialog.form[o.prop] = o.defaultValue || ''
    })
    if (isUpdate) {
      dialog.options.forEach(o => {
        dialog.form[o.prop] = item.row[o.prop]
      })
      dialog.form.id = item.row.id

      if (item.row.menuId) {
        defaultCheckedKeys.value = item.row.menuId.split(',')
      }
    }
    type.value = item.type
    dialog.show = true
  }
}

async function getTreeList() {
  const res = await menuService.treeList()
  if (res.code === 200) {
    menuTree.value = res.data
  }
}
getTreeList()
</script>

<style lang='scss' scoped>
.es-menu-tree {
  width: 100%;
  border: 1px solid var(--el-border-color);
  margin-top: 10px;
  border-radius: var(--el-border-radius-base);
}
</style>
