/**
 * 专题推荐路由
 */
module.exports = (app, router) => {
  const { topicRecommend: topicRecommendController } = app.controller

  // 获取专题推荐列表（框架约定的 /list 路径）
  router.get('/api/proj/topic-recommend/list', topicRecommendController.getTopicRecommendList.bind(topicRecommendController))

  // 批量操作路由（框架约定格式：/batch/操作名）
  router.post('/api/proj/topic-recommend/batch/enable', topicRecommendController.batchEnable.bind(topicRecommendController))
  router.post('/api/proj/topic-recommend/batch/disable', topicRecommendController.batchDisable.bind(topicRecommendController))
  router.post('/api/proj/topic-recommend/batch/delete', topicRecommendController.batchDelete.bind(topicRecommendController))

  // 批量设为推荐（旧路径，保留兼容）
  router.post('/api/proj/topic-recommend/batch-enable', topicRecommendController.batchEnable.bind(topicRecommendController))

  // 批量取消推荐（旧路径，保留兼容）
  router.post('/api/proj/topic-recommend/batch-disable', topicRecommendController.batchDisable.bind(topicRecommendController))

  // 批量删除（旧路径，保留兼容）
  router.post('/api/proj/topic-recommend/batch-delete', topicRecommendController.batchDelete.bind(topicRecommendController))

  // 切换推荐状态
  router.put('/api/proj/topic-recommend/toggle', topicRecommendController.toggleRecommend.bind(topicRecommendController))

  // 创建专题推荐
  router.post('/api/proj/topic-recommend', topicRecommendController.createTopicRecommend.bind(topicRecommendController))

  // 更新专题推荐（不带 ID）
  router.put('/api/proj/topic-recommend', topicRecommendController.updateTopicRecommend.bind(topicRecommendController))

  // 获取专题推荐列表
  router.get('/api/proj/topic-recommend', topicRecommendController.getTopicRecommendList.bind(topicRecommendController))

  // 获取专题推荐详情（带 ID）
  router.get('/api/proj/topic-recommend/:id', topicRecommendController.getTopicRecommendDetail.bind(topicRecommendController))

  // 更新专题推荐（带 ID）
  router.put('/api/proj/topic-recommend/:id', topicRecommendController.updateTopicRecommend.bind(topicRecommendController))

  // 删除专题推荐
  router.delete('/api/proj/topic-recommend/:id', topicRecommendController.deleteTopicRecommend.bind(topicRecommendController))
}
