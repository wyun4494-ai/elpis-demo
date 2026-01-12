<template>
  <el-dialog
    v-model="visible"
    title="添加时间段"
    width="800px"
    destroy-on-close
    :close-on-click-modal="false"
    class="add-time-slot-dialog"
  >
    <div
      v-loading="loading"
      class="dialog-content"
    >
      <!-- 提示信息 -->
      <el-alert
        type="info"
        :closable="false"
        show-icon
        class="info-alert"
      >
        <template #title>
          <span>从预设的时间段中选择要添加到活动"{{ contextData.activity_name }}"的时间段</span>
        </template>
      </el-alert>

      <!-- 时间段列表 -->
      <el-table
        ref="tableRef"
        :data="availableSlots"
        border
        stripe
        style="width: 100%"
        max-height="450px"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
          align="center"
        />
        <el-table-column
          prop="slot_name"
          label="时间段名称"
          min-width="150"
          align="center"
        />
        <el-table-column
          label="时间范围"
          min-width="200"
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
      </el-table>

      <!-- 已选时间段 -->
      <div v-if="selectedSlots.length > 0" class="selected-section">
        <div class="section-title">已选时间段（{{ selectedSlots.length }}个）</div>
        <div class="selected-tags">
          <el-tag
            v-for="slot in selectedSlots"
            :key="slot.slot_id"
            type="success"
            closable
            @close="handleRemoveSlot(slot)"
          >
            {{ slot.slot_name }} ({{ slot.start_time }} - {{ slot.end_time }})
          </el-tag>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button
          type="primary"
          :disabled="selectedSlots.length === 0"
          @click="handleConfirm"
        >
          确定添加（{{ selectedSlots.length }}）
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import $curl from '$elpisCommon/curl.js'

const visible = ref(false)
const loading = ref(false)
const availableSlots = ref([])
const selectedSlots = ref([])
const tableRef = ref(null)
const contextData = ref({})

const emit = defineEmits(['confirm'])

/**
 * 显示对话框
 * @param {Object} data - 上下文数据
 */
const show = async (data) => {
  contextData.value = { ...data }
  visible.value = true
  await loadAvailableSlots()
}

/**
 * 隐藏对话框
 */
const hide = () => {
  visible.value = false
  availableSlots.value = []
  selectedSlots.value = []
  contextData.value = {}
}

/**
 * 加载可用的时间段列表
 */
const loadAvailableSlots = async () => {
  loading.value = true
  try {
    // 获取所有启用的时间段
    const res = await $curl({
      url: '/api/proj/flash-sale-time-slot/list',
      method: 'get',
      params: {
        slot_status: 1 // 只显示启用的时间段
      }
    })

    // 过滤掉已经添加到当前活动的时间段
    const existingSlotIds = contextData.value.existingSlotIds || []
    availableSlots.value = (res.data || []).filter(
      slot => !existingSlotIds.includes(slot.slot_id)
    )

    if (availableSlots.value.length === 0) {
      ElMessage.warning('没有可用的时间段，请先在"秒杀时间段列表"中创建时间段')
    }
  } catch (error) {
    console.error('加载时间段列表失败:', error)
    ElMessage.error('加载时间段列表失败')
  } finally {
    loading.value = false
  }
}

/**
 * 选择变化
 * @param {Array} selection - 选中的时间段
 */
const handleSelectionChange = (selection) => {
  selectedSlots.value = selection
}

/**
 * 移除已选时间段
 * @param {Object} slot - 时间段数据
 */
const handleRemoveSlot = (slot) => {
  if (tableRef.value) {
    tableRef.value.toggleRowSelection(slot, false)
  }
}

/**
 * 确认添加
 */
const handleConfirm = () => {
  if (selectedSlots.value.length === 0) {
    ElMessage.warning('请选择要添加的时间段')
    return
  }

  emit('confirm', selectedSlots.value)
  hide()
}

defineExpose({
  show,
  hide
})
</script>

<style scoped lang="less">
.add-time-slot-dialog {
  :deep(.el-dialog__body) {
    padding: 20px 24px;
  }
}

.dialog-content {
  .info-alert {
    margin-bottom: 20px;
    border-radius: 6px;

    :deep(.el-alert__title) {
      font-size: 14px;
      line-height: 1.6;
    }
  }

  .selected-section {
    margin-top: 24px;
    padding-top: 20px;
    border-top: 2px solid #e4e7ed;

    .section-title {
      font-size: 15px;
      font-weight: 600;
      color: #303133;
      margin-bottom: 16px;
    }

    .selected-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;

      .el-tag {
        font-size: 13px;
        padding: 8px 12px;
        height: auto;
        line-height: 1.5;
      }
    }
  }

  .time-range {
    font-family: 'Courier New', monospace;
    font-weight: 500;
    color: #409eff;
  }

  :deep(.el-table) {
    border-radius: 6px;
    overflow: hidden;

    .el-table__header {
      th {
        background-color: #f5f7fa;
        color: #606266;
        font-weight: 600;
      }
    }
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
