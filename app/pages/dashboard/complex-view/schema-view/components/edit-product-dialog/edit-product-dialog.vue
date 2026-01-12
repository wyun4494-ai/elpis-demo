<template>
  <el-dialog
    v-model="visible"
    title="编辑秒杀商品"
    width="600px"
    destroy-on-close
    :close-on-click-modal="false"
    class="edit-product-dialog"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="120px"
      class="edit-form"
    >
      <el-form-item label="商品名称">
        <el-input
          :model-value="formData.product_name"
          disabled
        />
      </el-form-item>

      <el-form-item label="货号">
        <el-input
          :model-value="formData.item_number"
          disabled
        />
      </el-form-item>

      <el-form-item label="商品价格">
        <el-input
          :model-value="`¥${formData.original_price}`"
          disabled
        />
      </el-form-item>

      <el-form-item
        label="秒杀价格"
        prop="flash_sale_price"
      >
        <el-input-number
          v-model="formData.flash_sale_price"
          :min="0.01"
          :max="Math.max(formData.original_price, 0.01)"
          :precision="2"
          controls-position="right"
          style="width: 100%"
        />
        <div class="form-tip">必须小于商品价格 ¥{{ formData.original_price }}</div>
      </el-form-item>

      <el-form-item
        label="秒杀数量"
        prop="flash_sale_stock"
      >
        <el-input-number
          v-model="formData.flash_sale_stock"
          :min="1"
          :max="Math.max(formData.total_inventory, 1)"
          controls-position="right"
          style="width: 100%"
        />
        <div class="form-tip">当前库存：{{ formData.total_inventory }}</div>
      </el-form-item>

      <el-form-item
        label="限购数量"
        prop="limit_per_user"
      >
        <el-input-number
          v-model="formData.limit_per_user"
          :min="1"
          :max="9999"
          controls-position="right"
          style="width: 100%"
        />
        <div class="form-tip">每人最多购买数量（建议不超过秒杀数量）</div>
      </el-form-item>

      <el-form-item
        label="排序"
        prop="sort_order"
      >
        <el-input-number
          v-model="formData.sort_order"
          :min="0"
          :step="1"
          controls-position="right"
          style="width: 100%"
        />
        <div class="form-tip">数字越小越靠前</div>
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button
          type="primary"
          :loading="saving"
          @click="handleSave"
        >
          {{ saving ? '保存中...' : '保存' }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const visible = ref(false)
const saving = ref(false)
const formRef = ref(null)

const formData = ref({
  flash_sale_product_id: '',
  product_name: '',
  item_number: '',
  original_price: 0,
  total_inventory: 0,
  flash_sale_price: 0,
  flash_sale_stock: 0,
  limit_per_user: 1,
  sort_order: 0
})

const formRules = {
  flash_sale_price: [
    { required: true, message: '请输入秒杀价格', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value >= formData.value.original_price) {
          callback(new Error('秒杀价格必须小于商品价格'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  flash_sale_stock: [
    { required: true, message: '请输入秒杀数量', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value > formData.value.total_inventory) {
          callback(new Error('秒杀数量不能超过库存'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  limit_per_user: [
    { required: true, message: '请输入限购数量', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value > formData.value.flash_sale_stock) {
          callback(new Error('限购数量建议不超过秒杀数量'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

const emit = defineEmits(['confirm'])

/**
 * 显示对话框
 * @param {Object} data - 商品数据
 */
const show = (data) => {
  // 确保所有数值字段都有有效值，避免 el-input-number 组件报错
  const originalPrice = parseFloat(data.original_price) || 0.01
  const totalInventory = parseInt(data.total_inventory || data.sku_inventory) || 1
  const flashSalePrice = parseFloat(data.flash_sale_price) || parseFloat((originalPrice * 0.8).toFixed(2))
  const flashSaleStock = parseInt(data.flash_sale_stock) || Math.min(totalInventory, 100)
  
  formData.value = {
    flash_sale_product_id: data.flash_sale_product_id,
    product_name: data.product_name,
    item_number: data.item_number,
    original_price: originalPrice,
    total_inventory: totalInventory,
    flash_sale_price: flashSalePrice,
    flash_sale_stock: flashSaleStock,
    limit_per_user: parseInt(data.limit_per_user) || 1,
    sort_order: parseInt(data.sort_order) || 0
  }
  visible.value = true
}

/**
 * 隐藏对话框
 */
const hide = () => {
  visible.value = false
  formData.value = {
    flash_sale_product_id: '',
    product_name: '',
    item_number: '',
    original_price: 0,
    total_inventory: 0,
    flash_sale_price: 0,
    flash_sale_stock: 0,
    limit_per_user: 1,
    sort_order: 0
  }
}

/**
 * 保存
 */
const handleSave = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
  } catch (error) {
    return
  }

  saving.value = true
  try {
    emit('confirm', formData.value)
    hide()
  } catch (error) {
    console.error('保存失败:', error)
    ElMessage.error(error.message || '保存失败')
  } finally {
    saving.value = false
  }
}

defineExpose({
  show,
  hide
})
</script>

<style scoped lang="less">
.edit-product-dialog {
  :deep(.el-dialog__body) {
    padding: 20px 24px;
  }
}

.edit-form {
  padding: 10px 0;

  .form-tip {
    font-size: 12px;
    color: #909399;
    margin-top: 4px;
    line-height: 1.5;
  }

  :deep(.el-form-item) {
    margin-bottom: 24px;

    .el-form-item__label {
      font-weight: 500;
      color: #606266;
    }

    .el-input__inner,
    .el-input-number__decrease,
    .el-input-number__increase {
      height: 40px;
      line-height: 40px;
    }
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;

  .el-button {
    min-width: 80px;
  }
}
</style>
