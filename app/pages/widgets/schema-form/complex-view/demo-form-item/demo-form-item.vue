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
      {{ schema.label }}demo
    </el-row>
    <!-- value -->
    <el-row
      class="item-value"
    >
      <el-input-number
        v-model="dotValue"
        v-bind="schema.option"
        :controls="false"
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

const name = ref('inputNumber')
const dotValue = ref()
const validTips = ref(null)
const placeholder = ref('')

// 初始化数据
const initData = () => { 
  // 如果有model值，使用model值，否则使用schema中定义的默认值
  dotValue.value = model.value !== undefined ? model.value : schema.option?.default
  validTips.value = null

  const {
    minium,
    maximum
  } = schema

  const ruleList = []
  if(schema.option?.placeholder){
    ruleList.value = schema.option.placeholder
  }
  if(minium !== undefined) {
    ruleList.push(`最小值: ${minium}`)
  }
  if(maximum !== undefined) {
    ruleList.push(`最大值:${maximum}`)
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
      } else if(keyword === 'minimum') {
        validTips.value = `数值不能小于${params.limit}`
      } else if(keyword === 'maximum') {
        validTips.value = `数值不能大于${params.limit}`
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
:deep(.el-input-number .el-input__inner) {
  text-align: left;
}
</style>