<template>
  <div class="es-page-login" @keyup.enter="toLogin">
    <div class="box">
      <div class="logo">
        <span>{{ title }}</span>
      </div>
      <el-form label-position="top" class="form" :disabled="saving" size="large">
        <el-form-item label="">
          <el-input v-model="form.username" placeholder="用户名" maxlength="20" prefix-icon="User" />
        </el-form-item>

        <el-form-item label="">
          <el-input v-model="form.password" type="password" placeholder="密码" maxlength="20" prefix-icon="Lock" />
        </el-form-item>
        <el-form-item label="">
          <div style="display: flex;">
            <el-input v-model="form.code" placeholder="验证码" maxlength="4" />
            <img style="background-color: #fff;" :src="imageCode" @click="getCodeImage">
          </div>
        </el-form-item>
        <div class="op">
          <el-button type="primary" :loading="saving" @click="toLogin">登录</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { title } from '@/config'
import loginService, { ILogin } from '@/api/login'
const router = useRouter()

// 状态1
const saving = ref(false)

// 表单数据
const form = reactive<ILogin>({
  username: '',
  password: '',
  code: '',
  captchaId: ''
})
const imageCode = ref('')

// 登录
async function toLogin() {
  if (!form.username) {
    return ElMessage.error('用户名不能为空')
  }

  if (!form.password) {
    return ElMessage.error('密码不能为空')
  }
  saving.value = true

  try {
    const res = await loginService.login(form)
    if (res.code === 200) {
      const data = { username: form.username, token: res.data.token }
      await useUserStore().saveUser(data)
      router.push('/')
    }
  } catch (err: any) {
    console.log(err)
  }

  saving.value = false
}

async function getCodeImage() {
  const res: any = await loginService.getImageCode()
  if (res.code === 200) {
    imageCode.value = res.data.image
    form.captchaId = res.data.captchaId
  }
}

getCodeImage()
</script>

<style lang="scss">
@import '@/assets/css/variable.scss';

.es-page-login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  position: relative;
  background-color: fade-out($es-side-bg, 0.2);

  .el-button {
    width: 100%;
  }

  .el-form-item {
    margin-bottom: 40px;
  }

  .el-input__wrapper,
  .el-button {
    --el-input-border-color: rgba(107, 107, 107, 1);
    border-color: var(--el-input-border-color);
  }

  .box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    padding: 30px;
    min-width: 450px;

    .logo {
      position: relative;
      height: 81px;
      margin-bottom: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;

      span {
        font-size: 26px;
        margin-left: 10px;
        letter-spacing: 5px;
        font-weight: bold;
      }
    }

    .el-form {
      width: 280px;

      :deep(.el-form-item) {
        margin-bottom: 20px;
      }
    }

    .op {
      display: flex;
      justify-content: center;
      margin: 50px 0 30px;
    }
  }

  .es-copyright {
    position: absolute;
    bottom: 60px;
    color: #999999;
    text-align: center;
    font-size: 13px;
    line-height: 20px;
  }
}
</style>
