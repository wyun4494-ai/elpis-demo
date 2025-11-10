module.exports = (app) => {
  // Token 验证中间件
  app.use(app.middlewares.authTokenVerify)

  // 权限验证中间件（必须在 Token 验证之后）
  app.use(app.middlewares.permissionVerify)
}