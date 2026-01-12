/**
 * 人气推荐路由
 */
module.exports = (app, router) => {
  const { popularProductRecommend: popularProductRecommendController } = app.controller

  // 获取可推荐的商品列表（必须放在前面，避免被 :id 路由匹配）
  router.get('/api/proj/popular-product-recommend/available-products', popularProductRecommendController.getAvailableProducts.bind(popularProductRecommendController))

  // 获取人气推荐列表（框架约定的 /list 路径）
  router.get('/api/proj/popular-product-recommend/list', popularProductRecommendController.getPopularProductRecommendList.bind(popularProductRecommendController))

  // 批量操作路由（框架约定格式：/batch/操作名）
  router.post('/api/proj/popular-product-recommend/batch/enable', popularProductRecommendController.batchEnable.bind(popularProductRecommendController))
  router.post('/api/proj/popular-product-recommend/batch/disable', popularProductRecommendController.batchDisable.bind(popularProductRecommendController))
  router.post('/api/proj/popular-product-recommend/batch/delete', popularProductRecommendController.batchDelete.bind(popularProductRecommendController))

  // 批量设为推荐（旧路径，保留兼容）
  router.post('/api/proj/popular-product-recommend/batch-enable', popularProductRecommendController.batchEnable.bind(popularProductRecommendController))

  // 批量取消推荐（旧路径，保留兼容）
  router.post('/api/proj/popular-product-recommend/batch-disable', popularProductRecommendController.batchDisable.bind(popularProductRecommendController))

  // 批量删除（旧路径，保留兼容）
  router.post('/api/proj/popular-product-recommend/batch-delete', popularProductRecommendController.batchDelete.bind(popularProductRecommendController))

  // 切换推荐状态
  router.put('/api/proj/popular-product-recommend/toggle', popularProductRecommendController.toggleRecommend.bind(popularProductRecommendController))

  // 创建人气推荐
  router.post('/api/proj/popular-product-recommend', popularProductRecommendController.createPopularProductRecommend.bind(popularProductRecommendController))

  // 更新人气推荐（不带 ID）
  router.put('/api/proj/popular-product-recommend', popularProductRecommendController.updatePopularProductRecommend.bind(popularProductRecommendController))

  // 获取人气推荐列表
  router.get('/api/proj/popular-product-recommend', popularProductRecommendController.getPopularProductRecommendList.bind(popularProductRecommendController))

  // 获取人气推荐详情（带 ID）
  router.get('/api/proj/popular-product-recommend/:id', popularProductRecommendController.getPopularProductRecommendDetail.bind(popularProductRecommendController))

  // 更新人气推荐（带 ID）
  router.put('/api/proj/popular-product-recommend/:id', popularProductRecommendController.updatePopularProductRecommend.bind(popularProductRecommendController))

  // 删除人气推荐
  router.delete('/api/proj/popular-product-recommend/:id', popularProductRecommendController.deletePopularProductRecommend.bind(popularProductRecommendController))
}
