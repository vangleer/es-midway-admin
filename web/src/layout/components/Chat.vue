<template>
  <div class="es-action-btn" @click="show = true">
    <el-icon size="18"><BellFilled /></el-icon>
  </div>
  <el-dialog v-model="show" title="聊天窗口" width="1200px" draggable append-to-body>
    <IM />
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { BellFilled } from '@element-plus/icons-vue'
import IM from '@/components/im/IM.vue'
const show = ref(false)
</script>

<style lang="scss">
.el-dialog__body {
  background-color: #eee;
  padding: 0;
}
</style>
