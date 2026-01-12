<template>
  <div class="product-selector">
    <el-select
      v-model="selectedProducts"
      multiple
      filterable
      remote
      reserve-keyword
      placeholder="请搜索并选择商品"
      :remote-method="searchProducts"
      :loading="loading"
      style="width: 100%"
      @change="handleChange"
    >
      <el-option
        v-for="item in productOptions"
        :key="item.product_id"
        :label="item.product_name"
        :value="item.product_id"
      >
        <div style="display: flex; align-items: center;">
          <img
            v-if="item.product_images"
            :src="item.product_images"
            style="width: 40px; height: 40px; margin-right: 10px; object-fit: cover;"
          />
          <div>
            <div>{{ item.product_name }}</div>
            <div style="font-size: 12px; color: #999;">¥{{ item.price }}</div>
          </div>
        </div>
      </el-option>
    </el-select>
    <div v-if="validTips" class="valid-tips">{{ validTips }}</div>
    <div v-if="selectedProducts.length > 0" class="selected-list">
      <div class="selected-title">已选择 {{ selectedProducts.length }} 个商品：</div>
      <el-tag
        v-for="productId in selectedProducts"
        :key="productId"
        closable
        @close="removeProduct(productId)"
        style="margin: 5px;"
      >
        {{ getProductName(productId) }}
      </el-tag>
    </div>
  </div>
</template>

<script setup>
import { ref, toRefs, watch, onMounted } from 'vue'
import $curl from '$elpisCommon/curl.js'

const props = defineProps({
  schema: { type: Object, default: () => ({}) },
  schemaKey: { type: String, default: '' },
  model: { type: Array, default: () => [] }
})

const { schema, schemaKey } = props
const { model } = toRefs(props)

const name = ref('product-selector')
const selectedProducts = ref([])
const productOptions = ref([])
const loading = ref(false)
const validTips = ref('')

// 搜索商品
const searchProducts = async (query) => {
  if (!query) {
    productOptions.value = []
    return
  }

  loading.value = true
  try {
    const res = await $curl({
      method: 'get',
      url: '/api/proj/product/list',
      params: {
        product_name: query,
        page: 1,
        pageSize: 20
      }
    })

    if (res && res.success && res.data) {
      productOptions.value = res.data
    }
  } catch (error) {
    console.error('搜索商品失败:', error)
  } finally {
    loading.value = false
  }
}

// 处理选择变化
const handleChange = () => {
  validTips.value = ''
}

// 移除商品
const removeProduct = (productId) => {
  const index = selectedProducts.value.indexOf(productId)
  if (index > -1) {
    selectedProducts.value.splice(index, 1)
  }
}

// 获取商品名称
const getProductName = (productId) => {
  const product = productOptions.value.find(p => p.product_id === productId)
  return product ? product.product_name : productId
}

// 获取值
const getValue = () => {
  return selectedProducts.value.length > 0 ? { [schemaKey]: selectedProducts.value } : {}
}

// 验证
const validate = () => {
  validTips.value = ''
  if (schema.option?.required && selectedProducts.value.length === 0) {
    validTips.value = '请至少选择一个商品'
    return false
  }
  return true
}

// 初始化
onMounted(() => {
  if (model.value && Array.isArray(model.value) && model.value.length > 0) {
    selectedProducts.value = [...model.value]
    // 加载已选商品的详情
    loadSelectedProducts()
  }
})

// 加载已选商品的详情
const loadSelectedProducts = async () => {
  if (selectedProducts.value.length === 0) return

  try {
    const res = await $curl({
      method: 'get',
      url: '/api/proj/product/list',
      params: {
        page: 1,
        pageSize: 100
      }
    })

    if (res && res.success && res.data) {
      const allProducts = res.data
      productOptions.value = allProducts.filter(p => 
        selectedProducts.value.includes(p.product_id)
      )
    }
  } catch (error) {
    console.error('加载商品详情失败:', error)
  }
}

// 监听 model 变化
watch(model, (newVal) => {
  if (newVal && Array.isArray(newVal)) {
    selectedProducts.value = [...newVal]
    loadSelectedProducts()
  }
}, { deep: true })

defineExpose({ getValue, validate, name })
</script>

<style scoped lang="less">
.product-selector {
  width: 100%;

  .valid-tips {
    color: #f56c6c;
    font-size: 12px;
    margin-top: 5px;
  }

  .selected-list {
    margin-top: 10px;
    padding: 10px;
    background-color: #f5f7fa;
    border-radius: 4px;

    .selected-title {
      font-size: 14px;
      color: #606266;
      margin-bottom: 5px;
    }
  }
}
</style>
