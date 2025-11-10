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
import { ElMessage } from 'element-plus';
import $curl from '$elpisCurl';
import HeaderContainer from '$elpisHeaderContainer';

const loading = ref(false);
const modelList = ref([]);
const userProjectList = ref([]);  // 用户有权限访问的项目列表

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

// 获取用户有权限访问的项目列表
async function getUserProjectList() {
  try {
    const res = await $curl({
      method: 'get',
      url: '/api/proj/user/project-list',
      errorMessage: '获取用户项目权限失败'
    });
    if (res && res.success && Array.isArray(res.data)) {
      userProjectList.value = res.data;
    }
  } catch (error) {
    console.error('获取用户项目权限异常:', error);
  }
}

onMounted(async () => {
  await getUserProjectList();
  await getModelList();
});

const onEnter = (projectItem) => {
  // 权限检查：支持两种模式
  // 1. 直接权限：project_key 直接匹配项目的 key（如 business-personnel）
  // 2. 领域权限：project_key 匹配项目所属的领域模型（如 business 对应 jd、pdd、taobao）

  const hasDirectPermission = userProjectList.value.includes(projectItem.key);
  const hasModelPermission = projectItem.modelKey && userProjectList.value.includes(projectItem.modelKey);

  // 调试
  console.log('🔍 项目:', projectItem.name);
  console.log('📌 项目 key:', projectItem.key);
  console.log('📌 项目 modelKey:', projectItem.modelKey);
  console.log('✅ 用户权限列表:', userProjectList.value);
  console.log('🔐 直接权限:', hasDirectPermission);
  console.log('🔐 领域权限:', hasModelPermission);

  if (!hasDirectPermission && !hasModelPermission) {
    ElMessage.warning('您没有权限访问此项目');
    return;
  }

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