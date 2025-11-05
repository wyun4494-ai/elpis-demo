module.exports = (app, router) => {
  const { productAudit: productAuditController } = app.controller;

  // 审核列表路由
  router.get('/api/proj/product-audit/list', productAuditController.getAuditList.bind(productAuditController));

  // 审核详情路由
  router.get('/api/proj/product-audit', productAuditController.getAuditDetail.bind(productAuditController));

  // 执行审核路由
  router.post('/api/proj/product-audit/audit', productAuditController.auditProduct.bind(productAuditController));

  // 审核历史路由
  router.get('/api/proj/product-audit/history', productAuditController.getAuditHistory.bind(productAuditController));
};

