<template>
  <div class="es-im">
    <div class="es-im-container">
      <el-scrollbar class="es-im-user-list">
        <div
          v-for="item in userList"
          :class="['es-im-user-item', { active: chatUser.id === item.id }]"
          @click="handleUserClick(item)"
        >
          <div class="es-im-avatar">
            <img src="https://dummyimage.com/40x40/cd79f2/FFF.png&text=J" alt="">
          </div>
          <div class="es-im-user-content">
            <div class="es-im-title">{{ item.username }}</div>
              <div class="es-im-content">
                <div class="text">{{ item.message.content }}</div>
              </div>
          </div>
          <div class="es-im-user-status">{{ dayjs(item.message.createTime).format('HH:mm:ss') }}</div>
        </div>
      </el-scrollbar>
      <div class="es-im-chatbox">
        <el-scrollbar ref="infoRef" class="es-im-info">
          <div ref="innerRef" class="es-im-info-list">
            <div v-for="item in messageList" :class="['es-im-info-item', { active: item.self }]">
              <div v-if="!item.self" class="es-im-avatar">
                <img src="https://dummyimage.com/40x40/cd79f2/FFF.png&text=J" alt="">
              </div>
              <div class="es-im-message">
                <div class="es-im-title">{{ item.self ? item.fromUserName : item.toUserName }}</div>
                <div class="es-im-content">
                  <div class="is-text">{{ item.content }}</div>
                </div>
              </div>
              <div v-if="item.self" class="es-im-avatar">
                <img src="https://dummyimage.com/40x40/cd79f2/FFF.png&text=J" alt="">
              </div>
            </div>
          </div>
        </el-scrollbar>
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
import { ref, onMounted, shallowRef, computed, onBeforeUnmount, nextTick } from 'vue'
import { useUserStore } from '@/store'
import { io, Socket } from 'socket.io-client'
import { dayjs, ScrollbarInstance } from 'element-plus'
const userStore = useUserStore()
const message = ref<string>('')
const list = ref<any[]>([])
const userList = ref<any>([])
const chatUser = ref<any>({})
const socket = shallowRef<Socket | null>(null)
const chatTopic = ref('')
const infoRef = ref<ScrollbarInstance | null>(null)
const innerRef = ref<HTMLElement | null>(null)

const messageList = computed(() => {
  return (list.value || []).map(item => {
    return {
      ...item,
      fromUserName: userStore.username,
      toUserName: chatUser.value.username,
      self: +item.fromUserId === userStore.userid
    }
  })
})

function handleSendMessage() {
  if (!message.value && !message.value.trim()) return
  socket.value?.emit('chat', {
    fromUserId: userStore.userid,
    toUserId: chatUser.value.id,
    content: message.value
  })
  message.value = ''
}
/**
 * 点击聊天列表
 * @param item
 */
function handleUserClick(item) {
  chatUser.value = item
  getChatList()
}

/**
 * 获取左侧列表
 */
async function getUserList() {
  socket.value?.emit('userList', { userId: userStore.userid }, (data) => {
    userList.value = data
    // 默认与列表的第一位朋友聊天
    chatUser.value = userList.value[0]
    getChatList()
  })
}

// 接收发送的消息
function onChatMessage (data) {
  list.value.push(data)
  setScroll()
}

/**
 * 获取和当前朋友的聊天记录
 */
function getChatList() {
  if (socket.value) {
    socket.value.emit('chatList', {
      fromUserId: userStore.userid,
      toUserId: chatUser.value.id
    }, (data) => {
      list.value = data || []
      setScroll()
    })

    // 使用聊天双方的id建立事件名称，需要和后端一致
    const ids = [userStore.userid, chatUser.value.id]
    ids.sort((a, b) => a - b)
    const topic = `${ids[0]}-chat-${ids[1]}`

    // 取消前一次的监听
    socket.value.off(chatTopic.value, onChatMessage)
    // 重新监听
    socket.value.on(topic, onChatMessage)
    chatTopic.value = topic
  } else {
    list.value = []
  }
}

function setScroll() {
  nextTick(() => {
    infoRef.value?.setScrollTop(innerRef.value?.clientHeight || 9999)
  })
}
onMounted(() => {
  // 简历websocket连接
  socket.value = io('ws://127.0.0.1:7001', { transports: ['websocket'] })
  // 连接后获取左侧列表
  socket.value.on('connect', () => getUserList())

  // 监听自己的发送
  socket.value.on('chat', onChatMessage)
})

onBeforeUnmount(() => {
  socket.value?.close()
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
      cursor: pointer;
      &:hover, &.active {
        background-color: #eee;
      }
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
