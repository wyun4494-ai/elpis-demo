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
      <el-input
        type="textarea"
        :rows="5"
        v-model="dotValue"
        v-bind="schema.option"
        class="component"
        :class=" validTips ? 'valid-border' : '' "
        :placeholder="placeholder"
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
  },
})
const { schema, schemaKey} = props
const { model } = toRefs(props)

const name = ref('textarea')
const dotValue = ref()
const validTips = ref(null)
const placeholder = ref('')

// 初始化数据
const initData = () => { 
  // 如果有model值，使用model值，否则使用schema中定义的默认值
  dotValue.value = model.value !== undefined ? model.value : schema.option?.default
  validTips.value = null

  const { minLength, maxLength, pattern } = schema

  const ruleList = []
  if(schema.option?.placeholder){
    placeholder.value = schema.option.placeholder
  }
  if(minLength) {
    ruleList.push(`最小长度: ${minLength}`)
  }
  if(maxLength) {
    ruleList.push(`最大长度:${maxLength}`)
  }
  if(pattern) {
    ruleList.push(`格式: ${pattern}`)
  }

  placeholder.value = ruleList.join('|')
}


onMounted(() => { 
  initData()
})
watch([model, schema], () => { 
  initData()
},{
  deep: true,
  immediate: true
})

// 获取表单值
const getValue = () => {
  return dotValue.value !== null ? {
    [schemaKey]: dotValue.value
  } : {}
}

// 表单校验
const validate = () => {
  validTips.value = null

  const { type } = schema

  if(schema.option?.required && !dotValue.value){
    validTips.value = '请输入内容'
    return false
  }

  // 调用ajv校验schema
  if(dotValue.value) {
    const validate = ajv.compile(schema)
    const valid = validate(dotValue.value)
    if(!valid && validate.errors && validate.errors[0]) {
      const { keyword, params} = validate.errors[0]
      if(keyword === 'type') {
        validTips.value = `类型必须为${type}，请检查输入`
      } else if(keyword === 'minLength') {
        validTips.value = `长度不能小于${params.limit}`
      } else if(keyword === 'maxLength') {
        validTips.value = `长度不能大于${params.limit}`
      } else if(keyword === 'pattern') {
        validTips.value = `格式错误，请检查输入`
      } else {
        console.log(validate.errors[0])
        validTips.value = '格式错误，请检查输入'
      }
      return false 
    }
  }
  return true
}

// 输入框聚焦事件
const onFocus = () => { 
  validTips.value = null
}
// 输入框失焦事件
const onBlur = () => { 
  validate()
}

defineExpose({
  getValue,
  validate,
  name
})
</script>

<style lang="less" scoped>

</style>