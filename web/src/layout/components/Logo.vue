<template>
  <a class="es-logo" @click.prevent="router.replace('/')">
    <img class="es-logo-icon" src="/logo.svg" />
    <h1 v-if="store.mode === 'side'">
      {{ !store.collapse ? title : '' }}
    </h1>
    <h1 v-else>{{ title }}</h1>
  </a>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAppStore } from '@/store'
import { title } from '@/config'
const router = useRouter()
const store = useAppStore()
</script>

<style lang="scss" scoped>
@import '@/assets/css/variable.scss';
.es-logo {
  cursor: pointer;
  display: flex;
  align-items: center;
  color: #fff;
  height: var(--es-header-height);
  background-color: lighten($es-side-bg, 5%);
  padding: 0 8px;
  width: 200px;
  .es-logo-icon {
    width: 32px;
    height: 32px;
  }
  h1 {
    font-size: 20px;
    line-height: 32px;
    margin: 0 0 0 12px;
    font-weight: 600;
    word-wrap: nowrap;
  }
}
</style>
