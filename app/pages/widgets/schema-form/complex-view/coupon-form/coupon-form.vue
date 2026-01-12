<template>
  <div class="coupon-form">
    <!-- 优惠券类型 -->
    <el-form-item label="优惠券类型" required>
      <el-select 
        v-model="formData.coupon_type" 
        placeholder="请选择优惠券类型"
        @change="handleTypeChange"
      >
        <el-option label="满减券" :value="1" />
        <el-option label="折扣券" :value="2" />
        <el-option label="无门槛券" :value="3" />
      </el-select>
      <div class="field-tip">{{ getTypeTip() }}</div>
    </el-form-item>

    <!-- 满减券字段 -->
    <template v-if="formData.coupon_type === 1">
      <el-form-item label="优惠金额（元）" required>
        <el-input-number 
          v-model="formData.discount_amount" 
          :min="0.01" 
          :precision="2" 
          :step="1"
          placeholder="如：20"
        />
        <div class="field-tip">用户可减免的金额</div>
      </el-form-item>

      <el-form-item label="最低消费（元）" required>
        <el-input-number 
          v-model="formData.min_amount" 
          :min="0.01" 
          :precision="2" 
          :step="1"
          placeholder="如：100"
        />
        <div class="field-tip">订单需达到此金额才能使用（满减券必须设置）</div>
      </el-form-item>
    </template>

    <!-- 折扣券字段 -->
    <template v-if="formData.coupon_type === 2">
      <el-form-item label="折扣率" required>
        <el-input-number 
          v-model="formData.discount_rate" 
          :min="0.01" 
          :max="0.99" 
          :precision="2" 
          :step="0.1"
          placeholder="如：0.8"
        />
        <div class="field-tip">0.8表示8折，0.5表示5折</div>
      </el-form-item>

      <el-form-item label="最高优惠（元）">
        <el-input-number 
          v-model="formData.max_discount" 
          :min="0" 
          :precision="2" 
          :step="1"
          placeholder="如：50"
        />
        <div class="field-tip">限制最高优惠金额，填0表示不限制</div>
      </el-form-item>
    </template>

    <!-- 无门槛券字段 -->
    <template v-if="formData.coupon_type === 3">
      <el-form-item label="优惠金额（元）" required>
        <el-input-number 
          v-model="formData.discount_amount" 
          :min="0.01" 
          :precision="2" 
          :step="1"
          placeholder="如：10"
        />
        <div class="field-tip">用户可直接减免的金额</div>
      </el-form-item>
    </template>

    <!-- 通用字段 -->
    <el-form-item label="发行总量">
      <el-input-number 
        v-model="formData.total_count" 
        :min="0" 
        placeholder="如：1000"
      />
      <div class="field-tip">可被领取的总数量，填0表示不限制</div>
    </el-form-item>

    <el-form-item label="每人限领">
      <el-input-number 
        v-model="formData.limit_per_user" 
        :min="0" 
        placeholder="如：1"
      />
      <div class="field-tip">每个用户最多可领取数量，填0表示不限制</div>
    </el-form-item>

    <!-- 有效期设置 -->
    <el-form-item label="有效期类型" required>
      <el-radio-group v-model="validityType" @change="handleValidityTypeChange">
        <el-radio :label="1">固定时间</el-radio>
        <el-radio :label="2">领取后N天</el-radio>
      </el-radio-group>
    </el-form-item>

    <!-- 固定时间模式 -->
    <template v-if="validityType === 1">
      <el-form-item label="开始时间" required>
        <el-date-picker
          v-model="formData.start_time"
          type="datetime"
          placeholder="请选择开始时间"
          format="YYYY-MM-DD HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </el-form-item>

      <el-form-item label="结束时间" required>
        <el-date-picker
          v-model="formData.end_time"
          type="datetime"
          placeholder="请选择结束时间"
          format="YYYY-MM-DD HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </el-form-item>
    </template>

    <!-- 领取后N天模式 -->
    <template v-if="validityType === 2">
      <el-form-item label="有效天数" required>
        <el-input-number 
          v-model="formData.valid_days" 
          :min="1" 
          placeholder="如：7"
        />
        <div class="field-tip">用户领取后N天内有效</div>
      </el-form-item>
    </template>

    <!-- 可使用商品 -->
    <el-form-item label="可使用商品" required>
      <el-radio-group v-model="applicableType" @change="handleApplicableTypeChange">
        <el-radio-button label="all">全场通用</el-radio-button>
        <el-radio-button label="category">指定分类</el-radio-button>
        <el-radio-button label="product">指定商品</el-radio-button>
      </el-radio-group>
    </el-form-item>

    <!-- 指定分类 -->
    <template v-if="applicableType === 'category'">
      <el-form-item label="选择分类">
        <div class="applicable-selector">
          <el-cascader
            v-model="selectedCategory"
            :options="categoryOptions"
            :props="cascaderProps"
            placeholder="请选择分类名称"
            clearable
            filterable
            style="width: 300px; margin-right: 10px;"
          />
          <el-button type="primary" @click="addCategory">添加</el-button>
        </div>
        <div class="field-tip">选择后点击"添加"按钮</div>
      </el-form-item>

      <!-- 已选分类列表 -->
      <el-form-item label="已选分类">
        <el-table :data="selectedCategories" border style="width: 100%">
          <el-table-column prop="category_name" label="分类名称" />
          <el-table-column label="操作" width="100">
            <template #default="{ $index }">
              <el-button type="danger" size="small" @click="removeCategory($index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div v-if="selectedCategories.length === 0" class="empty-tip">暂无数据</div>
      </el-form-item>
    </template>

    <!-- 指定商品 -->
    <template v-if="applicableType === 'product'">
      <el-form-item label="搜索商品">
        <div class="applicable-selector">
          <el-select
            v-model="selectedProduct"
            filterable
            remote
            reserve-keyword
            placeholder="请输入商品名称/货号"
            :remote-method="searchProducts"
            :loading="productLoading"
            style="width: 300px; margin-right: 10px;"
            value-key="product_id"
          >
            <el-option
              v-for="item in productOptions"
              :key="item.product_id"
              :label="`${item.product_name} (${item.item_number || '无货号'})`"
              :value="item"
            />
          </el-select>
          <el-button type="primary" @click="addProduct">添加</el-button>
        </div>
        <div class="field-tip">输入商品名称或货号搜索，选择后点击"添加"按钮</div>
      </el-form-item>

      <!-- 已选商品列表 -->
      <el-form-item label="已选商品">
        <el-table :data="selectedProducts" border style="width: 100%">
          <el-table-column prop="product_name" label="商品名称" />
          <el-table-column prop="item_number" label="货号" width="150" />
          <el-table-column label="操作" width="100">
            <template #default="{ $index }">
              <el-button type="danger" size="small" @click="removeProduct($index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div v-if="selectedProducts.length === 0" class="empty-tip">暂无数据</div>
      </el-form-item>
    </template>

    <el-form-item label="使用说明">
      <el-input 
        v-model="formData.description" 
        type="textarea" 
        :rows="3"
        placeholder="请输入使用说明"
      />
    </el-form-item>

    <el-form-item label="排序">
      <el-input-number 
        v-model="formData.sort_order" 
        placeholder="数字越小越靠前"
      />
    </el-form-item>
  </div>
</template>

<script setup>
import { ref, toRefs, watch, onMounted, inject } from 'vue'
import { ElMessage } from 'element-plus'
import $curl from '$elpisCommon/curl.js'

const props = defineProps({
  schema: { type: Object, default: () => ({}) },
  schemaKey: { type: String, default: '' },
  model: { type: Object, default: () => ({}) }
})

const { schema, schemaKey } = props
const { model } = toRefs(props)

const name = ref('coupon-form')
const validTips = ref('')

// 表单数据
const formData = ref({
  coupon_type: 1, // 默认满减券
  discount_amount: 0,
  discount_rate: 0,
  min_amount: 0,
  max_discount: 0,
  total_count: 0,
  limit_per_user: 1,
  valid_days: 0,
  start_time: null,
  end_time: null,
  description: '',
  sort_order: 0
})

// 有效期类型：1-固定时间，2-领取后N天
const validityType = ref(1)

// 适用范围类型：all-全场通用，category-指定分类，product-指定商品
const applicableType = ref('all')

// 分类相关
const categoryOptions = ref([])
const selectedCategory = ref(null)
const selectedCategories = ref([])
const cascaderProps = {
  value: 'category_id',
  label: 'category_name',
  children: 'children',
  checkStrictly: true,
  emitPath: false
}

// 商品相关
const productOptions = ref([])
const selectedProduct = ref(null)
const selectedProducts = ref([])
const productLoading = ref(false)

// 初始化数据
onMounted(async () => {
  // 加载分类数据
  await loadCategories()

  // 加载编辑数据（如果有）
  loadEditData()
})

// 加载编辑数据
const loadEditData = () => {
  if (model.value && Object.keys(model.value).length > 0) {
    // 编辑模式，加载现有数据
    Object.keys(formData.value).forEach(key => {
      if (model.value[key] !== undefined && model.value[key] !== null) {
        formData.value[key] = model.value[key]
      }
    })

    // 判断有效期类型（优先判断 valid_days，因为它更明确）
    if (model.value.valid_days && Number(model.value.valid_days) > 0) {
      validityType.value = 2  // 领取后N天
      formData.value.valid_days = Number(model.value.valid_days)
      // 清空固定时间字段
      formData.value.start_time = null
      formData.value.end_time = null
    } else if (model.value.start_time && model.value.end_time) {
      validityType.value = 1  // 固定时间
      formData.value.start_time = model.value.start_time
      formData.value.end_time = model.value.end_time
      // 清空有效天数
      formData.value.valid_days = 0
    } else {
      // 默认固定时间
      validityType.value = 1
    }

    // 加载适用范围数据
    if (model.value.applicable_categories && model.value.applicable_categories.length > 0) {
      applicableType.value = 'category'
      selectedCategories.value = model.value.applicable_categories
    } else if (model.value.applicable_products && model.value.applicable_products.length > 0) {
      applicableType.value = 'product'
      selectedProducts.value = model.value.applicable_products
    } else {
      applicableType.value = 'all'
    }
  }
}

// 监听 model 变化，重新加载数据
watch(model, (newVal) => {
  if (newVal && Object.keys(newVal).length > 0) {
    loadEditData()
  }
}, { deep: true, immediate: true })

// 加载分类数据
const loadCategories = async () => {
  try {
    const res = await $curl({
      method: 'get',
      url: '/api/proj/category/children'
    })
    
    if (res && res.success && res.data) {
      categoryOptions.value = res.data
    } else {
      ElMessage.error('加载分类数据失败')
    }
  } catch (error) {
    ElMessage.error('加载分类数据失败，请稍后重试')
  }
}

// 搜索商品
const searchProducts = async (query) => {
  if (!query) {
    productOptions.value = []
    return
  }

  productLoading.value = true
  try {
    const res = await $curl({
      method: 'get',
      url: '/api/proj/product/search',
      params: { keyword: query }
    })
    
    if (res && res.success && Array.isArray(res.data)) {
      productOptions.value = res.data
    } else {
      productOptions.value = []
    }
  } catch (error) {
    productOptions.value = []
  } finally {
    productLoading.value = false
  }
}

// 添加分类
const addCategory = () => {
  if (!selectedCategory.value) {
    ElMessage.warning('请先选择分类')
    return
  }

  // 查找分类信息
  const findCategory = (options, id) => {
    for (const option of options) {
      if (option.category_id === id) {
        return option
      }
      if (option.children && option.children.length > 0) {
        const found = findCategory(option.children, id)
        if (found) return found
      }
    }
    return null
  }

  const category = findCategory(categoryOptions.value, selectedCategory.value)
  if (!category) {
    ElMessage.warning('未找到分类信息')
    return
  }

  // 检查是否已添加
  const exists = selectedCategories.value.some(item => item.category_id === category.category_id)
  if (exists) {
    ElMessage.warning('该分类已添加')
    return
  }

  selectedCategories.value.push({
    category_id: category.category_id,
    category_name: category.full_name || category.category_name
  })

  selectedCategory.value = null
  ElMessage.success('添加成功')
}

// 删除分类
const removeCategory = (index) => {
  selectedCategories.value.splice(index, 1)
}

// 添加商品
const addProduct = () => {
  if (!selectedProduct.value) {
    ElMessage.warning('请先选择商品')
    return
  }

  // 检查是否已添加
  const exists = selectedProducts.value.some(item => item.product_id === selectedProduct.value.product_id)
  if (exists) {
    ElMessage.warning('该商品已添加')
    return
  }

  selectedProducts.value.push({
    product_id: selectedProduct.value.product_id,
    product_name: selectedProduct.value.product_name,
    item_number: selectedProduct.value.item_number || '无货号'
  })

  selectedProduct.value = null
  ElMessage.success('添加成功')
}

// 删除商品
const removeProduct = (index) => {
  selectedProducts.value.splice(index, 1)
}

// 适用范围类型改变
const handleApplicableTypeChange = (type) => {
  // 清空之前的选择
  if (type !== 'category') {
    selectedCategories.value = []
  }
  if (type !== 'product') {
    selectedProducts.value = []
  }
}

// 优惠券类型改变时，清空不相关字段
const handleTypeChange = (type) => {
  if (type === 1) {
    // 满减券：清空折扣率和最高优惠
    formData.value.discount_rate = 0
    formData.value.max_discount = 0
  } else if (type === 2) {
    // 折扣券：清空优惠金额和最低消费
    formData.value.discount_amount = 0
    formData.value.min_amount = 0
  } else if (type === 3) {
    // 无门槛券：清空折扣率、最高优惠、最低消费
    formData.value.discount_rate = 0
    formData.value.max_discount = 0
    formData.value.min_amount = 0
  }
}

// 有效期类型改变时，清空不相关字段
const handleValidityTypeChange = (type) => {
  if (type === 1) {
    // 固定时间：清空有效天数
    formData.value.valid_days = 0
  } else if (type === 2) {
    // 领取后N天：清空开始结束时间
    formData.value.start_time = null
    formData.value.end_time = null
  }
}

// 获取类型提示
const getTypeTip = () => {
  const tips = {
    1: '满减券：订单满足最低消费金额后可减免固定金额',
    2: '折扣券：订单按折扣率计算优惠，可设置最高优惠限制',
    3: '无门槛券：无需满足条件，直接减免固定金额'
  }
  return tips[formData.value.coupon_type] || ''
}

// 获取表单值
const getValue = () => {
  // 处理适用范围数据
  let applicable_products = null
  let applicable_categories = null

  if (applicableType.value === 'category') {
    applicable_categories = selectedCategories.value.map(item => ({
      category_id: item.category_id,
      category_name: item.category_name
    }))
  } else if (applicableType.value === 'product') {
    applicable_products = selectedProducts.value.map(item => ({
      product_id: item.product_id,
      product_name: item.product_name,
      item_number: item.item_number
    }))
  }

  // 返回 coupon_config 对象，包含所有配置字段
  return { 
    coupon_config: {
      coupon_type: formData.value.coupon_type,
      discount_amount: formData.value.discount_amount,
      discount_rate: formData.value.discount_rate,
      min_amount: formData.value.min_amount,
      max_discount: formData.value.max_discount,
      total_count: formData.value.total_count,
      limit_per_user: formData.value.limit_per_user,
      valid_days: formData.value.valid_days,
      start_time: formData.value.start_time,
      end_time: formData.value.end_time,
      applicable_products: applicable_products,
      applicable_categories: applicable_categories,
      description: formData.value.description,
      sort_order: formData.value.sort_order
    }
  }
}

// 验证表单
const validate = () => {
  validTips.value = ''

  // 验证优惠券类型
  if (!formData.value.coupon_type) {
    validTips.value = '请选择优惠券类型'
    ElMessage.warning(validTips.value)
    return false
  }

  // 根据类型验证必填字段
  if (formData.value.coupon_type === 1) {
    // 满减券
    if (!formData.value.discount_amount || formData.value.discount_amount <= 0) {
      validTips.value = '请输入优惠金额'
      ElMessage.warning(validTips.value)
      return false
    }
    if (!formData.value.min_amount || formData.value.min_amount <= 0) {
      validTips.value = '满减券必须设置最低消费金额（必须大于0）'
      ElMessage.warning(validTips.value)
      return false
    }
    if (formData.value.discount_amount >= formData.value.min_amount) {
      validTips.value = '优惠金额不能大于等于最低消费金额'
      ElMessage.warning(validTips.value)
      return false
    }
  } else if (formData.value.coupon_type === 2) {
    // 折扣券
    if (!formData.value.discount_rate || formData.value.discount_rate <= 0 || formData.value.discount_rate >= 1) {
      validTips.value = '请输入正确的折扣率（0.01-0.99）'
      ElMessage.warning(validTips.value)
      return false
    }
  } else if (formData.value.coupon_type === 3) {
    // 无门槛券
    if (!formData.value.discount_amount || formData.value.discount_amount <= 0) {
      validTips.value = '请输入优惠金额'
      ElMessage.warning(validTips.value)
      return false
    }
  }

  // 验证有效期
  if (validityType.value === 1) {
    // 固定时间模式
    if (!formData.value.start_time || !formData.value.end_time) {
      validTips.value = '请选择开始时间和结束时间'
      ElMessage.warning(validTips.value)
      return false
    }
    if (new Date(formData.value.start_time) >= new Date(formData.value.end_time)) {
      validTips.value = '结束时间必须大于开始时间'
      ElMessage.warning(validTips.value)
      return false
    }
  } else if (validityType.value === 2) {
    // 领取后N天模式
    if (!formData.value.valid_days || formData.value.valid_days <= 0) {
      validTips.value = '请输入有效天数'
      ElMessage.warning(validTips.value)
      return false
    }
  }

  // 验证适用范围
  if (applicableType.value === 'category' && selectedCategories.value.length === 0) {
    validTips.value = '请至少选择一个分类'
    ElMessage.warning(validTips.value)
    return false
  }

  if (applicableType.value === 'product' && selectedProducts.value.length === 0) {
    validTips.value = '请至少选择一个商品'
    ElMessage.warning(validTips.value)
    return false
  }

  return true
}

defineExpose({ getValue, validate, name })
</script>

<style scoped lang="less">
.coupon-form {
  .field-tip {
    font-size: 12px;
    color: #909399;
    margin-top: 4px;
    line-height: 1.5;
  }

  .applicable-selector {
    display: flex;
    align-items: center;
  }

  .empty-tip {
    text-align: center;
    padding: 20px;
    color: #909399;
    font-size: 14px;
  }

  :deep(.el-form-item) {
    margin-bottom: 22px;
  }

  :deep(.el-input-number) {
    width: 100%;
  }

  :deep(.el-date-editor) {
    width: 100%;
  }

  :deep(.el-radio-button__inner) {
    padding: 12px 20px;
  }
}
</style>
