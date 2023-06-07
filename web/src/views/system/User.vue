<template>
  <ESCrud ref="crudRef" v-bind="crud" @op="handleOp">
    <template #roleId="{ row }">
      <el-tag v-for="item in getRowRoles(row)" effect="dark">
        {{ item.label }}
      </el-tag>
    </template>
  </ESCrud>
  <ESDialog
    width="500px"
    v-model="dialog.show"
    :title="type === 'add' ? '新建' : '编辑'"
    destroy-on-close
    @confirm="handleSubmit"
  >
    <ESForm
      ref="formRef"
      v-model="dialog.form"
      :options="formOptions"
      :label-width="100"
      @submit="handleSubmit"
    >
    </ESForm>
  </ESDialog>
</template>

<script setup lang='ts'>
import { reactive, ref, computed } from 'vue'
import ESCrud from '@/components/crud/Crud.vue'
import ESDialog from '@/components/Dialog.vue'
import ESForm from '@/components/form/Form.vue'
import service from '@/api/system/user'
import roleService from '@/api/system/role'
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
    { label: '用户名', prop: 'username' },
    { label: '真实姓名', prop: 'realname' },
    { label: '角色Id', prop: 'roleId', slot: true },
    { label: '操作', prop: '', type: 'op', minWidth: 120, buttons: ['update', 'delete'] }
  ]
})

const type = ref('add')
const crudRef = ref()
const formRef = ref()
const dialog = reactive({
  show: false,
  form: {} as any
})
const roleList = ref([])
const formOptions = computed<FormOption[]>(() => [
  { label: '用户名', prop: 'username', required: true },
  { label: '真实姓名', prop: 'realname', required: true },
  { label: '角色Id', prop: 'roleId', required: true, component: 'el-select', props: { multiple: true, options: roleList.value } },
])

function getRowRoles(row): RowType[] {
  const roleIds = row.roleId?.split(',').map(n => +n) || []
  return roleList.value.filter((item: RowType) => roleIds.includes(item.id))
}

function handleSubmit() {
  const form = {
    ...dialog.form,
    roleId: dialog.form.roleId.join(',')
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
        crudRef.value?.getList()
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}
function handleOp(item: OperateItemType) {
  if (['add', 'update'].includes(item.type)) {
    const isUpdate = item.type === 'update' && item.row
    // 清空表单值
    formOptions.value.forEach(o => {
      dialog.form[o.prop] = o.defaultValue || ''
      dialog.form.roleId = []
    })
    if (isUpdate) {
      formOptions.value.forEach(o => {
        dialog.form[o.prop] = item.row[o.prop]
      })
      dialog.form.id = item.row.id
      dialog.form.roleId = item.row.roleId?.split(',') || []
    }
    type.value = item.type
    dialog.show = true
  }
}

async function getRoleList() {
  const res = await roleService.list(null)
  if (res.code === 200) {
    roleList.value = res.data.map(item => ({ ...item, label: item.name, value: item.id }))
  }
}

getRoleList()

async function getUserRole() {
  const res = await service.getUserRole()
  if (res.code === 200) {
    console.log(res)
  }
}

getUserRole()
</script>

<style lang='scss'>
.el-tag {
  &+& {
    margin-left: 10px;
  }
}
</style>
