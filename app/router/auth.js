module.exports = (app,router) => {
  const { auth: authController } = app.controller
  router.post('/api/auth/login', authController.login.bind(authController))
}