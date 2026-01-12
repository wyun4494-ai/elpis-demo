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
        v-model="dotValue"
        type="datetime"
        class="component"
        :class=" validTips ? 'valid-border' : '' "
        :placeholder="schema.option?.placeholder || '请选择日期时间'"
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
import { ref, toRefs, watch, onMounted, inject} from 'vue'
const ajv = inject('ajv')

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
    type: [String, Number, Boolean, Object],
    default: undefined
  }
})

const { schema, schemaKey } = props
const { model } = toRefs(props)

const name = ref('datetime')
const dotValue = ref()
const validTips = ref('')

/**
 * 初始化数据
 */
const initData = () => {
  dotValue.value = model.value !== undefined ? model.value : schema.option?.default
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
 */
const getValue = () => {
  return dotValue.value !== undefined ? {
    [schemaKey]: dotValue.value
  } : {}
}

/**
 * 表单校验
 */
const validate = () => {
  validTips.value = ''

  if (schema.option?.required && !dotValue.value) {
    validTips.value = '请选择日期时间'
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

defineExpose({
  getValue,
  validate,
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
