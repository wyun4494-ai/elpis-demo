<template>
  <el-drawer
    v-model="visible"
    :title="drawerTitle"
    size="80%"
    :before-close="handleClose"
  >
    <div v-loading="loading" class="edit-param-category-container">
      <!-- 分类基本信息 -->
      <el-card shadow="hover" class="category-info-card">
        <template #header>
          <div class="card-header">
            <span>分类基本信息</span>
          </div>
        </template>
        <el-form
          ref="categoryFormRef"
          :model="categoryForm"
          label-width="120px"
        >
          <el-form-item label="分类ID">
            <el-input v-model="categoryForm.category_id" disabled />
          </el-form-item>
          <el-form-item label="分类名称" required>
            <el-input
              v-model="categoryForm.category_name"
              placeholder="请输入分类名称"
            />
          </el-form-item>
          <el-form-item label="排序">
            <el-input-number
              v-model="categoryForm.sort_order"
              :min="0"
              style="width: 100%"
            />
          </el-form-item>
        </el-form>
      </el-card>

      <el-divider content-position="left">参数列表管理</el-divider>

      <!-- 参数列表 -->
      <el-card shadow="hover" class="params-list-card">
        <template #header>
          <div class="card-header">
            <span>参数列表 ({{ params.length }} 个)</span>
            <el-button
              type="primary"
              size="small"
              @click="handleAddParam"
            >
              添加参数
            </el-button>
          </div>
        </template>

        <!-- 参数表格 -->
        <el-table
          v-if="params.length > 0"
          :data="params"
          border
          stripe
          style="width: 100%"
        >
          <el-table-column
            prop="param_name"
            label="参数名称"
            width="150"
          >
            <template #default="{ row }">
              <el-input
                v-model="row.param_name"
                placeholder="请输入参数名称"
                size="small"
              />
            </template>
          </el-table-column>
          <el-table-column
            prop="param_type"
            label="参数类型"
            width="150"
          >
            <template #default="{ row }">
              <el-select
                v-model="row.param_type"
                placeholder="请选择"
                size="small"
                style="width: 100%"
              >
                <el-option label="输入框" value="input" />
                <el-option label="下拉选择" value="select" />
                <el-option label="多选框" value="checkbox" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            prop="param_values"
            label="预定义值"
            min-width="200"
          >
            <template #default="{ row }">
              <el-input
                v-model="row.param_values_text"
                placeholder="多个值用逗号分隔，如：金色,白色,黑色"
                size="small"
              />
            </template>
          </el-table-column>
          <el-table-column
            prop="sort_order"
            label="排序"
            width="100"
            align="center"
          >
            <template #default="{ row }">
              <el-input-number
                v-model="row.sort_order"
                :min="0"
                size="small"
                style="width: 100%"
              />
            </template>
          </el-table-column>
          <el-table-column
            prop="status"
            label="状态"
            width="100"
            align="center"
          >
            <template #default="{ row }">
              <el-switch
                v-model="row.status"
                :active-value="1"
                :inactive-value="0"
                size="small"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="100"
            align="center"
            fixed="right"
          >
            <template #default="{ $index }">
              <el-button
                type="danger"
                size="small"
                text
                @click="handleDeleteParam($index)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 空状态 -->
        <el-empty
          v-else
          description="暂无参数，点击上方按钮添加"
          :image-size="100"
        />
      </el-card>
    </div>

    <!-- 底部按钮 -->
    <template #footer>
      <div class="drawer-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" :loading="saving" @click="handleSave">
          保存
        </el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import $curl from '$elpisCommon/curl.js'

const emit = defineEmits(['command'])

const name = ref('editParamCategoryDrawer')
const visible = ref(false)
const loading = ref(false)
const saving = ref(false)
const categoryFormRef = ref(null)

const categoryForm = ref({
  category_id: '',
  category_name: '',
  sort_order: 0
})

const params = ref([])
const deletedParamIds = ref([])

const drawerTitle = computed(() => {
  return categoryForm.value.category_name
    ? `编辑参数分类 - ${categoryForm.value.category_name}`
    : '编辑参数分类'
})

// 显示抽屉
const show = async (rowData) => {
  visible.value = true
  categoryForm.value = {
    category_id: rowData.category_id || '',
    category_name: rowData.category_name || '',
    sort_order: rowData.sort_order || 0
  }
  deletedParamIds.value = []

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
      params.value = (res.data.params || []).map(param => ({
        ...param,
        param_values_text: parseParamValuesToText(param.param_values)
      }))
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

// 解析参数值（JSON → 文本）
const parseParamValuesToText = (paramValues) => {
  if (!paramValues) return ''
  try {
    const parsed = JSON.parse(paramValues)
    return Array.isArray(parsed) ? parsed.join(',') : ''
  } catch (error) {
    return ''
  }
}

// 添加参数
const handleAddParam = () => {
  params.value.push({
    param_id: `NEW_${Date.now()}`,
    param_name: '',
    param_type: 'input',
    param_values_text: '',
    param_category: categoryForm.value.category_name,
    sort_order: params.value.length,
    status: 1,
    is_new: true
  })
}

// 删除参数
const handleDeleteParam = async (index) => {
  const param = params.value[index]
  
  // 如果是已存在的参数，需要确认
  if (!param.is_new) {
    try {
      await ElMessageBox.confirm(
        '确定要删除该参数吗？删除后将无法恢复。',
        '删除确认',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
      
      // 记录删除的参数ID
      deletedParamIds.value.push(param.param_id)
    } catch {
      return
    }
  }
  
  // 从列表中移除
  params.value.splice(index, 1)
}

// 保存
const handleSave = async () => {
  // 验证分类名称
  if (!categoryForm.value.category_name || !categoryForm.value.category_name.trim()) {
    ElMessage.error('请输入分类名称')
    return
  }

  // 验证参数
  for (const param of params.value) {
    if (!param.param_name || !param.param_name.trim()) {
      ElMessage.error('请填写所有参数的名称')
      return
    }
  }

  saving.value = true
  try {
    // 1. 更新分类基本信息
    const res1 = await $curl({
      method: 'put',
      url: '/api/proj/param-category',
      data: {
        category_id: categoryForm.value.category_id,
        category_name: categoryForm.value.category_name,
        sort_order: categoryForm.value.sort_order
      }
    })

    if (!res1 || !res1.success) {
      return
    }

    // 2. 处理参数更新
    const paramUpdates = params.value.map(param => ({
      param_id: param.is_new ? undefined : param.param_id,
      param_name: param.param_name,
      param_type: param.param_type,
      param_values: param.param_values_text
        ? JSON.stringify(param.param_values_text.split(',').map(v => v.trim()).filter(v => v))
        : null,
      param_category: categoryForm.value.category_name,
      sort_order: param.sort_order,
      status: param.status
    }))

    // 3. 批量更新参数
    const res2 = await $curl({
      method: 'post',
      url: '/api/proj/param-category/update-params',
      data: {
        category_id: categoryForm.value.category_id,
        params: paramUpdates,
        deleted_param_ids: deletedParamIds.value
      },
      successMessage: '保存成功',
      errorMessage: '保存失败'
    })

    if (res2 && res2.success) {
      visible.value = false
      emit('command', { event: 'loadTableData' })
    }
  } catch (error) {
    console.error('Save error:', error)
  } finally {
    saving.value = false
  }
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
.edit-param-category-container {
  padding: 0 20px;
}

.edit-param-category-container .category-info-card {
  margin-bottom: 20px;
}

.edit-param-category-container .params-list-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.drawer-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>

