module.exports = (app,router) => {
  const { business: businessController} = app.controller;

  router.post('/api/proj/product',businessController.create.bind(businessController));

  router.get('/api/proj/product',businessController.get.bind(businessController));

  router.put('/api/proj/product',businessController.update.bind(businessController));

  router.delete('/api/proj/product',businessController.remove.bind(businessController));

  router.get('/api/proj/product/list',businessController.getProductList.bind(businessController));

  router.get('/api/proj/product_enum/list',businessController.getProductEnumList.bind(businessController));
}