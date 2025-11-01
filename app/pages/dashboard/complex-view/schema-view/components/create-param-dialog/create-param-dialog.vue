<template>
  <el-dialog
    v-model="visible"
    title="新建参数"
    width="600px"
    :before-close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="formData"
      label-width="120px"
    >
      <el-form-item label="参数分类" required>
        <el-select
          v-model="formData.param_category"
          placeholder="请选择参数分类"
          style="width: 100%"
        >
          <el-option
            v-for="category in categories"
            :key="category.category_id"
            :label="category.category_name"
            :value="category.category_name"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="参数名称" required>
        <el-input
          v-model="formData.param_name"
          placeholder="请输入参数名称，如：屏幕尺寸"
        />
      </el-form-item>

      <el-form-item label="参数类型" required>
        <el-select
          v-model="formData.param_type"
          placeholder="请选择参数类型"
          style="width: 100%"
        >
          <el-option label="输入框" value="input" />
          <el-option label="下拉选择" value="select" />
          <el-option label="多选框" value="checkbox" />
        </el-select>
      </el-form-item>

      <el-form-item label="预定义值">
        <el-input
          v-model="formData.param_values_text"
          type="textarea"
          :rows="3"
          placeholder="多个值用逗号分隔，如：金色,白色,黑色"
        />
        <div class="form-tip">
          提示：如果参数类型为"下拉选择"或"多选框"，建议填写预定义值
        </div>
      </el-form-item>

      <el-form-item label="排序">
        <el-input-number
          v-model="formData.sort_order"
          :min="0"
          style="width: 100%"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" :loading="saving" @click="handleSave">
          保存
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import $curl from '$elpisCommon/curl.js'

const emit = defineEmits(['command'])

const name = ref('createParamDialog')
const visible = ref(false)
const saving = ref(false)
const formRef = ref(null)

const categories = ref([])

const formData = ref({
  param_category: '',
  param_name: '',
  param_type: 'input',
  param_values_text: '',
  sort_order: 0
})

// 显示对话框
const show = async () => {
  visible.value = true
  
  // 重置表单
  formData.value = {
    param_category: '',
    param_name: '',
    param_type: 'input',
    param_values_text: '',
    sort_order: 0
  }

  // 加载参数分类列表
  await loadCategories()
}

// 加载参数分类列表
const loadCategories = async () => {
  try {
    const res = await $curl({
      method: 'get',
      url: '/api/proj/param-category/list',
      params: {
        page: 1,
        pageSize: 100
      }
    })

    if (res && res.success && Array.isArray(res.data)) {
      categories.value = res.data
    } else {
      categories.value = []
    }
  } catch (error) {
    console.error('Load categories error:', error)
    categories.value = []
  }
}

// 保存
const handleSave = async () => {
  // 验证
  if (!formData.value.param_category) {
    ElMessage.error('请选择参数分类')
    return
  }

  if (!formData.value.param_name || !formData.value.param_name.trim()) {
    ElMessage.error('请输入参数名称')
    return
  }

  if (!formData.value.param_type) {
    ElMessage.error('请选择参数类型')
    return
  }

  saving.value = true
  try {
    // 处理预定义值
    let paramValues = null
    if (formData.value.param_values_text && formData.value.param_values_text.trim()) {
      const values = formData.value.param_values_text
        .split(',')
        .map(v => v.trim())
        .filter(v => v)
      paramValues = JSON.stringify(values)
    }

    const res = await $curl({
      method: 'post',
      url: '/api/proj/param-library',
      data: {
        param_name: formData.value.param_name,
        param_type: formData.value.param_type,
        param_category: formData.value.param_category,
        param_values: paramValues,
        sort_order: formData.value.sort_order,
        status: 1
      },
      successMessage: '新建参数成功',
      errorMessage: '新建参数失败'
    })

    if (res && res.success) {
      visible.value = false
      emit('command', { event: 'loadTableData' })
    }
  } catch (error) {
    console.error('Save error:', error)
  } finally {
    saving.value = false
  }
}

// 关闭
const handleClose = () => {
  visible.value = false
}

defineExpose({
  show,
  name
})
</script>

<style scoped>
.form-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>

