<template>
  <el-drawer
    v-model="isShow"
    directory="rtl"
    :size="550"
    title="demo-component"
  >
  </el-drawer>
</template>

<script setup>
import { ref } from 'vue';

const isShow = ref(false);
const name = ref('demoComponent');
const show = () => {
  isShow.value = true;
};

defineExpose({
  show,
  name
});
</script>

<style lang="less" scoped>

</style>