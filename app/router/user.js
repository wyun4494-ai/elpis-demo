module.exports = (app,router) => {
  const { user: userController } = app.controller

  router.get('/api/proj/user/list', userController.getUserList.bind(userController))
  router.get('/api/proj/user', userController.getUser.bind(userController))
  router.post('/api/proj/user', userController.createUser.bind(userController))
  router.put('/api/proj/user', userController.updateUser.bind(userController))
  router.delete('/api/proj/user', userController.deleteUser.bind(userController))
}