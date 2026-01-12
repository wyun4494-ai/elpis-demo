/**
 * 秒杀活动管理控制器
 * 处理秒杀活动相关的 HTTP 请求（CRUD）
 *
 * @class FlashSaleController
 * @extends BaseController
 */
module.exports = (app) => {
  const moment = require('moment')
  const baseController = require('@lesheng/elpis').Controller.Base(app)

  return class FlashSaleController extends baseController {

    /**
     * 获取秒杀活动详情或秒杀活动列表
     *
     * @param {Object} ctx - Koa 上下文对象
     * @returns {Promise<void>}
     */
    async getFlashSale(ctx) {
      // 优先从路径参数获取 flash_sale_id
      const flashSaleIdFromParams = ctx.params.flash_sale_id
      const flashSaleIdFromQuery = ctx.request.query.flash_sale_id
      const flashSaleId = flashSaleIdFromParams || flashSaleIdFromQuery

      // 如果有 flash_sale_id，获取单个秒杀活动详情
      if (flashSaleId) {
        const { flashSale: flashSaleService } = app.service
        const flashSaleItem = await flashSaleService.getFlashSale(flashSaleId)

        // 格式化时间
        if (flashSaleItem.start_time) {
          flashSaleItem.start_time = moment(flashSaleItem.start_time).format('YYYY-MM-DD HH:mm:ss')
        }
        if (flashSaleItem.end_time) {
          flashSaleItem.end_time = moment(flashSaleItem.end_time).format('YYYY-MM-DD HH:mm:ss')
        }
        if (flashSaleItem.create_time) {
          flashSaleItem.create_time = moment(flashSaleItem.create_time).format('YYYY-MM-DD HH:mm:ss')
        }

        this.success(ctx, flashSaleItem)
        return
      }

      // 否则获取秒杀活动列表
      const {
        activity_name: activityName,
        activity_status: activityStatus,
        start_time_start: startTimeStart,
        start_time_end: startTimeEnd,
        page,
        pageSize
      } = ctx.request.query

      const { flashSale: flashSaleService } = app.service

      // 1. 并行查询列表数据和总数
      const jobs = []
      jobs.push(flashSaleService.getFlashSaleList({
        activity_name: activityName,
        activity_status: activityStatus ? Number(activityStatus) : undefined,
        start_time_start: startTimeStart,
        start_time_end: startTimeEnd,
        page: Number(page),
        pageSize: Number(pageSize)
      }))
      jobs.push(flashSaleService.getFlashSaleListTotal({
        activity_name: activityName,
        activity_status: activityStatus ? Number(activityStatus) : undefined,
        start_time_start: startTimeStart,
        start_time_end: startTimeEnd
      }))

      const res = await Promise.all(jobs)

      // 2. 处理空数据情况
      if (res[0].length === 0 || !res[0]) {
        this.success(ctx, [], { total: 0 })
        return
      }

      // 3. 格式化展示数据
      const flashSaleList = res[0]
      flashSaleList.forEach(item => {
        // 格式化时间
        item.start_time = moment(item.start_time).format('YYYY-MM-DD HH:mm:ss')
        item.end_time = moment(item.end_time).format('YYYY-MM-DD HH:mm:ss')
        item.create_time = moment(item.create_time).format('YYYY-MM-DD HH:mm:ss')

        // 活动状态转换为文本
        if (item.activity_status === 0) {
          item.activity_status_text = '未开始'
        } else if (item.activity_status === 1) {
          item.activity_status_text = '进行中'
        } else if (item.activity_status === 2) {
          item.activity_status_text = '已结束'
        } else if (item.activity_status === 3) {
          item.activity_status_text = '已取消'
        }
      })
      const total = res[1]

      this.success(ctx, flashSaleList, { total })
    }

    /**
     * 获取秒杀活动列表（分页）
     *
     * @param {Object} ctx - Koa 上下文对象
     * @returns {Promise<void>}
     */
    async getFlashSaleList(ctx) {
      // 直接调用 getFlashSale 方法处理
      await this.getFlashSale(ctx)
    }

    /**
     * 创建秒杀活动
     *
     * @param {Object} ctx - Koa 上下文对象
     * @returns {Promise<void>}
     */
    async createFlashSale(ctx) {
      const {
        activity_name: activityName,
        activity_desc: activityDesc,
        start_time: startTime,
        end_time: endTime,
        limit_per_product: limitPerProduct,
        sort_order: sortOrder,
        banner_image: bannerImage
      } = ctx.request.body

      const { flashSale: flashSaleService } = app.service

      try {
        const flashSaleId = await flashSaleService.createFlashSale({
          activity_name: activityName,
          activity_desc: activityDesc,
          start_time: startTime,
          end_time: endTime,
          limit_per_product: limitPerProduct,
          sort_order: sortOrder,
          banner_image: bannerImage,
          created_by: ctx.state.user?.user_id || 'admin'
        })

        this.success(ctx, {
          message: '创建成功',
          flash_sale_id: flashSaleId
        })
      } catch (error) {
        this.fail(ctx, error.message || '创建失败', 400)
      }
    }

    /**
     * 更新秒杀活动
     *
     * @param {Object} ctx - Koa 上下文对象
     * @returns {Promise<void>}
     */
    async updateFlashSale(ctx) {
      // 优先从路径参数获取 flash_sale_id
      const flashSaleIdFromParams = ctx.params.flash_sale_id
      const flashSaleIdFromBody = ctx.request.body.flash_sale_id
      const flashSaleId = flashSaleIdFromParams || flashSaleIdFromBody

      if (!flashSaleId) {
        this.fail(ctx, '秒杀活动ID不能为空', 400)
        return
      }

      const {
        activity_name: activityName,
        activity_desc: activityDesc,
        start_time: startTime,
        end_time: endTime,
        activity_status: activityStatus,
        limit_per_product: limitPerProduct,
        sort_order: sortOrder,
        banner_image: bannerImage
      } = ctx.request.body

      const { flashSale: flashSaleService } = app.service

      try {
        await flashSaleService.updateFlashSale(flashSaleId, {
          activity_name: activityName,
          activity_desc: activityDesc,
          start_time: startTime,
          end_time: endTime,
          activity_status: activityStatus !== undefined ? Number(activityStatus) : undefined,
          limit_per_product: limitPerProduct,
          sort_order: sortOrder,
          banner_image: bannerImage
        })

        this.success(ctx, {
          message: '更新成功',
          flash_sale_id: flashSaleId
        })
      } catch (error) {
        this.fail(ctx, error.message || '更新失败', 400)
      }
    }

    /**
     * 删除秒杀活动（软删除）
     *
     * @param {Object} ctx - Koa 上下文对象
     * @returns {Promise<void>}
     */
    async deleteFlashSale(ctx) {
      const { flash_sale_id: flashSaleId } = ctx.params

      const { flashSale: flashSaleService } = app.service
      await flashSaleService.deleteFlashSale(flashSaleId)

      this.success(ctx, {
        message: '删除成功',
        flash_sale_id: flashSaleId
      })
    }

    /**
     * 批量删除秒杀活动（软删除）
     *
     * @param {Object} ctx - Koa 上下文对象
     * @returns {Promise<void>}
     */
    async batchDeleteFlashSale(ctx) {
      const { flash_sale_ids: flashSaleIds } = ctx.request.body

      if (!flashSaleIds || !Array.isArray(flashSaleIds) || flashSaleIds.length === 0) {
        this.fail(ctx, '秒杀活动ID数组不能为空', 400)
        return
      }

      const { flashSale: flashSaleService } = app.service
      await flashSaleService.batchDeleteFlashSale(flashSaleIds)

      this.success(ctx, {
        message: '批量删除成功',
        count: flashSaleIds.length
      })
    }
  }
}
