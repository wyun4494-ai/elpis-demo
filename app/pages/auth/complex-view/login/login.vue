<template>
  <el-row class="login-container" v-loading="loading">
    <el-row class="main-panel">
      <el-row type="flew" class="title-panel">  
        <div class="logo-item">
          <img :src="`/${icon}`" class="logo">
        </div>
        <el-row class="title">
          {{ name }}
        </el-row>
      </el-row>
      <el-input
      v-model="username"
      placeholder="请输入用户名"
      class="username"
      clearable
      size="large"
      @keyup.enter="login"
      />
      <el-input
      v-model="password"
      placeholder="请输入密码"
      class="password"
      type="password"
      show-password
      clearable
      size="large"
      @keyup.enter="login"
      />
      <el-button type="primary" class="login" size="large" @click="login">
        登录
      </el-button>
    </el-row>
  </el-row>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import $curl from '$elpisCommon/curl.js'

const loading = ref(false)
const icon = ref(window.options.icon)
const name = ref(window.options.name)
const username = ref('')
const password = ref('')

const login = async () => {
  loading.value = true
  const res = await $curl({
    method: 'post',
    url: '/api/auth/login',
    data: {
      username: username.value,
      password: password.value
    }
  })
  loading.value = false

  if(!res || !res.success) {
    ElMessage.error('登录失败')
    return
  }
  ElMessage.success('登录成功')
  
  localStorage.setItem('nickname', res?.data?.nickname)

  let path = '/view/project-list'
  if(location.search) {
    const urlParams = new URLSearchParams(location.search)
    const callback = urlParams.get('callback')
    if(callback) {
      path = callback
    }
  }
  window.location.href = `http://${window.location.host}${path}`
}
</script>

<style lang="less" scoped>
// 背景与居中布局
:global(body) {
  background: linear-gradient(135deg, #111827 0%, #1f2937 50%, #0f172a 100%);
  margin: 0;
  padding: 0;
  height: 100vh;
  overflow: hidden;
}

:global(html) {
  height: 100%;
  margin: 0;
  padding: 0;
}

.login-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin: 0;
  z-index: 9999;
}

// 登录卡片
.main-panel {
  width: 100%;
  max-width: 420px;
  padding: 32px 28px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
  backdrop-filter: saturate(160%) blur(6px);
  margin: 0 20px;
  position: relative;
  z-index: 1;
}

.title-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 24px;
}

.logo-item .logo {
  width: 56px;
  height: 56px;
  object-fit: contain;
  border-radius: 12px;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.15);
}

.title {
  font-size: 20px;
  font-weight: 700;
  color: #111827;
}

// 输入框样式
.username,
.password {
  margin-top: 14px;
}

.username :deep(.el-input__wrapper),
.password :deep(.el-input__wrapper) {
  border-radius: 12px;
  box-shadow: 0 0 0 1px #e5e7eb inset;
  transition: all .2s ease;
}

.username :deep(.el-input__wrapper.is-focus),
.password :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 2px #3b82f6 inset, 0 6px 16px rgba(59, 130, 246, 0.15);
}

// 登录按钮
.login {
  width: 100%;
  margin-top: 18px;
  height: 44px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
  box-shadow: 0 10px 22px rgba(79, 70, 229, 0.35);
  transition: transform .08s ease, box-shadow .2s ease, filter .2s ease;
}

.login:hover {
  filter: brightness(1.05);
  box-shadow: 0 12px 26px rgba(79, 70, 229, 0.45);
}

.login:active {
  transform: translateY(1px);
}

// 小屏适配
@media (max-width: 480px) {
  .main-panel {
    padding: 24px 18px;
    max-width: 90%;
    margin: 0 10px;
  }
  .logo-item .logo {
    width: 48px;
    height: 48px;
  }
}
</style>