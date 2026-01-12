<template>
  <div></div>
</template>

<script setup>
import { ElMessage, ElNotification, ElMessageBox } from 'element-plus'
import $curl from '$elpisCommon/curl.js'

const emit = defineEmits(['command'])

const name = 'orderListHandler'

// 导出订单
const exportOrders = async (params) => {
  try {
    ElMessage.info('正在导出订单数据...')
    
    const response = await $curl({
      url: '/api/proj/order/export',
      method: 'get',
      params: params.searchParams || {}
    })

    if (response && response.success) {
      const data = response.data || []
      
      // 将 JSON 数据转换为 CSV 格式
      if (data.length === 0) {
        ElMessage.warning('没有可导出的订单数据')
        return
      }
      
      // CSV 表头
      const headers = [
        '订单号',
        '用户姓名',
        '订单金额',
        '实付金额',
        '订单状态',
        '支付状态',
        '下单时间',
        '收货人',
        '联系电话',
        '收货地址'
      ]
      
      // CSV 数据行
      const rows = data.map(order => [
        order.order_no || '',
        order.customer_name || '',
        order.total_amount || 0,
        order.pay_amount || 0,
        order.order_status_text || '',
        order.pay_status_text || '',
        order.order_time || '',
        order.receiver_name || '',
        order.receiver_phone || '',
        `${order.receiver_province || ''} ${order.receiver_city || ''} ${order.receiver_district || ''} ${order.receiver_address || ''}`
      ])
      
      // 组合 CSV 内容
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n')
      
      // 添加 BOM 头，解决中文乱码问题
      const BOM = '\uFEFF'
      const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `订单列表_${new Date().getTime()}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      ElNotification({
        title: '导出成功',
        message: `已成功导出 ${data.length} 条订单数据`,
        type: 'success',
        duration: 3000
      })
    } else {
      ElMessage.error(response?.message || '导出订单失败')
    }
  } catch (error) {
    console.error('导出订单失败:', error)
    ElMessage.error('导出订单失败，请稍后重试')
  }
}

// 批量发货
const batchDeliver = async (params) => {
  const selectedRows = params.selectedRows || []
  
  if (selectedRows.length === 0) {
    ElMessage.warning('请先选择要发货的订单')
    return
  }

  // 检查是否都是待发货状态
  const invalidOrders = selectedRows.filter(row => row.order_status !== 1)
  if (invalidOrders.length > 0) {
    ElMessage.warning('只能对待发货状态的订单进行发货操作')
    return
  }

  try {
    await ElMessageBox.confirm(
      `确认要批量发货 ${selectedRows.length} 个订单吗？`,
      '批量发货确认',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    ElMessage.info('批量发货功能开发中，请使用单个发货功能')
  } catch (error) {
    // 用户取消
  }
}

// 批量取消订单
const batchCancel = async (params) => {
  const selectedRows = params.selectedRows || []
  
  if (selectedRows.length === 0) {
    ElMessage.warning('请先选择要取消的订单')
    return
  }

  // 检查是否都是待支付状态
  const invalidOrders = selectedRows.filter(row => row.order_status !== 0)
  if (invalidOrders.length > 0) {
    ElMessage.warning('只能取消待支付状态的订单')
    return
  }

  try {
    const { value: cancelReason } = await ElMessageBox.prompt(
      `确认要批量取消 ${selectedRows.length} 个订单吗？请输入取消原因：`,
      '批量取消订单',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        inputPattern: /.{5,}/,
        inputErrorMessage: '取消原因至少5个字符',
        inputPlaceholder: '请输入取消原因'
      }
    )

    const orderIds = selectedRows.map(row => row.order_id)

    const response = await $curl({
      url: '/api/proj/order/batch-cancel',
      method: 'post',
      data: {
        order_ids: orderIds,
        cancel_reason: cancelReason
      }
    })

    if (response && response.success) {
      ElNotification({
        title: '批量取消成功',
        message: `已成功取消 ${selectedRows.length} 个订单`,
        type: 'success',
        duration: 3000
      })
      
      // 刷新列表
      emit('command', { event: 'loadTableData' })
    } else {
      ElMessage.error(response?.message || '批量取消订单失败')
    }
  } catch (error) {
    if (error === 'cancel') {
      // 用户取消
      return
    }
    console.error('批量取消订单失败:', error)
    ElMessage.error('批量取消订单失败，请稍后重试')
  }
}

// 批量删除订单
const batchDelete = async (params) => {
  const selectedRows = params.selectedRows || []
  
  if (selectedRows.length === 0) {
    ElMessage.warning('请先选择要删除的订单')
    return
  }

  // 检查是否都是已完成或已取消状态
  const invalidOrders = selectedRows.filter(row => row.order_status !== 3 && row.order_status !== 4)
  if (invalidOrders.length > 0) {
    ElMessage.warning('只能删除已完成或已取消的订单')
    return
  }

  try {
    await ElMessageBox.confirm(
      `确认要批量删除 ${selectedRows.length} 个订单吗？删除后无法恢复！`,
      '批量删除确认',
      {
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
        type: 'error'
      }
    )

    const orderIds = selectedRows.map(row => row.order_id)

    const response = await $curl({
      url: '/api/proj/order/batch-delete',
      method: 'post',
      data: {
        order_ids: orderIds
      }
    })

    if (response && response.success) {
      ElNotification({
        title: '批量删除成功',
        message: `已成功删除 ${selectedRows.length} 个订单`,
        type: 'success',
        duration: 3000
      })
      
      // 刷新列表
      emit('command', { event: 'loadTableData' })
    } else {
      ElMessage.error(response?.message || '批量删除订单失败')
    }
  } catch (error) {
    if (error === 'cancel') {
      // 用户取消
      return
    }
    console.error('批量删除订单失败:', error)
    ElMessage.error('批量删除订单失败，请稍后重试')
  }
}

// 统一的事件处理方法
const handleEvent = (eventKey, params) => {
  switch (eventKey) {
    case 'exportOrders':
      return exportOrders(params)
    case 'batchDeliver':
      return batchDeliver(params)
    case 'batchCancel':
      return batchCancel(params)
    case 'batchDelete':
      return batchDelete(params)
    default:
      console.warn('未知的事件:', eventKey)
  }
}

defineExpose({
  name,
  handleEvent,
  exportOrders,
  batchDeliver,
  batchCancel,
  batchDelete
})
</script>
