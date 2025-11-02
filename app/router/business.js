module.exports = (app, router) => {
  const { business: businessController } = app.controller;

  // 商品 CRUD 路由
  router.post('/api/proj/product', businessController.create.bind(businessController));
  router.get('/api/proj/product', businessController.get.bind(businessController));
  router.put('/api/proj/product', businessController.update.bind(businessController));
  router.delete('/api/proj/product', businessController.remove.bind(businessController));
  router.get('/api/proj/product/list', businessController.getProductList.bind(businessController));

  // 枚举值路由
  router.get('/api/proj/product_enum/list', businessController.getProductNameEnum.bind(businessController));
  router.get('/api/proj/price_enum/list', businessController.getPriceEnum.bind(businessController));
  router.get('/api/proj/inventory_enum/list', businessController.getInventoryEnum.bind(businessController));

  // 远程搜索路由
  router.get('/api/proj/product/search', businessController.searchProduct.bind(businessController));

  // 回收站路由
  router.get('/api/proj/product/recycle/list', businessController.getRecycleProductList.bind(businessController));
  router.get('/api/proj/product/recycle', businessController.getRecycleProduct.bind(businessController));
  router.post('/api/proj/product/restore', businessController.restoreProduct.bind(businessController));
  router.delete('/api/proj/product/permanent', businessController.permanentDeleteProduct.bind(businessController));
  
  // 回收站操作路由（用于侧边栏按钮）
  router.post('/api/proj/product/recycle/restore', businessController.restore.bind(businessController));
  router.delete('/api/proj/product/recycle/permanent', businessController.permanentDelete.bind(businessController));

  // SKU管理路由
  router.get('/api/proj/product/:product_id/skus', businessController.getProductSkus.bind(businessController));
  router.put('/api/proj/product/:product_id/skus', businessController.updateProductSkus.bind(businessController));

  // 商品参数路由
  router.get('/api/proj/product/:product_id/params', businessController.getProductParams.bind(businessController));

  // 批量操作路由
  router.post('/api/proj/product/batch/shelf-on', businessController.batchShelfOn.bind(businessController));
  router.post('/api/proj/product/batch/shelf-off', businessController.batchShelfOff.bind(businessController));
  router.post('/api/proj/product/batch/delete', businessController.batchDelete.bind(businessController));
};