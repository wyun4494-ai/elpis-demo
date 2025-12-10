/**
 * 客户管理路由
 * 定义普通用户（商城客户）相关的 API 路由
 *
 * 路由列表：
 * - GET /api/proj/customer/list - 获取客户列表
 * - POST /api/proj/customer - 创建客户
 * - GET /api/proj/customer/:customer_id - 获取客户详情
 * - PUT /api/proj/customer/:customer_id - 更新客户
 * - DELETE /api/proj/customer/:customer_id - 删除客户
 * - POST /api/proj/customer/batch-delete - 批量删除客户
 *
 * @param {Object} app - Elpis 应用实例
 * @param {Object} router - Koa Router 实例
 */
module.exports = (app, router) => {
  const { customer: customerController } = app.controller

  // 获取客户列表（schema-table 会自动添加 /list 后缀）
  router.get('/api/proj/customer/list', customerController.getCustomerList.bind(customerController))

  // 批量删除客户
  router.post('/api/proj/customer/batch-delete', customerController.batchDeleteCustomer.bind(customerController))

  // 获取客户列表或客户详情（兼容旧接口）
  router.get('/api/proj/customer', customerController.getCustomer.bind(customerController))

  // 创建客户
  router.post('/api/proj/customer', customerController.createCustomer.bind(customerController))

  // 更新客户（支持两种方式）
  // 1. PUT /api/proj/customer（body 中包含 customer_id）- 用于编辑表单
  // 2. PUT /api/proj/customer/:customer_id（路径参数）- 用于其他场景
  router.put('/api/proj/customer', customerController.updateCustomer.bind(customerController))

  // 获取客户详情
  router.get('/api/proj/customer/:customer_id', customerController.getCustomer.bind(customerController))

  // 更新客户（路径参数方式）
  router.put('/api/proj/customer/:customer_id', customerController.updateCustomer.bind(customerController))

  // 删除客户
  router.delete('/api/proj/customer/:customer_id', customerController.deleteCustomer.bind(customerController))
}
