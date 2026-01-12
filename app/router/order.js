module.exports = (app, router) => {
  const { order: orderController } = app.controller;

  // 订单 CRUD 路由
  router.get('/api/proj/order/list', orderController.getList.bind(orderController));
  router.get('/api/proj/order/:order_id', orderController.get.bind(orderController)); // RESTful 风格
  router.get('/api/proj/order', orderController.get.bind(orderController)); // Query 参数风格
  router.put('/api/proj/order/:order_id', orderController.update.bind(orderController)); // RESTful 风格
  router.put('/api/proj/order', orderController.update.bind(orderController)); // Query 参数风格
  router.delete('/api/proj/order/:order_id', orderController.delete.bind(orderController)); // RESTful 风格
  router.delete('/api/proj/order', orderController.delete.bind(orderController)); // Query 参数风格

  // 订单操作路由
  router.post('/api/proj/order/cancel', orderController.cancel.bind(orderController));
  router.post('/api/proj/order/deliver', orderController.deliver.bind(orderController));
  router.post('/api/proj/order/confirm-receive', orderController.confirmReceive.bind(orderController));
  
  // 批量操作路由
  router.post('/api/proj/order/batch-cancel', orderController.batchCancel.bind(orderController));
  router.post('/api/proj/order/batch-delete', orderController.batchDelete.bind(orderController));
  
  // 导出路由
  router.get('/api/proj/order/export', orderController.export.bind(orderController));
};
