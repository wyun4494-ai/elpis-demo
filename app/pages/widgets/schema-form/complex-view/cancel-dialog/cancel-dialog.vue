<template>
  <el-dialog
    v-model="visible"
    title="取消订单"
    width="500px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item label="取消原因" prop="cancel_reason">
        <el-input
          v-model="formData.cancel_reason"
          type="textarea"
          :rows="4"
          placeholder="请输入取消订单的原因"
          maxlength="200"
          show-word-limit
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="danger" :loading="loading" @click="handleSubmit">
        确认取消订单
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElNotification, ElMessageBox } from 'element-plus'
import $curl from '$elpisCommon/curl.js'

const emit = defineEmits(['command'])

const name = 'cancelDialog'  // 改为普通字符串，不使用 ref
const visible = ref(false)
const loading = ref(false)
const formRef = ref(null)
const orderId = ref('')

const formData = reactive({
  cancel_reason: ''
})

const rules = {
  cancel_reason: [
    { required: true, message: '请输入取消原因', trigger: 'blur' },
    { min: 5, message: '取消原因至少5个字符', trigger: 'blur' }
  ]
}

// 显示对话框
const show = (params) => {
  orderId.value = params?.order_id || params
  visible.value = true
  
  // 重置表单
  formData.cancel_reason = ''
  formRef.value?.clearValidate()
}

// 关闭对话框
const handleClose = () => {
  visible.value = false
  formRef.value?.resetFields()
}

// 提交取消订单
const handleSubmit = async () => {
  try {
    const valid = await formRef.value?.validate()
    if (!valid) return

    if (!orderId.value) {
      ElMessage.warning('订单ID不能为空')
      return
    }

    // 二次确认
    await ElMessageBox.confirm(
      '取消订单后将无法恢复，确认要取消该订单吗？',
      '确认取消',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    loading.value = true

    const response = await $curl({
      url: '/api/proj/order/cancel',
      method: 'post',
      data: {
        order_id: orderId.value,
        cancel_reason: formData.cancel_reason
      }
    })

    if (response && response.success) {
      ElNotification({
        title: '取消成功',
        message: '订单已成功取消',
        type: 'success',
        duration: 3000
      })
      handleClose()
      emit('command', { event: 'loadTableData' })
    } else {
      ElMessage.error(response?.message || '取消订单失败')
    }
  } catch (error) {
    if (error === 'cancel') {
      // 用户取消了二次确认
      return
    }
    console.error('取消订单失败:', error)
    ElMessage.error('取消订单失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

defineExpose({
  show,
  name
})
</script>

<style scoped lang="less">
:deep(.el-dialog__body) {
  padding: 20px 20px 10px;
}
</style>
