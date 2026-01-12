/**
 * 秒杀活动管理路由
 */
module.exports = (app, router) => {
  const { flashSale: flashSaleController } = app.controller

  // 秒杀活动列表
  router.get('/api/proj/flash-sale/list', flashSaleController.getFlashSaleList.bind(flashSaleController))

  // 秒杀活动详情（支持 query 参数）
  router.get('/api/proj/flash-sale', flashSaleController.getFlashSale.bind(flashSaleController))

  // 秒杀活动详情（支持路径参数）
  router.get('/api/proj/flash-sale/:flash_sale_id', flashSaleController.getFlashSale.bind(flashSaleController))

  // 创建秒杀活动
  router.post('/api/proj/flash-sale', flashSaleController.createFlashSale.bind(flashSaleController))

  // 更新秒杀活动
  router.put('/api/proj/flash-sale', flashSaleController.updateFlashSale.bind(flashSaleController))
  
  // 更新秒杀活动（支持表格列内编辑）
  router.put('/api/proj/flash-sale/:flash_sale_id', flashSaleController.updateFlashSale.bind(flashSaleController))

  // 删除秒杀活动
  router.delete('/api/proj/flash-sale/:flash_sale_id', flashSaleController.deleteFlashSale.bind(flashSaleController))

  // 批量删除秒杀活动
  router.post('/api/proj/flash-sale/batch-delete', flashSaleController.batchDeleteFlashSale.bind(flashSaleController))
}
