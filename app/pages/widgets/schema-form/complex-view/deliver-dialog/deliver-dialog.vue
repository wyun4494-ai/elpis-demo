<template>
  <el-dialog
    v-model="visible"
    title="订单发货"
    width="600px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item label="物流公司" prop="logistics_company">
        <el-input
          v-model="formData.logistics_company"
          placeholder="请输入物流公司名称"
          clearable
        />
      </el-form-item>

      <el-form-item label="物流单号" prop="logistics_no">
        <el-input
          v-model="formData.logistics_no"
          placeholder="请输入物流单号"
          clearable
        />
      </el-form-item>

      <el-form-item label="发货人" prop="sender_name">
        <el-input
          v-model="formData.sender_name"
          placeholder="请输入发货人姓名"
          clearable
        />
      </el-form-item>

      <el-form-item label="发货电话" prop="sender_phone">
        <el-input
          v-model="formData.sender_phone"
          placeholder="请输入发货人电话"
          clearable
        />
      </el-form-item>

      <el-form-item label="发货地址" prop="sender_address">
        <el-input
          v-model="formData.sender_address"
          type="textarea"
          :rows="3"
          placeholder="请输入发货地址"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" :loading="loading" @click="handleSubmit">
        确认发货
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElNotification } from 'element-plus'
import $curl from '$elpisCommon/curl.js'

const emit = defineEmits(['command'])

const name = 'deliverDialog'  // 改为普通字符串，不使用 ref
const visible = ref(false)
const loading = ref(false)
const formRef = ref(null)
const orderId = ref('')

const formData = reactive({
  logistics_company: '',
  logistics_no: '',
  sender_name: '',
  sender_phone: '',
  sender_address: ''
})

const rules = {
  logistics_company: [
    { required: true, message: '请输入物流公司名称', trigger: 'blur' }
  ],
  logistics_no: [
    { required: true, message: '请输入物流单号', trigger: 'blur' }
  ],
  sender_name: [
    { required: true, message: '请输入发货人姓名', trigger: 'blur' }
  ],
  sender_phone: [
    { required: true, message: '请输入发货人电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  sender_address: [
    { required: true, message: '请输入发货地址', trigger: 'blur' }
  ]
}

// 显示对话框
const show = (params) => {
  orderId.value = params?.order_id || params
  visible.value = true
  
  // 重置表单
  Object.assign(formData, {
    logistics_company: '',
    logistics_no: '',
    sender_name: '',
    sender_phone: '',
    sender_address: ''
  })
  
  formRef.value?.clearValidate()
}

// 关闭对话框
const handleClose = () => {
  visible.value = false
  formRef.value?.resetFields()
}

// 提交发货
const handleSubmit = async () => {
  try {
    const valid = await formRef.value?.validate()
    if (!valid) return

    if (!orderId.value) {
      ElMessage.warning('订单ID不能为空')
      return
    }

    loading.value = true

    const response = await $curl({
      url: '/api/proj/order/deliver',
      method: 'post',
      data: {
        order_id: orderId.value,
        ...formData
      }
    })

    if (response && response.success) {
      ElNotification({
        title: '发货成功',
        message: '订单已成功发货',
        type: 'success',
        duration: 3000
      })
      handleClose()
      emit('command', { event: 'loadTableData' })
    } else {
      ElMessage.error(response?.message || '发货失败')
    }
  } catch (error) {
    console.error('发货失败:', error)
    ElMessage.error('发货失败，请稍后重试')
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
