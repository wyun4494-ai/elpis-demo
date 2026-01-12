/**
 * 品牌推荐路由
 */
module.exports = (app, router) => {
  const { brandRecommend: brandRecommendController } = app.controller

  // 获取可推荐的品牌列表（必须放在前面，避免被 :id 路由匹配）
  router.get('/api/proj/brand-recommend/available-brands', brandRecommendController.getAvailableBrands.bind(brandRecommendController))

  // 获取品牌推荐列表（框架约定的 /list 路径）
  router.get('/api/proj/brand-recommend/list', brandRecommendController.getBrandRecommendList.bind(brandRecommendController))

  // 批量操作路由（框架约定格式：/batch/操作名）
  router.post('/api/proj/brand-recommend/batch/enable', brandRecommendController.batchEnable.bind(brandRecommendController))
  router.post('/api/proj/brand-recommend/batch/disable', brandRecommendController.batchDisable.bind(brandRecommendController))
  router.post('/api/proj/brand-recommend/batch/delete', brandRecommendController.batchDelete.bind(brandRecommendController))

  // 批量设为推荐（旧路径，保留兼容）
  router.post('/api/proj/brand-recommend/batch-enable', brandRecommendController.batchEnable.bind(brandRecommendController))

  // 批量取消推荐（旧路径，保留兼容）
  router.post('/api/proj/brand-recommend/batch-disable', brandRecommendController.batchDisable.bind(brandRecommendController))

  // 批量删除（旧路径，保留兼容）
  router.post('/api/proj/brand-recommend/batch-delete', brandRecommendController.batchDelete.bind(brandRecommendController))

  // 切换推荐状态
  router.put('/api/proj/brand-recommend/toggle', brandRecommendController.toggleRecommend.bind(brandRecommendController))

  // 设置排序
  router.put('/api/proj/brand-recommend/sort', brandRecommendController.setSortOrder.bind(brandRecommendController))

  // 创建品牌推荐
  router.post('/api/proj/brand-recommend', brandRecommendController.createBrandRecommend.bind(brandRecommendController))

  // 更新品牌推荐（框架约定，不带 ID）
  router.put('/api/proj/brand-recommend', brandRecommendController.updateBrandRecommend.bind(brandRecommendController))

  // 获取品牌推荐列表
  router.get('/api/proj/brand-recommend', brandRecommendController.getBrandRecommendList.bind(brandRecommendController))

  // 获取品牌推荐详情（带 ID）
  router.get('/api/proj/brand-recommend/:id', brandRecommendController.getBrandRecommendDetail.bind(brandRecommendController))

  // 更新品牌推荐（带 ID）
  router.put('/api/proj/brand-recommend/:id', brandRecommendController.updateBrandRecommend.bind(brandRecommendController))

  // 删除品牌推荐
  router.delete('/api/proj/brand-recommend/:id', brandRecommendController.deleteBrandRecommend.bind(brandRecommendController))
}
