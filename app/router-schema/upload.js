module.exports = {
  '/api/upload/image': {
    post: {
      // 文件上传不需要严格的参数验证
      // multipart/form-data 由中间件处理
    }
  },
  '/api/upload/brand-logo': {
    post: {}
  },
  '/api/upload/product-image': {
    post: {}
  }
};

