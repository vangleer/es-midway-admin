<template>
  <div :class="[`es-layout-aside`]">
    <Logo v-if="store.mode === 'side' || store.browser.isMini" />
    <Menu />
  </div>
  <div
    v-if="!store.browser.isMini"
    :style="{ width: store.collapse ? 'var(--es-header-height)' : 'var(--es-sidebar-width)' }"
    class="es-layout-aside-ghost"
  ></div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/store'
import Logo from './components/Logo.vue'
import Menu from './components/Menu.vue'
const store = useAppStore()
</script>

