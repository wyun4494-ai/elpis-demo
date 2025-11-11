/**
 * 用户管理路由
 * 定义用户相关的 API 路由
 *
 * 路由列表：
 * - GET /api/proj/user/list - 获取用户列表
 * - POST /api/proj/user - 创建用户
 * - GET /api/proj/user/:user_id - 获取用户详情
 * - PUT /api/proj/user/:user_id - 更新用户
 * - DELETE /api/proj/user/:user_id - 删除用户
 *
 * @param {Object} app - Elpis 应用实例
 * @param {Object} router - Koa Router 实例
 */
module.exports = (app, router) => {
  const { user: userController } = app.controller

  // 获取用户列表（schema-table 会自动添加 /list 后缀）
  router.get('/api/proj/user/list', userController.getUserList.bind(userController))

  // 获取用户列表或用户详情（兼容旧接口）
  router.get('/api/proj/user', userController.getUser.bind(userController))

  // 创建用户
  router.post('/api/proj/user', userController.createUser.bind(userController))

  // 更新用户（支持两种方式）
  // 1. PUT /api/proj/user（body 中包含 user_id）- 用于编辑表单
  // 2. PUT /api/proj/user/:user_id（路径参数）- 用于其他场景
  router.put('/api/proj/user', userController.updateUser.bind(userController))

  // 获取用户详情
  router.get('/api/proj/user/:user_id', userController.getUser.bind(userController))

  // 更新用户（路径参数方式）
  router.put('/api/proj/user/:user_id', userController.updateUser.bind(userController))

  // 删除用户
  router.delete('/api/proj/user/:user_id', userController.deleteUser.bind(userController))
}