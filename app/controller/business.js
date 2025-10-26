module.exports = (app) => {
  const BaseController = require('@lesheng/elpis').Controller.Base(app);
  
  return class BusinessController extends BaseController {

    /**
     * 获取商品详情
     */
    async get(ctx) {
      const { product_id: productId } = ctx.query;
      const { business: businessService } = app.service;

      const productItem = await businessService.getProduct(productId);

      if (!productItem) {
        this.fail(ctx, '商品不存在', 404);
        return;
      }

      this.success(ctx, productItem);
    }

    /**
     * 获取回收站商品详情
     */
    async getRecycleProduct(ctx) {
      const { product_id: productId } = ctx.query;
      const { business: businessService } = app.service;

      const productItem = await businessService.getRecycleProduct(productId);

      if (!productItem) {
        this.fail(ctx, '回收站中未找到该商品', 404);
        return;
      }

      this.success(ctx, productItem);
    }

    /**
     * 创建商品
     */
    async create(ctx) {
      const params = ctx.request.body;
      const { business: businessService } = app.service;

      const productId = await businessService.createProduct(params);

      this.success(ctx, {
        message: '创建成功',
        product_id: productId
      });
    }

    /**
     * 修改商品
     */
    async update(ctx) {
      const params = ctx.request.body;
      const { business: businessService } = app.service;

      await businessService.updateProduct(params);

      this.success(ctx, {
        message: '修改成功',
        product_id: params.product_id
      });
    }

    /**
     * 删除商品（软删除）
     */
    async remove(ctx) {
      const { product_id: productId, delete_reason: deleteReason } = ctx.request.body;
      const { business: businessService } = app.service;
      
      // 获取当前用户ID（从JWT Token中解析）
      const userId = ctx.userId || 'system';

      await businessService.deleteProduct(productId, deleteReason, userId);

      this.success(ctx, {
        message: '删除成功',
        product_id: productId
      });
    }

    /**
     * 获取商品列表
     */
    async getProductList(ctx) {
      const params = ctx.query;
      const { business: businessService } = app.service;

      const result = await businessService.getProductList(params);

      this.success(ctx, result.list, {
        total: result.total,
        page: result.page,
        pageSize: result.pageSize
      });
    }

    /**
     * 获取商品名称枚举列表
     */
    async getProductNameEnum(ctx) {
      const { business: businessService } = app.service;
      const enumList = await businessService.getProductNameEnum();
      this.success(ctx, enumList);
    }

    /**
     * 获取价格枚举列表
     */
    async getPriceEnum(ctx) {
      const { business: businessService } = app.service;
      const enumList = await businessService.getPriceEnum();
      this.success(ctx, enumList);
    }

    /**
     * 获取库存枚举列表
     */
    async getInventoryEnum(ctx) {
      const { business: businessService } = app.service;
      const enumList = await businessService.getInventoryEnum();
      this.success(ctx, enumList);
    }

    /**
     * 远程搜索商品
     */
    async searchProduct(ctx) {
      const params = ctx.query;
      const { business: businessService } = app.service;
      const list = await businessService.searchProduct(params);
      this.success(ctx, list);
    }

    /**
     * 获取回收站商品列表
     */
    async getRecycleProductList(ctx) {
      const params = ctx.query;
      const { business: businessService } = app.service;

      const result = await businessService.getRecycleProductList(params);

      this.success(ctx, result.list, {
        total: result.total,
        page: result.page,
        pageSize: result.pageSize
      });
    }

    /**
     * 恢复商品
     */
    async restoreProduct(ctx) {
      const { product_id: productId } = ctx.request.body;
      const { business: businessService } = app.service;

      await businessService.restoreProduct(productId);

      this.success(ctx, {
        message: '恢复成功',
        product_id: productId
      });
    }

    /**
     * 永久删除商品
     */
    async permanentDeleteProduct(ctx) {
      const { product_id: productId } = ctx.request.body;
      const { business: businessService } = app.service;

      await businessService.permanentDeleteProduct(productId);

      this.success(ctx, {
        message: '永久删除成功',
        product_id: productId
      });
    }

    /**
     * 恢复商品（回收站操作）
     */
    async restore(ctx) {
      const { product_id: productId } = ctx.request.body;
      const { business: businessService } = app.service;
      
      // 获取当前用户ID
      const userId = ctx.userId || 'system';

      await businessService.restoreProduct(productId, userId);

      this.success(ctx, {
        message: '恢复成功',
        product_id: productId
      });
    }

    /**
     * 永久删除（回收站操作）
     */
    async permanentDelete(ctx) {
      const { product_id: productId } = ctx.request.body;
      const { business: businessService } = app.service;

      await businessService.permanentDeleteProduct(productId);

      this.success(ctx, {
        message: '永久删除成功',
        product_id: productId
      });
    }
  };
};
