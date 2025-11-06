/**
 * 认证路由
 * 定义用户注册、登录、登出等 API 路由
 *
 * 路由列表：
 * - POST /api/proj/auth/register - 用户注册
 * - POST /api/proj/auth/login - 用户登录
 * - POST /api/proj/auth/logout - 用户登出
 * - GET /api/proj/auth/user-info - 获取当前用户信息
 *
 * @param {Object} app - Elpis 应用实例
 * @param {Object} router - Koa Router 实例
 */
module.exports = (app, router) => {
  const { auth: authController } = app.controller

  // 用户注册（无需 Token 验证）
  router.post('/api/proj/auth/register', authController.register.bind(authController))

  // 用户登录（无需 Token 验证）
  router.post('/api/proj/auth/login', authController.login.bind(authController))

  // 用户登出（需要 Token 验证）
  router.post('/api/proj/auth/logout', authController.logout.bind(authController))

  // 获取当前用户信息（需要 Token 验证）
  router.get('/api/proj/auth/user-info', authController.getUserInfo.bind(authController))
}