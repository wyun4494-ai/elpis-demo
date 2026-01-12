/**
 * 品牌推荐控制器
 */
module.exports = (app) => {
  const BaseController = require('@lesheng/elpis').Controller.Base(app)

  return class BrandRecommendController extends BaseController {
    /**
     * 获取品牌推荐列表
     * @param {Object} ctx - Koa 上下文
     */
    async getBrandRecommendList(ctx) {
      try {
        const params = ctx.query
        const { brandRecommend: brandRecommendService } = app.service
        
        // 如果有 recommend_id，说明是查询详情
        if (params.recommend_id) {
          const result = await brandRecommendService.getBrandRecommendDetail(params.recommend_id)
          this.success(ctx, result)
          return
        }
        
        // 否则查询列表
        const result = await brandRecommendService.getBrandRecommendList(params)
        this.success(ctx, result.list, { total: result.total })
      } catch (error) {
        app.logger.error('获取品牌推荐列表失败:', error)
        this.fail(ctx, error.message)
      }
    }

    /**
     * 获取品牌推荐详情
     * @param {Object} ctx - Koa 上下文
     */
    async getBrandRecommendDetail(ctx) {
      try {
        // 支持两种方式：路径参数和查询参数
        const recommend_id = ctx.params.id || ctx.query.recommend_id
        const { brandRecommend: brandRecommendService } = app.service
        const result = await brandRecommendService.getBrandRecommendDetail(recommend_id)
        this.success(ctx, result)
      } catch (error) {
        app.logger.error('获取品牌推荐详情失败:', error)
        this.fail(ctx, error.message)
      }
    }

    /**
     * 创建品牌推荐
     * @param {Object} ctx - Koa 上下文
     */
    async createBrandRecommend(ctx) {
      try {
        const data = ctx.request.body
        
        // 获取当前用户ID
        const userId = ctx.state.user?.user_id || 'system'
        data.created_by = userId

        const { brandRecommend: brandRecommendService } = app.service
        const recommendId = await brandRecommendService.createBrandRecommend(data)
        this.success(ctx, { recommend_id: recommendId })
      } catch (error) {
        app.logger.error('创建品牌推荐失败:', error)
        this.fail(ctx, error.message)
      }
    }

    /**
     * 更新品牌推荐
     * @param {Object} ctx - Koa 上下文
     */
    async updateBrandRecommend(ctx) {
      try {
        // 支持两种方式：路径参数和请求体
        const recommend_id = ctx.params.id || ctx.request.body.recommend_id
        const data = ctx.request.body

        const { brandRecommend: brandRecommendService } = app.service
        await brandRecommendService.updateBrandRecommend(recommend_id, data)
        this.success(ctx, null, { message: '更新成功' })
      } catch (error) {
        app.logger.error('更新品牌推荐失败:', error)
        this.fail(ctx, error.message)
      }
    }

    /**
     * 删除品牌推荐
     * @param {Object} ctx - Koa 上下文
     */
    async deleteBrandRecommend(ctx) {
      try {
        // 支持两种方式：路径参数和查询参数
        const recommend_id = ctx.params.id || ctx.query.recommend_id
        const { brandRecommend: brandRecommendService } = app.service
        await brandRecommendService.deleteBrandRecommend(recommend_id)
        this.success(ctx, null, { message: '删除成功' })
      } catch (error) {
        app.logger.error('删除品牌推荐失败:', error)
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
        const { brandRecommend: brandRecommendService } = app.service
        await brandRecommendService.toggleRecommend(recommend_id, is_enabled)
        this.success(ctx, null, { message: '操作成功' })
      } catch (error) {
        app.logger.error('切换推荐状态失败:', error)
        this.fail(ctx, error.message)
      }
    }

    /**
     * 设置排序
     * @param {Object} ctx - Koa 上下文
     */
    async setSortOrder(ctx) {
      try {
        const { recommend_id, sort_order } = ctx.request.body
        const { brandRecommend: brandRecommendService } = app.service
        await brandRecommendService.setSortOrder(recommend_id, sort_order)
        this.success(ctx, null, { message: '设置成功' })
      } catch (error) {
        app.logger.error('设置排序失败:', error)
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
        const { brandRecommend: brandRecommendService } = app.service
        await brandRecommendService.batchEnable(recommend_ids)
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
        const { brandRecommend: brandRecommendService } = app.service
        await brandRecommendService.batchDisable(recommend_ids)
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
        const { brandRecommend: brandRecommendService } = app.service
        await brandRecommendService.batchDelete(recommend_ids)
        this.success(ctx, null, { message: '批量删除成功' })
      } catch (error) {
        app.logger.error('批量删除失败:', error)
        this.fail(ctx, error.message)
      }
    }

    /**
     * 获取可推荐的品牌列表
     * @param {Object} ctx - Koa 上下文
     */
    async getAvailableBrands(ctx) {
      try {
        const params = ctx.query
        const { brandRecommend: brandRecommendService } = app.service
        const brands = await brandRecommendService.getAvailableBrands(params)
        this.success(ctx, brands)
      } catch (error) {
        app.logger.error('获取可推荐品牌列表失败:', error)
        this.fail(ctx, error.message)
      }
    }
  }
}
