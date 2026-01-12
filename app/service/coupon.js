/**
 * 优惠券服务
 */
module.exports = (app) => {
  const { v4: uuidv4 } = require('uuid')

  return class CouponService {
    /**
     * 格式化日期时间
     * @param {Date|String} datetime - 日期时间
     * @returns {String} 格式化后的日期时间
     */
    formatDateTime(datetime) {
      if (!datetime) return null
      
      const date = new Date(datetime)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      const seconds = String(date.getSeconds()).padStart(2, '0')
      
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    }

    /**
     * 获取优惠券列表
     * @param {Object} params - 查询参数
     * @returns {Promise<Object>} 返回列表和总数
     */
    async getCouponList(params) {
      const {
        page = 1,
        pageSize = 10,
        coupon_name,
        coupon_type,
        coupon_status,
        sort_field: sortField,
        sort_order: sortOrder
      } = params

      const offset = (page - 1) * pageSize

      // 构建查询
      let query = app.database('t_coupon').where('status', 1)

      // 搜索条件
      if (coupon_name) {
        query = query.where('coupon_name', 'like', `%${coupon_name}%`)
      }
      if (coupon_type) {
        query = query.where('coupon_type', coupon_type)
      }
      if (coupon_status !== undefined && coupon_status !== null && coupon_status !== '') {
        query = query.where('coupon_status', coupon_status)
      }

      // 排序
      const allowedSortFields = ['sort_order', 'create_time', 'received_count', 'used_count']
      let orderByField = 'create_time'
      let orderByDirection = 'desc'

      if (sortField && allowedSortFields.includes(sortField)) {
        orderByField = sortField
        orderByDirection = sortOrder === 'asc' ? 'asc' : 'desc'
      }

      // 查询列表
      const list = await query
        .clone()
        .orderBy(orderByField, orderByDirection)
        .limit(pageSize)
        .offset(offset)

      // 查询总数
      const totalResult = await query.clone().count('* as count').first()
      const total = totalResult ? totalResult.count : 0

      // 自动更新优惠券状态（仅非手动控制的）
      for (const item of list) {
        if (!item.manual_control || item.manual_control === 0) {
          const calculatedStatus = this.calculateCouponStatus(item.start_time, item.end_time, item.valid_days)
          if (calculatedStatus !== item.coupon_status) {
            await app.database('t_coupon')
              .where('coupon_id', item.coupon_id)
              .update({ coupon_status: calculatedStatus })
            item.coupon_status = calculatedStatus
          }
        }
        
        // 添加中文显示字段
        const typeMap = { 1: '满减券', 2: '折扣券', 3: '无门槛券' }
        const statusMap = { 0: '未开始', 1: '进行中', 2: '已结束' }
        item.coupon_type_text = typeMap[item.coupon_type] || '-'
        item.coupon_status_text = statusMap[item.coupon_status] || '-'
      }

      return { list, total }
    }

    /**
     * 计算优惠券状态
     * @param {Date} startTime - 开始时间
     * @param {Date} endTime - 结束时间
     * @param {Number} validDays - 有效天数
     * @returns {Number} 状态：0-未开始，1-进行中，2-已结束
     */
    calculateCouponStatus(startTime, endTime, validDays) {
      const now = new Date()

      // 相对时间模式（领取后N天有效）
      if (validDays > 0) {
        return 1 // 进行中（只要可以领取就是进行中）
      }

      // 固定时间模式
      if (!startTime || !endTime) {
        return 0 // 未开始
      }

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

    /**
     * 获取优惠券详情
     * @param {String} couponId - 优惠券ID
     * @returns {Promise<Object>} 优惠券详情
     */
    async getCouponDetail(couponId) {
      const coupon = await app.database('t_coupon')
        .where('coupon_id', couponId)
        .where('status', 1)
        .first()

      if (!coupon) {
        throw new Error('优惠券不存在')
      }

      // 自动更新状态（仅非手动控制的）
      if (!coupon.manual_control || coupon.manual_control === 0) {
        const calculatedStatus = this.calculateCouponStatus(coupon.start_time, coupon.end_time, coupon.valid_days)
        if (calculatedStatus !== coupon.coupon_status) {
          await app.database('t_coupon')
            .where('coupon_id', couponId)
            .update({ coupon_status: calculatedStatus })
          coupon.coupon_status = calculatedStatus
        }
      }

      // 转换数字类型
      if (coupon.discount_amount !== null && coupon.discount_amount !== undefined) {
        coupon.discount_amount = Number(coupon.discount_amount)
      }
      if (coupon.discount_rate !== null && coupon.discount_rate !== undefined) {
        coupon.discount_rate = Number(coupon.discount_rate)
      }
      if (coupon.min_amount !== null && coupon.min_amount !== undefined) {
        coupon.min_amount = Number(coupon.min_amount)
      }
      if (coupon.max_discount !== null && coupon.max_discount !== undefined) {
        coupon.max_discount = Number(coupon.max_discount)
      }
      if (coupon.valid_days !== null && coupon.valid_days !== undefined) {
        coupon.valid_days = Number(coupon.valid_days)
      }
      if (coupon.total_count !== null && coupon.total_count !== undefined) {
        coupon.total_count = Number(coupon.total_count)
      }
      if (coupon.limit_per_user !== null && coupon.limit_per_user !== undefined) {
        coupon.limit_per_user = Number(coupon.limit_per_user)
      }
      if (coupon.sort_order !== null && coupon.sort_order !== undefined) {
        coupon.sort_order = Number(coupon.sort_order)
      }

      // 解析 JSON 字段
      if (coupon.applicable_products) {
        try {
          coupon.applicable_products = JSON.parse(coupon.applicable_products)
        } catch (e) {
          coupon.applicable_products = []
        }
      } else {
        coupon.applicable_products = []
      }

      if (coupon.applicable_categories) {
        try {
          coupon.applicable_categories = JSON.parse(coupon.applicable_categories)
        } catch (e) {
          coupon.applicable_categories = []
        }
      } else {
        coupon.applicable_categories = []
      }

      // 格式化时间
      coupon.start_time = this.formatDateTime(coupon.start_time)
      coupon.end_time = this.formatDateTime(coupon.end_time)
      coupon.create_time = this.formatDateTime(coupon.create_time)
      coupon.update_time = this.formatDateTime(coupon.update_time)

      // 组合 coupon_config 对象（用于编辑表单）
      coupon.coupon_config = {
        coupon_type: coupon.coupon_type,
        discount_amount: coupon.discount_amount,
        discount_rate: coupon.discount_rate,
        min_amount: coupon.min_amount,
        max_discount: coupon.max_discount,
        total_count: coupon.total_count,
        limit_per_user: coupon.limit_per_user,
        valid_days: coupon.valid_days,
        start_time: coupon.start_time,
        end_time: coupon.end_time,
        applicable_products: coupon.applicable_products,
        applicable_categories: coupon.applicable_categories,
        description: coupon.description,
        sort_order: coupon.sort_order
      }

      return coupon
    }

    /**
     * 创建优惠券
     * @param {Object} data - 优惠券数据
     * @returns {Promise<String>} 优惠券ID
     */
    async createCoupon(data) {
      const {
        coupon_name,
        coupon_type,
        discount_amount,
        discount_rate,
        min_amount,
        max_discount,
        total_count,
        limit_per_user,
        valid_days,
        start_time,
        end_time,
        applicable_products,
        applicable_categories,
        description,
        sort_order,
        created_by
      } = data

      // 生成优惠券ID
      const couponId = `COUPON${uuidv4().replace(/-/g, '').substring(0, 10).toUpperCase()}`

      // 验证数据
      this.validateCouponData(data)

      // 计算初始状态
      const couponStatus = this.calculateCouponStatus(start_time, end_time, valid_days)

      // 插入数据
      await app.database('t_coupon').insert({
        coupon_id: couponId,
        coupon_name,
        coupon_type: Number(coupon_type),
        discount_amount: discount_amount || 0,
        discount_rate: discount_rate || 0,
        min_amount: min_amount || 0,
        max_discount: max_discount || 0,
        total_count: total_count || 0,
        received_count: 0,
        used_count: 0,
        limit_per_user: limit_per_user || 1,
        valid_days: valid_days || 0,
        start_time: start_time || null,
        end_time: end_time || null,
        coupon_status: couponStatus,
        manual_control: 0,
        applicable_products: applicable_products ? JSON.stringify(applicable_products) : null,
        applicable_categories: applicable_categories ? JSON.stringify(applicable_categories) : null,
        description: description || null,
        sort_order: sort_order || 0,
        status: 1,
        created_by: created_by || null
      })

      return couponId
    }

    /**
     * 更新优惠券
     * @param {String} couponId - 优惠券ID
     * @param {Object} data - 更新数据
     */
    async updateCoupon(couponId, data) {
      // 检查优惠券是否存在
      const coupon = await app.database('t_coupon')
        .where('coupon_id', couponId)
        .where('status', 1)
        .first()

      if (!coupon) {
        throw new Error('优惠券不存在')
      }

      const {
        coupon_name,
        coupon_type,
        discount_amount,
        discount_rate,
        min_amount,
        max_discount,
        total_count,
        limit_per_user,
        valid_days,
        start_time,
        end_time,
        coupon_status,
        applicable_products,
        applicable_categories,
        description,
        sort_order
      } = data

      // 验证数据
      this.validateCouponData(data)

      // 构建更新对象
      const updateObj = {}

      if (coupon_name !== undefined) updateObj.coupon_name = coupon_name
      if (coupon_type !== undefined) updateObj.coupon_type = Number(coupon_type)
      if (discount_amount !== undefined) updateObj.discount_amount = discount_amount
      if (discount_rate !== undefined) updateObj.discount_rate = discount_rate
      if (min_amount !== undefined) updateObj.min_amount = min_amount
      if (max_discount !== undefined) updateObj.max_discount = max_discount
      if (total_count !== undefined) updateObj.total_count = total_count
      if (limit_per_user !== undefined) updateObj.limit_per_user = limit_per_user
      if (valid_days !== undefined) updateObj.valid_days = valid_days
      if (start_time !== undefined) updateObj.start_time = start_time
      if (end_time !== undefined) updateObj.end_time = end_time
      if (applicable_products !== undefined) {
        updateObj.applicable_products = applicable_products ? JSON.stringify(applicable_products) : null
      }
      if (applicable_categories !== undefined) {
        updateObj.applicable_categories = applicable_categories ? JSON.stringify(applicable_categories) : null
      }
      if (description !== undefined) updateObj.description = description
      if (sort_order !== undefined) updateObj.sort_order = sort_order

      // 如果传入了 coupon_status，标记为手动控制
      if (coupon_status !== undefined && coupon_status !== null) {
        updateObj.coupon_status = Number(coupon_status)
        updateObj.manual_control = 1
      }

      // 更新数据
      await app.database('t_coupon')
        .where('coupon_id', couponId)
        .update(updateObj)
    }

    /**
     * 删除优惠券（软删除）
     * @param {String} couponId - 优惠券ID
     */
    async deleteCoupon(couponId) {
      // 检查优惠券是否存在
      const coupon = await app.database('t_coupon')
        .where('coupon_id', couponId)
        .where('status', 1)
        .first()

      if (!coupon) {
        throw new Error('优惠券不存在')
      }

      // 软删除
      await app.database('t_coupon')
        .where('coupon_id', couponId)
        .update({ status: -1 })
    }

    /**
     * 批量删除优惠券
     * @param {Array} couponIds - 优惠券ID数组
     */
    async batchDeleteCoupons(couponIds) {
      if (!couponIds || couponIds.length === 0) {
        throw new Error('请选择要删除的优惠券')
      }

      await app.database('t_coupon')
        .whereIn('coupon_id', couponIds)
        .where('status', 1)
        .update({ status: -1 })
    }

    /**
     * 验证优惠券数据
     * @param {Object} data - 优惠券数据
     */
    validateCouponData(data) {
      const { coupon_type, discount_amount, discount_rate, min_amount, valid_days, start_time, end_time } = data

      // 验证优惠券类型
      if (coupon_type && ![1, 2, 3].includes(Number(coupon_type))) {
        throw new Error('优惠券类型错误')
      }

      // 满减券验证
      if (Number(coupon_type) === 1) {
        if (!discount_amount || discount_amount <= 0) {
          throw new Error('满减券必须设置优惠金额')
        }
        if (min_amount === undefined || min_amount === null || min_amount <= 0) {
          throw new Error('满减券必须设置最低消费金额（必须大于0）')
        }
        if (discount_amount >= min_amount) {
          throw new Error('优惠金额不能大于等于最低消费金额')
        }
      }

      // 折扣券验证
      if (Number(coupon_type) === 2) {
        if (!discount_rate || discount_rate <= 0 || discount_rate >= 1) {
          throw new Error('折扣券折扣率必须在0-1之间')
        }
      }

      // 无门槛券验证
      if (Number(coupon_type) === 3) {
        if (!discount_amount || discount_amount <= 0) {
          throw new Error('无门槛券必须设置优惠金额')
        }
      }

      // 有效期验证
      if (valid_days === 0 || valid_days === '0') {
        // 固定时间模式
        if (!start_time || !end_time) {
          throw new Error('固定时间模式必须设置开始时间和结束时间')
        }
        if (new Date(start_time) >= new Date(end_time)) {
          throw new Error('开始时间必须早于结束时间')
        }
      }
    }
  }
}
