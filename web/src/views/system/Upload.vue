<template>
  <el-upload
    :auto-upload="false"
    :on-change="onChange"
  >
    <template #trigger>
      <el-button type="primary">选择文件</el-button>
    </template>

    <el-button type="success" @click="handleUpload">上传文件</el-button>
    <el-button type="success" @click="handleRemove">删除文件</el-button>
  </el-upload>
  <img v-if="url" :src="url">

</template>
<script lang="ts" setup>
import { ref } from 'vue'
import commonService from '@/api/common'
import { ElMessage } from 'element-plus'
const file = ref()
const url = ref('')

const onChange = (uploadFile) => {
  file.value = uploadFile
  console.log(uploadFile)
}

const handleUpload = async () => {
  if (!file.value) return ElMessage.warning('请选择文件')
  const formData = new FormData()
  formData.append('file', file.value.raw)
  const res = await commonService.upload(formData)
  if (res.code === 200) {
    url.value = res.data[0]
  }
}

const handleRemove = async () => {
  if (!url.value) return ElMessage.warning('请选择文件')
  const res = await commonService.removeFile({ url: url.value })
  url.value = ''
  file.value = undefined

  if (res.code === 200) {
    ElMessage.success('删除成功')
  }
}
</script>