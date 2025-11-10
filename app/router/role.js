/**
 * 角色管理路由
 * 定义角色相关的 API 路由
 *
 * 路由列表：
 * - GET /api/proj/role - 获取角色列表
 * - GET /api/proj/role/:role_id - 获取角色详情
 * - POST /api/proj/role - 创建角色
 * - PUT /api/proj/role/:role_id - 更新角色
 * - DELETE /api/proj/role/:role_id - 删除角色
 * - GET /api/proj/role/:role_id/menu - 获取角色的菜单权限
 * - PUT /api/proj/role/:role_id/menu - 更新角色的菜单权限
 * - GET /api/proj/user/menu - 获取当前用户的菜单权限
 *
 * @param {Object} app - Elpis 应用实例
 * @param {Object} router - Koa Router 实例
 */
module.exports = (app, router) => {
  const { role: roleController } = app.controller

  // 获取角色列表（schema-table 会自动添加 /list 后缀）
  router.get('/api/proj/role/list', roleController.list.bind(roleController))

  // 获取角色列表（兼容旧接口）
  router.get('/api/proj/role', roleController.list.bind(roleController))

  // 创建角色
  router.post('/api/proj/role', roleController.create.bind(roleController))

  // 更新角色状态（Switch 开关）- 必须在 /:role_id 之前
  router.put('/api/proj/role/status', roleController.updateStatus.bind(roleController))

  // 获取角色详情
  router.get('/api/proj/role/:role_id', roleController.detail.bind(roleController))

  // 更新角色
  router.put('/api/proj/role/:role_id', roleController.update.bind(roleController))

  // 删除角色
  router.delete('/api/proj/role/:role_id', roleController.delete.bind(roleController))

  // 获取角色的菜单权限列表
  router.get('/api/proj/role/:role_id/menu', roleController.getMenuList.bind(roleController))

  // 更新角色的菜单权限
  router.put('/api/proj/role/:role_id/menu', roleController.updateMenuList.bind(roleController))

  // 获取当前用户的菜单权限列表
  router.get('/api/proj/user/menu', roleController.getUserMenuList.bind(roleController))

  // 获取当前用户有权限访问的项目列表
  router.get('/api/proj/user/project-list', roleController.getUserProjectList.bind(roleController))

  // 检查用户是否有权限访问项目
  router.get('/api/proj/user/check-project-permission', roleController.checkProjectPermission.bind(roleController))
}

