<template>
  <el-config-provider :locale="zhLocale">
    <div :class="['app-container']">
      <router-view v-slot="{ Component }">
        <component :is="Component" />
      </router-view>
    </div>
  </el-config-provider>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import zhLocale from 'element-plus/lib/locale/lang/zh-cn'
import { resize } from './utils/resize'
onMounted(() => {
  resize()
})
</script>

<style lang="scss" scoped>
.app-container {
  height: 100%;
  width: 100%;
  background-color: #f7f7f7;
}
</style>
