module.exports = (app, router) => {
  const { paramCategory: paramCategoryController } = app.controller;

  // 参数分类列表
  router.get('/api/proj/param-category/list', 
    paramCategoryController.getParamCategoryList.bind(paramCategoryController));

  // 参数分类详情（包含该分类下的所有参数）
  router.get('/api/proj/param-category', 
    paramCategoryController.getParamCategory.bind(paramCategoryController));

  // 创建参数分类
  router.post('/api/proj/param-category', 
    paramCategoryController.create.bind(paramCategoryController));

  // 更新参数分类
  router.put('/api/proj/param-category', 
    paramCategoryController.update.bind(paramCategoryController));

  // 删除参数分类
  router.delete('/api/proj/param-category', 
    paramCategoryController.remove.bind(paramCategoryController));

  // 获取参数分类下拉选项
  router.get('/api/proj/param-category/options',
    paramCategoryController.getParamCategoryOptions.bind(paramCategoryController));

  // 批量更新参数
  router.post('/api/proj/param-category/update-params',
    paramCategoryController.updateParams.bind(paramCategoryController));
};

