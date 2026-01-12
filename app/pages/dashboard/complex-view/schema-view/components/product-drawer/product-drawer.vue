<template>
  <el-drawer
    v-model="visible"
    :title="drawerTitle"
    size="85%"
    destroy-on-close
    :close-on-click-modal="false"
    class="time-slot-drawer"
  >
    <div
      v-loading="loading"
      class="time-slot-drawer-container"
    >
      <!-- 活动信息 -->
      <el-card class="activity-card" shadow="never">
        <template #header>
          <div class="card-header">
            <span class="card-title">活动信息</span>
          </div>
        </template>
        <el-descriptions :column="3" border>
          <el-descriptions-item label="活动名称">{{ activityData.activity_name }}</el-descriptions-item>
          <el-descriptions-item label="开始时间">{{ activityData.start_time }}</el-descriptions-item>
          <el-descriptions-item label="结束时间">{{ activityData.end_time }}</el-descriptions-item>
        </el-descriptions>
      </el-card>

      <!-- 时间段列表 -->
      <el-card class="slot-card" shadow="never">
        <template #header>
          <div class="card-header">
            <div class="header-left">
              <span class="card-title">秒杀时间段列表</span>
              <span class="card-subtitle">点击"商品列表"按钮管理该时间段的秒杀商品</span>
            </div>
            <el-button
              type="primary"
              size="small"
              :icon="Plus"
              @click="handleAddTimeSlot"
            >
              添加时间段
            </el-button>
          </div>
        </template>

        <el-table
          :data="timeSlotList"
          border
          stripe
          style="width: 100%"
        >
          <el-table-column
            type="index"
            label="编号"
            width="80"
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
            label="商品数量"
            width="120"
            align="center"
          >
            <template #default="{ row }">
              <el-tag :type="getProductCount(row.slot_id) > 0 ? 'success' : 'info'">
                {{ getProductCount(row.slot_id) }} 个
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="150"
            align="center"
            fixed="right"
          >
            <template #default="{ row }">
              <el-button
                type="primary"
                size="small"
                @click="handleShowProductList(row)"
              >
                商品列表
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>

    <!-- 嵌套抽屉：秒杀商品列表 -->
    <flash-sale-product-list-drawer
      ref="productListDrawerRef"
      @refresh="loadTimeSlotList"
      @close-all="handleCloseAll"
    />

    <!-- 添加时间段对话框 -->
    <add-time-slot-dialog
      ref="addTimeSlotDialogRef"
      @confirm="handleAddTimeSlotConfirm"
    />
  </el-drawer>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import $curl from '$elpisCommon/curl.js'
import FlashSaleProductListDrawer from '../flash-sale-product-list-drawer/flash-sale-product-list-drawer.vue'
import AddTimeSlotDialog from '../add-time-slot-dialog/add-time-slot-dialog.vue'

const name = ref('productDrawer')
const visible = ref(false)
const loading = ref(false)
const activityData = ref({})
const timeSlotList = ref([])
const productCountMap = ref({})
const productListDrawerRef = ref(null)
const addTimeSlotDialogRef = ref(null)

// 从配置中获取
const props = defineProps({
  config: {
    type: Object,
    default: () => ({})
  }
})

const drawerTitle = computed(() => props.config?.title || '设置秒杀商品')
const mainKey = computed(() => props.config?.mainKey || 'flash_sale_id')

/**
 * 显示抽屉
 * @param {Object} rowData - 行数据
 */
const show = async (rowData) => {
  if (!rowData || !rowData[mainKey.value]) {
    ElMessage.error('缺少必要参数')
    return
  }

  activityData.value = { ...rowData }
  visible.value = true
  
  // 加载时间段列表和商品数量
  await loadTimeSlotList()
}

/**
 * 隐藏抽屉
 */
const hide = () => {
  visible.value = false
  activityData.value = {}
  timeSlotList.value = []
  productCountMap.value = {}
}

/**
 * 加载时间段列表
 */
const loadTimeSlotList = async () => {
  loading.value = true
  try {
    // 加载时间段列表
    const slotRes = await $curl({
      url: '/api/proj/flash-sale-time-slot/list',
      method: 'get',
      params: {
        flash_sale_id: activityData.value[mainKey.value]
      }
    })
    timeSlotList.value = slotRes.data || []

    // 加载商品数量统计
    const countRes = await $curl({
      url: '/api/proj/flash-sale-product/slot-count',
      method: 'get',
      params: {
        flash_sale_id: activityData.value[mainKey.value]
      }
    })
    productCountMap.value = countRes.data || {}
  } catch (error) {
    console.error('加载时间段列表失败:', error)
    ElMessage.error('加载时间段列表失败')
  } finally {
    loading.value = false
  }
}

/**
 * 获取时间段的商品数量
 * @param {String} slotId - 时间段ID
 * @returns {Number} 商品数量
 */
const getProductCount = (slotId) => {
  return productCountMap.value[slotId] || 0
}

/**
 * 显示商品列表
 * @param {Object} slotData - 时间段数据
 */
const handleShowProductList = (slotData) => {
  if (productListDrawerRef.value) {
    productListDrawerRef.value.show({
      ...slotData,
      flash_sale_id: activityData.value[mainKey.value],
      activity_name: activityData.value.activity_name
    })
  }
}

/**
 * 添加时间段
 */
const handleAddTimeSlot = () => {
  if (addTimeSlotDialogRef.value) {
    addTimeSlotDialogRef.value.show({
      flash_sale_id: activityData.value[mainKey.value],
      activity_name: activityData.value.activity_name,
      existingSlotIds: timeSlotList.value.map(slot => slot.slot_id)
    })
  }
}

/**
 * 添加时间段确认
 * @param {Array} selectedSlots - 选中的时间段列表
 */
const handleAddTimeSlotConfirm = async (selectedSlots) => {
  loading.value = true
  try {
    // 批量添加时间段
    for (const slot of selectedSlots) {
      await $curl({
        url: '/api/proj/flash-sale-time-slot',
        method: 'post',
        data: {
          flash_sale_id: activityData.value[mainKey.value],
          slot_name: slot.slot_name,
          start_time: slot.start_time,
          end_time: slot.end_time,
          sort_order: slot.sort_order || 0
        }
      })
    }

    ElMessage.success('添加时间段成功')
    await loadTimeSlotList()
  } catch (error) {
    console.error('添加时间段失败:', error)
    ElMessage.error(error.message || '添加时间段失败')
  } finally {
    loading.value = false
  }
}

/**
 * 关闭所有抽屉
 */
const handleCloseAll = () => {
  // 关闭第二层抽屉
  if (productListDrawerRef.value) {
    productListDrawerRef.value.hide()
  }
  // 关闭第一层抽屉
  hide()
}

defineExpose({
  name,
  show,
  hide
})
</script>

<style scoped lang="less">
.time-slot-drawer {
  :deep(.el-drawer__header) {
    padding: 20px 24px;
    border-bottom: 1px solid #e4e7ed;
    margin-bottom: 0;

    .el-drawer__title {
      font-size: 18px;
      font-weight: 600;
      color: #303133;
    }
  }

  :deep(.el-drawer__body) {
    padding: 24px;
    background-color: #f5f7fa;
  }
}

.time-slot-drawer-container {
  .activity-card,
  .slot-card {
    margin-bottom: 20px;
    border-radius: 8px;

    :deep(.el-card__header) {
      padding: 16px 20px;
      background-color: #fafafa;
      border-bottom: 1px solid #e4e7ed;
    }

    :deep(.el-card__body) {
      padding: 20px;
    }

    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .header-left {
        display: flex;
        align-items: center;
        gap: 16px;
      }

      .card-title {
        font-size: 16px;
        font-weight: 600;
        color: #303133;
      }

      .card-subtitle {
        font-size: 13px;
        color: #909399;
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

    .el-table__body {
      td {
        padding: 14px 0;
      }
    }
  }
}
</style>
