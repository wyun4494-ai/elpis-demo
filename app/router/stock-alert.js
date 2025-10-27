module.exports = (app, router) => {
  const { stockAlert: stockAlertController } = app.controller;

  // 库存预警路由
  router.get('/api/proj/stock-alert/list', stockAlertController.getAlertList.bind(stockAlertController));
  router.get('/api/proj/stock-alert/log/list', stockAlertController.getAlertLogList.bind(stockAlertController));
  router.post('/api/proj/stock-alert/handle', stockAlertController.handleAlert.bind(stockAlertController));
  router.post('/api/proj/stock-alert/batch-handle', stockAlertController.batchHandleAlert.bind(stockAlertController));
  router.get('/api/proj/stock-alert/statistics', stockAlertController.getStatistics.bind(stockAlertController));
  router.post('/api/proj/stock-alert/restock', stockAlertController.restock.bind(stockAlertController));
};

