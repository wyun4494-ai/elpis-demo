/**
 * 秒杀商品路由
 */
module.exports = (app, router) => {
  const { flashSaleProduct: flashSaleProductController } = app.controller

  // 获取秒杀商品列表
  router.get('/api/proj/flash-sale-product/list', flashSaleProductController.getFlashSaleProductList.bind(flashSaleProductController))

  // 获取时间段商品数量统计
  router.get('/api/proj/flash-sale-product/slot-count', flashSaleProductController.getSlotProductCount.bind(flashSaleProductController))

  // 获取秒杀商品详情
  router.get('/api/proj/flash-sale-product/:flash_sale_product_id', flashSaleProductController.getFlashSaleProduct.bind(flashSaleProductController))

  // 创建秒杀商品
  router.post('/api/proj/flash-sale-product', flashSaleProductController.createFlashSaleProduct.bind(flashSaleProductController))

  // 更新秒杀商品
  router.put('/api/proj/flash-sale-product/:flash_sale_product_id', flashSaleProductController.updateFlashSaleProduct.bind(flashSaleProductController))

  // 删除秒杀商品
  router.delete('/api/proj/flash-sale-product/:flash_sale_product_id', flashSaleProductController.deleteFlashSaleProduct.bind(flashSaleProductController))

  // 批量删除秒杀商品
  router.post('/api/proj/flash-sale-product/batch-delete', flashSaleProductController.batchDeleteFlashSaleProduct.bind(flashSaleProductController))
}
