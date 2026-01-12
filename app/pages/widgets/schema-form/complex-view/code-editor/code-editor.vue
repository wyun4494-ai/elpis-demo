<template>
  <div class="code-editor">
    <div class="editor-toolbar">
      <el-button size="small" @click="formatCode">格式化代码</el-button>
      <el-button size="small" @click="clearCode">清空</el-button>
      <span class="char-count">字符数: {{ codeContent.length }}</span>
    </div>
    <textarea
      ref="textareaRef"
      v-model="codeContent"
      class="code-textarea"
      :placeholder="schema.option?.placeholder || '请输入HTML代码'"
      :rows="schema.option?.rows || 10"
      @input="handleInput"
    />
    <div v-if="validTips" class="valid-tips">{{ validTips }}</div>
    <div class="editor-hint">
      支持HTML、CSS、JavaScript代码。请确保代码安全，避免XSS攻击。
    </div>
  </div>
</template>

<script setup>
import { ref, toRefs, watch, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  schema: { type: Object, default: () => ({}) },
  schemaKey: { type: String, default: '' },
  model: { type: String, default: '' }
})

const { schema, schemaKey } = props
const { model } = toRefs(props)

const name = ref('code-editor')
const codeContent = ref('')
const textareaRef = ref(null)
const validTips = ref('')

// 处理输入
const handleInput = () => {
  validTips.value = ''
}

// 格式化代码（简单的格式化）
const formatCode = () => {
  if (!codeContent.value) {
    ElMessage.warning('代码内容为空')
    return
  }

  try {
    // 简单的HTML格式化
    let formatted = codeContent.value
    
    // 移除多余的空白
    formatted = formatted.replace(/>\s+</g, '><')
    
    // 添加缩进
    let indent = 0
    const lines = []
    const tokens = formatted.split(/(<[^>]+>)/g).filter(t => t.trim())
    
    tokens.forEach(token => {
      if (token.startsWith('</')) {
        indent = Math.max(0, indent - 1)
        lines.push('  '.repeat(indent) + token)
      } else if (token.startsWith('<') && !token.endsWith('/>')) {
        lines.push('  '.repeat(indent) + token)
        if (!token.startsWith('<!')) {
          indent++
        }
      } else if (token.startsWith('<') && token.endsWith('/>')) {
        lines.push('  '.repeat(indent) + token)
      } else {
        lines.push('  '.repeat(indent) + token)
      }
    })
    
    codeContent.value = lines.join('\n')
    ElMessage.success('代码格式化成功')
  } catch (error) {
    ElMessage.error('代码格式化失败')
  }
}

// 清空代码
const clearCode = () => {
  codeContent.value = ''
  ElMessage.success('已清空代码')
}

// 获取值
const getValue = () => {
  return codeContent.value ? { [schemaKey]: codeContent.value } : {}
}

// 验证
const validate = () => {
  validTips.value = ''
  if (schema.option?.required && !codeContent.value) {
    validTips.value = '请输入代码内容'
    return false
  }
  return true
}

// 初始化
onMounted(() => {
  if (model.value) {
    codeContent.value = model.value
  }
})

// 监听 model 变化
watch(model, (newVal) => {
  if (newVal) {
    codeContent.value = newVal
  }
})

defineExpose({ getValue, validate, name })
</script>

<style scoped lang="less">
.code-editor {
  width: 100%;

  .editor-toolbar {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
    padding: 10px;
    background-color: #f5f7fa;
    border-radius: 4px;

    .char-count {
      margin-left: auto;
      font-size: 12px;
      color: #909399;
    }
  }

  .code-textarea {
    width: 100%;
    padding: 10px;
    font-family: 'Courier New', Courier, monospace;
    font-size: 14px;
    line-height: 1.5;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    resize: vertical;
    background-color: #fafafa;

    &:focus {
      outline: none;
      border-color: #409eff;
    }

    &::placeholder {
      color: #c0c4cc;
    }
  }

  .valid-tips {
    color: #f56c6c;
    font-size: 12px;
    margin-top: 5px;
  }

  .editor-hint {
    font-size: 12px;
    color: #909399;
    margin-top: 5px;
    line-height: 1.5;
  }
}
</style>
