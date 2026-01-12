/**
 * 广告位置路由
 */
module.exports = (app, router) => {
  const { adPosition: adPositionController } = app.controller;

  // 获取广告位置列表
  router.get('/api/proj/ad-position/list', 
    adPositionController.getList.bind(adPositionController));

  // 获取所有启用的广告位置（用于下拉选择）
  router.get('/api/proj/ad-position/all', 
    adPositionController.getAllEnabled.bind(adPositionController));

  // 获取广告位置详情
  router.get('/api/proj/ad-position', 
    adPositionController.getDetail.bind(adPositionController));

  // 创建广告位置
  router.post('/api/proj/ad-position', 
    adPositionController.create.bind(adPositionController));

  // 更新广告位置
  router.put('/api/proj/ad-position', 
    adPositionController.update.bind(adPositionController));

  // 删除广告位置
  router.delete('/api/proj/ad-position', 
    adPositionController.remove.bind(adPositionController));

  // 切换启用状态
  router.post('/api/proj/ad-position/toggle', 
    adPositionController.toggle.bind(adPositionController));

  // 批量启用
  router.post('/api/proj/ad-position/batch/enable', 
    adPositionController.batchEnable.bind(adPositionController));

  // 批量禁用
  router.post('/api/proj/ad-position/batch/disable', 
    adPositionController.batchDisable.bind(adPositionController));

  // 批量删除
  router.post('/api/proj/ad-position/batch/delete', 
    adPositionController.batchDelete.bind(adPositionController));
};
