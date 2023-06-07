<template>
  <div class="es-layout-tabs">
    <div class="es-action-btn" @click="handleAction('left')">
      <el-icon><ArrowLeft /></el-icon>
    </div>
    <div ref="wrapRef" class="es-layout-tabs-wrap es-scrollbar-x">
      <div ref="mainRef" class="es-layout-tabs-main">
        <div
          v-for="item in store.tabs"
          :key="item.path"
          :class="['es-layout-tabs-item', store.route.path === item.path ? 'active' : '']"
          @click="handleClick(item)"
        >
          <span>{{ item.meta?.title }}</span>
          <el-icon v-if="item.path !== '/'" class="tab-close" @click.stop="handleClose(item)"><Close /></el-icon>
        </div>
      </div>
    </div>
    <div class="es-action-btn" @click="handleAction('right')"><el-icon><ArrowRight /></el-icon></div>
  </div>
</template>

<script setup lang='ts'>
import { useAppStore } from '@/store'
import { ref } from 'vue'
import { RouteRecordRaw, useRouter } from 'vue-router'
type CommandType = 'left' | 'right'
const router = useRouter()
const store = useAppStore()
const wrapRef = ref<HTMLElement>()
const mainRef = ref<HTMLElement>()
function handleClick(item: RouteRecordRaw) {
  router.push(item.path)
}
function handleClose(item: RouteRecordRaw) {
  const index = store.tabs.findIndex(route => route.path === item.path)
  if (store.route.path === item.path) {
    if (store.tabs[index - 1]) {
      router.push(store.tabs[index - 1].path)
    } else {
      router.replace('/')
    }
  }
  store.tabs.splice(index, 1)
  if (!store.tabs.length) {
    router.replace('/')
  }
}

function handleAction(command: CommandType) {
  if (command === 'right') {
    wrapRef.value!.scrollLeft = wrapRef.value!.scrollWidth
  } else if (command === 'left') {
    wrapRef.value!.scrollLeft = 0
  }
}
</script>

<style lang='scss' scoped>
.es-layout-tabs {
  width: 100%;
  height: 30px;
  box-shadow: 0 1px 4px 0 rgb(0 21 41 / 12%);
  background-color: #fff;
  display: flex;
  &-wrap {
    position: relative;
    flex: 1;
    &::-webkit-scrollbar {
      width: 0px;
      height: 0px;
    }
  }
  &-main {
    display: flex;
    align-items: center;
    height: 100%;
    .tabs-action {
      height: 100%;
      padding: 0 10px;
      cursor: pointer;
    }
  }
  &-item {
    flex-grow: 0;
    flex-shrink: 0;
    position: relative;
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 0 20px;
    height: 28px;
    font-size: 14px;
    border: 1px solid #d9d9d9;
    color: #000000d9;
    margin: 0 3px;
    span, .tab-close {
      transition: all 0.2s;
    }
    &.active {
      background-color: var(--el-color-primary);
      color: #fff;
      &::before {
        transform: translateX(-12px);
        content: "";
        background-color: #fff;
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        position: relative;
      }
    }
    &.active, &:not(.active):hover {
      .tab-close {
        opacity: 1;
      }
      span:first-child {
        transform: translateX(-8px);
      }
    }
    &:not(.active):hover {
      color: var(--el-color-primary);
      .tab-close:hover {
        background-color: var(--el-color-primary);
        color: #fff;
      }
    }
    .tab-close {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      opacity: 0;
    }
  }
}
</style>
