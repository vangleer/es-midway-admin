<template>
  <div class="es-table">
    <el-card class="es-table-card">
      <template #header>
        <div class="es-table-header">
          <el-form :model="form" inline>
            <el-form-item label="Name">
              <el-input v-model="form.name" />
            </el-form-item>
            <el-form-item label="Address">
              <el-input v-model="form.address" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit" icon="Search">查询</el-button>
              <el-button @click="onSubmit" icon="Refresh">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </template>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="date" label="Date" width="180" />
        <el-table-column prop="name" label="Name" width="180" />
        <el-table-column prop="address" label="Address" />
      </el-table>

      <el-pagination background layout="prev, pager, next" :total="1000" />
    </el-card>
  </div>
</template>

<script setup lang='ts'>
import { reactive } from 'vue'

// do not use same name with ref
const form = reactive({
  name: '',
  address: ''
})

const tableData = [
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
]

const onSubmit = () => {
  console.log('submit!')
}
</script>

<style lang='scss' scoped>
.es-table-search {
  margin-bottom: 20px;
}
</style>
