<template>
  <div class="es-breadcrumb">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item v-if="store.route.meta.title">
        {{ store.route.meta.title }}
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/store'
const store = useAppStore()
</script>

<style lang="scss" scoped>
.es-breadcrumb {
  padding: 0px 8px;
}
</style>
