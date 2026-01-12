/**
 * 用户优惠券路由参数验证规则
 */
module.exports = {
  '/api/proj/user-coupon/list': {
    get: {
      query: {
        type: 'object',
        properties: {
          coupon_id: { type: 'string' },
          page: { type: 'string' },
          pageSize: { type: 'string' },
          use_status: { type: 'string' },
          customer_name: { type: 'string' }
        },
        required: ['coupon_id']
      }
    }
  },
  '/api/proj/user-coupon/stats/:coupon_id': {
    get: {
      params: {
        type: 'object',
        properties: {
          coupon_id: { type: 'string' }
        },
        required: ['coupon_id']
      }
    }
  }
}
