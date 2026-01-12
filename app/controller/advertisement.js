/**
 * 广告推荐控制器
 */
module.exports = (app) => {
  const BaseController = require('@lesheng/elpis').Controller.Base(app)

  return class AdvertisementController extends BaseController {
    /**
     * 获取广告列表
     * @param {Object} ctx - Koa 上下文
     */
    async getAdvertisementList(ctx) {
      try {
        const params = ctx.query
        const { advertisement: advertisementService } = app.service
        
        // 如果有 ad_id，说明是查询详情
        if (params.ad_id) {
          const result = await advertisementService.getAdvertisementDetail(params.ad_id)
          this.success(ctx, result)
          return
        }
        
        // 否则查询列表
        const result = await advertisementService.getAdvertisementList(params)
        this.success(ctx, result.list, { total: result.total })
      } catch (error) {
        app.logger.error('获取广告列表失败:', error)
        this.fail(ctx, error.message)
      }
    }

    /**
     * 获取广告详情
     * @param {Object} ctx - Koa 上下文
     */
    async getAdvertisementDetail(ctx) {
      try {
        const ad_id = ctx.params.id || ctx.query.ad_id
        const { advertisement: advertisementService } = app.service
        const result = await advertisementService.getAdvertisementDetail(ad_id)
        this.success(ctx, result)
      } catch (error) {
        app.logger.error('获取广告详情失败:', error)
        this.fail(ctx, error.message)
      }
    }

    /**
     * 创建广告
     * @param {Object} ctx - Koa 上下文
     */
    async createAdvertisement(ctx) {
      try {
        const data = ctx.request.body
        
        // 获取当前用户ID
        const userId = ctx.state.user?.user_id || 'system'
        data.created_by = userId

        const { advertisement: advertisementService } = app.service
        const adId = await advertisementService.createAdvertisement(data)
        this.success(ctx, { ad_id: adId })
      } catch (error) {
        app.logger.error('创建广告失败:', error)
        this.fail(ctx, error.message)
      }
    }

    /**
     * 更新广告
     * @param {Object} ctx - Koa 上下文
     */
    async updateAdvertisement(ctx) {
      try {
        const ad_id = ctx.params.id || ctx.request.body.ad_id
        const data = ctx.request.body

        const { advertisement: advertisementService } = app.service
        await advertisementService.updateAdvertisement(ad_id, data)
        this.success(ctx, null, { message: '更新成功' })
      } catch (error) {
        app.logger.error('更新广告失败:', error)
        this.fail(ctx, error.message)
      }
    }

    /**
     * 删除广告
     * @param {Object} ctx - Koa 上下文
     */
    async deleteAdvertisement(ctx) {
      try {
        const ad_id = ctx.params.id || ctx.query.ad_id
        const { advertisement: advertisementService } = app.service
        await advertisementService.deleteAdvertisement(ad_id)
        this.success(ctx, null, { message: '删除成功' })
      } catch (error) {
        app.logger.error('删除广告失败:', error)
        this.fail(ctx, error.message)
      }
    }

    /**
     * 切换启用状态
     * @param {Object} ctx - Koa 上下文
     */
    async toggleEnabled(ctx) {
      try {
        const { ad_id, is_enabled } = ctx.request.body
        const { advertisement: advertisementService } = app.service
        await advertisementService.toggleEnabled(ad_id, is_enabled)
        this.success(ctx, null, { message: '操作成功' })
      } catch (error) {
        app.logger.error('切换启用状态失败:', error)
        this.fail(ctx, error.message)
      }
    }

    /**
     * 批量启用
     * @param {Object} ctx - Koa 上下文
     */
    async batchEnable(ctx) {
      try {
        const { ad_ids } = ctx.request.body
        const { advertisement: advertisementService } = app.service
        await advertisementService.batchEnable(ad_ids)
        this.success(ctx, null, { message: '批量启用成功' })
      } catch (error) {
        app.logger.error('批量启用失败:', error)
        this.fail(ctx, error.message)
      }
    }

    /**
     * 批量禁用
     * @param {Object} ctx - Koa 上下文
     */
    async batchDisable(ctx) {
      try {
        const { ad_ids } = ctx.request.body
        const { advertisement: advertisementService } = app.service
        await advertisementService.batchDisable(ad_ids)
        this.success(ctx, null, { message: '批量禁用成功' })
      } catch (error) {
        app.logger.error('批量禁用失败:', error)
        this.fail(ctx, error.message)
      }
    }

    /**
     * 批量删除
     * @param {Object} ctx - Koa 上下文
     */
    async batchDelete(ctx) {
      try {
        const { ad_ids } = ctx.request.body
        const { advertisement: advertisementService } = app.service
        await advertisementService.batchDelete(ad_ids)
        this.success(ctx, null, { message: '批量删除成功' })
      } catch (error) {
        app.logger.error('批量删除失败:', error)
        this.fail(ctx, error.message)
      }
    }
  }
}
