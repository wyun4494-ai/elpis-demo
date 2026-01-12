<template>
  <el-dialog
    v-model="visible"
    title="广告位置管理"
    width="80%"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div class="ad-position-manager">
      <!-- 搜索栏 -->
      <div class="search-bar">
        <el-input
          v-model="searchKeyword"
          placeholder="请输入位置名称或标识"
          clearable
          style="width: 300px; margin-right: 10px;"
          @clear="handleSearch"
        />
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button type="success" @click="handleAdd">添加广告位置</el-button>
      </div>

      <!-- 表格 -->
      <el-table
        :data="tableData"
        border
        style="width: 100%; margin-top: 20px;"
        v-loading="loading"
      >
        <el-table-column prop="position_key" label="位置标识" width="150" />
        <el-table-column prop="position_name" label="位置名称" width="150" />
        <el-table-column prop="position_desc" label="位置描述" min-width="200" show-overflow-tooltip />
        <el-table-column prop="size_text" label="建议尺寸" width="150" />
        <el-table-column prop="max_count" label="最大数量" width="100" />
        <el-table-column label="是否启用" width="100">
          <template #default="{ row }">
            <el-switch
              v-model="row.is_enabled"
              :active-value="1"
              :inactive-value="0"
              @change="handleToggle(row)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="sort_order" label="排序" width="80" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        style="margin-top: 20px; justify-content: flex-end;"
        @size-change="handleSearch"
        @current-change="handleSearch"
      />

      <!-- 添加/编辑对话框 -->
      <el-dialog
        v-model="dialogVisible"
        :title="dialogTitle"
        width="600px"
        @close="handleDialogClose"
      >
        <el-form
          ref="formRef"
          :model="formData"
          :rules="formRules"
          label-width="140px"
        >
          <el-form-item label="位置标识" prop="position_key">
            <el-input
              v-model="formData.position_key"
              placeholder="请输入位置标识（如：home_banner）"
              maxlength="50"
              :disabled="isEdit"
            />
          </el-form-item>
          <el-form-item label="位置名称" prop="position_name">
            <el-input
              v-model="formData.position_name"
              placeholder="请输入位置名称"
              maxlength="100"
            />
          </el-form-item>
          <el-form-item label="位置描述">
            <el-input
              v-model="formData.position_desc"
              type="textarea"
              :rows="3"
              placeholder="请输入位置描述（可选）"
              maxlength="500"
            />
          </el-form-item>
          <el-form-item label="建议宽度（像素）">
            <el-input-number
              v-model="formData.width"
              :min="0"
              placeholder="请输入建议宽度"
              style="width: 100%;"
            />
          </el-form-item>
          <el-form-item label="建议高度（像素）">
            <el-input-number
              v-model="formData.height"
              :min="0"
              placeholder="请输入建议高度"
              style="width: 100%;"
            />
          </el-form-item>
          <el-form-item label="最大广告数量">
            <el-input-number
              v-model="formData.max_count"
              :min="1"
              placeholder="请输入最大广告数量"
              style="width: 100%;"
            />
          </el-form-item>
          <el-form-item label="排序">
            <el-input-number
              v-model="formData.sort_order"
              :min="0"
              placeholder="数字越小越靠前"
              style="width: 100%;"
            />
          </el-form-item>
          <el-form-item label="是否启用">
            <el-switch
              v-model="formData.is_enabled"
              :active-value="1"
              :inactive-value="0"
            />
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="submitting">保存</el-button>
        </template>
      </el-dialog>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import $curl from '$elpisCommon/curl.js'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const visible = ref(false)
const searchKeyword = ref('')
const tableData = ref([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const dialogVisible = ref(false)
const dialogTitle = ref('添加广告位置')
const isEdit = ref(false)
const formRef = ref(null)
const formData = ref({
  position_id: '',
  position_key: '',
  position_name: '',
  position_desc: '',
  width: null,
  height: null,
  max_count: 1,
  sort_order: 0,
  is_enabled: 1
})
const submitting = ref(false)

const formRules = {
  position_key: [
    { required: true, message: '请输入位置标识', trigger: 'blur' },
    { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
  ],
  position_name: [
    { required: true, message: '请输入位置名称', trigger: 'blur' },
    { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
  ]
}

// 监听 modelValue 变化
watch(() => props.modelValue, (newVal) => {
  visible.value = newVal
  if (newVal) {
    // 打开对话框时加载数据
    loadList()
  }
})

// 监听 visible 变化
watch(visible, (newVal) => {
  emit('update:modelValue', newVal)
})

// 加载列表
const loadList = async () => {
  loading.value = true
  try {
    const res = await $curl({
      method: 'get',
      url: '/api/proj/ad-position/list',
      params: {
        keyword: searchKeyword.value,
        page: currentPage.value,
        pageSize: pageSize.value
      }
    })

    if (res && res.success) {
      tableData.value = res.data || []
      total.value = res.total || 0
    }
  } catch (error) {
    console.error('加载广告位置列表失败:', error)
    ElMessage.error('加载列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  loadList()
}

// 添加
const handleAdd = () => {
  isEdit.value = false
  dialogTitle.value = '添加广告位置'
  formData.value = {
    position_id: '',
    position_key: '',
    position_name: '',
    position_desc: '',
    width: null,
    height: null,
    max_count: 1,
    sort_order: 0,
    is_enabled: 1
  }
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row) => {
  isEdit.value = true
  dialogTitle.value = '编辑广告位置'
  formData.value = {
    position_id: row.position_id,
    position_key: row.position_key,
    position_name: row.position_name,
    position_desc: row.position_desc || '',
    width: row.width,
    height: row.height,
    max_count: row.max_count,
    sort_order: row.sort_order,
    is_enabled: row.is_enabled
  }
  dialogVisible.value = true
}

// 删除
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确定要删除该广告位置吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const res = await $curl({
      method: 'delete',
      url: '/api/proj/ad-position',
      params: {
        position_id: row.position_id
      }
    })

    if (res && res.success) {
      ElNotification({
        title: '删除成功',
        message: '广告位置已删除',
        type: 'success'
      })
      loadList()
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除广告位置失败:', error)
      ElMessage.error(error.message || '删除失败')
    }
  }
}

// 切换启用状态
const handleToggle = async (row) => {
  try {
    const res = await $curl({
      method: 'post',
      url: '/api/proj/ad-position/toggle',
      data: {
        position_id: row.position_id,
        is_enabled: row.is_enabled
      }
    })

    if (res && res.success) {
      ElMessage.success('操作成功')
    }
  } catch (error) {
    console.error('切换状态失败:', error)
    ElMessage.error('操作失败')
    // 恢复原状态
    row.is_enabled = row.is_enabled === 1 ? 0 : 1
  }
}

// 提交表单
const handleSubmit = async () => {
  try {
    await formRef.value.validate()

    submitting.value = true
    const url = isEdit.value ? '/api/proj/ad-position' : '/api/proj/ad-position'
    const method = isEdit.value ? 'put' : 'post'

    const res = await $curl({
      method,
      url,
      data: formData.value
    })

    if (res && res.success) {
      ElNotification({
        title: isEdit.value ? '更新成功' : '创建成功',
        message: `广告位置已${isEdit.value ? '更新' : '创建'}`,
        type: 'success'
      })
      dialogVisible.value = false
      loadList()
    }
  } catch (error) {
    if (error !== false) {
      console.error('保存广告位置失败:', error)
      ElMessage.error(error.message || '保存失败')
    }
  } finally {
    submitting.value = false
  }
}

// 关闭对话框
const handleDialogClose = () => {
  formRef.value?.resetFields()
}

// 关闭主对话框
const handleClose = () => {
  visible.value = false
}
</script>

<style scoped lang="less">
.ad-position-manager {
  .search-bar {
    display: flex;
    align-items: center;
  }
}
</style>
