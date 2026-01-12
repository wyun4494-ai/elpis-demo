<template>
  <el-dialog
    v-model="visible"
    :title="title"
    :width="size"
    destroy-on-close
    :close-on-click-modal="false"
    class="time-slot-dialog"
  >
    <div
      v-loading="loading"
      class="time-slot-list-container"
    >
      <el-alert
        type="info"
        :closable="false"
        class="info-alert"
      >
        <template #title>
          <div class="alert-title">
            <el-icon><InfoFilled /></el-icon>
            <span>秒杀时间段说明</span>
          </div>
        </template>
        <div class="alert-content">
          <p>秒杀时间段是预设的秒杀活动时间点，用户可以在这些时间段内参与秒杀活动。</p>
          <p class="example-text">常见时间段：00:00、02:00、08:00、10:00、12:00、14:00、16:00、18:00、20:00、22:00</p>
        </div>
      </el-alert>

      <div class="toolbar">
        <el-button
          type="primary"
          :icon="Plus"
          @click="handleAdd"
        >
          添加时间段
        </el-button>
        <div class="toolbar-info">
          <span class="count-text">共 {{ timeSlots.length }} 个时间段</span>
        </div>
      </div>

      <el-table
        :data="timeSlots"
        border
        stripe
        style="width: 100%"
      >
        <el-table-column
          prop="slot_name"
          label="时间段名称"
          min-width="120"
          align="center"
        />
        <el-table-column
          label="时间范围"
          min-width="180"
          align="center"
        >
          <template #default="{ row }">
            <span class="time-range">{{ row.start_time }} - {{ row.end_time }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="sort_order"
          label="排序"
          width="100"
          align="center"
        />
        <el-table-column
          prop="slot_status"
          label="状态"
          width="100"
          align="center"
        >
          <template #default="{ row }">
            <el-switch
              :model-value="row.slot_status"
              :active-value="1"
              :inactive-value="0"
              inline-prompt
              active-text="启用"
              inactive-text="禁用"
              @change="(value) => handleToggleStatus(row, value)"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="180"
          align="center"
          fixed="right"
        >
          <template #default="{ row }">
            <div class="action-buttons">
              <el-button
                type="primary"
                size="small"
                @click="handleEdit(row)"
              >
                编辑
              </el-button>
              <el-button
                type="danger"
                size="small"
                @click="handleDelete(row)"
              >
                删除
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <template #footer>
      <el-button @click="visible = false">关闭</el-button>
    </template>

    <!-- 添加/编辑时间段对话框 -->
    <el-dialog
      v-model="editDialogVisible"
      :title="editMode === 'add' ? '添加时间段' : '编辑时间段'"
      width="550px"
      destroy-on-close
      :close-on-click-modal="false"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="110px"
        class="edit-form"
      >
        <el-form-item
          label="时间段名称"
          prop="slot_name"
        >
          <el-input
            v-model="formData.slot_name"
            placeholder="如：10点场、下午场"
            clearable
          />
        </el-form-item>
        <el-form-item
          label="开始时间"
          prop="start_time"
        >
          <el-time-picker
            v-model="formData.start_time"
            format="HH:mm:ss"
            value-format="HH:mm:ss"
            placeholder="选择开始时间"
            clearable
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item
          label="结束时间"
          prop="end_time"
        >
          <el-time-picker
            v-model="formData.end_time"
            format="HH:mm:ss"
            value-format="HH:mm:ss"
            placeholder="选择结束时间"
            clearable
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item
          label="排序"
          prop="sort_order"
        >
          <el-input-number
            v-model="formData.sort_order"
            :min="0"
            :step="1"
            controls-position="right"
            style="width: 100%"
          />
          <div class="form-tip">数字越小越靠前</div>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button
            type="primary"
            :loading="saving"
            @click="handleSave"
          >
            {{ saving ? '保存中...' : '保存' }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </el-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, InfoFilled } from '@element-plus/icons-vue'
import $curl from '$elpisCommon/curl.js'

const name = ref('timeSlotListDialog')
const visible = ref(false)
const loading = ref(false)
const timeSlots = ref([])
const editDialogVisible = ref(false)
const editMode = ref('add') // 'add' | 'edit'
const saving = ref(false)
const formRef = ref(null)

// 从配置中获取
const props = defineProps({
  config: {
    type: Object,
    default: () => ({})
  }
})

const title = computed(() => props.config?.title || '秒杀时间段列表')
const size = computed(() => props.config?.size || '70%')

// 表单数据
const formData = ref({
  slot_id: '',
  flash_sale_id: '',
  slot_name: '',
  start_time: '',
  end_time: '',
  sort_order: 0
})

// 表单验证规则
const formRules = {
  slot_name: [
    { required: true, message: '请输入时间段名称', trigger: 'blur' }
  ],
  start_time: [
    { required: true, message: '请选择开始时间', trigger: 'change' }
  ],
  end_time: [
    { required: true, message: '请选择结束时间', trigger: 'change' }
  ]
}

/**
 * 显示对话框
 */
const show = async () => {
  visible.value = true
  await loadTimeSlots()
}

/**
 * 隐藏对话框
 */
const hide = () => {
  visible.value = false
  timeSlots.value = []
}

/**
 * 加载时间段列表
 */
const loadTimeSlots = async () => {
  loading.value = true
  try {
    const res = await $curl({
      url: '/api/proj/flash-sale-time-slot/list',
      method: 'get'
    })
    timeSlots.value = res.data || []
  } catch (error) {
    console.error('加载时间段列表失败:', error)
    ElMessage.error('加载时间段列表失败')
  } finally {
    loading.value = false
  }
}

/**
 * 添加时间段
 */
const handleAdd = () => {
  editMode.value = 'add'
  formData.value = {
    slot_id: '',
    flash_sale_id: '',
    slot_name: '',
    start_time: '',
    end_time: '',
    sort_order: 0
  }
  editDialogVisible.value = true
}

/**
 * 编辑时间段
 */
const handleEdit = (row) => {
  editMode.value = 'edit'
  formData.value = {
    slot_id: row.slot_id,
    flash_sale_id: row.flash_sale_id,
    slot_name: row.slot_name,
    start_time: row.start_time,
    end_time: row.end_time,
    sort_order: row.sort_order
  }
  editDialogVisible.value = true
}

/**
 * 保存时间段
 */
const handleSave = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
  } catch (error) {
    return
  }

  saving.value = true
  try {
    if (editMode.value === 'add') {
      await $curl({
        url: '/api/proj/flash-sale-time-slot',
        method: 'post',
        data: formData.value
      })
      ElMessage.success('添加成功')
    } else {
      await $curl({
        url: `/api/proj/flash-sale-time-slot/${formData.value.slot_id}`,
        method: 'put',
        data: formData.value
      })
      ElMessage.success('更新成功')
    }

    editDialogVisible.value = false
    await loadTimeSlots()
  } catch (error) {
    console.error('保存失败:', error)
    ElMessage.error(error.message || '保存失败')
  } finally {
    saving.value = false
  }
}

/**
 * 删除时间段
 */
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除时间段"${row.slot_name}"吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    await $curl({
      url: `/api/proj/flash-sale-time-slot/${row.slot_id}`,
      method: 'delete'
    })
    ElMessage.success('删除成功')
    await loadTimeSlots()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error(error.message || '删除失败')
    }
  }
}

/**
 * 切换时间段状态
 */
const handleToggleStatus = async (row, value) => {
  try {
    await $curl({
      url: `/api/proj/flash-sale-time-slot/${row.slot_id}/toggle-status`,
      method: 'put',
      data: {
        slot_status: value
      }
    })
    ElMessage.success('状态更新成功')
    await loadTimeSlots()
  } catch (error) {
    console.error('状态更新失败:', error)
    ElMessage.error(error.message || '状态更新失败')
  }
}

defineExpose({
  name,
  show,
  hide
})
</script>

<style scoped lang="less">
.time-slot-dialog {
  :deep(.el-dialog__header) {
    padding: 20px 24px;
    border-bottom: 1px solid #e4e7ed;
    margin-right: 0;

    .el-dialog__title {
      font-size: 18px;
      font-weight: 600;
      color: #303133;
    }
  }

  :deep(.el-dialog__body) {
    padding: 24px;
  }

  :deep(.el-dialog__footer) {
    padding: 16px 24px;
    border-top: 1px solid #e4e7ed;
  }
}

.time-slot-list-container {
  min-height: 400px;

  .info-alert {
    margin-bottom: 20px;
    border-radius: 8px;

    .alert-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
      font-size: 14px;

      .el-icon {
        font-size: 16px;
      }
    }

    .alert-content {
      margin-top: 8px;
      line-height: 1.8;

      p {
        margin: 4px 0;
        color: #606266;
      }

      .example-text {
        color: #909399;
        font-size: 13px;
      }
    }
  }

  .toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding: 12px 16px;
    background-color: #f5f7fa;
    border-radius: 6px;

    .toolbar-info {
      .count-text {
        font-size: 14px;
        color: #606266;
        font-weight: 500;
      }
    }
  }

  .time-range {
    font-family: 'Courier New', monospace;
    font-weight: 500;
    color: #409eff;
    white-space: nowrap;
  }

  .action-buttons {
    display: flex;
    gap: 8px;
    justify-content: center;
    align-items: center;
  }

  :deep(.el-table) {
    border-radius: 6px;
    overflow: hidden;

    .el-table__header {
      th {
        background-color: #f5f7fa;
        color: #606266;
        font-weight: 600;
        font-size: 14px;
      }
    }

    .el-table__body {
      td {
        padding: 14px 0;
        font-size: 14px;
      }
    }

    .el-table__empty-block {
      min-height: 200px;
    }
  }

  :deep(.el-switch) {
    --el-switch-on-color: #67c23a;
    --el-switch-off-color: #dcdfe6;
    height: 24px;

    .el-switch__core {
      height: 24px;
      min-width: 50px;
    }
  }
}

.edit-form {
  padding: 20px 20px 0;

  .form-tip {
    font-size: 12px;
    color: #909399;
    margin-top: 4px;
    line-height: 1.5;
  }

  :deep(.el-form-item) {
    margin-bottom: 24px;

    .el-form-item__label {
      font-weight: 500;
      color: #606266;
    }

    .el-input__inner,
    .el-input-number__decrease,
    .el-input-number__increase {
      height: 40px;
      line-height: 40px;
    }
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 10px 0;

  .el-button {
    min-width: 80px;
  }
}
</style>
