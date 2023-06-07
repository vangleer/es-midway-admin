<template>
  <div class="es-action-btn" @click="show = true">
    <el-icon><Setting /></el-icon>
  </div>
  <el-drawer v-model="show" title="主题设置" direction="rtl" size="300px" append-to-body>
    <div className="es-settings-content">
      <div :style="{ marginBottom: '24px' }">
        <h3>导航模式</h3>
        <div className="es-settings-block">
          <div
            v-for="v in layouts"
            :key="v.value"
            :class="['es-settings-layout-block-' + v.value]"
            @click="store.$patch({ mode: v.value })"
          >
            <el-icon v-if="store.mode === v.value" class="es-check-icon"><Check /></el-icon>
          </div>
        </div>
      </div>

      <div :style="{ marginBottom: '24px' }">
        <h3>主题色</h3>
        <div className="es-settings-block">
          <div
            v-for="v in colors"
            :key="v.value"
            class="theme-color-block"
            :style="{ backgroundColor: v.value }"
            @click="handleChangeColor(v)"
          >
            <el-icon v-if="store.primaryColor === v.value" class="es-check-icon"><Check /></el-icon>
          </div>
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAppStore } from '@/store'
import { Setting } from '@element-plus/icons-vue'
import { colors, layouts, ColorsType } from '@/config/layout'
import color from 'color'

const store = useAppStore()
const show = ref(false)

function handleChangeColor(v: ColorsType) {
  document.documentElement.style.setProperty('--el-color-primary', v.value)
  document.documentElement.style.setProperty(
    '--el-color-primary-light-3',
    color(v.value).fade(0.3).rgb().string()
  )
  document.documentElement.style.setProperty(
    '--el-color-primary-light-5',
    color(v.value).fade(0.5).rgb().string()
  )
  document.documentElement.style.setProperty(
    '--el-color-primary-light-7',
    color(v.value).fade(0.7).rgb().string()
  )
  document.documentElement.style.setProperty(
    '--el-color-primary-light-8',
    color(v.value).fade(0.8).rgb().string()
  )
  document.documentElement.style.setProperty(
    '--el-color-primary-light-9',
    color(v.value).fade(0.9).rgb().string()
  )
  document.documentElement.style.setProperty(
    '--el-color-primary-dark-2',
    color(v.value).darken(0.2).rgb().string()
  )
  store.$patch({ primaryColor: v.value })
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/variable.scss';
.es-settings-content {
  h3 {
    margin-bottom: 12px;
  }
  .es-settings-block {
    display: flex;
  }
  .theme-color-block {
    width: 20px;
    height: 20px;
    margin-top: 8px;
    margin-right: 8px;
    color: #fff;
    font-weight: 700;
    text-align: center;
    line-height: 20px;
    border-radius: 2px;
    cursor: pointer;
  }
  [class^='es-settings-layout-block'] {
    position: relative;
    width: 44px;
    height: 36px;
    margin-right: 16px;
    overflow: hidden;
    background-color: #f0f2f5;
    border-radius: 4px;
    box-shadow: 0 1px 2.5px 0 rgb(0 0 0 / 18%);
    cursor: pointer;

    .es-check-icon {
      position: absolute;
      right: 6px;
      bottom: 4px;
      font-weight: 700;
      font-size: 14px;
      pointer-events: none;
    }
    &::before,
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
    }
    &::after {
      background-color: $es-side-bg;
      width: 100%;
      height: 25%;
    }
  }
  .es-settings-layout-block-mix {
    &::before {
      background-color: #fff;
      width: 33%;
      height: 100%;
    }
    &::after {
      z-index: 1;
      background-color: $es-side-bg;
    }
  }
  .es-settings-layout-block-side {
    &::before {
      z-index: 1;
      background-color: $es-side-bg;
      width: 33%;
      height: 100%;
    }
    &::after {
      background-color: #fff;
    }
  }
}
</style>
