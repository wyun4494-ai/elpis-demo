<template>
  <el-button @click="handleClick">点击</el-button>
  <div>demo</div>
</template>

<script setup>
import { ref } from 'vue'
 
const handleClick = () => {
  console.log('点击')
}
</script>

<style lang="less" scoped>

</style>