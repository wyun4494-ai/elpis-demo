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

const userName = ref('')

onMounted(() => {
  // 从 localStorage 获取用户名
  userName.value = localStorage.getItem('nickname') || '用户'
})

const handleUserCommand = function(event) {
  if (event === 'logout') {
    window.location = `http://${window.location.host}/api/auth/logout`
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