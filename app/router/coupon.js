/**
 * 优惠券路由
 */
module.exports = (app, router) => {
  const { coupon: couponController } = app.controller

  // 获取优惠券列表
  router.get('/api/proj/coupon/list', couponController.getCouponList.bind(couponController))

  // 获取优惠券详情
  router.get('/api/proj/coupon/:coupon_id', couponController.getCouponDetail.bind(couponController))

  // 创建优惠券
  router.post('/api/proj/coupon', couponController.createCoupon.bind(couponController))

  // 更新优惠券（支持两种方式）
  router.put('/api/proj/coupon/:coupon_id', couponController.updateCoupon.bind(couponController))
  router.put('/api/proj/coupon', couponController.updateCoupon.bind(couponController))

  // 删除优惠券
  router.delete('/api/proj/coupon/:coupon_id', couponController.deleteCoupon.bind(couponController))

  // 批量删除优惠券
  router.post('/api/proj/coupon/batch-delete', couponController.batchDeleteCoupons.bind(couponController))
}
