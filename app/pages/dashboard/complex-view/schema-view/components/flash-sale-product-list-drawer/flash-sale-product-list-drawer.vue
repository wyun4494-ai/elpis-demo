<template>
  <el-drawer
    v-model="visible"
    size="90%"
    destroy-on-close
    :close-on-click-modal="false"
    append-to-body
    class="product-list-drawer"
    @close="handleClose"
  >
    <template #header>
      <div class="drawer-header">
        <span class="drawer-title">秒杀商品列表</span>
        <el-button
          type="primary"
          size="small"
          :icon="Close"
          @click="handleCloseAll"
        >
          关闭所有
        </el-button>
      </div>
    </template>

    <div
      v-loading="loading"
      class="product-list-container"
    >
      <!-- 时间段信息 -->
      <el-card class="info-card" shadow="never">
        <el-descriptions :column="3" border size="small">
          <el-descriptions-item label="活动名称">{{ slotData.activity_name }}</el-descriptions-item>
          <el-descriptions-item label="时间段">{{ slotData.slot_name }}</el-descriptions-item>
          <el-descriptions-item label="时间范围">
            <span class="time-range">{{ slotData.start_time }} - {{ slotData.end_time }}</span>
          </el-descriptions-item>
        </el-descriptions>
      </el-card>

      <!-- 工具栏 -->
      <div class="toolbar">
        <el-button
          type="primary"
          :icon="Plus"
          @click="handleAddProduct"
        >
          添加商品
        </el-button>
        <div class="toolbar-info">
          <span class="count-text">共 {{ productList.length }} 个商品</span>
          <span class="tip-text">提示：按 ESC 键可快速关闭所有抽屉</span>
        </div>
      </div>

      <!-- 商品列表 -->
      <el-table
        :data="productList"
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
          prop="product_name"
          label="商品名称"
          min-width="180"
          show-overflow-tooltip
        />
        <el-table-column
          prop="item_number"
          label="货号"
          width="150"
          align="center"
        />
        <el-table-column
          label="SKU"
          width="150"
          align="center"
        >
          <template #default="{ row }">
            {{ row.sku_name || '全部SKU' }}
          </template>
        </el-table-column>
        <el-table-column
          prop="original_price"
          label="商品价格"
          width="120"
          align="center"
        >
          <template #default="{ row }">
            <span class="price">¥{{ row.original_price }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="remaining_stock"
          label="剩余数量"
          width="120"
          align="center"
        >
          <template #default="{ row }">
            <el-tag :type="row.remaining_stock > 0 ? 'success' : 'danger'">
              {{ row.remaining_stock }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="flash_sale_price"
          label="秒杀价格"
          width="120"
          align="center"
        >
          <template #default="{ row }">
            <span class="flash-price">¥{{ row.flash_sale_price }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="flash_sale_stock"
          label="秒杀数量"
          width="120"
          align="center"
        />
        <el-table-column
          prop="limit_per_user"
          label="限购数量"
          width="120"
          align="center"
        />
        <el-table-column
          prop="sort_order"
          label="排序"
          width="100"
          align="center"
        />
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

    <!-- 添加商品对话框 -->
    <add-product-dialog
      ref="addProductDialogRef"
      @confirm="handleAddConfirm"
    />

    <!-- 编辑商品对话框 -->
    <edit-product-dialog
      ref="editProductDialogRef"
      @confirm="handleEditConfirm"
    />
  </el-drawer>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import { Plus, Close } from '@element-plus/icons-vue'
import $curl from '$elpisCommon/curl.js'
import AddProductDialog from '../add-product-dialog/add-product-dialog.vue'
import EditProductDialog from '../edit-product-dialog/edit-product-dialog.vue'

const visible = ref(false)
const loading = ref(false)
const slotData = ref({})
const productList = ref([])
const addProductDialogRef = ref(null)
const editProductDialogRef = ref(null)

const emit = defineEmits(['refresh', 'close-all'])

/**
 * 显示抽屉
 * @param {Object} data - 时间段数据
 */
const show = async (data) => {
  slotData.value = { ...data }
  visible.value = true
  await loadProductList()
}

/**
 * 隐藏抽屉
 */
const hide = () => {
  visible.value = false
  slotData.value = {}
  productList.value = []
}

/**
 * 关闭抽屉时触发
 */
const handleClose = () => {
  // 抽屉关闭时的清理工作
}

/**
 * 关闭所有抽屉
 */
const handleCloseAll = () => {
  emit('close-all')
  hide()
}

/**
 * 监听 ESC 键
 */
const handleKeyDown = (event) => {
  if (event.key === 'Escape' && visible.value) {
    handleCloseAll()
  }
}

// 组件挂载时添加键盘监听
onMounted(() => {
  document.addEventListener('keydown', handleKeyDown)
})

// 组件卸载时移除键盘监听
onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
})

/**
 * 加载商品列表
 */
const loadProductList = async () => {
  loading.value = true
  try {
    const res = await $curl({
      url: '/api/proj/flash-sale-product/list',
      method: 'get',
      params: {
        flash_sale_id: slotData.value.flash_sale_id,
        slot_id: slotData.value.slot_id
      }
    })
    productList.value = res.data || []
  } catch (error) {
    console.error('加载商品列表失败:', error)
    ElMessage.error('加载商品列表失败')
  } finally {
    loading.value = false
  }
}

/**
 * 添加商品
 */
const handleAddProduct = () => {
  if (addProductDialogRef.value) {
    addProductDialogRef.value.show({
      flash_sale_id: slotData.value.flash_sale_id,
      slot_id: slotData.value.slot_id
    })
  }
}

/**
 * 添加商品确认
 * @param {Array} products - 选中的商品列表
 */
const handleAddConfirm = async (products) => {
  loading.value = true
  
  let successCount = 0
  let failCount = 0
  const failedProducts = []
  
  try {
    // 批量添加商品
    for (const product of products) {
      try {
        await $curl({
          url: '/api/proj/flash-sale-product',
          method: 'post',
          data: {
            flash_sale_id: slotData.value.flash_sale_id,
            slot_id: slotData.value.slot_id,
            product_id: product.product_id,
            sku_id: product.sku_id || null,
            original_price: product.original_price,
            flash_sale_price: product.flash_sale_price,
            flash_sale_stock: product.flash_sale_stock,
            limit_per_user: product.limit_per_user,
            sort_order: product.sort_order || 0
          }
        })
        successCount++
      } catch (error) {
        failCount++
        const productName = product.sku_code 
          ? `${product.product_name}（${product.sku_code}）` 
          : product.product_name
        const errorMsg = error.response?.data?.message || error.message || '添加失败'
        failedProducts.push({ name: productName, error: errorMsg })
      }
    }

    // 刷新列表（只有在有成功的情况下才刷新）
    if (successCount > 0) {
      await loadProductList()
      emit('refresh')
    }

    // 根据结果显示不同的通知
    if (failCount === 0 && successCount > 0) {
      // 全部成功
      ElNotification({
        title: '添加成功',
        message: `已成功添加 ${successCount} 个商品`,
        type: 'success',
        duration: 3000
      })
    } else if (failCount > 0 && successCount > 0) {
      // 部分成功
      const failedList = failedProducts.map(item => `• ${item.name}: ${item.error}`).join('\n')
      ElNotification({
        title: '部分添加成功',
        message: `成功添加 ${successCount} 个商品，失败 ${failCount} 个\n\n失败原因：\n${failedList}`,
        type: 'warning',
        duration: 6000,
        dangerouslyUseHTMLString: false
      })
    } else if (failCount > 0 && successCount === 0) {
      // 全部失败
      const failedList = failedProducts.map(item => `• ${item.name}: ${item.error}`).join('\n')
      ElNotification({
        title: '添加失败',
        message: `所有商品添加失败\n\n失败原因：\n${failedList}`,
        type: 'error',
        duration: 6000,
        dangerouslyUseHTMLString: false
      })
    } else {
      // 没有商品被处理（理论上不应该发生）
      ElMessage.warning('没有商品需要添加')
    }
  } catch (error) {
    console.error('添加商品失败:', error)
    ElNotification({
      title: '添加失败',
      message: error.message || '添加商品失败，请稍后重试',
      type: 'error',
      duration: 4000
    })
  } finally {
    loading.value = false
  }
}

/**
 * 编辑商品
 * @param {Object} row - 商品数据
 */
const handleEdit = (row) => {
  if (editProductDialogRef.value) {
    editProductDialogRef.value.show(row)
  }
}

/**
 * 编辑商品确认
 * @param {Object} data - 编辑后的数据
 */
const handleEditConfirm = async (data) => {
  loading.value = true
  try {
    await $curl({
      url: `/api/proj/flash-sale-product/${data.flash_sale_product_id}`,
      method: 'put',
      data: {
        flash_sale_price: data.flash_sale_price,
        flash_sale_stock: data.flash_sale_stock,
        limit_per_user: data.limit_per_user,
        sort_order: data.sort_order
      }
    })

    ElNotification({
      title: '更新成功',
      message: '商品信息已成功更新',
      type: 'success',
      duration: 3000
    })
    
    await loadProductList()
    emit('refresh')
  } catch (error) {
    console.error('更新商品失败:', error)
    // 显示后端返回的具体错误信息
    const errorMessage = error.response?.data?.message || error.message || '更新商品失败'
    ElNotification({
      title: '更新失败',
      message: errorMessage,
      type: 'error',
      duration: 4000
    })
  } finally {
    loading.value = false
  }
}

/**
 * 删除商品
 * @param {Object} row - 商品数据
 */
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除商品"${row.product_name}"吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    await $curl({
      url: `/api/proj/flash-sale-product/${row.flash_sale_product_id}`,
      method: 'delete'
    })

    ElNotification({
      title: '删除成功',
      message: '商品已从秒杀活动中移除',
      type: 'success',
      duration: 3000
    })
    
    await loadProductList()
    emit('refresh')
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除商品失败:', error)
      const errorMessage = error.response?.data?.message || error.message || '删除商品失败'
      ElNotification({
        title: '删除失败',
        message: errorMessage,
        type: 'error',
        duration: 4000
      })
    }
  }
}

defineExpose({
  show,
  hide
})
</script>

<style scoped lang="less">
.product-list-drawer {
  :deep(.el-drawer__header) {
    padding: 20px 24px;
    border-bottom: 1px solid #e4e7ed;
    margin-bottom: 0;
  }

  :deep(.el-drawer__body) {
    padding: 24px;
    background-color: #f5f7fa;
  }

  .drawer-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding-right: 40px;

    .drawer-title {
      font-size: 18px;
      font-weight: 600;
      color: #303133;
    }
  }
}

.product-list-container {
  .info-card {
    margin-bottom: 20px;
    border-radius: 8px;

    :deep(.el-card__body) {
      padding: 16px;
    }

    .time-range {
      font-family: 'Courier New', monospace;
      font-weight: 500;
      color: #409eff;
    }
  }

  .toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding: 12px 16px;
    background-color: #fff;
    border-radius: 6px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

    .toolbar-info {
      display: flex;
      align-items: center;
      gap: 16px;

      .count-text {
        font-size: 14px;
        color: #606266;
        font-weight: 500;
      }

      .tip-text {
        font-size: 12px;
        color: #909399;
        font-style: italic;
      }
    }
  }

  .price {
    color: #909399;
    text-decoration: line-through;
  }

  .flash-price {
    color: #f56c6c;
    font-weight: 600;
    font-size: 15px;
  }

  .action-buttons {
    display: flex;
    gap: 8px;
    justify-content: center;
  }

  :deep(.el-table) {
    border-radius: 6px;
    overflow: hidden;
    background-color: #fff;

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
