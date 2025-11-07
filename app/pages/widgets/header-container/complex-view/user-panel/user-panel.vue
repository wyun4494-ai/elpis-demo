<template>
    <img 
      src="./asserts/avatar.png"
      class="avatar"
    >
    <el-dropdown @command="handleUserCommand">
      <span class="username">
        {{ userName }} <i class="el-icon-arrow-down el-icon--right" />
      </span>
      <template #dropdown>
        <el-dropdown-item command="logout">
          退出登录
        </el-dropdown-item>
      </template>
    </el-dropdown>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import $curl from '$elpisCommon/curl.js'
import Cookies from 'js-cookie'

const userName = ref('')

onMounted(() => {
  // 从 localStorage 获取用户名
  userName.value = localStorage.getItem('nickname') || '用户'
})

/**
 * 处理用户下拉菜单命令
 * @param {string} event - 命令类型（logout）
 */
const handleUserCommand = async function(event) {
  if (event === 'logout') {
    try {
      // 调用退出登录 API
      const res = await $curl({
        method: 'post',
        url: '/api/proj/auth/logout',
        data: {}
      })

      if (res && res.success) {
        // 1. 清除 localStorage 中的用户信息
        localStorage.removeItem('token')
        localStorage.removeItem('nickname')
        localStorage.removeItem('username')
        localStorage.removeItem('user_id')
        localStorage.removeItem('role_id')

        // 2. 清除 sessionStorage 中的用户信息（如果有）
        sessionStorage.removeItem('auth_token')

        // 3. 清除前端可读的 Cookie（如果有）
        // 注意：后端已经通过 Set-Cookie 清除了 HttpOnly Cookie
        Cookies.remove('auth_token', { path: '/' })

        ElMessage.success('退出登录成功')

        // 跳转到登录页面
        setTimeout(() => {
          window.location.href = '/view/auth/login'
        }, 500)
      }
    } catch (error) {
      console.error('退出登录失败', error)
      ElMessage.error('退出登录失败，请重试')
    }
  }
}
</script>

<style lang="less" scoped>

.avatar {
  margin-right: 10px;
  width: 25px;
  height: 25px;
  border-radius: 50%;
}

.username {
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  height: 60px;
  line-height: 60px;
  outline: none;
}
</style>