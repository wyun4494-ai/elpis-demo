/**
 * 广告推荐路由
 */
module.exports = (app, router) => {
  const { advertisement: advertisementController } = app.controller

  // 获取广告列表（框架约定的 /list 路径）
  router.get('/api/proj/advertisement/list', advertisementController.getAdvertisementList.bind(advertisementController))

  // 批量操作路由（框架约定格式：/batch/操作名）
  router.post('/api/proj/advertisement/batch/enable', advertisementController.batchEnable.bind(advertisementController))
  router.post('/api/proj/advertisement/batch/disable', advertisementController.batchDisable.bind(advertisementController))
  router.post('/api/proj/advertisement/batch/delete', advertisementController.batchDelete.bind(advertisementController))

  // 批量启用（旧路径，保留兼容）
  router.post('/api/proj/advertisement/batch-enable', advertisementController.batchEnable.bind(advertisementController))

  // 批量禁用（旧路径，保留兼容）
  router.post('/api/proj/advertisement/batch-disable', advertisementController.batchDisable.bind(advertisementController))

  // 批量删除（旧路径，保留兼容）
  router.post('/api/proj/advertisement/batch-delete', advertisementController.batchDelete.bind(advertisementController))

  // 切换启用状态
  router.put('/api/proj/advertisement/toggle', advertisementController.toggleEnabled.bind(advertisementController))

  // 创建广告
  router.post('/api/proj/advertisement', advertisementController.createAdvertisement.bind(advertisementController))

  // 更新广告（不带 ID）
  router.put('/api/proj/advertisement', advertisementController.updateAdvertisement.bind(advertisementController))

  // 获取广告列表
  router.get('/api/proj/advertisement', advertisementController.getAdvertisementList.bind(advertisementController))

  // 获取广告详情（带 ID）
  router.get('/api/proj/advertisement/:id', advertisementController.getAdvertisementDetail.bind(advertisementController))

  // 更新广告（带 ID）
  router.put('/api/proj/advertisement/:id', advertisementController.updateAdvertisement.bind(advertisementController))

  // 删除广告
  router.delete('/api/proj/advertisement/:id', advertisementController.deleteAdvertisement.bind(advertisementController))
}
