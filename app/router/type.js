module.exports = (app, router) => {
  const { type: typeController } = app.controller;

  // 商品类型列表（末级分类列表）
  router.get('/api/proj/type/list', typeController.getTypeList.bind(typeController));
  
  // 获取分类的类型配置
  router.get('/api/proj/type', typeController.get.bind(typeController));
  router.get('/api/proj/type/by-category', typeController.getTypeByCategoryId.bind(typeController));
  
  // 保存属性和参数配置
  router.post('/api/proj/type/attributes', typeController.saveAttributes.bind(typeController));
  router.post('/api/proj/type/params', typeController.saveParams.bind(typeController));
  
  // 删除类型配置
  router.delete('/api/proj/type', typeController.remove.bind(typeController));

  // 参数库路由
  router.get('/api/proj/param-library/list', typeController.getParamLibraryList.bind(typeController));
  router.post('/api/proj/param-library', typeController.createParam.bind(typeController));
};

