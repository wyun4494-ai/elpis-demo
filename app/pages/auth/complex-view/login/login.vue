<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-wrapper">
        <!-- 左侧盒子 - 品牌介绍 -->
        <div class="left-panel">
          <!-- 背景装饰元素 -->
          <div class="decoration-dots"></div>
          <div class="decoration-dots-bottom"></div>
          <div class="decoration-squares"></div>

          <!-- 内容 -->
          <div class="content">
            <div class="logo-section">
              <img :src="`/${icon}`" class="logo" />
              <h1>{{ name }}</h1>
            </div>

            <h2 class="subtitle">企业级 Schema 驱动管理后台</h2>

            <div class="author">
              <span class="name-cn">吴云</span>
              <span class="name-en">Wu Yun</span>
            </div>

            <p class="description">
              Elpis 是一个基于 Schema 驱动的低代码全栈开发框架，
              通过配置自动生成 CRUD 界面，从个人项目到企业级应用，
              让开发更高效！
            </p>
          </div>

          <!-- 底部品牌标识 -->
          <div class="brand-footer">
            <span class="brand-name">Elpis 企业版</span>
            <span class="badge">HOT</span>
            <span class="platform-name">企业级 Schema 驱动管理后台</span>
          </div>
        </div>

        <!-- 右侧盒子 - 登录/注册表单 -->
        <div class="right-panel">
        <!-- 登录表单 -->
        <div v-if="formMode === 'login'" class="form-container" v-loading="loading">
          <div class="form-header">
            <h2>登录</h2>
            <div class="switch-link">
              没有帐号？<a @click="switchToRegister">点此注册</a>
            </div>
          </div>

          <el-form :model="loginForm" :rules="loginRules" ref="loginFormRef">
            <el-form-item prop="username">
              <el-input
                v-model="loginForm.username"
                placeholder="用户名"
                size="large"
                clearable
                @keyup.enter="handleLogin"
              />
            </el-form-item>

            <el-form-item prop="password">
              <el-input
                v-model="loginForm.password"
                type="password"
                placeholder="密码"
                size="large"
                show-password
                clearable
                @keyup.enter="handleLogin"
              />
            </el-form-item>

            <div class="form-options">
              <el-checkbox v-model="loginForm.remember">记住我</el-checkbox>
              <a class="link-button" @click="handleSmsLogin">短信验证码登录</a>
            </div>

            <el-button
              type="warning"
              class="submit-button"
              size="large"
              @click="handleLogin"
            >
              登录
            </el-button>

            <div class="form-footer">
              <a @click="handleForgotPassword">已有帐号，忘记密码？</a>
            </div>
          </el-form>
        </div>

        <!-- 注册表单 -->
        <div v-else class="form-container" v-loading="loading">
          <div class="form-header">
            <h2>注册</h2>
            <div class="switch-link">
              已有帐号？<a @click="switchToLogin">点此登录</a>
            </div>
          </div>

          <el-form :model="registerForm" :rules="registerRules" ref="registerFormRef">
            <el-form-item prop="nickname">
              <el-input
                v-model="registerForm.nickname"
                placeholder="昵称"
                size="large"
                clearable
              />
            </el-form-item>

            <el-form-item prop="username">
              <el-input
                v-model="registerForm.username"
                placeholder="用户名（3-50位，仅支持字母、数字、下划线）"
                size="large"
                clearable
              />
            </el-form-item>

            <el-form-item prop="password">
              <el-input
                v-model="registerForm.password"
                type="password"
                placeholder="密码（至少6位）"
                size="large"
                show-password
                clearable
              />
            </el-form-item>

            <el-form-item prop="agree">
              <el-checkbox v-model="registerForm.agree">
                我已阅读并同意
                <a class="link" @click.prevent>使用条款</a> 及
                <a class="link" @click.prevent>非活跃帐号处理规范</a>
              </el-checkbox>
            </el-form-item>

            <el-button
              type="warning"
              class="submit-button"
              size="large"
              @click="handleRegister"
            >
              立即注册
            </el-button>
          </el-form>
        </div>
        </div>
      </div>
    </div>

    <!-- 页脚 -->
    <div class="page-footer">
      <span class="copyright">© Elpis.com</span>
      <div class="footer-links">
        <a @click="handleAboutUs">关于我们</a>
        <a @click="handleTerms">使用条款</a>
        <a @click="handleHelp">帮助文档</a>
        <a @click="handleSupport">在线自助服务</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import $curl from '$elpisCommon/curl.js'
import Cookies from 'js-cookie'

// 基础配置
const loading = ref(false)
const icon = ref(window.options.icon)
const name = ref(window.options.name)
const formMode = ref('login') // 'login' | 'register'

// 表单引用
const loginFormRef = ref(null)
const registerFormRef = ref(null)

// 登录表单数据
const loginForm = reactive({
  username: '',
  password: '',
  remember: false
})

// 登录表单验证规则
const loginRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
}

// 注册表单数据
const registerForm = reactive({
  nickname: '',
  username: '',
  password: '',
  agree: false
})

// 注册表单验证规则
const registerRules = {
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 1, max: 50, message: '昵称长度为 1-50 个字符', trigger: 'blur' }
  ],
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 50, message: '用户名长度为 3-50 个字符', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含字母、数字、下划线', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 50, message: '密码长度至少为 6 个字符', trigger: 'blur' }
  ],
  agree: [
    {
      validator: (rule, value, callback) => {
        if (!value) {
          callback(new Error('请阅读并同意使用条款'))
        } else {
          callback()
        }
      },
      trigger: 'change'
    }
  ]
}

/**
 * 切换到注册表单
 */
const switchToRegister = () => {
  formMode.value = 'register'
  // 清空登录表单
  loginForm.username = ''
  loginForm.password = ''
  loginForm.remember = false
  loginFormRef.value?.clearValidate()
}

/**
 * 切换到登录表单
 */
const switchToLogin = () => {
  formMode.value = 'login'
  // 清空注册表单
  registerForm.nickname = ''
  registerForm.username = ''
  registerForm.password = ''
  registerForm.agree = false
  registerFormRef.value?.clearValidate()
}

/**
 * 处理登录
 */
const handleLogin = async () => {
  // 表单验证
  const valid = await loginFormRef.value?.validate().catch(() => false)
  if (!valid) return

  loading.value = true

  try {
    const res = await $curl({
      method: 'post',
      url: '/api/proj/auth/login',
      data: {
        username: loginForm.username,
        password: loginForm.password,
        remember: loginForm.remember
      }
    })

    loading.value = false

    if (!res || !res.success) {
      ElMessage.error(res?.message || '登录失败')
      return
    }

    ElMessage.success('登录成功')

    // 存储用户信息到 localStorage
    localStorage.setItem('nickname', res.data.user.nickname)
    localStorage.setItem('username', res.data.user.username)
    localStorage.setItem('role_id', res.data.user.role_id)

    // 注意：Token 已由后端通过 Set-Cookie 响应头设置到 Cookie 中（HttpOnly）
    // 前端无法通过 JavaScript 读取或修改此 Cookie（安全性考虑）
    // 如果需要前端也能读取 Token（用于某些场景），可以使用以下代码：
    // if (loginForm.remember && res.data.token) {
    //   // 使用 js-cookie 设置前端可读的 Token（非 HttpOnly）
    //   Cookies.set('auth_token', res.data.token, {
    //     expires: 7,           // 7 天
    //     secure: false,        // 开发环境设为 false，生产环境设为 true
    //     sameSite: 'Lax',      // 防止 CSRF 攻击
    //     path: '/'
    //   })
    // } else if (res.data.token) {
    //   // 不记住我：使用 sessionStorage（会话级存储）
    //   sessionStorage.setItem('auth_token', res.data.token)
    // }

    // 跳转到目标页面
    let path = '/view/project-list'
    if (location.search) {
      const urlParams = new URLSearchParams(location.search)
      const callback = urlParams.get('callback')
      if (callback) {
        path = decodeURIComponent(callback) // 解码 URL 编码的 callback 参数
      }
    }

    // 使用相对路径跳转（避免协议问题）
    window.location.href = path
  } catch (error) {
    loading.value = false
    ElMessage.error('登录失败，请稍后重试')
  }
}

/**
 * 处理注册
 */
const handleRegister = async () => {
  // 表单验证
  const valid = await registerFormRef.value?.validate().catch(() => false)
  if (!valid) return

  loading.value = true

  try {
    const res = await $curl({
      method: 'post',
      url: '/api/proj/auth/register',
      data: {
        nickname: registerForm.nickname,
        username: registerForm.username,
        password: registerForm.password
      }
    })

    loading.value = false

    if (!res || !res.success) {
      ElMessage.error(res?.message || '注册失败')
      return
    }

    ElMessage.success('注册成功，请登录')

    // 切换到登录表单，并填充用户名
    formMode.value = 'login'
    loginForm.username = registerForm.username
    loginForm.password = ''
    loginForm.remember = false

    // 清空注册表单
    registerForm.nickname = ''
    registerForm.username = ''
    registerForm.password = ''
    registerForm.agree = false
  } catch (error) {
    loading.value = false
    ElMessage.error('注册失败，请稍后重试')
  }
}

/**
 * 短信验证码登录（仅 UI，暂不实现）
 */
const handleSmsLogin = () => {
  ElMessage.info('短信验证码登录功能开发中...')
}

/**
 * 忘记密码（仅 UI，暂不实现）
 */
const handleForgotPassword = () => {
  ElMessage.info('忘记密码功能开发中...')
}

/**
 * 页脚链接处理函数（仅 UI，暂不实现）
 */
const handleAboutUs = () => {
  ElMessage.info('关于我们功能开发中...')
}

const handleTerms = () => {
  ElMessage.info('使用条款功能开发中...')
}

const handleHelp = () => {
  ElMessage.info('帮助文档功能开发中...')
}

const handleSupport = () => {
  ElMessage.info('在线自助服务功能开发中...')
}
</script>

<style lang="less" scoped>
// 全局样式
:global(body) {
  background: #f5f5f5;
  margin: 0;
  padding: 0;
  height: 100vh;
  overflow: auto;
}

:global(html) {
  height: 100%;
  margin: 0;
  padding: 0;
}

// 页面容器
.login-page {
  min-height: 100vh;
  background-image: url('./asserts/bg1.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  display: flex;
  flex-direction: column;
  position: relative;

  // 添加半透明遮罩层，让背景图不会太抢眼
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    z-index: 0;
  }
}

// 登录内容容器
.login-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 40px 20px 40px;
  position: relative;
  z-index: 1;
}

// 登录包装器（左右布局）
.login-wrapper {
  display: flex;
  width: 1000px;
  min-height: 600px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  overflow: visible;
  background: white;
  position: relative;
  z-index: 1;
}

// ========== 左侧盒子 ==========
.left-panel {
  flex: 0 0 420px;
  background: linear-gradient(135deg, #4a5f7f 0%, #5a7a9f 100%);
  position: relative;
  overflow: hidden;
  padding: 50px 40px 40px 40px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: white;
}

// 背景装饰 - 圆点（半圆形扇形扩散，从深到浅）
.decoration-dots {
  position: absolute;
  top: 0;
  left: 0;
  width: 250px;
  height: 250px;
  pointer-events: none;
  z-index: 0;
  border-radius: 0 0 250px 0;
  overflow: hidden;

  // 使用伪元素创建圆点图案
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 2px, transparent 2px);
    background-size: 15px 15px;
    background-position: 0 0;
    mask-image: radial-gradient(circle at top left, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.3) 50%, transparent 100%);
    -webkit-mask-image: radial-gradient(circle at top left, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.3) 50%, transparent 100%);
  }
}

// 背景装饰 - 右下角圆点（对称效果）
.decoration-dots-bottom {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 250px;
  height: 250px;
  pointer-events: none;
  z-index: 0;
  border-radius: 250px 0 0 0;
  overflow: hidden;

  // 使用伪元素创建圆点图案
  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 2px, transparent 2px);
    background-size: 15px 15px;
    background-position: 0 0;
    mask-image: radial-gradient(circle at bottom right, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.3) 50%, transparent 100%);
    -webkit-mask-image: radial-gradient(circle at bottom right, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.3) 50%, transparent 100%);
  }
}

// 背景装饰 - 方块
.decoration-squares {
  position: absolute;
  top: 80px;
  right: 50px;
  width: 60px;
  height: 60px;
  border: 2px solid rgba(255, 255, 255, 0.15);
  transform: rotate(45deg);
  pointer-events: none;
  z-index: 0;
}

// 内容区域
.content {
  position: relative;
  z-index: 1;
  margin-top: 60px; // 给顶部装饰元素留出空间
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 30px;

  .logo {
    width: 50px;
    height: 50px;
    object-fit: contain;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.15);
    padding: 8px;
  }

  h1 {
    font-size: 32px;
    font-weight: 600;
    margin: 0;
    color: white;
    letter-spacing: 1px;
  }
}

.subtitle {
  font-size: 18px;
  font-weight: 400;
  margin: 0 0 50px 0;
  color: rgba(255, 255, 255, 0.95);
  letter-spacing: 0.5px;
}

.author {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  font-size: 15px;
  align-items: baseline;

  .name-cn {
    font-weight: 500;
    color: rgba(255, 255, 255, 0.9);
  }

  .name-en {
    color: rgba(255, 255, 255, 0.7);
    font-size: 14px;
  }
}

.description {
  font-size: 14px;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.85);
  margin: 0;
  text-align: justify;
}

// 底部品牌标识
.brand-footer {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.85);
  position: relative;
  z-index: 1;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.15);

  .brand-name {
    font-weight: 600;
    color: white;
  }

  .badge {
    background: #ff4d4f;
    color: white;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
  }

  .platform-name {
    color: rgba(255, 255, 255, 0.75);
    font-size: 13px;
  }
}

// ========== 右侧盒子 ==========
.right-panel {
  flex: 1;
  background: white;
  padding: 50px 60px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  overflow-y: auto;
}

// 表单容器
.form-container {
  width: 100%;
  max-width: 420px;
  padding-top: 20px;
}

// 表单头部
.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;

  h2 {
    font-size: 24px;
    font-weight: 700;
    color: #111827;
    margin: 0;
  }

  .switch-link {
    font-size: 14px;
    color: #6b7280;

    a {
      color: #0366d6;
      cursor: pointer;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}

// 表单选项（记住我 + 短信登录）
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;

  .link-button {
    font-size: 14px;
    color: #0366d6;
    cursor: pointer;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}

// 提交按钮
.submit-button {
  width: 100%;
  height: 44px;
  background: #ff6a00;
  border: none;
  font-size: 16px;
  font-weight: bold;
  color: white;
  border-radius: 4px;
  transition: all 0.3s ease;

  &:hover {
    background: #ff7a10;
  }

  &:active {
    background: #e65a00;
  }
}

// 表单底部
.form-footer {
  text-align: center;
  margin-top: 16px;

  a {
    font-size: 14px;
    color: #0366d6;
    cursor: pointer;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}

// 链接样式
.link {
  color: #0366d6;
  cursor: pointer;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}

// 表单项样式调整
:deep(.el-form-item) {
  margin-bottom: 20px;
}

:deep(.el-input__wrapper) {
  border-radius: 4px;
  box-shadow: 0 0 0 1px #d1d5db inset;
  transition: all 0.2s ease;

  &.is-focus {
    box-shadow: 0 0 0 2px #0366d6 inset;
  }
}

:deep(.el-checkbox__label) {
  font-size: 14px;
  color: #6b7280;
}

// 响应式布局
@media (max-width: 1100px) {
  .login-wrapper {
    width: 900px;
  }

  .left-panel {
    flex: 0 0 450px;
  }
}

@media (max-width: 768px) {
  .login-container {
    padding: 20px;
    align-items: center;
  }

  .login-wrapper {
    width: 100%;
    min-height: auto;
    flex-direction: column;
  }

  .left-panel {
    flex: 0 0 auto;
    min-height: 300px;
    padding: 30px;
  }

  .right-panel {
    padding: 30px;
    align-items: center;
  }

  .form-container {
    padding-top: 0;
  }

  .logo-section {
    h1 {
      font-size: 24px;
    }
  }

  .subtitle {
    font-size: 16px;
  }

  .description {
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .login-container {
    padding: 10px;
  }

  .left-panel {
    padding: 20px;
    min-height: 250px;
  }

  .right-panel {
    padding: 20px;
  }

  .form-container {
    max-width: 100%;
  }

  .logo-section {
    .logo {
      width: 48px;
      height: 48px;
    }

    h1 {
      font-size: 20px;
    }
  }

  .subtitle {
    font-size: 14px;
  }

  .description {
    font-size: 12px;
  }

  .form-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;

    h2 {
      font-size: 20px;
    }
  }
}

// ========== 页脚 ==========
.page-footer {
  position: relative;
  z-index: 1;
  padding: 20px 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 30px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 13px;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);

  .copyright {
    font-weight: 500;
  }

  .footer-links {
    display: flex;
    align-items: center;
    gap: 20px;

    a {
      color: rgba(255, 255, 255, 0.85);
      text-decoration: none;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;

      &:hover {
        color: #fff;
      }

      &::after {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 0;
        width: 0;
        height: 1px;
        background: #fff;
        transition: width 0.3s ease;
      }

      &:hover::after {
        width: 100%;
      }
    }
  }
}

// 响应式调整
@media (max-width: 768px) {
  .page-footer {
    flex-direction: column;
    gap: 12px;
    padding: 16px 20px;

    .footer-links {
      flex-wrap: wrap;
      justify-content: center;
      gap: 12px;
    }
  }
}
</style>