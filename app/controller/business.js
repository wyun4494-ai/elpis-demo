/**
 * 商品管理控制器
 * 处理商品相关的 HTTP 请求（CRUD、上下架、回收站等）
 *
 * @class BusinessController
 * @extends BaseController
 */
module.exports = (app) => {
  const BaseController = require('@lesheng/elpis').Controller.Base(app);

  return class BusinessController extends BaseController {

    /**
     * 获取商品详情
     *
     * @param {Object} ctx - Koa 上下文对象
     * @param {Object} ctx.query - 查询参数
     * @param {string} ctx.query.product_id - 商品ID
     * @returns {Promise<void>}
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
     *
     * @param {Object} ctx - Koa 上下文对象
     * @param {Object} ctx.query - 查询参数
     * @param {string} ctx.query.product_id - 商品ID
     * @returns {Promise<void>}
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
     *
     * @param {Object} ctx - Koa 上下文对象
     * @param {Object} ctx.request.body - 请求体参数
     * @param {string} ctx.request.body.product_name - 商品名称
     * @param {string} ctx.request.body.category_id - 分类ID
     * @param {string} ctx.request.body.brand_id - 品牌ID
     * @param {number} ctx.request.body.price - 价格
     * @param {number} ctx.request.body.inventory - 总库存
     * @param {number} ctx.request.body.shelf_status - 上架状态（0-下架，1-上架）
     * @returns {Promise<void>}
     */
    async create(ctx) {
      const params = ctx.request.body;
      const { business: businessService } = app.service;

      // 业务规则：新建商品不允许直接上架（需要先审核）
      if (params.shelf_status === 1) {
        this.fail(ctx, '新建商品需要先审核通过才能上架', 400);
        return;
      }

      const productId = await businessService.createProduct(params);

      this.success(ctx, {
        message: '创建成功',
        product_id: productId
      });
    }

    /**
     * 修改商品
     *
     * @param {Object} ctx - Koa 上下文对象
     * @param {Object} ctx.request.body - 请求体参数
     * @param {string} ctx.request.body.product_id - 商品ID
     * @param {number} [ctx.request.body.shelf_status] - 上架状态（0-下架，1-上架）
     * @returns {Promise<void>}
     */
    async update(ctx) {
      const params = ctx.request.body;
      const { business: businessService } = app.service;

      // 业务规则：如果是上架操作，需要验证库存和审核状态
      if (params.shelf_status === 1) {
        const product = await businessService.getProduct(params.product_id);
        if (product) {
          if (product.inventory === 0) {
            this.fail(ctx, '总库存为0，不能上架', 400);
            return;
          }
          if (product.audit_status !== 1) {
            this.fail(ctx, '商品未审核通过，不能上架', 400);
            return;
          }
        }
      }

      await businessService.updateProduct(params);

      this.success(ctx, {
        message: '修改成功',
        product_id: params.product_id
      });
    }

    /**
     * 删除商品（软删除）
     *
     * @param {Object} ctx - Koa 上下文对象
     * @param {Object} ctx.request.body - 请求体参数
     * @param {string} ctx.request.body.product_id - 商品ID
     * @param {string} ctx.request.body.delete_reason - 删除原因
     * @returns {Promise<void>}
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
     * 获取商品列表（分页）
     *
     * @param {Object} ctx - Koa 上下文对象
     * @param {Object} ctx.query - 查询参数
     * @param {string} [ctx.query.product_name] - 商品名称（模糊查询）
     * @param {string} [ctx.query.category_id] - 分类ID
     * @param {string} [ctx.query.brand_id] - 品牌ID
     * @param {number} [ctx.query.price] - 价格
     * @param {number} [ctx.query.inventory] - 库存
     * @param {number} [ctx.query.shelf_status] - 上架状态（0-下架，1-上架）
     * @param {string} [ctx.query.create_time_start] - 创建时间开始
     * @param {string} [ctx.query.create_time_end] - 创建时间结束
     * @param {number} [ctx.query.page=1] - 页码
     * @param {number} [ctx.query.pageSize=10] - 每页数量
     * @returns {Promise<void>}
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
     * 获取商品名称枚举列表（用于搜索下拉选择）
     *
     * @param {Object} ctx - Koa 上下文对象
     * @returns {Promise<void>}
     */
    async getProductNameEnum(ctx) {
      const { business: businessService } = app.service;
      const enumList = await businessService.getProductNameEnum();
      this.success(ctx, enumList);
    }

    /**
     * 获取价格枚举列表（用于搜索下拉选择）
     *
     * @param {Object} ctx - Koa 上下文对象
     * @returns {Promise<void>}
     */
    async getPriceEnum(ctx) {
      const { business: businessService } = app.service;
      const enumList = await businessService.getPriceEnum();
      this.success(ctx, enumList);
    }

    /**
     * 获取库存枚举列表（用于搜索下拉选择）
     *
     * @param {Object} ctx - Koa 上下文对象
     * @returns {Promise<void>}
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

    /**
     * 获取商品的所有SKU
     */
    async getProductSkus(ctx) {
      const { product_id: productId } = ctx.params;
      const { business: businessService } = app.service;

      const skus = await businessService.getProductSkus(productId);

      this.success(ctx, skus);
    }

    /**
     * 获取商品的SKU列表（用于查询参数）
     */
    async getProductSkuList(ctx) {
      const { product_id: productId } = ctx.query;
      const { business: businessService } = app.service;

      try {
        const skus = await businessService.getProductSkus(productId);
        this.success(ctx, skus);
      } catch (error) {
        app.logger.error('获取商品SKU列表失败:', error);
        this.fail(ctx, error.message, 400);
      }
    }

    /**
     * 批量更新商品SKU
     */
    async updateProductSkus(ctx) {
      const { product_id: productId } = ctx.params;
      const { skus } = ctx.request.body;
      const { business: businessService } = app.service;

      await businessService.updateProductSkus(productId, skus);

      this.success(ctx, { message: '更新成功' });
    }

    /**
     * 获取商品的所有参数值
     */
    async getProductParams(ctx) {
      const { product_id: productId } = ctx.params;
      const { business: businessService } = app.service;

      const params = await businessService.getProductParams(productId);

      this.success(ctx, params);
    }

    /**
     * 批量上架商品
     *
     * @param {Object} ctx - Koa 上下文对象
     * @param {Object} ctx.request.body - 请求体参数
     * @param {Array<string>} ctx.request.body.product_ids - 商品ID列表
     * @returns {Promise<void>}
     */
    async batchShelfOn(ctx) {
      const { product_ids: productIds } = ctx.request.body;
      const { business: businessService } = app.service;

      try {
        const result = await businessService.batchShelfOn(productIds);
        this.success(ctx, result);
      } catch (error) {
        app.logger.error('批量上架失败', error);
        this.fail(ctx, error.message, 400);
      }
    }

    /**
     * 批量下架商品
     *
     * @param {Object} ctx - Koa 上下文对象
     * @param {Object} ctx.request.body - 请求体参数
     * @param {Array<string>} ctx.request.body.product_ids - 商品ID列表
     * @returns {Promise<void>}
     */
    async batchShelfOff(ctx) {
      const { product_ids: productIds } = ctx.request.body;
      const { business: businessService } = app.service;

      try {
        const result = await businessService.batchShelfOff(productIds);
        this.success(ctx, result);
      } catch (error) {
        app.logger.error('批量下架失败', error);
        this.fail(ctx, error.message, 400);
      }
    }

    /**
     * 批量删除商品
     *
     * @param {Object} ctx - Koa 上下文对象
     * @param {Object} ctx.request.body - 请求体参数
     * @param {Array<string>} ctx.request.body.product_ids - 商品ID列表
     * @param {string} [ctx.request.body.delete_reason] - 删除原因
     * @returns {Promise<void>}
     */
    async batchDelete(ctx) {
      const { product_ids: productIds, delete_reason: deleteReason } = ctx.request.body;
      const { business: businessService } = app.service;

      // 获取当前用户ID（从JWT Token中解析）
      const userId = ctx.userId || 'system';

      try {
        const result = await businessService.batchDeleteProduct(productIds, deleteReason, userId);
        this.success(ctx, result);
      } catch (error) {
        app.logger.error('批量删除失败', error);
        this.fail(ctx, error.message, 400);
      }
    }

    /**
     * 批量恢复商品
     *
     * @param {Object} ctx - Koa 上下文对象
     * @param {Object} ctx.request.body - 请求体参数
     * @param {Array<string>} ctx.request.body.product_ids - 商品ID列表
     * @param {string} [ctx.request.body.note] - 恢复备注
     * @returns {Promise<void>}
     */
    async batchRestore(ctx) {
      const { product_ids: productIds, note } = ctx.request.body;
      const { business: businessService } = app.service;

      // 获取当前用户ID（从JWT Token中解析）
      const userId = ctx.userId || 'system';

      try {
        const result = await businessService.batchRestoreProduct(productIds, note, userId);
        this.success(ctx, result);
      } catch (error) {
        app.logger.error('批量恢复失败', error);
        this.fail(ctx, error.message, 400);
      }
    }

    /**
     * 批量永久删除商品
     *
     * @param {Object} ctx - Koa 上下文对象
     * @param {Object} ctx.request.body - 请求体参数
     * @param {Array<string>} ctx.request.body.product_ids - 商品ID列表
     * @param {string} [ctx.request.body.note] - 删除备注
     * @returns {Promise<void>}
     */
    async batchPermanentDelete(ctx) {
      const { product_ids: productIds, note } = ctx.request.body;
      const { business: businessService } = app.service;

      try {
        const result = await businessService.batchPermanentDeleteProduct(productIds, note);
        this.success(ctx, result);
      } catch (error) {
        app.logger.error('批量永久删除失败', error);
        this.fail(ctx, error.message, 400);
      }
    }
  };
};
