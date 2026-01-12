<template>
  <div class="category-selector">
    <el-cascader
      v-model="selectedCategories"
      :options="categoryOptions"
      :props="cascaderProps"
      placeholder="请选择分类"
      clearable
      filterable
      style="width: 100%"
      @change="handleChange"
    />
    <div v-if="validTips" class="valid-tips">{{ validTips }}</div>
    <div v-if="selectedCategoryIds.length > 0" class="selected-list">
      <div class="selected-title">已选择 {{ selectedCategoryIds.length }} 个分类：</div>
      <el-tag
        v-for="categoryId in selectedCategoryIds"
        :key="categoryId"
        closable
        @close="removeCategory(categoryId)"
        style="margin: 5px;"
      >
        {{ getCategoryName(categoryId) }}
      </el-tag>
    </div>
  </div>
</template>

<script setup>
import { ref, toRefs, watch, onMounted, computed } from 'vue'
import $curl from '$elpisCommon/curl.js'

const props = defineProps({
  schema: { type: Object, default: () => ({}) },
  schemaKey: { type: String, default: '' },
  model: { type: Array, default: () => [] }
})

const { schema, schemaKey } = props
const { model } = toRefs(props)

const name = ref('category-selector')
const selectedCategories = ref([])
const categoryOptions = ref([])
const categoryMap = ref({})
const loading = ref(false)
const validTips = ref('')

// 级联选择器配置
const cascaderProps = {
  multiple: true,
  checkStrictly: true,
  value: 'category_id',
  label: 'category_name',
  children: 'children',
  emitPath: false
}

// 已选择的分类ID列表
const selectedCategoryIds = computed(() => {
  if (Array.isArray(selectedCategories.value)) {
    return selectedCategories.value.flat()
  }
  return []
})

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
      buildCategoryMap(res.data)
    }
  } catch (error) {
    console.error('加载分类树失败:', error)
  } finally {
    loading.value = false
  }
}

// 构建分类映射表（用于快速查找）
const buildCategoryMap = (categories) => {
  categories.forEach(category => {
    categoryMap.value[category.category_id] = category
    if (category.children && category.children.length > 0) {
      buildCategoryMap(category.children)
    }
  })
}

// 处理选择变化
const handleChange = (value) => {
  validTips.value = ''
  selectedCategories.value = value
}

// 移除分类
const removeCategory = (categoryId) => {
  const index = selectedCategoryIds.value.indexOf(categoryId)
  if (index > -1) {
    selectedCategories.value.splice(index, 1)
  }
}

// 获取分类名称
const getCategoryName = (categoryId) => {
  const category = categoryMap.value[categoryId]
  return category ? category.full_name || category.category_name : categoryId
}

// 获取值
const getValue = () => {
  return selectedCategoryIds.value.length > 0 ? { [schemaKey]: selectedCategoryIds.value } : {}
}

// 验证
const validate = () => {
  validTips.value = ''
  if (schema.option?.required && selectedCategoryIds.value.length === 0) {
    validTips.value = '请至少选择一个分类'
    return false
  }
  return true
}

// 初始化
onMounted(() => {
  // 加载分类树
  loadCategoryTree()

  if (model.value && Array.isArray(model.value) && model.value.length > 0) {
    selectedCategories.value = [...model.value]
  }
})

// 监听 model 变化
watch(model, (newVal) => {
  if (newVal && Array.isArray(newVal)) {
    selectedCategories.value = [...newVal]
  }
}, { deep: true })

defineExpose({ getValue, validate, name })
</script>

<style scoped lang="less">
.category-selector {
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
