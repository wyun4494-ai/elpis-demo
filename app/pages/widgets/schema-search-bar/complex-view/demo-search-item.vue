<template>
  <el-input
    v-model="dtoValue"
    v-bind="schema.option"
    class="input"
    placeholder="demo-search-item"
  />
</template>

<script setup>
import { ref, onMounted} from 'vue'

const { schema, schemaKey} = defineProps({
  schema: {
    type: Object,
    default: () => ({})
  },
  schemaKey: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['loaded'])

const dtoValue = ref()

const getValue = () => {
  return dtoValue.value !== undefined ? {
    [schemaKey]: dtoValue.value
  } : {}
}

const reset = () => {
  dtoValue.value = schema?.option?.default;
  return
}

onMounted(() => {
  reset()
  emit('loaded')
})

defineExpose({
  getValue,
  reset
})
</script>

<style lang="less" scoped>

</style>