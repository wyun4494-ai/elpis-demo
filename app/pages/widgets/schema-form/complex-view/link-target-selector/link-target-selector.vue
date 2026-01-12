<template>
  <div class="link-target-selector">
    <div class="link-type-selector">
      <el-select
        v-model="linkType"
        placeholder="请选择链接类型"
        style="width: 100%"
        @change="handleLinkTypeChange"
      >
        <el-option label="商品" :value="1" />
        <el-option label="分类" :value="2" />
        <el-option label="品牌" :value="3" />
        <el-option label="专题" :value="4" />
        <el-option label="外部链接" :value="5" />
      </el-select>
    </div>

    <div v-if="linkType" class="link-target-input" style="margin-top: 10px;">
      <!-- 商品选择 -->
      <el-select
        v-if="linkType === 1"
        v-model="linkTarget"
        filterable
        remote
        reserve-keyword
        placeholder="请搜索并选择商品"
        :remote-method="searchProducts"
        :loading="loading"
        style="width: 100%"
        @change="handleTargetChange"
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
              style="width: 30px; height: 30px; margin-right: 10px; object-fit: cover;"
            />
            <span>{{ item.product_name }}</span>
          </div>
        </el-option>
      </el-select>

      <!-- 分类选择 -->
      <el-cascader
        v-else-if="linkType === 2"
        v-model="linkTarget"
        :options="categoryOptions"
        :props="cascaderProps"
        placeholder="请选择分类"
        clearable
        filterable
        style="width: 100%"
        @change="handleTargetChange"
      />

      <!-- 品牌选择 -->
      <el-select
        v-else-if="linkType === 3"
        v-model="linkTarget"
        filterable
        remote
        reserve-keyword
        placeholder="请搜索并选择品牌"
        :remote-method="searchBrands"
        :loading="loading"
        style="width: 100%"
        @change="handleTargetChange"
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
              style="width: 30px; height: 30px; margin-right: 10px; object-fit: cover; border-radius: 4px;"
            />
            <span>{{ item.brand_name }}</span>
          </div>
        </el-option>
      </el-select>

      <!-- 专题选择 -->
      <el-select
        v-else-if="linkType === 4"
        v-model="linkTarget"
        filterable
        remote
        reserve-keyword
        placeholder="请搜索并选择专题"
        :remote-method="searchTopics"
        :loading="loading"
        style="width: 100%"
        @change="handleTargetChange"
      >
        <el-option
          v-for="item in topicOptions"
          :key="item.topic_id"
          :label="item.topic_name"
          :value="item.topic_id"
        />
      </el-select>

      <!-- 外部链接 -->
      <el-input
        v-else-if="linkType === 5"
        v-model="linkTarget"
        placeholder="请输入外部链接URL"
        @input="handleTargetChange"
      />
    </div>

    <div v-if="validTips" class="valid-tips">{{ validTips }}</div>
  </div>
</template>

<script setup>
import { ref, toRefs, watch, onMounted } from 'vue'
import $curl from '$elpisCommon/curl.js'

const props = defineProps({
  schema: { type: Object, default: () => ({}) },
  schemaKey: { type: String, default: '' },
  model: { type: Object, default: () => ({}) }
})

const { schema, schemaKey } = props
const { model } = toRefs(props)

const name = ref('link-target-selector')
const linkType = ref(null)
const linkTarget = ref('')
const loading = ref(false)
const validTips = ref('')

// 选项数据
const productOptions = ref([])
const brandOptions = ref([])
const topicOptions = ref([])
const categoryOptions = ref([])

// 级联选择器配置
const cascaderProps = {
  checkStrictly: true,
  value: 'category_id',
  label: 'category_name',
  children: 'children',
  emitPath: false
}

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

// 搜索品牌
const searchBrands = async (query) => {
  loading.value = true
  try {
    const res = await $curl({
      method: 'get',
      url: '/api/proj/brand/list',
      params: {
        brand_name: query || '',
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

// 搜索专题
const searchTopics = async (query) => {
  loading.value = true
  try {
    const res = await $curl({
      method: 'get',
      url: '/api/proj/topic-recommend/list',
      params: {
        topic_name: query || '',
        page: 1,
        pageSize: 50
      }
    })

    if (res && res.success && res.data) {
      topicOptions.value = res.data
    }
  } catch (error) {
    console.error('搜索专题失败:', error)
  } finally {
    loading.value = false
  }
}

// 加载分类树
const loadCategoryTree = async () => {
  loading.value = true
  try {
    const res = await $curl({
      method: 'get',
      url: '/api/proj/category/tree',
      params: {}
    })

    if (res && res.success && res.data) {
      categoryOptions.value = res.data
    }
  } catch (error) {
    console.error('加载分类树失败:', error)
  } finally {
    loading.value = false
  }
}

// 处理链接类型变化
const handleLinkTypeChange = () => {
  linkTarget.value = ''
  validTips.value = ''

  // 根据类型加载数据
  if (linkType.value === 2) {
    loadCategoryTree()
  } else if (linkType.value === 3) {
    searchBrands('')
  } else if (linkType.value === 4) {
    searchTopics('')
  }
}

// 处理目标变化
const handleTargetChange = () => {
  validTips.value = ''
}

// 获取值
const getValue = () => {
  const result = {}
  if (linkType.value) {
    result.link_type = linkType.value
  }
  if (linkTarget.value) {
    result.link_target = linkTarget.value
  }
  return result
}

// 验证
const validate = () => {
  validTips.value = ''
  if (schema.option?.required) {
    if (!linkType.value) {
      validTips.value = '请选择链接类型'
      return false
    }
    if (!linkTarget.value) {
      validTips.value = '请选择或输入链接目标'
      return false
    }
  }
  return true
}

// 初始化
onMounted(() => {
  if (model.value && typeof model.value === 'object') {
    if (model.value.link_type) {
      linkType.value = model.value.link_type
      handleLinkTypeChange()
    }
    if (model.value.link_target) {
      linkTarget.value = model.value.link_target
    }
  }
})

// 监听 model 变化
watch(model, (newVal) => {
  if (newVal && typeof newVal === 'object') {
    if (newVal.link_type) {
      linkType.value = newVal.link_type
    }
    if (newVal.link_target) {
      linkTarget.value = newVal.link_target
    }
  }
}, { deep: true })

defineExpose({ getValue, validate, name })
</script>

<style scoped lang="less">
.link-target-selector {
  width: 100%;

  .valid-tips {
    color: #f56c6c;
    font-size: 12px;
    margin-top: 5px;
  }
}
</style>
