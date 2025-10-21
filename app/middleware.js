module.exports = (app) => {
  // 登录太校验
  app.use(app.middlewares.authTokenVerify)
}