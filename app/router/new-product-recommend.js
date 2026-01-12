/**
 * 新品推荐路由
 */
module.exports = (app, router) => {
  const { newProductRecommend: newProductRecommendController } = app.controller

  // 获取可推荐的商品列表（必须放在前面，避免被 :id 路由匹配）
  router.get('/api/proj/new-product-recommend/available-products', newProductRecommendController.getAvailableProducts.bind(newProductRecommendController))

  // 获取新品推荐列表（框架约定的 /list 路径）
  router.get('/api/proj/new-product-recommend/list', newProductRecommendController.getNewProductRecommendList.bind(newProductRecommendController))

  // 批量操作路由（框架约定格式：/batch/操作名）
  router.post('/api/proj/new-product-recommend/batch/enable', newProductRecommendController.batchEnable.bind(newProductRecommendController))
  router.post('/api/proj/new-product-recommend/batch/disable', newProductRecommendController.batchDisable.bind(newProductRecommendController))
  router.post('/api/proj/new-product-recommend/batch/delete', newProductRecommendController.batchDelete.bind(newProductRecommendController))

  // 批量设为推荐（旧路径，保留兼容）
  router.post('/api/proj/new-product-recommend/batch-enable', newProductRecommendController.batchEnable.bind(newProductRecommendController))

  // 批量取消推荐（旧路径，保留兼容）
  router.post('/api/proj/new-product-recommend/batch-disable', newProductRecommendController.batchDisable.bind(newProductRecommendController))

  // 批量删除（旧路径，保留兼容）
  router.post('/api/proj/new-product-recommend/batch-delete', newProductRecommendController.batchDelete.bind(newProductRecommendController))

  // 切换推荐状态
  router.put('/api/proj/new-product-recommend/toggle', newProductRecommendController.toggleRecommend.bind(newProductRecommendController))

  // 创建新品推荐
  router.post('/api/proj/new-product-recommend', newProductRecommendController.createNewProductRecommend.bind(newProductRecommendController))

  // 更新新品推荐（不带 ID）
  router.put('/api/proj/new-product-recommend', newProductRecommendController.updateNewProductRecommend.bind(newProductRecommendController))

  // 获取新品推荐列表
  router.get('/api/proj/new-product-recommend', newProductRecommendController.getNewProductRecommendList.bind(newProductRecommendController))

  // 获取新品推荐详情（带 ID）
  router.get('/api/proj/new-product-recommend/:id', newProductRecommendController.getNewProductRecommendDetail.bind(newProductRecommendController))

  // 更新新品推荐（带 ID）
  router.put('/api/proj/new-product-recommend/:id', newProductRecommendController.updateNewProductRecommend.bind(newProductRecommendController))

  // 删除新品推荐
  router.delete('/api/proj/new-product-recommend/:id', newProductRecommendController.deleteNewProductRecommend.bind(newProductRecommendController))
}
