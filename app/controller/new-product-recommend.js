/**
 * 新品推荐控制器
 */
module.exports = (app) => {
  const BaseController = require('@lesheng/elpis').Controller.Base(app)

  return class NewProductRecommendController extends BaseController {
    /**
     * 获取新品推荐列表
     * @param {Object} ctx - Koa 上下文
     */
    async getNewProductRecommendList(ctx) {
      try {
        const params = ctx.query
        const { newProductRecommend: newProductRecommendService } = app.service
        
        // 如果有 recommend_id，说明是查询详情
        if (params.recommend_id) {
          const result = await newProductRecommendService.getNewProductRecommendDetail(params.recommend_id)
          this.success(ctx, result)
          return
        }
        
        // 否则查询列表
        const result = await newProductRecommendService.getNewProductRecommendList(params)
        this.success(ctx, result.list, { total: result.total })
      } catch (error) {
        app.logger.error('获取新品推荐列表失败:', error)
        this.fail(ctx, error.message)
      }
    }

    /**
     * 获取新品推荐详情
     * @param {Object} ctx - Koa 上下文
     */
    async getNewProductRecommendDetail(ctx) {
      try {
        const recommend_id = ctx.params.id || ctx.query.recommend_id
        const { newProductRecommend: newProductRecommendService } = app.service
        const result = await newProductRecommendService.getNewProductRecommendDetail(recommend_id)
        this.success(ctx, result)
      } catch (error) {
        app.logger.error('获取新品推荐详情失败:', error)
        this.fail(ctx, error.message)
      }
    }

    /**
     * 创建新品推荐
     * @param {Object} ctx - Koa 上下文
     */
    async createNewProductRecommend(ctx) {
      try {
        const data = ctx.request.body
        
        // 获取当前用户ID
        const userId = ctx.state.user?.user_id || 'system'
        data.created_by = userId

        const { newProductRecommend: newProductRecommendService } = app.service
        const recommendId = await newProductRecommendService.createNewProductRecommend(data)
        this.success(ctx, { recommend_id: recommendId })
      } catch (error) {
        app.logger.error('创建新品推荐失败:', error)
        this.fail(ctx, error.message)
      }
    }

    /**
     * 更新新品推荐
     * @param {Object} ctx - Koa 上下文
     */
    async updateNewProductRecommend(ctx) {
      try {
        const recommend_id = ctx.params.id || ctx.request.body.recommend_id
        const data = ctx.request.body

        const { newProductRecommend: newProductRecommendService } = app.service
        await newProductRecommendService.updateNewProductRecommend(recommend_id, data)
        this.success(ctx, null, { message: '更新成功' })
      } catch (error) {
        app.logger.error('更新新品推荐失败:', error)
        this.fail(ctx, error.message)
      }
    }

    /**
     * 删除新品推荐
     * @param {Object} ctx - Koa 上下文
     */
    async deleteNewProductRecommend(ctx) {
      try {
        const recommend_id = ctx.params.id || ctx.query.recommend_id
        const { newProductRecommend: newProductRecommendService } = app.service
        await newProductRecommendService.deleteNewProductRecommend(recommend_id)
        this.success(ctx, null, { message: '删除成功' })
      } catch (error) {
        app.logger.error('删除新品推荐失败:', error)
        this.fail(ctx, error.message)
      }
    }

    /**
     * 切换推荐状态
     * @param {Object} ctx - Koa 上下文
     */
    async toggleRecommend(ctx) {
      try {
        const { recommend_id, is_enabled } = ctx.request.body
        const { newProductRecommend: newProductRecommendService } = app.service
        await newProductRecommendService.toggleRecommend(recommend_id, is_enabled)
        this.success(ctx, null, { message: '操作成功' })
      } catch (error) {
        app.logger.error('切换推荐状态失败:', error)
        this.fail(ctx, error.message)
      }
    }

    /**
     * 批量设为推荐
     * @param {Object} ctx - Koa 上下文
     */
    async batchEnable(ctx) {
      try {
        const { recommend_ids } = ctx.request.body
        const { newProductRecommend: newProductRecommendService } = app.service
        await newProductRecommendService.batchEnable(recommend_ids)
        this.success(ctx, null, { message: '批量设为推荐成功' })
      } catch (error) {
        app.logger.error('批量设为推荐失败:', error)
        this.fail(ctx, error.message)
      }
    }

    /**
     * 批量取消推荐
     * @param {Object} ctx - Koa 上下文
     */
    async batchDisable(ctx) {
      try {
        const { recommend_ids } = ctx.request.body
        const { newProductRecommend: newProductRecommendService } = app.service
        await newProductRecommendService.batchDisable(recommend_ids)
        this.success(ctx, null, { message: '批量取消推荐成功' })
      } catch (error) {
        app.logger.error('批量取消推荐失败:', error)
        this.fail(ctx, error.message)
      }
    }

    /**
     * 批量删除
     * @param {Object} ctx - Koa 上下文
     */
    async batchDelete(ctx) {
      try {
        const { recommend_ids } = ctx.request.body
        const { newProductRecommend: newProductRecommendService } = app.service
        await newProductRecommendService.batchDelete(recommend_ids)
        this.success(ctx, null, { message: '批量删除成功' })
      } catch (error) {
        app.logger.error('批量删除失败:', error)
        this.fail(ctx, error.message)
      }
    }

    /**
     * 获取可推荐的商品列表
     * @param {Object} ctx - Koa 上下文
     */
    async getAvailableProducts(ctx) {
      try {
        const params = ctx.query
        const { newProductRecommend: newProductRecommendService } = app.service
        const products = await newProductRecommendService.getAvailableProducts(params)
        this.success(ctx, products)
      } catch (error) {
        app.logger.error('获取可推荐商品列表失败:', error)
        this.fail(ctx, error.message)
      }
    }
  }
}
