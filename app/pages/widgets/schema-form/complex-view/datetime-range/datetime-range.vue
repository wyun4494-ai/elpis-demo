<template>
  <el-row
    type="flex"
    align="top"
    class="form-item"
  >
    <!-- label -->
    <el-row
      class="item-label"
      justify="start"
    >
      <el-row 
        v-if="schema.option?.required"
        type="flex"
        class="required"
      >
        *
      </el-row>
      {{ schema.label }}
    </el-row>
    <!-- value -->
    <el-row
      class="item-value"
    >
      <el-date-picker
        v-model="dateRange"
        type="datetimerange"
        class="component"
        :class=" validTips ? 'valid-border' : '' "
        :placeholder="schema.option?.placeholder || '请选择日期时间范围'"
        :start-placeholder="schema.option?.startPlaceholder || '开始时间'"
        :end-placeholder="schema.option?.endPlaceholder || '结束时间'"
        :disabled="schema.option?.disabled"
        :format="schema.option?.format || 'YYYY-MM-DD HH:mm:ss'"
        :value-format="schema.option?.valueFormat || 'YYYY-MM-DD HH:mm:ss'"
        @change="onChange"
        @focus="onFocus"
        @blur="onBlur"
      />
    </el-row>
    <el-row
      v-if="validTips"
      class="valid-tips"
    >
      {{ validTips }}
    </el-row>
  </el-row>
</template>

<script setup>
import { ref, toRefs, watch, onMounted, computed } from 'vue'

const props = defineProps({
  schema: {
    type: Object,
    default: () => ({})
  },
  schemaKey: {
    type: String,
    default: ''
  },
  model: {
    type: [String, Number, Boolean, Object, Array],
    default: undefined
  }
})

const { schema, schemaKey } = props
const { model } = toRefs(props)

const name = ref('datetime-range')
const dateRange = ref([])
const validTips = ref('')

// 获取配置的 startKey 和 endKey
const startKey = computed(() => schema.option?.startKey || `${schemaKey}_start`)
const endKey = computed(() => schema.option?.endKey || `${schemaKey}_end`)

/**
 * 初始化数据
 */
const initData = () => {
  // 如果 model 是数组，直接使用
  if (Array.isArray(model.value) && model.value.length === 2) {
    dateRange.value = model.value
  } 
  // 如果 model 是对象，从 startKey 和 endKey 中提取
  else if (model.value && typeof model.value === 'object') {
    const start = model.value[startKey.value]
    const end = model.value[endKey.value]
    if (start && end) {
      dateRange.value = [start, end]
    } else {
      // 如果没有值，清空
      dateRange.value = []
    }
  }
  // 使用默认值
  else if (schema.option?.default) {
    dateRange.value = schema.option.default
  }
  // 如果 model 为 undefined 或 null，清空
  else {
    dateRange.value = []
  }
  
  validTips.value = ''
}

onMounted(() => {
  initData()
})

watch([model, schema], () => {
  initData()
}, {
  deep: true,
  immediate: true
})

/**
 * 获取表单值
 * 返回格式：{ startKey: '开始时间', endKey: '结束时间' }
 */
const getValue = () => {
  // 如果没有选择日期范围，返回空对象（这样重置时不会传递这些参数）
  if (!dateRange.value || dateRange.value.length !== 2 || !dateRange.value[0] || !dateRange.value[1]) {
    return {}
  }
  
  return {
    [startKey.value]: dateRange.value[0],
    [endKey.value]: dateRange.value[1]
  }
}

/**
 * 表单校验
 */
const validate = () => {
  validTips.value = ''

  if (schema.option?.required && (!dateRange.value || dateRange.value.length !== 2)) {
    validTips.value = '请选择日期时间范围'
    return false
  }

  return true
}

const onFocus = () => {
  validTips.value = ''
}

const onBlur = () => {
  validate()
}

const onChange = (value) => {
  validate()
}

/**
 * 重置方法
 * 供搜索栏调用，清空日期范围选择
 */
const reset = () => {
  dateRange.value = []
  validTips.value = ''
}

defineExpose({
  getValue,
  validate,
  reset,
  name
})
</script>

<style lang="less" scoped>
.form-item {
  width: 100%;
  margin-bottom: 20px;

  .item-label {
    width: 120px;
    font-size: 14px;
    color: #606266;
    margin-right: 10px;
    flex-shrink: 0;

    .required {
      color: #f56c6c;
      margin-right: 4px;
    }
  }

  .item-value {
    flex: 1;
    min-width: 0;

    .component {
      width: 100%;

      &.valid-border {
        :deep(.el-input__wrapper) {
          box-shadow: 0 0 0 1px #f56c6c inset;
        }
      }
    }
  }

  .valid-tips {
    width: 100%;
    font-size: 12px;
    color: #f56c6c;
    margin-top: 5px;
    margin-left: 130px;
  }
}
</style>
