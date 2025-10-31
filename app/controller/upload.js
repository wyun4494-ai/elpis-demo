/**
 * 图片上传控制器
 * 处理图片上传相关的 HTTP 请求（通用图片、品牌Logo、商品图片）
 *
 * 上传规范：
 * - 文件大小限制：5MB
 * - 存储路径：app/public/uploads/{category}/YYYY-MM/
 * - 文件命名：{timestamp}_{uuid}.{ext}
 * - 支持格式：jpg/png/gif
 *
 * @class UploadController
 * @extends BaseController
 */
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
     *
     * @returns {Function} multer 中间件（单文件上传）
     */
    getUploadMiddleware() {
      return upload.single('file');
    }

    /**
     * 上传图片（通用）
     *
     * @param {Object} ctx - Koa 上下文对象
     * @param {Object} ctx.file - multer 处理后的文件对象
     * @param {Buffer} ctx.file.buffer - 文件内容（Buffer）
     * @param {string} ctx.file.originalname - 原始文件名
     * @param {string} ctx.file.mimetype - 文件MIME类型
     * @param {number} ctx.file.size - 文件大小（字节）
     * @param {Object} ctx.request.body - 请求体参数
     * @param {string} [ctx.request.body.type='common'] - 上传类型（common/brand/product）
     * @returns {Promise<void>}
     */
    async uploadImage(ctx) {
      try {
        // 1. 获取上传的文件（multer 处理后的文件）
        const file = ctx.file;

        if (!file) {
          this.fail(ctx, '未接收到文件', 400);
          return;
        }

        // 2. 获取上传类型
        const uploadType = ctx.request.body?.type || 'common';

        // 3. 调用 Service 处理文件上传
        const { upload: uploadService } = app.service;
        const result = await uploadService.uploadImage(file, uploadType);

        // 4. 返回上传结果
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
     *
     * @param {Object} ctx - Koa 上下文对象
     * @param {Object} ctx.file - multer 处理后的文件对象
     * @returns {Promise<void>}
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
     *
     * @param {Object} ctx - Koa 上下文对象
     * @param {Object} ctx.file - multer 处理后的文件对象
     * @returns {Promise<void>}
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

