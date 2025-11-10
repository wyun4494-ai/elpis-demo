<template>
  <el-dialog
    v-model="visible"
    :title="`分配菜单权限 - ${roleData.role_name}`"
    width="600px"
    @close="handleClose"
  >
    <!-- 菜单树 -->
    <div class="menu-tree-container">
      <el-tree
        ref="treeRef"
        :data="menuTreeData"
        :props="{ children: 'children', label: 'label' }"
        show-checkbox
        node-key="id"
        :default-checked-keys="checkedMenuIds"
        @check="handleTreeCheck"
      />
    </div>

    <!-- 底部按钮 -->
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSave" :loading="saving">保存</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import $curl from '$elpisCommon/curl.js'

const emit = defineEmits(['command'])

const name = ref('assignMenuDialog')
const visible = ref(false)
const roleData = ref({})
const treeRef = ref(null)
const menuTreeData = ref([])
const checkedMenuIds = ref([])
const saving = ref(false)

// 显示对话框
const show = async (rowData) => {
  roleData.value = rowData
  visible.value = true
  // 先加载菜单树，再加载角色菜单权限
  await loadMenuTree()
  // 加载角色已有的菜单权限（会自动等待 DOM 更新）
  await loadRoleMenus()
}

// 加载菜单树
const loadMenuTree = async () => {
  try {
    const res = await $curl({
      method: 'get',
      url: '/api/proj/menu/list'
    })

    if (res && res.success && Array.isArray(res.data)) {
      menuTreeData.value = buildMenuTree(res.data)
    } else {
      ElMessage.warning('菜单列表为空')
    }
  } catch (error) {
    console.error('加载菜单树失败:', error)
    ElMessage.error('加载菜单树失败')
  }
}

// 构建菜单树结构
const buildMenuTree = (menus) => {
  const tree = []
  const menuMap = {}

  // 按项目分组
  const projectGroups = {}
  menus.forEach(menu => {
    if (!projectGroups[menu.project_key]) {
      projectGroups[menu.project_key] = {
        id: `project_${menu.project_key}`,
        label: menu.project_name,
        children: []
      }
    }
    projectGroups[menu.project_key].children.push({
      id: `${menu.project_key}_${menu.menu_key}`,
      label: menu.menu_name,
      projectKey: menu.project_key,
      menuKey: menu.menu_key
    })
  })

  // 转换为树结构
  Object.values(projectGroups).forEach(group => {
    tree.push(group)
  })

  return tree
}

// 加载角色已有的菜单权限
const loadRoleMenus = async () => {
  try {
    const res = await $curl({
      method: 'get',
      url: `/api/proj/role/${roleData.value.role_id}/menu`
    })

    if (res && res.success && Array.isArray(res.data)) {
      // 构建选中的菜单 ID 列表
      checkedMenuIds.value = res.data.map(item => `${item.project_key}_${item.menu_key}`)

      // 等待 DOM 更新后再设置选中状态
      await nextTick()

      // 设置树的选中状态
      if (treeRef.value) {
        // 使用 setCheckedKeys 方法设置选中的节点
        // 第二个参数 false 表示不包含半选状态
        treeRef.value.setCheckedKeys(checkedMenuIds.value, false)
      }
    } else if (res && res.success && (!res.data || res.data.length === 0)) {
      // 该角色没有分配任何菜单权限
      checkedMenuIds.value = []

      await nextTick()

      if (treeRef.value) {
        treeRef.value.setCheckedKeys([], false)
      }
    }
  } catch (error) {
    console.error('加载角色菜单权限失败:', error)
    ElMessage.error('加载角色菜单权限失败')
  }
}

// 处理树节点选中
const handleTreeCheck = () => {
  // 树的选中状态会自动更新
}

// 保存菜单权限
const handleSave = async () => {
  try {
    saving.value = true

    // 获取选中的菜单
    const checkedNodes = treeRef.value.getCheckedNodes()
    const menuList = checkedNodes
      .filter(node => node.menuKey) // 只取菜单节点，不取项目节点
      .map(node => ({
        menu_key: node.menuKey,
        project_key: node.projectKey
      }))

    // 调用 API 保存权限
    const res = await $curl({
      method: 'put',
      url: `/api/proj/role/${roleData.value.role_id}/menu`,
      data: { menu_list: menuList },
      successMessage: '菜单权限分配成功'
    })

    if (res && res.success) {
      emit('success')
      visible.value = false
    }
  } catch (error) {
    console.error('保存菜单权限失败:', error)
    ElMessage.error('保存菜单权限失败')
  } finally {
    saving.value = false
  }
}

// 关闭对话框
const handleClose = () => {
  visible.value = false
}

// 暴露给父组件的方法
defineExpose({
  show,
  name
})
</script>

<style scoped>
.menu-tree-container {
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid #dcdfe4;
  border-radius: 4px;
  padding: 10px;
}
</style>

