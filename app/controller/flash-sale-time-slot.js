/**
 * 秒杀时间段控制器
 * 处理秒杀时间段相关的 HTTP 请求
 */
module.exports = (app) => {
  const BaseController = require('@lesheng/elpis').Controller.Base(app)

  return class FlashSaleTimeSlotController extends BaseController {
    /**
     * 获取时间段列表
     * @param {Object} ctx - Koa 上下文
     */
    async getTimeSlotList(ctx) {
      try {
        const params = ctx.query
        const { flashSaleTimeSlot: flashSaleTimeSlotService } = app.service
        const list = await flashSaleTimeSlotService.getTimeSlotList(params)

        this.success(ctx, list)
      } catch (error) {
        app.logger.error('获取时间段列表失败:', error)
        this.fail(ctx, error.message || '获取时间段列表失败')
      }
    }

    /**
     * 获取时间段详情
     * @param {Object} ctx - Koa 上下文
     */
    async getTimeSlot(ctx) {
      try {
        const { slot_id: slotId } = ctx.params
        const { flashSaleTimeSlot: flashSaleTimeSlotService } = app.service
        const timeSlot = await flashSaleTimeSlotService.getTimeSlot(slotId)

        this.success(ctx, timeSlot)
      } catch (error) {
        app.logger.error('获取时间段详情失败:', error)
        this.fail(ctx, error.message || '获取时间段详情失败')
      }
    }

    /**
     * 创建时间段
     * @param {Object} ctx - Koa 上下文
     */
    async createTimeSlot(ctx) {
      try {
        const data = ctx.request.body
        const { flashSaleTimeSlot: flashSaleTimeSlotService } = app.service
        const slotId = await flashSaleTimeSlotService.createTimeSlot(data)

        this.success(ctx, {
          message: '创建成功',
          slot_id: slotId
        })
      } catch (error) {
        app.logger.error('创建时间段失败:', error)
        this.fail(ctx, error.message || '创建时间段失败')
      }
    }

    /**
     * 更新时间段
     * @param {Object} ctx - Koa 上下文
     */
    async updateTimeSlot(ctx) {
      try {
        const { slot_id: slotId } = ctx.params
        const data = ctx.request.body
        const { flashSaleTimeSlot: flashSaleTimeSlotService } = app.service
        await flashSaleTimeSlotService.updateTimeSlot(slotId, data)

        this.success(ctx, {
          message: '更新成功',
          slot_id: slotId
        })
      } catch (error) {
        app.logger.error('更新时间段失败:', error)
        this.fail(ctx, error.message || '更新时间段失败')
      }
    }

    /**
     * 删除时间段
     * @param {Object} ctx - Koa 上下文
     */
    async deleteTimeSlot(ctx) {
      try {
        const { slot_id: slotId } = ctx.params
        const { flashSaleTimeSlot: flashSaleTimeSlotService } = app.service
        await flashSaleTimeSlotService.deleteTimeSlot(slotId)

        this.success(ctx, {
          message: '删除成功',
          slot_id: slotId
        })
      } catch (error) {
        app.logger.error('删除时间段失败:', error)
        this.fail(ctx, error.message || '删除时间段失败')
      }
    }

    /**
     * 批量删除时间段
     * @param {Object} ctx - Koa 上下文
     */
    async batchDeleteTimeSlot(ctx) {
      try {
        const { slot_ids: slotIds } = ctx.request.body
        const { flashSaleTimeSlot: flashSaleTimeSlotService } = app.service
        await flashSaleTimeSlotService.batchDeleteTimeSlot(slotIds)

        this.success(ctx, {
          message: '批量删除成功',
          count: slotIds.length
        })
      } catch (error) {
        app.logger.error('批量删除时间段失败:', error)
        this.fail(ctx, error.message || '批量删除时间段失败')
      }
    }

    /**
     * 切换时间段启用状态
     * @param {Object} ctx - Koa 上下文
     */
    async toggleTimeSlotStatus(ctx) {
      try {
        const { slot_id: slotId } = ctx.params
        const { slot_status: slotStatus } = ctx.request.body
        const { flashSaleTimeSlot: flashSaleTimeSlotService } = app.service
        await flashSaleTimeSlotService.toggleTimeSlotStatus(slotId, slotStatus)

        this.success(ctx, {
          message: '状态更新成功',
          slot_id: slotId
        })
      } catch (error) {
        app.logger.error('切换时间段状态失败:', error)
        this.fail(ctx, error.message || '切换时间段状态失败')
      }
    }
  }
}
