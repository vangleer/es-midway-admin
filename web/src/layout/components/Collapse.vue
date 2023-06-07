<template>
  <div class="es-action-btn" @click="store.$patch({ collapse: !store.collapse })">
    <el-icon>
      <Expand v-if="store.collapse" />
      <Fold v-else />
    </el-icon>
  </div>
</template>

<script setup lang='ts'>
import { useAppStore } from '@/store'
const store = useAppStore()
</script>

<style lang='scss' scoped>

</style>
