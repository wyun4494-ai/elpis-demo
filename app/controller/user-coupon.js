/**
 * 用户优惠券控制器
 */
module.exports = (app) => {
  const BaseController = require('@lesheng/elpis').Controller.Base(app)

  class UserCouponController extends BaseController {
    /**
     * 获取领取用户列表
     * @param {Object} ctx - Koa 上下文
     */
    async getUserCouponList(ctx) {
      try {
        const params = ctx.query
        const { userCoupon: userCouponService } = app.service
        const result = await userCouponService.getUserCouponList(params)
        this.success(ctx, result.list, { total: result.total })
      } catch (error) {
        app.logger.error('获取领取用户列表失败:', error)
        this.error(ctx, error.message || '获取领取用户列表失败')
      }
    }

    /**
     * 获取用户优惠券统计
     * @param {Object} ctx - Koa 上下文
     */
    async getUserCouponStats(ctx) {
      try {
        const { coupon_id } = ctx.params
        const { userCoupon: userCouponService } = app.service
        const result = await userCouponService.getUserCouponStats(coupon_id)
        this.success(ctx, result)
      } catch (error) {
        app.logger.error('获取用户优惠券统计失败:', error)
        this.error(ctx, error.message || '获取用户优惠券统计失败')
      }
    }
  }

  return UserCouponController
}
