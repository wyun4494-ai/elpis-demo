<template>
  <div class="ad-position-selector">
    <el-select
      v-model="selectedPosition"
      filterable
      allow-create
      default-first-option
      placeholder="请选择或输入广告位置"
      style="width: 100%"
      @change="handleChange"
    >
      <el-option
        v-for="item in positionOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <div v-if="validTips" class="valid-tips">{{ validTips }}</div>
    <div class="position-hint">
      <div v-if="selectedPositionInfo && selectedPositionInfo.position_desc" class="info-item">
        <span class="label">描述：</span>{{ selectedPositionInfo.position_desc }}
      </div>
      <div v-if="selectedPositionInfo && selectedPositionInfo.width && selectedPositionInfo.height" class="info-item">
        <span class="label">建议尺寸：</span>{{ selectedPositionInfo.width }} × {{ selectedPositionInfo.height }} 像素
      </div>
      <div v-if="!selectedPositionInfo" class="info-item">
        支持选择预定义位置或自定义输入新位置
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, toRefs, watch, onMounted, computed } from 'vue'
import $curl from '$elpisCommon/curl.js'

const props = defineProps({
  schema: { type: Object, default: () => ({}) },
  schemaKey: { type: String, default: '' },
  model: { type: String, default: '' }
})

const { schema, schemaKey } = props
const { model } = toRefs(props)

const name = ref('ad-position-selector')
const selectedPosition = ref('')
const positionOptions = ref([])
const loading = ref(false)
const validTips = ref('')

// 当前选中的位置信息
const selectedPositionInfo = computed(() => {
  if (!selectedPosition.value) return null
  return positionOptions.value.find(p => p.value === selectedPosition.value)
})

// 加载广告位置列表
const loadPositions = async () => {
  loading.value = true
  try {
    const res = await $curl({
      method: 'get',
      url: '/api/proj/ad-position/all',
      params: {}
    })

    if (res && res.success && res.data) {
      positionOptions.value = res.data.map(item => ({
        label: item.position_name,
        value: item.position_key,
        ...item
      }))
    }
  } catch (error) {
    console.error('加载广告位置失败:', error)
    // 如果加载失败，使用默认选项
    positionOptions.value = [
      { label: '首页轮播图', value: 'home_banner' },
      { label: '首页侧边栏', value: 'home_sidebar' },
      { label: '分类页顶部', value: 'category_top' },
      { label: '商品详情页', value: 'product_detail' }
    ]
  } finally {
    loading.value = false
  }
}

// 处理选择变化
const handleChange = () => {
  validTips.value = ''
}

// 获取值
const getValue = () => {
  return selectedPosition.value ? { [schemaKey]: selectedPosition.value } : {}
}

// 验证
const validate = () => {
  validTips.value = ''
  if (schema.option?.required && !selectedPosition.value) {
    validTips.value = '请选择或输入广告位置'
    return false
  }
  return true
}

// 初始化
onMounted(() => {
  // 加载广告位置列表
  loadPositions()

  // 设置初始值
  if (model.value) {
    selectedPosition.value = model.value
  }
})

// 监听 model 变化
watch(model, (newVal) => {
  if (newVal) {
    selectedPosition.value = newVal
  }
})

defineExpose({ getValue, validate, name })
</script>

<style scoped lang="less">
.ad-position-selector {
  width: 100%;

  .valid-tips {
    color: #f56c6c;
    font-size: 12px;
    margin-top: 5px;
  }

  .position-hint {
    font-size: 12px;
    color: #909399;
    margin-top: 8px;
    padding: 8px;
    background-color: #f5f7fa;
    border-radius: 4px;
    line-height: 1.5;

    .info-item {
      margin-bottom: 4px;

      &:last-child {
        margin-bottom: 0;
      }

      .label {
        font-weight: 500;
        color: #606266;
      }
    }
  }
}
</style>
