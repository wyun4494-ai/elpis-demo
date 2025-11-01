<template>
  <el-drawer
    v-model="visible"
    :title="drawerTitle"
    size="70%"
    :before-close="handleClose"
  >
    <div v-loading="loading" class="view-params-container">
      <!-- 分类信息 -->
      <el-descriptions :column="2" border class="category-info">
        <el-descriptions-item label="分类ID">
          {{ categoryInfo.category_id }}
        </el-descriptions-item>
        <el-descriptions-item label="分类名称">
          {{ categoryInfo.category_name }}
        </el-descriptions-item>
        <el-descriptions-item label="参数数量">
          <el-tag type="primary">{{ params.length }} 个</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="排序">
          {{ categoryInfo.sort_order }}
        </el-descriptions-item>
      </el-descriptions>

      <el-divider content-position="left">参数列表</el-divider>

      <!-- 参数列表表格 -->
      <el-table
        v-if="params.length > 0"
        :data="params"
        border
        stripe
        style="width: 100%"
      >
        <el-table-column
          prop="param_id"
          label="参数ID"
          width="200"
          show-overflow-tooltip
        />
        <el-table-column
          prop="param_name"
          label="参数名称"
          width="150"
        />
        <el-table-column
          prop="param_type"
          label="参数类型"
          width="120"
        >
          <template #default="{ row }">
            <el-tag :type="getParamTypeTagType(row.param_type)" size="small">
              {{ getParamTypeLabel(row.param_type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="param_values"
          label="预定义值"
          min-width="200"
        >
          <template #default="{ row }">
            <div v-if="row.param_values" class="param-values">
              <el-tag
                v-for="(value, index) in parseParamValues(row.param_values)"
                :key="index"
                size="small"
                style="margin: 2px"
              >
                {{ value }}
              </el-tag>
            </div>
            <span v-else class="text-muted">-</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="sort_order"
          label="排序"
          width="80"
          align="center"
        />
        <el-table-column
          prop="status"
          label="状态"
          width="80"
          align="center"
        >
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'" size="small">
              {{ row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>

      <!-- 空状态 -->
      <el-empty
        v-else
        description="该分类下暂无参数"
        :image-size="120"
      />
    </div>

    <!-- 底部按钮 -->
    <template #footer>
      <div class="drawer-footer">
        <el-button @click="handleClose">关闭</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import $curl from '$elpisCommon/curl.js'

const name = ref('viewParamsDrawer')
const visible = ref(false)
const loading = ref(false)
const categoryInfo = ref({
  category_id: '',
  category_name: '',
  sort_order: 0
})
const params = ref([])

const drawerTitle = computed(() => {
  return categoryInfo.value.category_name
    ? `${categoryInfo.value.category_name} - 参数列表`
    : '参数列表'
})

// 显示抽屉
const show = async (rowData) => {
  visible.value = true
  categoryInfo.value = {
    category_id: rowData.category_id || '',
    category_name: rowData.category_name || '',
    sort_order: rowData.sort_order || 0
  }

  // 加载参数列表
  await loadParams(rowData.category_id)
}

// 加载参数列表
const loadParams = async (categoryId) => {
  if (!categoryId) {
    ElMessage.error('缺少分类ID')
    return
  }

  loading.value = true
  try {
    const res = await $curl({
      method: 'get',
      url: '/api/proj/param-category',
      params: { category_id: categoryId }
    })

    if (res && res.success && res.data) {
      params.value = res.data.params || []
    } else {
      params.value = []
    }
  } catch (error) {
    console.error('Load params error:', error)
    ElMessage.error('加载参数列表失败')
    params.value = []
  } finally {
    loading.value = false
  }
}

// 解析参数值（JSON 字符串 → 数组）
const parseParamValues = (paramValues) => {
  if (!paramValues) return []
  try {
    const parsed = JSON.parse(paramValues)
    return Array.isArray(parsed) ? parsed : []
  } catch (error) {
    return []
  }
}

// 获取参数类型标签
const getParamTypeLabel = (type) => {
  const typeMap = {
    input: '输入框',
    select: '下拉选择',
    checkbox: '多选框'
  }
  return typeMap[type] || type
}

// 获取参数类型标签颜色
const getParamTypeTagType = (type) => {
  const typeMap = {
    input: '',
    select: 'success',
    checkbox: 'warning'
  }
  return typeMap[type] || ''
}

// 关闭抽屉
const handleClose = () => {
  visible.value = false
}

defineExpose({
  show,
  name
})
</script>

<style scoped>
.view-params-container {
  padding: 0 20px;
}

.view-params-container .category-info {
  margin-bottom: 20px;
}

.view-params-container .param-values {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.view-params-container .text-muted {
  color: #909399;
}

.drawer-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>

