<template>
  <div class="es-im">
    <div class="es-im-container">
      <div class="es-im-user-list">
        <div v-for="item in userList" class="es-im-user-item">
          <div class="es-im-avatar">
            <img src="https://dummyimage.com/40x40/cd79f2/FFF.png&text=J" alt="">
          </div>
          <div class="es-im-user-content">
            <div class="es-im-title">{{ item.username }}</div>
              <div class="es-im-content">
                <div class="text">lalasdasdasdas</div>
              </div>
          </div>
          <div class="es-im-user-status">07:59:44</div>
        </div>
      </div>
      <div class="es-im-chatbox">
        <div class="es-im-info">
          <div class="es-im-info-list">
            <div v-for="item, index in list" :class="['es-im-info-item', { active: index % 2 === 0 }]">
              <div v-if="index % 2 !== 0" class="es-im-avatar">
                <img src="https://dummyimage.com/40x40/cd79f2/FFF.png&text=J" alt="">
              </div>
              <div class="es-im-message">
                <div class="es-im-title">lisi</div>
                <div class="es-im-content">
                  <div class="is-text">{{ item }}</div>
                </div>
              </div>
              <div v-if="index % 2 === 0" class="es-im-avatar">
                <img src="https://dummyimage.com/40x40/cd79f2/FFF.png&text=J" alt="">
              </div>
            </div>
          </div>
        </div>
        <div class="es-im-footer">
          <div class="es-im-input">
            <el-input
              v-model="message"
              type="textarea"
              :rows="5"
              resize="none"
              placeholder="输入内容"
            />
            <div class="es-im-send-btn">
              <el-button type="success" @click="handleSendMessage">发送</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { ref, onMounted, shallowRef } from 'vue'
import userService from '@/api/system/user'
import { io, Socket } from 'socket.io-client'
const message = ref<string>('')
const list = ref<string[]>([])
const userList = ref<any>([])
const socket = shallowRef<Socket | null>(null)

function handleSendMessage() {
  if (!message.value && !message.value.trim()) return

  list.value.push(message.value)
  socket.value?.send('myEvent', message.value)
  message.value = ''
}

async function getUserList() {
  const res = await userService.list()
  console.log(res)
  if (res.code === 200) {
    userList.value = res.data
  }
}
onMounted(() => {

  socket.value = io('/socket')

  socket.value.on('connect', (e) => {
    console.log('connect', e)
  })
  socket.value.on('data', (e) => {
    console.log('message', e)
  })

  getUserList()
})
</script>

<style lang='scss' scoped>
.es-im-container {
  width: 1200px;
  height: 630px;
  display: flex;
  justify-content: flex-end;
  background-color: #eee;
  padding: 5px;
  box-sizing: border-box;
  position: relative;
  color: #000;
  .es-im-user-list {
    height: calc(100% - 10px);
    width: 345px;
    position: absolute;
    left: 5px;
    top: 5px;
    background-color: #fff;
    .es-im-user-item {
      display: flex;
      padding: 15px 10px;
    }
    .es-im-avatar {
      margin-right: 10px;
      img {
        width: 40px;
        height: 40px;
      }
    }
    .es-im-user-content {
      flex: 1;
      font-size: 12px;
      color: #666;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .es-im-title {
        font-size: 14px;
        margin-bottom: 4px;
      }
      .es-im-content .text {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
      }
    }
    .es-im-user-status {
      font-size: 12px;
      color: #999;
    }

  }
  .es-im-chatbox {
    position: relative;
    z-index: 99;
    transition: width .3s;
    width: calc(100% - 350px);
    background-color: pink;
    .es-im-info {
      height: calc(100% - 150px);
      background-color: #f7f7f7;
      overflow: hidden;
      overflow-y: auto;
      .es-im-info-item {
        display: flex;
        padding: 10px;
        &.active {
          justify-content: flex-end;
          .es-im-avatar {
            margin-left: 10px;
          }
          .es-im-message .es-im-title {
            text-align: right;
          }
        }
        .es-im-avatar {
          margin-right: 10px;
          img {
            height: 36px;
            width: 36px;
          }
        }
        .es-im-message {
          .es-im-title {
            font-size: 12px;
            color: #666;
          }
          .es-im-content {
            display: flex;
            flex-direction: column;
            margin-top: 5px;
            .is-text {
              background-color: #fff;
              padding: 8px;
              border-radius: 0 5px 5px;
              max-width: 400px;
              font-size: 14px;
            }
          }
        }
      }
    }
    .es-im-footer {
      background-color: #fff;
      padding: 10px;
      height: 150px;
    }
    .es-im-input {
      display: flex;
      position: relative;
      .es-im-send-btn {
        margin-left: 10px;
        position: absolute;
        right: 10px;
        bottom: 10px;
      }
    }
  }
}
</style>
