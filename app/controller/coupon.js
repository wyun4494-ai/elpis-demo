/**
 * 优惠券控制器
 */
module.exports = (app) => {
  const BaseController = require('@lesheng/elpis').Controller.Base(app)

  return class CouponController extends BaseController {
    /**
     * 获取优惠券列表
     * @param {Object} ctx - Koa 上下文
     */
    async getCouponList(ctx) {
      try {
        const params = ctx.query
        const { coupon: couponService } = app.service
        const result = await couponService.getCouponList(params)
        this.success(ctx, result.list, { total: result.total })
      } catch (error) {
        app.logger.error('获取优惠券列表失败:', error)
        this.error(ctx, error.message || '获取优惠券列表失败')
      }
    }

    /**
     * 获取优惠券详情
     * @param {Object} ctx - Koa 上下文
     */
    async getCouponDetail(ctx) {
      try {
        const { coupon_id } = ctx.params
        const { coupon: couponService } = app.service
        const result = await couponService.getCouponDetail(coupon_id)
        this.success(ctx, result)
      } catch (error) {
        app.logger.error('获取优惠券详情失败:', error)
        this.error(ctx, error.message || '获取优惠券详情失败')
      }
    }

    /**
     * 创建优惠券
     * @param {Object} ctx - Koa 上下文
     */
    async createCoupon(ctx) {
      try {
        const data = ctx.request.body
        
        // 如果有 coupon_config 对象，拆分成多个字段
        if (data.coupon_config && typeof data.coupon_config === 'object') {
          Object.assign(data, data.coupon_config)
          delete data.coupon_config
        }
        
        const { coupon: couponService } = app.service
        const couponId = await couponService.createCoupon(data)
        this.success(ctx, { coupon_id: couponId }, { message: '创建成功' })
      } catch (error) {
        app.logger.error('创建优惠券失败:', error)
        this.fail(ctx, error.message || '创建优惠券失败', 500)
      }
    }

    /**
     * 更新优惠券
     * @param {Object} ctx - Koa 上下文
     */
    async updateCoupon(ctx) {
      try {
        // 优先从 params 获取，如果没有则从 body 获取
        const coupon_id = ctx.params.coupon_id || ctx.request.body.coupon_id
        
        if (!coupon_id) {
          return this.fail(ctx, '优惠券ID不能为空', 400)
        }
        
        const data = ctx.request.body
        
        // 如果有 coupon_config 对象，拆分成多个字段
        if (data.coupon_config && typeof data.coupon_config === 'object') {
          Object.assign(data, data.coupon_config)
          delete data.coupon_config
        }
        
        const { coupon: couponService } = app.service
        await couponService.updateCoupon(coupon_id, data)
        this.success(ctx, null, { message: '更新成功' })
      } catch (error) {
        app.logger.error('更新优惠券失败:', error)
        this.fail(ctx, error.message || '更新优惠券失败', 500)
      }
    }

    /**
     * 删除优惠券
     * @param {Object} ctx - Koa 上下文
     */
    async deleteCoupon(ctx) {
      try {
        const { coupon_id } = ctx.params
        const { coupon: couponService } = app.service
        await couponService.deleteCoupon(coupon_id)
        this.success(ctx, null, { message: '删除成功' })
      } catch (error) {
        app.logger.error('删除优惠券失败:', error)
        this.error(ctx, error.message || '删除优惠券失败')
      }
    }

    /**
     * 批量删除优惠券
     * @param {Object} ctx - Koa 上下文
     */
    async batchDeleteCoupons(ctx) {
      try {
        const { coupon_ids } = ctx.request.body
        const { coupon: couponService } = app.service
        await couponService.batchDeleteCoupons(coupon_ids)
        this.success(ctx, null, { message: '批量删除成功' })
      } catch (error) {
        app.logger.error('批量删除优惠券失败:', error)
        this.error(ctx, error.message || '批量删除优惠券失败')
      }
    }
  }
}
