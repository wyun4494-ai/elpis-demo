<template>
  <div class="order-detail-container">
    <!-- 订单进度条 -->
    <div class="order-progress-section">
      <el-steps :active="getStepActive()" align-center finish-status="success">
        <el-step title="提交订单" :description="orderData.order_time" />
        <el-step 
          title="支付订单" 
          :description="orderData.pay_time || (orderData.order_status === 0 ? '待支付' : '')"
          :status="orderData.order_status === 4 ? 'error' : undefined"
        />
        <el-step 
          title="商家发货" 
          :description="orderData.delivery_time || (orderData.order_status >= 1 && orderData.order_status < 2 ? '待发货' : '')"
        />
        <el-step 
          title="确认收货" 
          :description="orderData.receive_time || (orderData.order_status === 2 ? '待收货' : '')"
        />
        <el-step 
          title="完成评价" 
          :description="orderData.finish_time || (orderData.order_status === 3 ? '已完成' : '')"
        />
      </el-steps>
      
      <!-- 订单状态提示 -->
      <div v-if="orderData.order_status === 4" class="status-alert">
        <el-alert 
          title="订单已取消" 
          type="error" 
          :description="`取消原因：${orderData.cancel_reason || '无'}`"
          :closable="false"
          show-icon
        />
      </div>
      <div v-else-if="orderData.order_status === 5 || orderData.order_status === 6" class="status-alert">
        <el-alert 
          :title="orderData.order_status === 5 ? '退款中' : '已退款'" 
          type="warning" 
          :closable="false"
          show-icon
        />
      </div>
    </div>

    <!-- 基本信息表格 -->
    <div class="info-section">
      <div class="section-title">
        <i class="el-icon-document"></i>
        基本信息
      </div>
      <table class="info-table">
        <tbody>
        <tr>
          <td class="label">订单编号</td>
          <td class="value">{{ orderData.order_no }}</td>
          <td class="label">支付单号</td>
          <td class="value">{{ orderData.pay_no || '-' }}</td>
        </tr>
        <tr>
          <td class="label">用户姓名</td>
          <td class="value">{{ orderData.customer_name }}</td>
          <td class="label">支付方式</td>
          <td class="value">{{ getPayTypeText(orderData.pay_type) }}</td>
        </tr>
        <tr>
          <td class="label">订单状态</td>
          <td class="value">
            <el-tag :type="getStatusType(orderData.order_status)" size="small">
              {{ orderData.order_status_text }}
            </el-tag>
          </td>
          <td class="label">支付状态</td>
          <td class="value">
            <el-tag :type="getPayStatusType(orderData.pay_status)" size="small">
              {{ orderData.pay_status_text }}
            </el-tag>
          </td>
        </tr>
        <tr>
          <td class="label">订单总金额</td>
          <td class="value">¥{{ orderData.total_amount }}</td>
          <td class="label">运费</td>
          <td class="value">¥{{ orderData.freight_amount }}</td>
        </tr>
        <tr>
          <td class="label">优惠金额</td>
          <td class="value">¥{{ orderData.discount_amount }}</td>
          <td class="label">优惠券抵扣</td>
          <td class="value">¥{{ orderData.coupon_amount }}</td>
        </tr>
        <tr>
          <td class="label">实付金额</td>
          <td class="value pay-amount" colspan="3">¥{{ orderData.pay_amount }}</td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- 收货人信息表格 -->
    <div class="info-section">
      <div class="section-title">
        <i class="el-icon-location"></i>
        收货人信息
      </div>
      <table class="info-table">
        <tbody>
        <tr>
          <td class="label">收货人</td>
          <td class="value">{{ orderData.receiver_name }}</td>
          <td class="label">手机号码</td>
          <td class="value">{{ orderData.receiver_phone }}</td>
        </tr>
        <tr>
          <td class="label">邮政编码</td>
          <td class="value">{{ orderData.receiver_postcode || '-' }}</td>
          <td class="label">收货地址</td>
          <td class="value">
            {{ orderData.receiver_province }} {{ orderData.receiver_city }} {{ orderData.receiver_district }} {{ orderData.receiver_address }}
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- 商品信息表格 -->
    <div class="info-section">
      <div class="section-title">
        <i class="el-icon-goods"></i>
        商品信息
      </div>
      <el-table :data="orderData.items" border style="width: 100%">
        <el-table-column label="商品图片" width="100" align="center">
          <template #default="{ row }">
            <el-image 
              v-if="row.product_image" 
              :src="row.product_image" 
              fit="cover" 
              style="width: 60px; height: 60px; border-radius: 4px;"
              :preview-src-list="[row.product_image]"
            />
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="product_name" label="商品名称" min-width="200" show-overflow-tooltip />
        <el-table-column prop="sku_name" label="规格" min-width="150" show-overflow-tooltip />
        <el-table-column prop="product_price" label="单价" width="120" align="right">
          <template #default="{ row }">¥{{ row.product_price }}</template>
        </el-table-column>
        <el-table-column prop="product_quantity" label="数量" width="80" align="center" />
        <el-table-column prop="pay_amount" label="小计" width="120" align="right">
          <template #default="{ row }">
            <span class="amount-text">¥{{ row.pay_amount }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 物流信息表格 -->
    <div v-if="orderData.logistics" class="info-section">
      <div class="section-title">
        <i class="el-icon-truck"></i>
        物流信息
      </div>
      <table class="info-table">
        <tbody>
        <tr>
          <td class="label">物流公司</td>
          <td class="value">{{ orderData.logistics.logistics_company }}</td>
          <td class="label">物流单号</td>
          <td class="value">{{ orderData.logistics.logistics_no }}</td>
        </tr>
        <tr>
          <td class="label">物流状态</td>
          <td class="value">
            <el-tag :type="getLogisticsStatusType(orderData.logistics.logistics_status)" size="small">
              {{ getLogisticsStatusText(orderData.logistics.logistics_status) }}
            </el-tag>
          </td>
          <td class="label">发货时间</td>
          <td class="value">{{ orderData.logistics.send_time || '-' }}</td>
        </tr>
        <tr>
          <td class="label">发货人</td>
          <td class="value">{{ orderData.logistics.sender_name }}</td>
          <td class="label">发货电话</td>
          <td class="value">{{ orderData.logistics.sender_phone }}</td>
        </tr>
        <tr>
          <td class="label">发货地址</td>
          <td class="value" colspan="3">{{ orderData.logistics.sender_address }}</td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- 备注信息表格 -->
    <div v-if="orderData.buyer_message || orderData.seller_remark" class="info-section">
      <div class="section-title">
        <i class="el-icon-edit"></i>
        备注信息
      </div>
      <table class="info-table">
        <tbody>
        <tr v-if="orderData.buyer_message">
          <td class="label">买家留言</td>
          <td class="value" colspan="3">{{ orderData.buyer_message }}</td>
        </tr>
        <tr v-if="orderData.seller_remark">
          <td class="label">卖家备注</td>
          <td class="value" colspan="3">{{ orderData.seller_remark }}</td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- 操作记录时间线 -->
    <div v-if="orderData.status_logs && orderData.status_logs.length > 0" class="info-section">
      <div class="section-title">
        <i class="el-icon-time"></i>
        操作记录
      </div>
      <el-timeline class="timeline-container">
        <el-timeline-item
          v-for="log in orderData.status_logs"
          :key="log.log_id"
          :timestamp="log.create_time"
          placement="top"
        >
          <div class="timeline-content">
            <div class="timeline-title">{{ log.status_name }}</div>
            <div class="timeline-info">
              <span>操作人：{{ log.operator_name }}</span>
              <span class="operator-type">({{ getOperatorTypeText(log.operator_type) }})</span>
            </div>
            <div v-if="log.remark" class="timeline-remark">{{ log.remark }}</div>
          </div>
        </el-timeline-item>
      </el-timeline>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import $curl from '$elpisCommon/curl.js'

const props = defineProps({
  schema: { type: Object, default: () => ({}) },
  schemaKey: { type: String, default: '' },
  model: { type: [String, Object], default: undefined },
  mainKey: { type: String, default: '' }
})

const orderData = ref({
  items: [],
  logistics: null,
  status_logs: []
})

// 获取订单详情
const fetchOrderDetail = async () => {
  try {
    const orderId = props.model
    if (!orderId) {
      ElMessage.warning('订单ID不能为空')
      return
    }

    const response = await $curl({
      url: '/api/proj/order',
      method: 'get',
      params: { order_id: orderId }
    })

    if (response && response.success) {
      orderData.value = response.data || {}
    } else {
      ElMessage.error(response?.message || '获取订单详情失败')
    }
  } catch (error) {
    console.error('获取订单详情失败:', error)
    ElMessage.error('获取订单详情失败')
  }
}

// 订单状态相关
const getStatusText = (status) => {
  const statusMap = {
    0: '待支付',
    1: '待发货',
    2: '待收货',
    3: '已完成',
    4: '已取消',
    5: '退款中',
    6: '已退款'
  }
  return statusMap[status] || '未知'
}

const getStatusType = (status) => {
  const typeMap = {
    0: 'warning',
    1: 'primary',
    2: 'info',
    3: 'success',
    4: 'info',
    5: 'danger',
    6: 'info'
  }
  return typeMap[status] || 'info'
}

// 获取步骤条的当前步骤
const getStepActive = () => {
  const status = orderData.value.order_status
  // 0-待支付(1), 1-待发货(2), 2-待收货(3), 3-已完成(5), 4-已取消(1), 5-退款中(1), 6-已退款(1)
  if (status === 0) return 1 // 提交订单完成，待支付
  if (status === 1) return 2 // 支付完成，待发货
  if (status === 2) return 3 // 发货完成，待收货
  if (status === 3) return 5 // 全部完成
  if (status === 4) return 1 // 已取消，停在支付步骤
  if (status === 5 || status === 6) return 1 // 退款，停在支付步骤
  return 0
}

// 支付方式
const getPayTypeText = (type) => {
  const typeMap = {
    1: '微信支付',
    2: '支付宝',
    3: '银行卡'
  }
  return typeMap[type] || '-'
}

// 支付状态相关
const getPayStatusText = (status) => {
  const statusMap = {
    0: '未支付',
    1: '已支付',
    2: '已退款'
  }
  return statusMap[status] || '未知'
}

const getPayStatusType = (status) => {
  const typeMap = {
    0: 'warning',
    1: 'success',
    2: 'info'
  }
  return typeMap[status] || 'info'
}

// 物流状态相关
const getLogisticsStatusText = (status) => {
  const statusMap = {
    0: '未发货',
    1: '运输中',
    2: '派送中',
    3: '已签收',
    4: '异常'
  }
  return statusMap[status] || '未知'
}

const getLogisticsStatusType = (status) => {
  const typeMap = {
    0: 'info',
    1: 'primary',
    2: 'warning',
    3: 'success',
    4: 'danger'
  }
  return typeMap[status] || 'info'
}

// 操作人类型
const getOperatorTypeText = (type) => {
  const typeMap = {
    1: '用户',
    2: '管理员',
    3: '系统'
  }
  return typeMap[type] || '未知'
}

onMounted(() => {
  fetchOrderDetail()
})
</script>

<style scoped lang="less">
.order-detail-container {
  padding: 0;
  background: #f5f7fa;
  
  // 订单进度条区域
  .order-progress-section {
    background: #fff;
    padding: 30px 40px;
    margin-bottom: 16px;
    border-radius: 4px;
    
    :deep(.el-steps) {
      .el-step__title {
        font-size: 14px;
      }
      
      .el-step__description {
        font-size: 12px;
        color: #909399;
      }
    }
    
    .status-alert {
      margin-top: 20px;
    }
  }
  
  // 信息区块
  .info-section {
    background: #fff;
    margin-bottom: 16px;
    border-radius: 4px;
    overflow: hidden;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    .section-title {
      padding: 16px 20px;
      background: #fafafa;
      border-bottom: 1px solid #e8e8e8;
      font-size: 14px;
      font-weight: 500;
      color: #303133;
      
      i {
        margin-right: 8px;
        color: #409EFF;
      }
    }
    
    // 信息表格样式
    .info-table {
      width: 100%;
      border-collapse: collapse;
      
      tr {
        border-bottom: 1px solid #e8e8e8;
        
        &:last-child {
          border-bottom: none;
        }
        
        td {
          padding: 12px 20px;
          font-size: 14px;
          
          &.label {
            width: 120px;
            background: #fafafa;
            color: #606266;
            font-weight: 500;
            border-right: 1px solid #e8e8e8;
          }
          
          &.value {
            color: #303133;
            
            &.pay-amount {
              font-size: 18px;
              font-weight: bold;
              color: #F56C6C;
            }
          }
        }
      }
    }
    
    // 商品表格
    :deep(.el-table) {
      border-top: none;
      
      .amount-text {
        color: #F56C6C;
        font-weight: 500;
      }
    }
    
    // 时间线样式
    .timeline-container {
      padding: 20px;
      
      .timeline-content {
        .timeline-title {
          font-size: 14px;
          font-weight: 500;
          color: #303133;
          margin-bottom: 8px;
        }
        
        .timeline-info {
          font-size: 13px;
          color: #606266;
          margin-bottom: 4px;
          
          .operator-type {
            color: #909399;
            margin-left: 4px;
          }
        }
        
        .timeline-remark {
          font-size: 13px;
          color: #909399;
          margin-top: 8px;
          padding: 8px 12px;
          background: #f5f7fa;
          border-radius: 4px;
        }
      }
    }
  }
}
</style>
