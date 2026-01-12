<template>
  <div class="brand-selector">
    <el-select
      v-model="selectedBrands"
      multiple
      filterable
      remote
      reserve-keyword
      placeholder="请搜索并选择品牌"
      :remote-method="searchBrands"
      :loading="loading"
      style="width: 100%"
      @change="handleChange"
    >
      <el-option
        v-for="item in brandOptions"
        :key="item.brand_id"
        :label="item.brand_name"
        :value="item.brand_id"
      >
        <div style="display: flex; align-items: center;">
          <img
            v-if="item.logo_url"
            :src="item.logo_url"
            style="width: 40px; height: 40px; margin-right: 10px; object-fit: cover; border-radius: 4px;"
          />
          <div>
            <div>{{ item.brand_name }}</div>
            <div style="font-size: 12px; color: #999;">{{ item.brand_name_en }}</div>
          </div>
        </div>
      </el-option>
    </el-select>
    <div v-if="validTips" class="valid-tips">{{ validTips }}</div>
    <div v-if="selectedBrands.length > 0" class="selected-list">
      <div class="selected-title">已选择 {{ selectedBrands.length }} 个品牌：</div>
      <el-tag
        v-for="brandId in selectedBrands"
        :key="brandId"
        closable
        @close="removeBrand(brandId)"
        style="margin: 5px;"
      >
        {{ getBrandName(brandId) }}
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

const name = ref('brand-selector')
const selectedBrands = ref([])
const brandOptions = ref([])
const loading = ref(false)
const validTips = ref('')

// 搜索品牌
const searchBrands = async (query) => {
  if (!query) {
    // 如果没有查询关键词，加载所有品牌
    loadAllBrands()
    return
  }

  loading.value = true
  try {
    const res = await $curl({
      method: 'get',
      url: '/api/proj/brand/list',
      params: {
        brand_name: query,
        page: 1,
        pageSize: 50
      }
    })

    if (res && res.success && res.data) {
      brandOptions.value = res.data
    }
  } catch (error) {
    console.error('搜索品牌失败:', error)
  } finally {
    loading.value = false
  }
}

// 加载所有品牌
const loadAllBrands = async () => {
  loading.value = true
  try {
    const res = await $curl({
      method: 'get',
      url: '/api/proj/brand/list',
      params: {
        page: 1,
        pageSize: 100
      }
    })

    if (res && res.success && res.data) {
      brandOptions.value = res.data
    }
  } catch (error) {
    console.error('加载品牌列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 处理选择变化
const handleChange = () => {
  validTips.value = ''
}

// 移除品牌
const removeBrand = (brandId) => {
  const index = selectedBrands.value.indexOf(brandId)
  if (index > -1) {
    selectedBrands.value.splice(index, 1)
  }
}

// 获取品牌名称
const getBrandName = (brandId) => {
  const brand = brandOptions.value.find(b => b.brand_id === brandId)
  return brand ? brand.brand_name : brandId
}

// 获取值
const getValue = () => {
  return selectedBrands.value.length > 0 ? { [schemaKey]: selectedBrands.value } : {}
}

// 验证
const validate = () => {
  validTips.value = ''
  if (schema.option?.required && selectedBrands.value.length === 0) {
    validTips.value = '请至少选择一个品牌'
    return false
  }
  return true
}

// 初始化
onMounted(() => {
  // 加载所有品牌
  loadAllBrands()

  if (model.value && Array.isArray(model.value) && model.value.length > 0) {
    selectedBrands.value = [...model.value]
  }
})

// 监听 model 变化
watch(model, (newVal) => {
  if (newVal && Array.isArray(newVal)) {
    selectedBrands.value = [...newVal]
  }
}, { deep: true })

defineExpose({ getValue, validate, name })
</script>

<style scoped lang="less">
.brand-selector {
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
