module.exports = (app) => {
  const BaseController = require('@lesheng/elpis').Controller.Base(app);
  const multer = require('@koa/multer');
  
  // 配置 multer（内存存储）
  const storage = multer.memoryStorage();
  const upload = multer({ 
    storage: storage,
    limits: {
      fileSize: 5 * 1024 * 1024 // 5MB
    }
  });

  return class UploadController extends BaseController {

    /**
     * 获取 multer 中间件
     */
    getUploadMiddleware() {
      return upload.single('file');
    }

    /**
     * 上传图片
     */
    async uploadImage(ctx) {
      try {
        // 获取上传的文件（multer 处理后的文件）
        const file = ctx.file;
        
        if (!file) {
          this.fail(ctx, '未接收到文件', 400);
          return;
        }

        // 获取上传类型
        const uploadType = ctx.request.body?.type || 'common';

        const { upload: uploadService } = app.service;
        const result = await uploadService.uploadImage(file, uploadType);

        this.success(ctx, result.url, {
          filename: result.filename,
          originalname: result.originalname,
          size: result.size
        });
      } catch (error) {
        this.fail(ctx, error.message, 500);
      }
    }

    /**
     * 上传品牌Logo
     */
    async uploadBrandLogo(ctx) {
      try {
        const file = ctx.file;
        
        if (!file) {
          this.fail(ctx, '未接收到文件', 400);
          return;
        }

        const { upload: uploadService } = app.service;
        const result = await uploadService.uploadImage(file, 'brand');

        this.success(ctx, result.url, {
          filename: result.filename,
          originalname: result.originalname,
          size: result.size
        });
      } catch (error) {
        this.fail(ctx, error.message, 500);
      }
    }

    /**
     * 上传商品图片
     */
    async uploadProductImage(ctx) {
      try {
        const file = ctx.file;
        
        if (!file) {
          this.fail(ctx, '未接收到文件', 400);
          return;
        }

        const { upload: uploadService } = app.service;
        const result = await uploadService.uploadImage(file, 'product');

        this.success(ctx, result.url, {
          filename: result.filename,
          originalname: result.originalname,
          size: result.size
        });
      } catch (error) {
        this.fail(ctx, error.message, 500);
      }
    }
  };
};

