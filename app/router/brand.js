module.exports = (app, router) => {
  const { brand: brandController } = app.controller;

  // 品牌列表
  router.get('/api/proj/brand/list', 
    brandController.getBrandList.bind(brandController));

  // 品牌详情
  router.get('/api/proj/brand', 
    brandController.getBrand.bind(brandController));

  // 创建品牌
  router.post('/api/proj/brand', 
    brandController.create.bind(brandController));

  // 更新品牌
  router.put('/api/proj/brand', 
    brandController.update.bind(brandController));

  // 删除品牌
  router.delete('/api/proj/brand', 
    brandController.remove.bind(brandController));

  // 远程搜索品牌（用于下拉选择）
  router.get('/api/proj/brand/search', 
    brandController.searchBrand.bind(brandController));
};

