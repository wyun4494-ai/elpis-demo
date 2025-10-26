module.exports = (app, router) => {
  const { upload: uploadController } = app.controller;
  const multer = require('@koa/multer');
  
  // 配置 multer（内存存储）
  const storage = multer.memoryStorage();
  const uploadMiddleware = multer({ 
    storage: storage,
    limits: {
      fileSize: 5 * 1024 * 1024 // 5MB
    }
  }).single('file');

  // 通用图片上传
  router.post('/api/upload/image', 
    uploadMiddleware,
    uploadController.uploadImage.bind(uploadController));

  // 品牌Logo上传
  router.post('/api/upload/brand-logo', 
    uploadMiddleware,
    uploadController.uploadBrandLogo.bind(uploadController));

  // 商品图片上传
  router.post('/api/upload/product-image', 
    uploadMiddleware,
    uploadController.uploadProductImage.bind(uploadController));
};

