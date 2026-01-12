<template>
  <el-dialog
    v-model="visible"
    title="添加秒杀商品"
    width="1000px"
    destroy-on-close
    :close-on-click-modal="false"
    class="add-product-dialog"
  >
    <div
      v-loading="loading"
      class="dialog-content"
    >
      <!-- 搜索栏 -->
      <div class="search-bar">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索商品名称或货号"
          clearable
          style="width: 300px"
          @keyup.enter="handleSearch"
        >
          <template #append>
            <el-button :icon="Search" @click="handleSearch" />
          </template>
        </el-input>
      </div>

      <!-- 工具栏 -->
      <div class="toolbar">
        <el-button
          type="primary"
          size="small"
          :disabled="selectedTableProducts.length === 0"
          @click="handleBatchAdd"
        >
          批量添加（{{ selectedTableProducts.length }}）
        </el-button>
        <span class="tip-text">提示：勾选商品后点击"批量添加"，或点击单个商品的"添加"按钮</span>
      </div>

      <!-- 已选商品批量操作工具栏 -->
      <div v-if="selectedProducts.length > 0" class="batch-toolbar">
        <div class="batch-toolbar-left">
          <span class="batch-title">已选商品配置（{{ selectedProducts.length }}个）</span>
          <el-button
            type="danger"
            size="small"
            plain
            @click="handleClearAll"
          >
            清空全部
          </el-button>
        </div>
        <div class="batch-toolbar-right">
          <el-button
            size="small"
            @click="showBatchSetDialog = true"
          >
            批量设置
          </el-button>
        </div>
      </div>

      <!-- 商品列表 -->
      <el-table
        ref="tableRef"
        :data="productList"
        border
        stripe
        style="width: 100%; margin-bottom: 16px"
        max-height="500px"
        :row-key="getRowKey"
        :expand-row-keys="expandedRows"
        @selection-change="handleTableSelectionChange"
        @expand-change="handleExpandChange"
      >
        <el-table-column
          type="selection"
          width="55"
          align="center"
          :reserve-selection="true"
        />
        <el-table-column type="expand">
          <template #default="{ row }">
            <div class="sku-section">
              <div class="sku-title">选择 SKU（可多选）</div>
              <el-table
                :data="row.skuList || []"
                border
                size="small"
                @selection-change="(selection) => handleSkuSelectionChange(row, selection)"
              >
                <el-table-column
                  type="selection"
                  width="55"
                  align="center"
                />
                <el-table-column
                  prop="sku_code"
                  label="SKU编码"
                  width="150"
                  align="center"
                />
                <el-table-column
                  prop="sku_name"
                  label="SKU名称"
                  min-width="200"
                  show-overflow-tooltip
                />
                <el-table-column
                  prop="price"
                  label="价格"
                  width="120"
                  align="center"
                >
                  <template #default="{ row: skuRow }">
                    ¥{{ skuRow.price }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="inventory"
                  label="库存"
                  width="100"
                  align="center"
                />
              </el-table>
              <div v-if="!row.skuList || row.skuList.length === 0" class="no-sku-tip">
                该商品没有 SKU，将使用商品本身参与秒杀
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="product_name"
          label="商品名称"
          min-width="200"
          show-overflow-tooltip
        />
        <el-table-column
          prop="item_number"
          label="货号"
          width="150"
          align="center"
        />
        <el-table-column
          prop="price"
          label="价格"
          width="120"
          align="center"
        >
          <template #default="{ row }">
            ¥{{ row.price }}
          </template>
        </el-table-column>
        <el-table-column
          prop="inventory"
          label="库存"
          width="100"
          align="center"
        />
        <el-table-column
          label="操作"
          width="120"
          align="center"
          fixed="right"
        >
          <template #default="{ row }">
            <el-button
              type="primary"
              size="small"
              @click="handleAddProduct(row)"
            >
              添加
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="pagination.total"
        layout="total, sizes, prev, pager, next, jumper"
        background
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
      />

      <!-- 已选商品配置 -->
      <div v-if="selectedProducts.length > 0" class="selected-section">
        <el-table
          ref="selectedTableRef"
          :data="selectedProducts"
          border
          style="width: 100%"
          max-height="300px"
          @selection-change="handleSelectedProductsChange"
        >
          <el-table-column
            type="selection"
            width="55"
            align="center"
          />
          <el-table-column
            prop="product_name"
            label="商品名称"
            min-width="150"
            show-overflow-tooltip
          />
          <el-table-column
            label="SKU"
            width="150"
            align="center"
          >
            <template #default="{ row }">
              <el-tag v-if="row.sku_code" type="success" size="small">
                {{ row.sku_code }}
              </el-tag>
              <span v-else class="no-sku-text">全部SKU</span>
            </template>
          </el-table-column>
          <el-table-column
            label="秒杀价格"
            width="150"
          >
            <template #default="{ row }">
              <el-input-number
                v-model="row.flash_sale_price"
                :min="0.01"
                :max="Math.max(parseFloat(row.original_price) || 0.01, 0.01)"
                :precision="2"
                size="small"
                style="width: 100%"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="秒杀数量"
            width="150"
          >
            <template #default="{ row }">
              <el-input-number
                v-model="row.flash_sale_stock"
                :min="1"
                :max="Math.max(parseInt(row.inventory) || 1, 1)"
                size="small"
                style="width: 100%"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="限购数量"
            width="150"
          >
            <template #default="{ row }">
              <el-input-number
                v-model="row.limit_per_user"
                :min="1"
                :max="9999"
                size="small"
                style="width: 100%"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="排序"
            width="120"
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
            label="操作"
            width="80"
            align="center"
            fixed="right"
          >
            <template #default="{ row, $index }">
              <el-button
                type="danger"
                size="small"
                link
                @click="handleRemoveProduct($index)"
              >
                移除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="hide">取消</el-button>
        <el-button
          type="primary"
          :disabled="selectedProducts.length === 0"
          @click="handleConfirm"
        >
          确定添加（{{ selectedProducts.length }}）
        </el-button>
      </div>
    </template>

    <!-- 批量设置对话框 -->
    <el-dialog
      v-model="showBatchSetDialog"
      title="批量设置"
      width="500px"
      destroy-on-close
      append-to-body
    >
      <el-form
        ref="batchFormRef"
        :model="batchForm"
        label-width="100px"
      >
        <el-form-item label="秒杀价格">
          <el-radio-group v-model="batchForm.priceType">
            <el-radio value="none">不修改</el-radio>
            <el-radio value="fixed">固定价格</el-radio>
            <el-radio value="discount">折扣比例</el-radio>
          </el-radio-group>
          <div v-if="batchForm.priceType === 'fixed'" style="margin-top: 8px">
            <el-input-number
              v-model="batchForm.fixedPrice"
              :min="0.01"
              :precision="2"
              placeholder="请输入固定价格"
              style="width: 100%"
            />
          </div>
          <div v-if="batchForm.priceType === 'discount'" style="margin-top: 8px">
            <el-input-number
              v-model="batchForm.discountRate"
              :min="0.1"
              :max="0.99"
              :precision="2"
              :step="0.1"
              placeholder="如0.8表示8折"
              style="width: 100%"
            />
            <div class="tip-text" style="margin-top: 4px">例如：0.8 表示原价的 8 折</div>
          </div>
        </el-form-item>

        <el-form-item label="秒杀数量">
          <el-radio-group v-model="batchForm.stockType">
            <el-radio value="none">不修改</el-radio>
            <el-radio value="fixed">固定数量</el-radio>
            <el-radio value="percent">库存比例</el-radio>
          </el-radio-group>
          <div v-if="batchForm.stockType === 'fixed'" style="margin-top: 8px">
            <el-input-number
              v-model="batchForm.fixedStock"
              :min="1"
              placeholder="请输入固定数量"
              style="width: 100%"
            />
          </div>
          <div v-if="batchForm.stockType === 'percent'" style="margin-top: 8px">
            <el-input-number
              v-model="batchForm.stockPercent"
              :min="1"
              :max="100"
              placeholder="如50表示库存的50%"
              style="width: 100%"
            />
            <div class="tip-text" style="margin-top: 4px">例如：50 表示库存的 50%</div>
          </div>
        </el-form-item>

        <el-form-item label="限购数量">
          <el-radio-group v-model="batchForm.limitType">
            <el-radio value="none">不修改</el-radio>
            <el-radio value="fixed">固定数量</el-radio>
          </el-radio-group>
          <div v-if="batchForm.limitType === 'fixed'" style="margin-top: 8px">
            <el-input-number
              v-model="batchForm.fixedLimit"
              :min="1"
              :max="9999"
              placeholder="请输入限购数量"
              style="width: 100%"
            />
          </div>
        </el-form-item>

        <el-form-item label="排序">
          <el-radio-group v-model="batchForm.sortType">
            <el-radio value="none">不修改</el-radio>
            <el-radio value="fixed">固定值</el-radio>
          </el-radio-group>
          <div v-if="batchForm.sortType === 'fixed'" style="margin-top: 8px">
            <el-input-number
              v-model="batchForm.fixedSort"
              :min="0"
              placeholder="请输入排序值"
              style="width: 100%"
            />
          </div>
        </el-form-item>

        <el-form-item label="应用范围">
          <el-radio-group v-model="batchForm.applyRange">
            <el-radio value="all">全部商品</el-radio>
            <el-radio value="selected">仅选中商品</el-radio>
          </el-radio-group>
          <div v-if="batchForm.applyRange === 'selected'" class="tip-text" style="margin-top: 4px">
            当前选中 {{ selectedConfigProducts.length }} 个商品
          </div>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="showBatchSetDialog = false">取消</el-button>
        <el-button type="primary" @click="handleBatchSet">确定</el-button>
      </template>
    </el-dialog>
  </el-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import $curl from '$elpisCommon/curl.js'

const visible = ref(false)
const loading = ref(false)
const searchKeyword = ref('')
const productList = ref([])
const selectedProducts = ref([])
const selectedTableProducts = ref([]) // 表格中勾选的商品
const selectedConfigProducts = ref([]) // 已选商品配置表格中勾选的商品
const tableRef = ref(null)
const selectedTableRef = ref(null)
const contextData = ref({})
const expandedRows = ref([])
const productSkuMap = ref({})
const pagination = ref({
  page: 1,
  pageSize: 10,
  total: 0
})
const existingProducts = ref([]) // 当前时间段已有的秒杀商品

// 批量设置对话框
const showBatchSetDialog = ref(false)
const batchFormRef = ref(null)
const batchForm = ref({
  priceType: 'none', // none, fixed, discount
  fixedPrice: null,
  discountRate: 0.8,
  stockType: 'none', // none, fixed, percent
  fixedStock: null,
  stockPercent: 50,
  limitType: 'none', // none, fixed
  fixedLimit: 1,
  sortType: 'none', // none, fixed
  fixedSort: 0,
  applyRange: 'all' // all, selected
})

const emit = defineEmits(['confirm'])

/**
 * 显示对话框
 * @param {Object} data - 上下文数据
 */
const show = async (data) => {
  // 重置所有状态
  contextData.value = { ...data }
  searchKeyword.value = ''
  productList.value = []
  selectedProducts.value = []
  selectedTableProducts.value = []
  expandedRows.value = []
  productSkuMap.value = {}
  existingProducts.value = []
  pagination.value = {
    page: 1,
    pageSize: 10,
    total: 0
  }
  
  visible.value = true
  
  // 加载当前时间段已有的秒杀商品
  await loadExistingProducts()
  // 加载商品列表
  await loadProductList()
}

/**
 * 加载当前时间段已有的秒杀商品
 */
const loadExistingProducts = async () => {
  try {
    const res = await $curl({
      url: '/api/proj/flash-sale-product/list',
      method: 'get',
      params: {
        flash_sale_id: contextData.value.flash_sale_id,
        slot_id: contextData.value.slot_id
      }
    })
    existingProducts.value = res.data || []
  } catch (error) {
    console.error('加载已有商品失败:', error)
    existingProducts.value = []
  }
}

/**
 * 隐藏对话框
 */
const hide = () => {
  visible.value = false
  
  // 清空所有状态
  searchKeyword.value = ''
  productList.value = []
  selectedProducts.value = []
  expandedRows.value = []
  productSkuMap.value = {}
  contextData.value = {}
  pagination.value = {
    page: 1,
    pageSize: 10,
    total: 0
  }
}

/**
 * 加载商品列表
 */
const loadProductList = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.value.page,
      pageSize: pagination.value.pageSize,
      shelf_status: 1 // 只显示上架商品
    }
    
    if (searchKeyword.value) {
      params.product_name = searchKeyword.value
    }
    
    const res = await $curl({
      url: '/api/proj/product/list',
      method: 'get',
      params
    })
    
    productList.value = res.data || []
    pagination.value.total = res.total || 0
  } catch (error) {
    console.error('加载商品列表失败:', error)
    ElMessage.error('加载商品列表失败')
  } finally {
    loading.value = false
  }
}

/**
 * 搜索商品
 */
const handleSearch = async () => {
  pagination.value.page = 1
  await loadProductList()
}

/**
 * 页码变化
 * @param {Number} page - 新页码
 */
const handlePageChange = async (page) => {
  pagination.value.page = page
  await loadProductList()
}

/**
 * 每页数量变化
 * @param {Number} pageSize - 新的每页数量
 */
const handleSizeChange = async (pageSize) => {
  pagination.value.pageSize = pageSize
  pagination.value.page = 1
  await loadProductList()
}

/**
 * 获取行的唯一标识
 * @param {Object} row - 行数据
 * @returns {String} 行的唯一标识
 */
const getRowKey = (row) => {
  return row.product_id
}

/**
 * 展开行变化
 * @param {Object} row - 行数据
 * @param {Array} expandedRowsData - 展开的行数据
 */
const handleExpandChange = async (row, expandedRowsData) => {
  expandedRows.value = expandedRowsData.map(item => item.product_id)
  
  // 如果展开且还没有加载 SKU，则加载
  if (expandedRowsData.some(item => item.product_id === row.product_id)) {
    if (!row.skuList) {
      await loadProductSkus(row)
    }
  }
}

/**
 * 加载商品的 SKU 列表
 * @param {Object} product - 商品数据
 */
const loadProductSkus = async (product) => {
  try {
    const res = await $curl({
      url: '/api/proj/product/sku/list',
      method: 'get',
      params: {
        product_id: product.product_id
      }
    })
    
    product.skuList = res.data || []
    productSkuMap.value[product.product_id] = product.skuList
  } catch (error) {
    console.error('加载 SKU 列表失败:', error)
    ElMessage.error('加载 SKU 列表失败')
    product.skuList = []
  }
}

/**
 * 表格选择变化
 * @param {Array} selection - 选中的商品
 */
const handleTableSelectionChange = (selection) => {
  selectedTableProducts.value = selection
}

/**
 * SKU 选择变化
 * @param {Object} product - 商品数据
 * @param {Array} selection - 选中的 SKU
 */
const handleSkuSelectionChange = (product, selection) => {
  productSkuMap.value[product.product_id] = selection
}

/**
 * 批量添加商品
 */
const handleBatchAdd = () => {
  if (selectedTableProducts.value.length === 0) {
    ElMessage.warning('请先选择要添加的商品')
    return
  }

  let totalAdded = 0
  let totalDuplicate = 0
  const duplicateList = []

  selectedTableProducts.value.forEach(product => {
    const selectedSkus = productSkuMap.value[product.product_id] || []
    
    if (selectedSkus.length > 0) {
      // 有选中的 SKU，添加选中的 SKU
      selectedSkus.forEach(sku => {
        const existsInSlot = existingProducts.value.some(
          item => item.product_id === product.product_id && item.sku_id === sku.sku_id
        )
        
        if (existsInSlot) {
          totalDuplicate++
          duplicateList.push(`${product.product_name}（${sku.sku_name || sku.sku_code}）`)
          return
        }
        
        const existsInSelected = selectedProducts.value.some(
          item => item.product_id === product.product_id && item.sku_id === sku.sku_id
        )
        
        if (!existsInSelected) {
          const skuPrice = parseFloat(sku.price) || parseFloat(product.price) || 0.01
          const skuInventory = parseInt(sku.inventory) || 0
          const flashSalePrice = skuPrice > 0 ? parseFloat((skuPrice * 0.8).toFixed(2)) : 0.01
          
          selectedProducts.value.push({
            product_id: product.product_id,
            sku_id: sku.sku_id,
            product_name: product.product_name,
            sku_code: sku.sku_code,
            sku_name: sku.sku_name,
            item_number: product.item_number,
            original_price: skuPrice,
            inventory: skuInventory,
            flash_sale_price: flashSalePrice,
            flash_sale_stock: Math.min(skuInventory, 100),
            limit_per_user: 1,
            sort_order: 0
          })
          totalAdded++
        }
      })
    } else {
      // 没有选中 SKU，添加整个商品（如果没有 SKU）
      if (!product.skuList || product.skuList.length === 0) {
        const existsInSlot = existingProducts.value.some(
          item => item.product_id === product.product_id && !item.sku_id
        )
        
        if (existsInSlot) {
          totalDuplicate++
          duplicateList.push(product.product_name)
          return
        }
        
        const existsInSelected = selectedProducts.value.some(
          item => item.product_id === product.product_id && !item.sku_id
        )
        
        if (!existsInSelected) {
          const productPrice = parseFloat(product.price) || 0.01
          const productInventory = parseInt(product.inventory) || 0
          const flashSalePrice = productPrice > 0 ? parseFloat((productPrice * 0.8).toFixed(2)) : 0.01
          
          selectedProducts.value.push({
            product_id: product.product_id,
            sku_id: null,
            product_name: product.product_name,
            sku_code: null,
            sku_name: null,
            item_number: product.item_number,
            original_price: productPrice,
            inventory: productInventory,
            flash_sale_price: flashSalePrice,
            flash_sale_stock: Math.min(productInventory, 100),
            limit_per_user: 1,
            sort_order: 0
          })
          totalAdded++
        }
      }
    }
  })

  // 清空表格选择
  if (tableRef.value) {
    tableRef.value.clearSelection()
  }
  selectedTableProducts.value = []

  // 显示结果
  if (totalDuplicate > 0 && totalAdded === 0) {
    ElMessage.warning(`所有选中的商品都已存在于当前时间段：${duplicateList.join('、')}`)
  } else if (totalDuplicate > 0 && totalAdded > 0) {
    ElMessage.warning(`已添加 ${totalAdded} 个商品，${totalDuplicate} 个重复：${duplicateList.join('、')}`)
  } else if (totalAdded > 0) {
    ElMessage.success(`已批量添加 ${totalAdded} 个商品`)
  } else {
    ElMessage.warning('没有可添加的商品，请先展开商品并选择 SKU')
  }
}

/**
 * 添加商品（或 SKU）
 * @param {Object} product - 商品数据
 */
const handleAddProduct = (product) => {
  const selectedSkus = productSkuMap.value[product.product_id] || []
  
  if (selectedSkus.length > 0) {
    // 添加选中的 SKU
    let addedCount = 0
    let duplicateCount = 0
    const duplicateSkus = []
    
    selectedSkus.forEach(sku => {
      // 检查是否已在当前时间段存在
      const existsInSlot = existingProducts.value.some(
        item => item.product_id === product.product_id && item.sku_id === sku.sku_id
      )
      
      if (existsInSlot) {
        duplicateCount++
        duplicateSkus.push(sku.sku_name || sku.sku_code)
        return
      }
      
      // 检查是否已添加到待添加列表
      const existsInSelected = selectedProducts.value.some(
        item => item.product_id === product.product_id && item.sku_id === sku.sku_id
      )
      
      if (!existsInSelected) {
        // 确保价格和库存都是有效的数字
        const skuPrice = parseFloat(sku.price) || parseFloat(product.price) || 0.01
        const skuInventory = parseInt(sku.inventory) || 0
        
        // 计算秒杀价（原价的80%，但不能为0）
        const flashSalePrice = skuPrice > 0 ? parseFloat((skuPrice * 0.8).toFixed(2)) : 0.01
        
        const newItem = {
          product_id: product.product_id,
          sku_id: sku.sku_id,
          product_name: product.product_name,
          sku_code: sku.sku_code,
          sku_name: sku.sku_name,
          item_number: product.item_number,
          original_price: skuPrice,
          inventory: skuInventory,
          flash_sale_price: flashSalePrice,
          flash_sale_stock: Math.min(skuInventory, 100),
          limit_per_user: 1,
          sort_order: 0
        }
        
        selectedProducts.value.push(newItem)
        addedCount++
      }
    })
    
    if (duplicateCount > 0) {
      ElMessage.warning(`以下 SKU 已存在于当前时间段，请移除重复商品：${duplicateSkus.join('、')}`)
    } else if (addedCount > 0) {
      ElMessage.success(`已添加 ${addedCount} 个 SKU`)
    } else {
      ElMessage.warning('选中的 SKU 已全部添加到待添加列表')
    }
  } else {
    // 没有选择 SKU，检查商品是否有 SKU
    if (!product.skuList) {
      // 如果还没有加载 SKU，先加载
      loadProductSkus(product).then(() => {
        if (!product.skuList || product.skuList.length === 0) {
          // 确实没有 SKU，添加整个商品
          addWholeProduct(product)
        } else {
          // 有 SKU 但没有选择，提示用户
          ElMessage.warning('请先展开商品并选择要参与秒杀的 SKU，或者再次点击添加全部 SKU')
        }
      })
    } else if (product.skuList.length === 0) {
      // 确实没有 SKU，添加整个商品
      addWholeProduct(product)
    } else {
      // 有 SKU 但没有选择，提示用户
      ElMessage.warning('请先展开商品并选择要参与秒杀的 SKU，或者再次点击添加全部 SKU')
    }
  }
}

/**
 * 添加整个商品（没有 SKU 的情况）
 * @param {Object} product - 商品数据
 */
const addWholeProduct = (product) => {
  // 检查是否已在当前时间段存在
  const existsInSlot = existingProducts.value.some(
    item => item.product_id === product.product_id && !item.sku_id
  )
  
  if (existsInSlot) {
    ElMessage.warning(`商品"${product.product_name}"已存在于当前时间段，请移除重复商品`)
    return
  }
  
  // 检查是否已添加到待添加列表
  const existsInSelected = selectedProducts.value.some(
    item => item.product_id === product.product_id && !item.sku_id
  )
  
  if (!existsInSelected) {
    // 确保价格和库存都是有效的数字
    const productPrice = parseFloat(product.price) || 0.01
    const productInventory = parseInt(product.inventory) || 0
    
    // 计算秒杀价（原价的80%，但不能为0）
    const flashSalePrice = productPrice > 0 ? parseFloat((productPrice * 0.8).toFixed(2)) : 0.01
    
    const newItem = {
      product_id: product.product_id,
      sku_id: null,
      product_name: product.product_name,
      sku_code: null,
      sku_name: null,
      item_number: product.item_number,
      original_price: productPrice,
      inventory: productInventory,
      flash_sale_price: flashSalePrice,
      flash_sale_stock: Math.min(productInventory, 100),
      limit_per_user: 1,
      sort_order: 0
    }
    
    selectedProducts.value.push(newItem)
    ElMessage.success('已添加商品（全部 SKU）')
  } else {
    ElMessage.warning('该商品已添加到待添加列表')
  }
}

/**
 * 已选商品配置表格选择变化
 * @param {Array} selection - 选中的商品
 */
const handleSelectedProductsChange = (selection) => {
  selectedConfigProducts.value = selection
}

/**
 * 移除已选商品
 * @param {Number} index - 索引
 */
const handleRemoveProduct = (index) => {
  selectedProducts.value.splice(index, 1)
}

/**
 * 清空全部已选商品
 */
const handleClearAll = () => {
  selectedProducts.value = []
  selectedConfigProducts.value = []
  ElMessage.success('已清空全部商品')
}

/**
 * 批量设置
 */
const handleBatchSet = () => {
  const targetProducts = batchForm.value.applyRange === 'all' 
    ? selectedProducts.value 
    : selectedConfigProducts.value

  if (targetProducts.length === 0) {
    ElMessage.warning('没有可设置的商品')
    return
  }

  let updatedCount = 0

  targetProducts.forEach(product => {
    // 设置秒杀价格
    if (batchForm.value.priceType === 'fixed' && batchForm.value.fixedPrice) {
      if (batchForm.value.fixedPrice < product.original_price) {
        product.flash_sale_price = batchForm.value.fixedPrice
        updatedCount++
      }
    } else if (batchForm.value.priceType === 'discount' && batchForm.value.discountRate) {
      const discountPrice = parseFloat((product.original_price * batchForm.value.discountRate).toFixed(2))
      if (discountPrice > 0 && discountPrice < product.original_price) {
        product.flash_sale_price = discountPrice
        updatedCount++
      }
    }

    // 设置秒杀数量
    if (batchForm.value.stockType === 'fixed' && batchForm.value.fixedStock) {
      const stock = Math.min(batchForm.value.fixedStock, product.inventory)
      if (stock > 0) {
        product.flash_sale_stock = stock
        updatedCount++
      }
    } else if (batchForm.value.stockType === 'percent' && batchForm.value.stockPercent) {
      const stock = Math.floor(product.inventory * batchForm.value.stockPercent / 100)
      if (stock > 0) {
        product.flash_sale_stock = stock
        updatedCount++
      }
    }

    // 设置限购数量
    if (batchForm.value.limitType === 'fixed' && batchForm.value.fixedLimit) {
      product.limit_per_user = batchForm.value.fixedLimit
      updatedCount++
    }

    // 设置排序
    if (batchForm.value.sortType === 'fixed' && batchForm.value.fixedSort !== null) {
      product.sort_order = batchForm.value.fixedSort
      updatedCount++
    }
  })

  showBatchSetDialog.value = false
  
  // 重置批量设置表单
  batchForm.value = {
    priceType: 'none',
    fixedPrice: null,
    discountRate: 0.8,
    stockType: 'none',
    fixedStock: null,
    stockPercent: 50,
    limitType: 'none',
    fixedLimit: 1,
    sortType: 'none',
    fixedSort: 0,
    applyRange: 'all'
  }

  if (updatedCount > 0) {
    ElMessage.success(`已批量设置 ${targetProducts.length} 个商品`)
  } else {
    ElMessage.warning('没有进行任何修改')
  }
}

/**
 * 确认添加
 */
const handleConfirm = () => {
  // 验证数据
  for (const product of selectedProducts.value) {
    if (!product.flash_sale_price || product.flash_sale_price <= 0) {
      ElMessage.warning(`请设置商品"${product.product_name}"的秒杀价格`)
      return
    }
    if (product.flash_sale_price >= product.original_price) {
      ElMessage.warning(`商品"${product.product_name}"的秒杀价格必须小于原价`)
      return
    }
    if (!product.flash_sale_stock || product.flash_sale_stock <= 0) {
      ElMessage.warning(`请设置商品"${product.product_name}"的秒杀数量`)
      return
    }
    if (product.flash_sale_stock > product.inventory) {
      ElMessage.warning(`商品"${product.product_name}"的秒杀数量不能超过库存`)
      return
    }
    if (!product.limit_per_user || product.limit_per_user <= 0) {
      ElMessage.warning(`请设置商品"${product.product_name}"的限购数量`)
      return
    }
  }

  emit('confirm', selectedProducts.value)
  hide()
}

defineExpose({
  show,
  hide
})
</script>

<style scoped lang="less">
.add-product-dialog {
  :deep(.el-dialog__body) {
    padding: 20px 24px;
  }
}

.dialog-content {
  .search-bar {
    margin-bottom: 20px;
  }

  .toolbar {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 16px;
    padding: 12px 16px;
    background-color: #f5f7fa;
    border-radius: 6px;

    .tip-text {
      font-size: 13px;
      color: #909399;
    }
  }

  .sku-section {
    padding: 16px;
    background-color: #f9fafb;
    border-radius: 6px;

    .sku-title {
      font-size: 14px;
      font-weight: 600;
      color: #303133;
      margin-bottom: 12px;
    }

    .no-sku-tip {
      padding: 12px;
      text-align: center;
      color: #909399;
      font-size: 13px;
      background-color: #fff;
      border: 1px dashed #dcdfe6;
      border-radius: 4px;
    }
  }

  .no-sku-text {
    color: #909399;
    font-size: 13px;
  }

  .batch-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 24px;
    margin-bottom: 12px;
    padding: 12px 16px;
    background-color: #f5f7fa;
    border-radius: 6px;

    .batch-toolbar-left {
      display: flex;
      align-items: center;
      gap: 12px;

      .batch-title {
        font-size: 15px;
        font-weight: 600;
        color: #303133;
      }
    }

    .batch-toolbar-right {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }

  .selected-section {
    margin-top: 8px;
  }

  .tip-text {
    font-size: 13px;
    color: #909399;
  }

  :deep(.el-table) {
    .el-table__header {
      th {
        background-color: #f5f7fa;
        color: #606266;
        font-weight: 600;
      }
    }
  }

  :deep(.el-pagination) {
    justify-content: center;
    padding: 12px 0;
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
