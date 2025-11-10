/**
 * 菜单管理路由
 */
module.exports = (app, router) => {
  const { menu: menuController } = app.controller

  // 获取所有菜单列表
  router.get('/api/proj/menu/list', menuController.list.bind(menuController))
}

