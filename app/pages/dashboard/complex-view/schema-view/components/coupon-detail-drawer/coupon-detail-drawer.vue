<template>
  <el-drawer
    v-model="visible"
    :title="title"
    :size="size"
    destroy-on-close
    class="coupon-detail-drawer"
  >
    <div v-loading="loading" class="drawer-content">
      <!-- 优惠券基本信息 -->
      <div class="info-section">
        <div class="section-title">优惠券信息</div>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="优惠券ID">
            {{ couponDetail.coupon_id || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="优惠券名称">
            {{ couponDetail.coupon_name || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="优惠券类型">
            <el-tag :type="getCouponTypeTag(couponDetail.coupon_type) || 'info'">
              {{ getCouponTypeText(couponDetail.coupon_type) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="优惠内容">
            <span class="discount-content">{{ getDiscountContent(couponDetail) }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="发行总量">
            {{ couponDetail.total_count === 0 ? '不限制' : couponDetail.total_count }}
          </el-descriptions-item>
          <el-descriptions-item label="每人限领">
            {{ couponDetail.limit_per_user === 0 ? '不限制' : couponDetail.limit_per_user }}
          </el-descriptions-item>
          <el-descriptions-item label="有效期" :span="2">
            {{ getValidPeriod(couponDetail) }}
          </el-descriptions-item>
          <el-descriptions-item label="领取情况" :span="2">
            <div class="receive-progress">
              <span class="progress-text">
                {{ couponDetail.received_count || 0 }}
                <span v-if="couponDetail.total_count > 0">/ {{ couponDetail.total_count }}</span>
              </span>
              <el-progress
                v-if="couponDetail.total_count > 0"
                :percentage="getReceivePercentage(couponDetail)"
                :color="getProgressColor(getReceivePercentage(couponDetail))"
                style="margin-top: 8px"
              />
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="使用情况" :span="2">
            <div class="use-progress">
              <span class="progress-text">
                {{ couponDetail.used_count || 0 }}
                <span v-if="couponDetail.received_count > 0">/ {{ couponDetail.received_count }}</span>
                <span class="use-rate">
                  （使用率：{{ getUseRate(couponDetail) }}%）
                </span>
              </span>
              <el-progress
                v-if="couponDetail.received_count > 0"
                :percentage="getUsePercentage(couponDetail)"
                :color="getProgressColor(getUsePercentage(couponDetail))"
                style="margin-top: 8px"
              />
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="getStatusTag(couponDetail.coupon_status) || 'info'">
              {{ getStatusText(couponDetail.coupon_status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="排序">
            {{ couponDetail.sort_order || 0 }}
          </el-descriptions-item>
          <el-descriptions-item label="使用说明" :span="2">
            {{ couponDetail.description || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">
            {{ couponDetail.create_time || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="更新时间">
            {{ couponDetail.update_time || '-' }}
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <!-- 领取用户列表 -->
      <div class="user-section">
        <div class="section-header">
          <div class="section-title">领取用户列表</div>
          <div class="search-bar">
            <el-input
              v-model="searchKeyword"
              placeholder="搜索用户名"
              clearable
              style="width: 200px; margin-right: 12px"
              @keyup.enter="handleSearch"
            >
              <template #append>
                <el-button :icon="Search" @click="handleSearch" />
              </template>
            </el-input>
            <el-select
              v-model="useStatusFilter"
              placeholder="使用状态"
              clearable
              style="width: 150px"
              @change="handleSearch"
            >
              <el-option label="全部" :value="-999" />
              <el-option label="未使用" :value="0" />
              <el-option label="已使用" :value="1" />
              <el-option label="已过期" :value="2" />
            </el-select>
          </div>
        </div>

        <el-table
          :data="userList"
          border
          stripe
          style="width: 100%; margin-top: 16px"
        >
          <el-table-column
            prop="customer_name"
            label="用户名"
            min-width="120"
            show-overflow-tooltip
          />
          <el-table-column
            prop="customer_nickname"
            label="昵称"
            min-width="120"
            show-overflow-tooltip
          />
          <el-table-column
            prop="customer_phone"
            label="手机号"
            width="130"
            align="center"
          />
          <el-table-column
            prop="receive_time"
            label="领取时间"
            width="180"
            align="center"
          />
          <el-table-column
            prop="use_status"
            label="使用状态"
            width="100"
            align="center"
          >
            <template #default="{ row }">
              <el-tag :type="getUseStatusTag(row.use_status)">
                {{ getUseStatusText(row.use_status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="use_time"
            label="使用时间"
            width="180"
            align="center"
          >
            <template #default="{ row }">
              {{ row.use_time || '-' }}
            </template>
          </el-table-column>
          <el-table-column
            prop="order_id"
            label="订单号"
            min-width="150"
            show-overflow-tooltip
          >
            <template #default="{ row }">
              {{ row.order_id || '-' }}
            </template>
          </el-table-column>
          <el-table-column
            prop="valid_end_time"
            label="有效期至"
            width="180"
            align="center"
          />
        </el-table>

        <!-- 分页 -->
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          background
          style="margin-top: 16px; justify-content: center"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </div>
  </el-drawer>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import $curl from '$elpisCommon/curl.js'

const name = ref('couponDetailDrawer')
const visible = ref(false)
const loading = ref(false)
const title = ref('优惠券详情')
const size = ref('80%')
const couponDetail = ref({})
const userList = ref([])
const searchKeyword = ref('')
const useStatusFilter = ref(-999)
const pagination = ref({
  page: 1,
  pageSize: 10,
  total: 0
})

/**
 * 显示抽屉
 * @param {Object} data - 优惠券数据
 * @param {Object} config - 配置
 */
const show = async (data, config = {}) => {
  visible.value = true
  title.value = config.title || '优惠券详情'
  size.value = config.size || '80%'
  
  // 重置状态
  couponDetail.value = {}
  userList.value = []
  searchKeyword.value = ''
  useStatusFilter.value = -999
  pagination.value = {
    page: 1,
    pageSize: 10,
    total: 0
  }
  
  // 加载优惠券详情
  await loadCouponDetail(data.coupon_id)
  // 加载领取用户列表
  await loadUserList(data.coupon_id)
}

/**
 * 隐藏抽屉
 */
const hide = () => {
  visible.value = false
}

/**
 * 加载优惠券详情
 * @param {String} couponId - 优惠券ID
 */
const loadCouponDetail = async (couponId) => {
  loading.value = true
  try {
    const res = await $curl({
      url: `/api/proj/coupon/${couponId}`,
      method: 'get'
    })
    couponDetail.value = res.data || {}
  } catch (error) {
    console.error('加载优惠券详情失败:', error)
    ElMessage.error('加载优惠券详情失败')
  } finally {
    loading.value = false
  }
}

/**
 * 加载领取用户列表
 * @param {String} couponId - 优惠券ID
 */
const loadUserList = async (couponId) => {
  loading.value = true
  try {
    const params = {
      coupon_id: couponId || couponDetail.value.coupon_id,
      page: pagination.value.page,
      pageSize: pagination.value.pageSize
    }
    
    if (searchKeyword.value) {
      params.customer_name = searchKeyword.value
    }
    if (useStatusFilter.value !== -999 && useStatusFilter.value !== null && useStatusFilter.value !== undefined) {
      params.use_status = useStatusFilter.value
    }
    
    const res = await $curl({
      url: '/api/proj/user-coupon/list',
      method: 'get',
      params
    })
    
    userList.value = res.data || []
    pagination.value.total = res.total || 0
  } catch (error) {
    console.error('加载领取用户列表失败:', error)
    ElMessage.error('加载领取用户列表失败')
  } finally {
    loading.value = false
  }
}

/**
 * 搜索
 */
const handleSearch = () => {
  pagination.value.page = 1
  loadUserList()
}

/**
 * 页码变化
 * @param {Number} page - 新页码
 */
const handlePageChange = (page) => {
  pagination.value.page = page
  loadUserList()
}

/**
 * 每页数量变化
 * @param {Number} pageSize - 新的每页数量
 */
const handleSizeChange = (pageSize) => {
  pagination.value.pageSize = pageSize
  pagination.value.page = 1
  loadUserList()
}

/**
 * 获取优惠券类型文本
 * @param {Number} type - 类型
 * @returns {String} 类型文本
 */
const getCouponTypeText = (type) => {
  const typeMap = { 1: '满减券', 2: '折扣券', 3: '无门槛券' }
  return typeMap[type] || '-'
}

/**
 * 获取优惠券类型标签
 * @param {Number} type - 类型
 * @returns {String} 标签类型
 */
const getCouponTypeTag = (type) => {
  const tagMap = { 1: 'success', 2: 'warning', 3: 'danger' }
  return tagMap[type] || ''
}

/**
 * 获取优惠内容
 * @param {Object} coupon - 优惠券数据
 * @returns {String} 优惠内容
 */
const getDiscountContent = (coupon) => {
  if (!coupon.coupon_type) return '-'
  
  if (coupon.coupon_type === 1) {
    // 满减券
    return `满 ¥${coupon.min_amount} 减 ¥${coupon.discount_amount}`
  } else if (coupon.coupon_type === 2) {
    // 折扣券
    const discount = (coupon.discount_rate * 10).toFixed(1)
    const maxDiscount = coupon.max_discount > 0 ? `（最高优惠 ¥${coupon.max_discount}）` : ''
    return `${discount} 折${maxDiscount}`
  } else if (coupon.coupon_type === 3) {
    // 无门槛券
    return `立减 ¥${coupon.discount_amount}`
  }
  
  return '-'
}

/**
 * 获取有效期
 * @param {Object} coupon - 优惠券数据
 * @returns {String} 有效期
 */
const getValidPeriod = (coupon) => {
  if (!coupon.valid_days && coupon.valid_days !== 0) return '-'
  
  if (coupon.valid_days > 0) {
    return `领取后 ${coupon.valid_days} 天内有效`
  } else {
    return `${coupon.start_time || '-'} 至 ${coupon.end_time || '-'}`
  }
}

/**
 * 获取领取百分比
 * @param {Object} coupon - 优惠券数据
 * @returns {Number} 百分比
 */
const getReceivePercentage = (coupon) => {
  if (!coupon.total_count || coupon.total_count === 0) return 0
  return Math.round((coupon.received_count / coupon.total_count) * 100)
}

/**
 * 获取使用百分比
 * @param {Object} coupon - 优惠券数据
 * @returns {Number} 百分比
 */
const getUsePercentage = (coupon) => {
  if (!coupon.received_count || coupon.received_count === 0) return 0
  return Math.round((coupon.used_count / coupon.received_count) * 100)
}

/**
 * 获取使用率
 * @param {Object} coupon - 优惠券数据
 * @returns {Number} 使用率
 */
const getUseRate = (coupon) => {
  if (!coupon.received_count || coupon.received_count === 0) return 0
  return Math.round((coupon.used_count / coupon.received_count) * 100)
}

/**
 * 获取进度条颜色
 * @param {Number} percentage - 百分比
 * @returns {String} 颜色
 */
const getProgressColor = (percentage) => {
  if (percentage < 30) return '#f56c6c'
  if (percentage < 70) return '#e6a23c'
  return '#67c23a'
}

/**
 * 获取状态文本
 * @param {Number} status - 状态
 * @returns {String} 状态文本
 */
const getStatusText = (status) => {
  const statusMap = { 0: '未开始', 1: '进行中', 2: '已结束' }
  return statusMap[status] || '-'
}

/**
 * 获取状态标签
 * @param {Number} status - 状态
 * @returns {String} 标签类型
 */
const getStatusTag = (status) => {
  const tagMap = { 0: 'info', 1: 'success', 2: 'danger' }
  return tagMap[status] || ''
}

/**
 * 获取使用状态文本
 * @param {Number} status - 使用状态
 * @returns {String} 状态文本
 */
const getUseStatusText = (status) => {
  const statusMap = { 0: '未使用', 1: '已使用', 2: '已过期' }
  return statusMap[status] || '-'
}

/**
 * 获取使用状态标签
 * @param {Number} status - 使用状态
 * @returns {String} 标签类型
 */
const getUseStatusTag = (status) => {
  const tagMap = { 0: 'warning', 1: 'success', 2: 'info' }
  return tagMap[status] || ''
}

defineExpose({
  name,
  show,
  hide
})
</script>

<style scoped lang="less">
.coupon-detail-drawer {
  :deep(.el-drawer__body) {
    padding: 0;
  }
}

.drawer-content {
  padding: 24px;
  height: 100%;
  overflow-y: auto;

  .info-section {
    margin-bottom: 32px;

    .section-title {
      font-size: 16px;
      font-weight: 600;
      color: #303133;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 2px solid #e4e7ed;
    }

    .discount-content {
      font-size: 15px;
      font-weight: 600;
      color: #f56c6c;
    }

    .receive-progress,
    .use-progress {
      .progress-text {
        font-size: 14px;
        color: #606266;

        .use-rate {
          color: #909399;
          font-size: 13px;
        }
      }
    }
  }

  .user-section {
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;

      .section-title {
        font-size: 16px;
        font-weight: 600;
        color: #303133;
      }

      .search-bar {
        display: flex;
        align-items: center;
      }
    }
  }
}
</style>
