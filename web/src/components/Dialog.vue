<template>
  <el-dialog
    v-model="show"
    :close-on-click-modal="closeOnClickModal"
    :title="title"
    draggable
    v-bind="$attrs"
    @close="$emit('close')"
  >
    <slot></slot>
    <template v-if="showFooter" #footer>
      <span class="dialog-footer">
        <el-button @click="show = false">取消</el-button>
        <el-button v-if="showConfirm" type="primary" :disabled="disabled" @click="onConfirm">
          {{ confirmText }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean
  },
  title: {
    type: String,
    default: ''
  },
  showFooter: {
    type: Boolean,
    default: true
  },
  confirmText: {
    type: String,
    default: '确定'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  showConfirm: {
    type: Boolean,
    default: true
  },
  closeOnClickModal: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'confirm', 'close'])

const show = computed<boolean>({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  }
})

const onConfirm = () => {
  emit('confirm')
}
</script>

<style lang="scss" scoped></style>
