<template>
  <div
    :class="[
      'es-layout',
      'es-layout-' + store.mode,
      { collapse: store.collapse, 'is-mini': store.browser.isMini }
    ]"
  >
    <div class="es-layout-mask" @click="store.$patch({ collapse: true })"></div>
    <Header v-if="store.mode !== 'side'" />
    <SideBar v-if="store.mode !== 'top'" />
    <div class="es-layout-main">
      <Header v-if="store.mode === 'side'" />
      <Tabs />
      <AppMain />
    </div>
  </div>
</template>

<script setup lang="ts">
import Header from './Header.vue'
import SideBar from './Sidebar.vue'
import AppMain from './AppMain.vue'
import Tabs from './components/Tabs.vue'
import { useAppStore } from '@/store'
const store = useAppStore()

</script>

<style lang="scss">
@import './index.scss';
</style>
