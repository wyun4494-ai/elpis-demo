module.exports = (app, router) => {
  const { category: categoryController } = app.controller;

  // 分类列表
  router.get('/api/proj/category/list', 
    categoryController.getCategoryList.bind(categoryController));

  // 分类详情
  router.get('/api/proj/category', 
    categoryController.getCategory.bind(categoryController));

  // 创建分类
  router.post('/api/proj/category', 
    categoryController.create.bind(categoryController));

  // 更新分类
  router.put('/api/proj/category', 
    categoryController.update.bind(categoryController));

  // 删除分类
  router.delete('/api/proj/category', 
    categoryController.remove.bind(categoryController));

  // 获取子分类（级联选择器）
  router.get('/api/proj/category/children', 
    categoryController.getCategoryChildren.bind(categoryController));

  // 获取分类路径（级联选择器回显）
  router.get('/api/proj/category/path', 
    categoryController.getCategoryPath.bind(categoryController));
};

