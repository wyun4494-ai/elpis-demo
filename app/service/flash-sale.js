/**
 * 秒杀活动管理服务
 * 处理秒杀活动相关的业务逻辑和数据库操作
 *
 * @class FlashSaleService
 */
module.exports = (app) => {
  const moment = require('moment')
  const { v4: uuidv4 } = require('uuid')

  return class FlashSaleService {

    /**
     * 获取秒杀活动列表
     *
     * @param {Object} params - 查询参数
     * @param {string} [params.activity_name] - 活动名称
     * @param {number} [params.activity_status] - 活动状态
     * @param {string} [params.start_time_start] - 开始时间范围（开始）
     * @param {string} [params.start_time_end] - 开始时间范围（结束）
     * @param {number} params.page - 页码
     * @param {number} params.pageSize - 每页数量
     * @returns {Promise<Array>} 返回秒杀活动列表
     */
    async getFlashSaleList({
      activity_name: activityName,
      activity_status: activityStatus,
      start_time_start: startTimeStart,
      start_time_end: startTimeEnd,
      page,
      pageSize
    }) {
      const queryObj = { status: app.status.NORMAL }

      if (activityName) {
        queryObj.activity_name = activityName
      }
      if (activityStatus !== undefined && activityStatus !== null && activityStatus !== '' && activityStatus !== -999) {
        queryObj.activity_status = Number(activityStatus)
      }

      let sql = app.database('t_flash_sale').select('*').where(queryObj)

      if (startTimeStart) {
        sql = sql.andWhere('start_time', '>=', startTimeStart)
      }
      if (startTimeEnd) {
        sql = sql.andWhere('start_time', '<=', startTimeEnd)
      }

      const offset = (page - 1) * pageSize
      sql = sql.orderBy('sort_order', 'asc').orderBy('create_time', 'desc').offset(offset).limit(pageSize)

      const list = await sql

      // 智能更新活动状态：只有非手动控制的活动才自动计算状态
      for (const item of list) {
        // 如果没有 manual_control 字段或值为 0，则自动计算状态
        if (!item.manual_control || item.manual_control === 0) {
          const calculatedStatus = this.calculateActivityStatus(item.start_time, item.end_time)
          // 如果计算出的状态与数据库不同，更新数据库
          if (calculatedStatus !== item.activity_status) {
            await app.database('t_flash_sale')
              .where('flash_sale_id', item.flash_sale_id)
              .update({ activity_status: calculatedStatus })
            item.activity_status = calculatedStatus
          }
        }
        // 如果是手动控制（manual_control = 1），保持数据库中的值不变
      }

      return list
    }

    /**
     * 获取秒杀活动列表总数
     *
     * @param {Object} params - 查询参数
     * @returns {Promise<number>} 返回总数
     */
    async getFlashSaleListTotal({
      activity_name: activityName,
      activity_status: activityStatus,
      start_time_start: startTimeStart,
      start_time_end: startTimeEnd
    }) {
      const queryObj = { status: app.status.NORMAL }

      if (activityName) {
        queryObj.activity_name = activityName
      }
      if (activityStatus !== undefined && activityStatus !== null && activityStatus !== '' && activityStatus !== -999) {
        queryObj.activity_status = Number(activityStatus)
      }

      let sql = app.database('t_flash_sale').countDistinct('flash_sale_id as count').where(queryObj)

      if (startTimeStart) {
        sql = sql.andWhere('start_time', '>=', startTimeStart)
      }
      if (startTimeEnd) {
        sql = sql.andWhere('start_time', '<=', startTimeEnd)
      }

      const res = await sql
      return res[0].count
    }

    /**
     * 获取秒杀活动详情
     *
     * @param {string} flashSaleId - 秒杀活动ID
     * @returns {Promise<Object>} 返回秒杀活动信息
     */
    async getFlashSale(flashSaleId) {
      const result = await app.database('t_flash_sale').select('*').where({
        flash_sale_id: flashSaleId,
        status: app.status.NORMAL
      }).first()

      // 智能更新活动状态：只有非手动控制的活动才自动计算状态
      if (result && (!result.manual_control || result.manual_control === 0)) {
        const calculatedStatus = this.calculateActivityStatus(result.start_time, result.end_time)
        // 如果计算出的状态与数据库不同，更新数据库
        if (calculatedStatus !== result.activity_status) {
          await app.database('t_flash_sale')
            .where('flash_sale_id', flashSaleId)
            .update({ activity_status: calculatedStatus })
          result.activity_status = calculatedStatus
        }
      }

      return result || {}
    }

    /**
     * 创建秒杀活动
     *
     * @param {Object} data - 秒杀活动数据
     * @param {string} data.activity_name - 活动名称
     * @param {string} [data.activity_desc] - 活动描述
     * @param {string} data.start_time - 开始时间
     * @param {string} data.end_time - 结束时间
     * @param {number} [data.limit_per_product] - 每个商品每人限购数量
     * @param {number} [data.sort_order] - 排序
     * @param {string} [data.banner_image] - Banner图
     * @param {string} [data.created_by] - 创建人
     * @returns {Promise<string>} 返回新创建的秒杀活动ID
     */
    async createFlashSale({
      activity_name: activityName,
      activity_desc: activityDesc,
      start_time: startTime,
      end_time: endTime,
      limit_per_product: limitPerProduct,
      sort_order: sortOrder,
      banner_image: bannerImage,
      created_by: createdBy
    }) {
      // 1. 验证时间
      if (new Date(startTime) >= new Date(endTime)) {
        throw new Error('开始时间必须早于结束时间')
      }

      // 2. 生成秒杀活动ID
      const flashSaleId = 'FS' + uuidv4().replace(/-/g, '').substring(0, 10).toUpperCase()

      // 3. 根据时间自动计算活动状态
      const activityStatus = this.calculateActivityStatus(startTime, endTime)

      // 4. 插入数据库
      await app.database('t_flash_sale').insert({
        flash_sale_id: flashSaleId,
        activity_name: activityName,
        activity_desc: activityDesc,
        start_time: startTime,
        end_time: endTime,
        activity_status: activityStatus,
        manual_control: 0,  // 默认为自动控制
        limit_per_product: limitPerProduct || 1,
        sort_order: sortOrder || 0,
        banner_image: bannerImage,
        status: app.status.NORMAL,
        created_by: createdBy,
        create_time: moment().format('YYYY-MM-DD HH:mm:ss')
      })

      return flashSaleId
    }

    /**
     * 更新秒杀活动
     *
     * @param {string} flashSaleId - 秒杀活动ID
     * @param {Object} data - 更新数据
     * @returns {Promise<string>} 返回秒杀活动ID
     */
    async updateFlashSale(flashSaleId, {
      activity_name: activityName,
      activity_desc: activityDesc,
      start_time: startTime,
      end_time: endTime,
      activity_status: activityStatus,
      limit_per_product: limitPerProduct,
      sort_order: sortOrder,
      banner_image: bannerImage
    }) {
      // 1. 验证时间
      if (startTime && endTime && new Date(startTime) >= new Date(endTime)) {
        throw new Error('开始时间必须早于结束时间')
      }

      // 2. 构建更新对象
      const updateObj = {}
      if (activityName !== undefined && activityName !== null) {
        updateObj.activity_name = activityName
      }
      if (activityDesc !== undefined) {
        updateObj.activity_desc = activityDesc
      }
      if (startTime !== undefined && startTime !== null) {
        updateObj.start_time = startTime
      }
      if (endTime !== undefined && endTime !== null) {
        updateObj.end_time = endTime
      }
      if (limitPerProduct !== undefined && limitPerProduct !== null) {
        updateObj.limit_per_product = limitPerProduct
      }
      if (sortOrder !== undefined && sortOrder !== null) {
        updateObj.sort_order = sortOrder
      }
      if (bannerImage !== undefined) {
        updateObj.banner_image = bannerImage
      }

      // 3. 处理活动状态
      // 如果明确传入了 activity_status，说明是手动控制，设置 manual_control = 1
      if (activityStatus !== undefined && activityStatus !== null) {
        updateObj.activity_status = Number(activityStatus)
        updateObj.manual_control = 1  // 标记为手动控制
      } 
      // 如果更新了时间但没有传入状态，重新计算活动状态并重置为自动控制
      else if (startTime || endTime) {
        const activity = await this.getFlashSale(flashSaleId)
        const newStartTime = startTime || activity.start_time
        const newEndTime = endTime || activity.end_time
        updateObj.activity_status = this.calculateActivityStatus(newStartTime, newEndTime)
        updateObj.manual_control = 0  // 重置为自动控制
      }

      // 4. 更新数据库
      await app.database('t_flash_sale').update({
        ...updateObj,
        update_time: moment().format('YYYY-MM-DD HH:mm:ss')
      }).where({
        flash_sale_id: flashSaleId,
        status: app.status.NORMAL
      })

      return flashSaleId
    }

    /**
     * 删除秒杀活动（软删除）
     *
     * @param {string} flashSaleId - 秒杀活动ID
     * @returns {Promise<string>} 返回秒杀活动ID
     */
    async deleteFlashSale(flashSaleId) {
      await app.database('t_flash_sale').update({
        status: app.status.DELETE,
        update_time: moment().format('YYYY-MM-DD HH:mm:ss')
      }).where({
        flash_sale_id: flashSaleId
      })

      return flashSaleId
    }

    /**
     * 批量删除秒杀活动（软删除）
     *
     * @param {Array<string>} flashSaleIds - 秒杀活动ID数组
     * @returns {Promise<number>} 返回删除的数量
     */
    async batchDeleteFlashSale(flashSaleIds) {
      await app.database('t_flash_sale')
        .whereIn('flash_sale_id', flashSaleIds)
        .update({
          status: app.status.DELETE,
          update_time: moment().format('YYYY-MM-DD HH:mm:ss')
        })

      return flashSaleIds.length
    }

    /**
     * 计算活动状态（自动更新）
     *
     * @param {string|Date} startTime - 开始时间
     * @param {string|Date} endTime - 结束时间
     * @returns {number} 活动状态：0-未开始，1-进行中，2-已结束
     */
    calculateActivityStatus(startTime, endTime) {
      const now = new Date()
      const start = new Date(startTime)
      const end = new Date(endTime)

      if (now < start) {
        return 0 // 未开始
      } else if (now >= start && now <= end) {
        return 1 // 进行中
      } else {
        return 2 // 已结束
      }
    }
  }
}
