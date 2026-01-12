/**
 * 专题推荐控制器
 */
module.exports = (app) => {
  const BaseController = require('@lesheng/elpis').Controller.Base(app)

  return class TopicRecommendController extends BaseController {
    /**
     * 获取专题推荐列表
     * @param {Object} ctx - Koa 上下文
     */
    async getTopicRecommendList(ctx) {
      try {
        const params = ctx.query
        const { topicRecommend: topicRecommendService } = app.service
        
        // 如果有 topic_id，说明是查询详情
        if (params.topic_id) {
          const result = await topicRecommendService.getTopicRecommendDetail(params.topic_id)
          this.success(ctx, result)
          return
        }
        
        // 否则查询列表
        const result = await topicRecommendService.getTopicRecommendList(params)
        this.success(ctx, result.list, { total: result.total })
      } catch (error) {
        app.logger.error('获取专题推荐列表失败:', error)
        this.fail(ctx, error.message)
      }
    }

    /**
     * 获取专题推荐详情
     * @param {Object} ctx - Koa 上下文
     */
    async getTopicRecommendDetail(ctx) {
      try {
        const topic_id = ctx.params.id || ctx.query.topic_id
        const { topicRecommend: topicRecommendService } = app.service
        const result = await topicRecommendService.getTopicRecommendDetail(topic_id)
        this.success(ctx, result)
      } catch (error) {
        app.logger.error('获取专题推荐详情失败:', error)
        this.fail(ctx, error.message)
      }
    }

    /**
     * 创建专题推荐
     * @param {Object} ctx - Koa 上下文
     */
    async createTopicRecommend(ctx) {
      try {
        const data = ctx.request.body
        
        // 获取当前用户ID
        const userId = ctx.state.user?.user_id || 'system'
        data.created_by = userId

        const { topicRecommend: topicRecommendService } = app.service
        const topicId = await topicRecommendService.createTopicRecommend(data)
        this.success(ctx, { topic_id: topicId })
      } catch (error) {
        app.logger.error('创建专题推荐失败:', error)
        this.fail(ctx, error.message)
      }
    }

    /**
     * 更新专题推荐
     * @param {Object} ctx - Koa 上下文
     */
    async updateTopicRecommend(ctx) {
      try {
        const topic_id = ctx.params.id || ctx.request.body.topic_id
        const data = ctx.request.body

        const { topicRecommend: topicRecommendService } = app.service
        await topicRecommendService.updateTopicRecommend(topic_id, data)
        this.success(ctx, null, { message: '更新成功' })
      } catch (error) {
        app.logger.error('更新专题推荐失败:', error)
        this.fail(ctx, error.message)
      }
    }

    /**
     * 删除专题推荐
     * @param {Object} ctx - Koa 上下文
     */
    async deleteTopicRecommend(ctx) {
      try {
        const topic_id = ctx.params.id || ctx.query.topic_id
        const { topicRecommend: topicRecommendService } = app.service
        await topicRecommendService.deleteTopicRecommend(topic_id)
        this.success(ctx, null, { message: '删除成功' })
      } catch (error) {
        app.logger.error('删除专题推荐失败:', error)
        this.fail(ctx, error.message)
      }
    }

    /**
     * 切换推荐状态
     * @param {Object} ctx - Koa 上下文
     */
    async toggleRecommend(ctx) {
      try {
        const { topic_id, is_enabled } = ctx.request.body
        const { topicRecommend: topicRecommendService } = app.service
        await topicRecommendService.toggleRecommend(topic_id, is_enabled)
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
        const { topic_ids } = ctx.request.body
        const { topicRecommend: topicRecommendService } = app.service
        await topicRecommendService.batchEnable(topic_ids)
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
        const { topic_ids } = ctx.request.body
        const { topicRecommend: topicRecommendService } = app.service
        await topicRecommendService.batchDisable(topic_ids)
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
        const { topic_ids } = ctx.request.body
        const { topicRecommend: topicRecommendService } = app.service
        await topicRecommendService.batchDelete(topic_ids)
        this.success(ctx, null, { message: '批量删除成功' })
      } catch (error) {
        app.logger.error('批量删除失败:', error)
        this.fail(ctx, error.message)
      }
    }
  }
}
