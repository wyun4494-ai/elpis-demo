<template>
  <header-container title="项目列表">
    <template #main-content>
      <div v-loading="loading">
        <div
          v-for="item in modelList"
          :key="item.model?.key"
        >
          <!-- 展示 model -->
          <div class="model-panel">
            <el-row
              type="flex"
              align="middle"
            >
              <div class="title">
                {{ item.model?.name }}
              </div>
            </el-row>
            <!-- 分割线 -->
            <div class="divider" />
          </div>
          <!-- 展示 project -->
          <el-row
            type="flex"
            class="project-panel"
          >
            <el-card
              v-for="projectItem in (item.project || {})"
              :key="projectItem?.key"
              class="project-card"
            >
              <!-- 标题 -->
              <template #header>
                <div class="title">
                  <span>{{ projectItem.name }}</span>
                </div>
              </template>
              <div class="content">
                {{ projectItem.desc ?? '----------' }}
              </div>
              <template #footer>
                <el-row justify="end">
                  <el-button
                    link
                    type="primary"
                    @click="onEnter(projectItem)"
                  >
                    进入
                  </el-button>
                </el-row>
              </template>
            </el-card>
          </el-row>
        </div>
      </div>
    </template>
  </header-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import $curl from '$elpisCurl';
import HeaderContainer from '$elpisHeaderContainer';

const loading = ref(false);
const modelList = ref([]);  

async function getModelList() {
  loading.value = true;
  try {
    const res = await $curl({
      method: 'get',
      url: '/api/project/model_list',
      errorMessage: '获取项目列表失败'
    });
    if (!res || !res.success || !res.data) {
      return;
    } 
    modelList.value = res.data;
  } catch (error) {
    console.error('获取项目列表异常:', error);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  getModelList();
});
const onEnter = (projectItem) => {
  // 获取当前页面的 origin = 域名
  const { origin } = window.location;
  // 跳转到对应项目的首页
  window.open(`${origin}/view/dashboard${projectItem.homePage}`);
};
</script>

<style lang="less">
// model
.model-panel {
  margin: 20px 50px;
  min-width: 500px;

  .title {
    font-size: 25px;
    font-weight: bold;
    color: #cfcfcf;
  }

  .divider {
    margin-top: 10px;
    border-bottom: 1px dashed #d7d7d7;
    width: 200px;
  }
}
// project
.project-panel{
      margin: 0 50px;
  .project-card{
    margin-right: 30px;
    margin-bottom: 30px;
    width: 300px;
    .title{
      font-size: 20px;
      font-weight: bold;
      color: #47a2ff;
    }
    .content{
      height: 80px;
      color: darkgray;
      font-size: 16px;
      overflow: hidden;
    }

  }
  
}
</style>