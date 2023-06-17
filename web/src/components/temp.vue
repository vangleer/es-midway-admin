<template>
  <div>

  </div>
</template>

<script setup lang='ts'>
import { onMounted, ref } from 'vue'
import { io, Socket } from 'socket.io-client'

const socket = ref<Socket | null>(null)

onMounted(() => {
  // 建立websocket连接
  socket.value = io('ws://127.0.0.1:7001/hello', { transports: ['websocket'] })
  // 连接成功回调
  socket.value.on('connect', () => {
    console.log('client connected')
    socket.value?.emit('words', 'hello world from client')
  })

  // 监听消息
  socket.value.on('words', (data) => {
    console.log(data)
  })
})
</script>

<style lang='scss' scoped>

</style>
