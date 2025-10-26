module.exports = (app, router) => {
  const { attribute: attributeController } = app.controller;

  router.get('/api/proj/attribute/list', attributeController.getAttributeList.bind(attributeController));
  router.get('/api/proj/attribute', attributeController.get.bind(attributeController));
  router.post('/api/proj/attribute', attributeController.create.bind(attributeController));
  router.put('/api/proj/attribute', attributeController.update.bind(attributeController));
  router.delete('/api/proj/attribute', attributeController.remove.bind(attributeController));
};

