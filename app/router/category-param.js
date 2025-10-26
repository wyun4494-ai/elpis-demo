module.exports = (app, router) => {
  const { categoryParam: categoryParamController } = app.controller;

  router.get('/api/proj/category-param/list', categoryParamController.getCategoryParamList.bind(categoryParamController));
  router.get('/api/proj/category-param', categoryParamController.get.bind(categoryParamController));
  router.post('/api/proj/category-param/add-from-library', categoryParamController.addFromLibrary.bind(categoryParamController));
  router.post('/api/proj/category-param/create-new', categoryParamController.createNewParam.bind(categoryParamController));
  router.put('/api/proj/category-param', categoryParamController.update.bind(categoryParamController));
  router.delete('/api/proj/category-param', categoryParamController.remove.bind(categoryParamController));
};

