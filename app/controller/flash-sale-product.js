/**
 * 秒杀商品控制器
 * 处理秒杀商品相关的 HTTP 请求
 */
module.exports = (app) => {
  const BaseController = require('@lesheng/elpis').Controller.Base(app)

  return class FlashSaleProductController extends BaseController {
    /**
     * 获取秒杀商品列表
     * @param {Object} ctx - Koa 上下文
     */
    async getFlashSaleProductList(ctx) {
      try {
        const params = ctx.query
        const { flashSaleProduct: flashSaleProductService } = app.service
        const list = await flashSaleProductService.getFlashSaleProductList(params)

        this.success(ctx, list)
      } catch (error) {
        app.logger.error('获取秒杀商品列表失败:', error)
        this.fail(ctx, error.message || '获取秒杀商品列表失败')
      }
    }

    /**
     * 获取秒杀商品详情
     * @param {Object} ctx - Koa 上下文
     */
    async getFlashSaleProduct(ctx) {
      try {
        const { flash_sale_product_id: flashSaleProductId } = ctx.params
        const { flashSaleProduct: flashSaleProductService } = app.service
        const product = await flashSaleProductService.getFlashSaleProduct(flashSaleProductId)

        this.success(ctx, product)
      } catch (error) {
        app.logger.error('获取秒杀商品详情失败:', error)
        this.fail(ctx, error.message || '获取秒杀商品详情失败')
      }
    }

    /**
     * 创建秒杀商品
     * @param {Object} ctx - Koa 上下文
     */
    async createFlashSaleProduct(ctx) {
      try {
        const data = ctx.request.body
        const { flashSaleProduct: flashSaleProductService } = app.service
        const flashSaleProductId = await flashSaleProductService.createFlashSaleProduct(data)

        this.success(ctx, {
          message: '添加成功',
          flash_sale_product_id: flashSaleProductId
        })
      } catch (error) {
        app.logger.error('创建秒杀商品失败:', error)
        this.fail(ctx, error.message || '创建秒杀商品失败')
      }
    }

    /**
     * 更新秒杀商品
     * @param {Object} ctx - Koa 上下文
     */
    async updateFlashSaleProduct(ctx) {
      try {
        const { flash_sale_product_id: flashSaleProductId } = ctx.params
        const data = ctx.request.body
        const { flashSaleProduct: flashSaleProductService } = app.service
        await flashSaleProductService.updateFlashSaleProduct(flashSaleProductId, data)

        this.success(ctx, {
          message: '更新成功',
          flash_sale_product_id: flashSaleProductId
        })
      } catch (error) {
        app.logger.error('更新秒杀商品失败:', error)
        this.fail(ctx, error.message || '更新秒杀商品失败')
      }
    }

    /**
     * 删除秒杀商品
     * @param {Object} ctx - Koa 上下文
     */
    async deleteFlashSaleProduct(ctx) {
      try {
        const { flash_sale_product_id: flashSaleProductId } = ctx.params
        const { flashSaleProduct: flashSaleProductService } = app.service
        await flashSaleProductService.deleteFlashSaleProduct(flashSaleProductId)

        this.success(ctx, {
          message: '删除成功',
          flash_sale_product_id: flashSaleProductId
        })
      } catch (error) {
        app.logger.error('删除秒杀商品失败:', error)
        this.fail(ctx, error.message || '删除秒杀商品失败')
      }
    }

    /**
     * 批量删除秒杀商品
     * @param {Object} ctx - Koa 上下文
     */
    async batchDeleteFlashSaleProduct(ctx) {
      try {
        const { flash_sale_product_ids: flashSaleProductIds } = ctx.request.body
        const { flashSaleProduct: flashSaleProductService } = app.service
        await flashSaleProductService.batchDeleteFlashSaleProduct(flashSaleProductIds)

        this.success(ctx, {
          message: '批量删除成功',
          count: flashSaleProductIds.length
        })
      } catch (error) {
        app.logger.error('批量删除秒杀商品失败:', error)
        this.fail(ctx, error.message || '批量删除秒杀商品失败')
      }
    }

    /**
     * 获取时间段的商品数量统计
     * @param {Object} ctx - Koa 上下文
     */
    async getSlotProductCount(ctx) {
      try {
        const { flash_sale_id: flashSaleId } = ctx.query
        const { flashSaleProduct: flashSaleProductService } = app.service
        const countMap = await flashSaleProductService.getSlotProductCount(flashSaleId)

        this.success(ctx, countMap)
      } catch (error) {
        app.logger.error('获取商品数量统计失败:', error)
        this.fail(ctx, error.message || '获取商品数量统计失败')
      }
    }
  }
}
