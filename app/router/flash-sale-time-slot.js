/**
 * 秒杀时间段路由
 */
module.exports = (app, router) => {
  const { flashSaleTimeSlot: flashSaleTimeSlotController } = app.controller

  // 获取时间段列表
  router.get('/api/proj/flash-sale-time-slot/list', flashSaleTimeSlotController.getTimeSlotList.bind(flashSaleTimeSlotController))

  // 获取时间段详情
  router.get('/api/proj/flash-sale-time-slot/:slot_id', flashSaleTimeSlotController.getTimeSlot.bind(flashSaleTimeSlotController))

  // 创建时间段
  router.post('/api/proj/flash-sale-time-slot', flashSaleTimeSlotController.createTimeSlot.bind(flashSaleTimeSlotController))

  // 更新时间段
  router.put('/api/proj/flash-sale-time-slot/:slot_id', flashSaleTimeSlotController.updateTimeSlot.bind(flashSaleTimeSlotController))

  // 删除时间段
  router.delete('/api/proj/flash-sale-time-slot/:slot_id', flashSaleTimeSlotController.deleteTimeSlot.bind(flashSaleTimeSlotController))

  // 批量删除时间段
  router.post('/api/proj/flash-sale-time-slot/batch-delete', flashSaleTimeSlotController.batchDeleteTimeSlot.bind(flashSaleTimeSlotController))

  // 切换时间段启用状态
  router.put('/api/proj/flash-sale-time-slot/:slot_id/toggle-status', flashSaleTimeSlotController.toggleTimeSlotStatus.bind(flashSaleTimeSlotController))
}
