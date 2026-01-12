/**
 * 用户优惠券路由
 */
module.exports = (app, router) => {
  const { userCoupon: userCouponController } = app.controller

  // 获取领取用户列表
  router.get('/api/proj/user-coupon/list', userCouponController.getUserCouponList.bind(userCouponController))

  // 获取用户优惠券统计
  router.get('/api/proj/user-coupon/stats/:coupon_id', userCouponController.getUserCouponStats.bind(userCouponController))
}
