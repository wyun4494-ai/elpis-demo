/**
 * 用户优惠券服务
 */
module.exports = (app) => {
  return class UserCouponService {
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
     * 获取领取用户列表
     * @param {Object} params - 查询参数
     * @returns {Promise<Object>} 返回列表和总数
     */
    async getUserCouponList(params) {
      const {
        coupon_id,
        page = 1,
        pageSize = 10,
        use_status,
        customer_name
      } = params

      if (!coupon_id) {
        throw new Error('优惠券ID不能为空')
      }

      const offset = (page - 1) * pageSize

      // 构建查询
      let query = app.database('t_user_coupon as uc')
        .leftJoin('t_customer as c', 'uc.customer_id', 'c.customer_id')
        .where('uc.coupon_id', coupon_id)
        .select(
          'uc.*',
          'c.username as customer_name',
          'c.nickname as customer_nickname',
          'c.phone as customer_phone'
        )

      // 搜索条件
      if (use_status !== undefined && use_status !== null && use_status !== '' && use_status !== -999) {
        query = query.where('uc.use_status', use_status)
      }
      if (customer_name) {
        query = query.where(function() {
          this.where('c.username', 'like', `%${customer_name}%`)
            .orWhere('c.nickname', 'like', `%${customer_name}%`)
        })
      }

      // 查询列表
      const list = await query
        .clone()
        .orderBy('uc.receive_time', 'desc')
        .limit(pageSize)
        .offset(offset)

      // 格式化时间
      list.forEach(item => {
        item.receive_time = this.formatDateTime(item.receive_time)
        item.use_time = this.formatDateTime(item.use_time)
        item.valid_start_time = this.formatDateTime(item.valid_start_time)
        item.valid_end_time = this.formatDateTime(item.valid_end_time)
      })

      // 查询总数
      const countQuery = app.database('t_user_coupon as uc')
        .leftJoin('t_customer as c', 'uc.customer_id', 'c.customer_id')
        .where('uc.coupon_id', coupon_id)
      
      // 添加搜索条件
      if (use_status !== undefined && use_status !== null && use_status !== '' && use_status !== -999) {
        countQuery.where('uc.use_status', use_status)
      }
      if (customer_name) {
        countQuery.where(function() {
          this.where('c.username', 'like', `%${customer_name}%`)
            .orWhere('c.nickname', 'like', `%${customer_name}%`)
        })
      }
      
      const totalResult = await countQuery.count('* as count').first()
      const total = totalResult ? totalResult.count : 0

      return { list, total }
    }

    /**
     * 获取用户优惠券统计
     * @param {String} couponId - 优惠券ID
     * @returns {Promise<Object>} 统计数据
     */
    async getUserCouponStats(couponId) {
      const stats = await app.database('t_user_coupon')
        .where('coupon_id', couponId)
        .select(
          app.database.raw('COUNT(*) as total_received'),
          app.database.raw('SUM(CASE WHEN use_status = 0 THEN 1 ELSE 0 END) as unused_count'),
          app.database.raw('SUM(CASE WHEN use_status = 1 THEN 1 ELSE 0 END) as used_count'),
          app.database.raw('SUM(CASE WHEN use_status = 2 THEN 1 ELSE 0 END) as expired_count')
        )
        .first()

      return stats || {
        total_received: 0,
        unused_count: 0,
        used_count: 0,
        expired_count: 0
      }
    }
  }
}
