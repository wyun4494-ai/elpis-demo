/**
 * 秒杀时间段服务
 * 处理秒杀时间段相关的业务逻辑
 */
module.exports = (app) => {
  const { nanoid } = require('nanoid')

  return class FlashSaleTimeSlotService {
    /**
     * 获取时间段列表
     * @param {Object} params - 查询参数
     * @returns {Promise<Array>} 时间段列表
     */
    async getTimeSlotList(params = {}) {
      const { flash_sale_id: flashSaleId } = params

      let query = app.database('t_flash_sale_time_slot')
        .where('status', 1)
        .orderBy('sort_order', 'asc')
        .orderBy('start_time', 'asc')

      // 如果指定了活动ID，则筛选
      if (flashSaleId) {
        query = query.where('flash_sale_id', flashSaleId)
      }

      const list = await query

      return list
    }

    /**
     * 获取时间段详情
     * @param {String} slotId - 时间段ID
     * @returns {Promise<Object>} 时间段详情
     */
    async getTimeSlot(slotId) {
      const timeSlot = await app.database('t_flash_sale_time_slot')
        .where('slot_id', slotId)
        .where('status', 1)
        .first()

      if (!timeSlot) {
        throw new Error('时间段不存在')
      }

      return timeSlot
    }

    /**
     * 创建时间段
     * @param {Object} data - 时间段数据
     * @returns {Promise<String>} 时间段ID
     */
    async createTimeSlot(data) {
      const {
        flash_sale_id: flashSaleId,
        slot_name: slotName,
        start_time: startTime,
        end_time: endTime,
        sort_order: sortOrder = 0
      } = data

      // 验证必填字段
      if (!flashSaleId || !slotName || !startTime || !endTime) {
        throw new Error('缺少必填字段')
      }

      // 验证时间格式（HH:mm:ss）
      const timeRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/
      if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
        throw new Error('时间格式不正确，应为 HH:mm:ss')
      }

      // 验证开始时间小于结束时间
      if (startTime >= endTime) {
        throw new Error('开始时间必须小于结束时间')
      }

      // 检查时间段是否冲突
      const conflictSlot = await app.database('t_flash_sale_time_slot')
        .where('flash_sale_id', flashSaleId)
        .where('status', 1)
        .where(function() {
          this.where(function() {
            // 新时间段的开始时间在已有时间段内
            this.where('start_time', '<=', startTime)
              .where('end_time', '>', startTime)
          }).orWhere(function() {
            // 新时间段的结束时间在已有时间段内
            this.where('start_time', '<', endTime)
              .where('end_time', '>=', endTime)
          }).orWhere(function() {
            // 新时间段包含已有时间段
            this.where('start_time', '>=', startTime)
              .where('end_time', '<=', endTime)
          })
        })
        .first()

      if (conflictSlot) {
        throw new Error(`时间段与"${conflictSlot.slot_name}"冲突`)
      }

      const slotId = `SLOT${nanoid(10)}`

      await app.database('t_flash_sale_time_slot').insert({
        slot_id: slotId,
        flash_sale_id: flashSaleId,
        slot_name: slotName,
        start_time: startTime,
        end_time: endTime,
        slot_status: 0,
        sort_order: sortOrder,
        status: 1
      })

      return slotId
    }

    /**
     * 更新时间段
     * @param {String} slotId - 时间段ID
     * @param {Object} data - 更新数据
     * @returns {Promise<void>}
     */
    async updateTimeSlot(slotId, data) {
      const {
        slot_name: slotName,
        start_time: startTime,
        end_time: endTime,
        slot_status: slotStatus,
        sort_order: sortOrder
      } = data

      // 检查时间段是否存在
      const existingSlot = await this.getTimeSlot(slotId)

      const updateObj = {}

      if (slotName !== undefined) {
        updateObj.slot_name = slotName
      }

      if (startTime !== undefined) {
        // 验证时间格式
        const timeRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/
        if (!timeRegex.test(startTime)) {
          throw new Error('开始时间格式不正确，应为 HH:mm:ss')
        }
        updateObj.start_time = startTime
      }

      if (endTime !== undefined) {
        // 验证时间格式
        const timeRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/
        if (!timeRegex.test(endTime)) {
          throw new Error('结束时间格式不正确，应为 HH:mm:ss')
        }
        updateObj.end_time = endTime
      }

      // 验证开始时间小于结束时间
      const finalStartTime = startTime !== undefined ? startTime : existingSlot.start_time
      const finalEndTime = endTime !== undefined ? endTime : existingSlot.end_time
      if (finalStartTime >= finalEndTime) {
        throw new Error('开始时间必须小于结束时间')
      }

      if (slotStatus !== undefined && slotStatus !== null) {
        updateObj.slot_status = Number(slotStatus)
      }

      if (sortOrder !== undefined && sortOrder !== null) {
        updateObj.sort_order = Number(sortOrder)
      }

      if (Object.keys(updateObj).length === 0) {
        return
      }

      await app.database('t_flash_sale_time_slot')
        .where('slot_id', slotId)
        .where('status', 1)
        .update(updateObj)
    }

    /**
     * 删除时间段（软删除）
     * @param {String} slotId - 时间段ID
     * @returns {Promise<void>}
     */
    async deleteTimeSlot(slotId) {
      await app.database('t_flash_sale_time_slot')
        .where('slot_id', slotId)
        .where('status', 1)
        .update({ status: -1 })
    }

    /**
     * 批量删除时间段（软删除）
     * @param {Array<String>} slotIds - 时间段ID数组
     * @returns {Promise<void>}
     */
    async batchDeleteTimeSlot(slotIds) {
      await app.database('t_flash_sale_time_slot')
        .whereIn('slot_id', slotIds)
        .where('status', 1)
        .update({ status: -1 })
    }

    /**
     * 切换时间段启用状态
     * @param {String} slotId - 时间段ID
     * @param {Number} slotStatus - 状态值
     * @returns {Promise<void>}
     */
    async toggleTimeSlotStatus(slotId, slotStatus) {
      await app.database('t_flash_sale_time_slot')
        .where('slot_id', slotId)
        .where('status', 1)
        .update({ slot_status: Number(slotStatus) })
    }
  }
}
