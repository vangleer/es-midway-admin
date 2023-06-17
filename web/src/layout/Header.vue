<template>
  <div class="es-header">
    <div class="es-header-left">
      <Logo v-if="store.mode !== 'side' && !store.browser.isMini" />
    </div>
    <div class="es-header-main">
      <template v-if="store.mode !== 'top'">
        <Collapse />
        <Breadcrumb />
      </template>
      <Menu v-else />
    </div>
    <Chat />
    <div class="es-header-user es-action-btn">
      <el-dropdown trigger="click">
        <el-button type="info" link>
          <img :src="userIcon" alt="用户头像" />
          <span>{{ userStore.username }}</span>
          <el-icon class="el-icon--right"><arrow-down /></el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="onLogout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <Settings />
  </div>
  <div v-if="store.mode === 'top'" class="es-header-ghost"></div>
</template>

<script setup lang="ts">
import Menu from './components/Menu.vue'
import Settings from './components/Settings.vue'
import Breadcrumb from './components/Breadcrumb.vue'
import Collapse from './components/Collapse.vue'
import Chat from './components/Chat.vue'
import userIcon from '@/assets/images/user.webp'
import { useAppStore, useUserStore } from '@/store'
import { useRouter } from 'vue-router'
import Logo from './components/Logo.vue'

const router = useRouter()
const store = useAppStore()
const userStore = useUserStore()
const onLogout = () => {
  router.replace('/login')
}
</script>

