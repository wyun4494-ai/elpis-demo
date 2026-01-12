/**
 * 优惠券路由参数验证规则
 */
module.exports = {
  '/api/proj/coupon/list': {
    get: {
      query: {
        type: 'object',
        properties: {
          page: { type: 'string' },
          pageSize: { type: 'string' },
          coupon_name: { type: 'string' },
          coupon_type: { type: 'string' },
          coupon_status: { type: 'string' },
          sort_field: { type: 'string' },
          sort_order: { type: 'string' }
        }
      }
    }
  },
  '/api/proj/coupon/:coupon_id': {
    get: {
      params: {
        type: 'object',
        properties: {
          coupon_id: { type: 'string' }
        },
        required: ['coupon_id']
      }
    },
    put: {
      params: {
        type: 'object',
        properties: {
          coupon_id: { type: 'string' }
        },
        required: ['coupon_id']
      },
      body: {
        type: 'object',
        properties: {
          coupon_name: { type: 'string', minLength: 1, maxLength: 200 },
          coupon_type: { type: 'number' },
          coupon_config: { type: 'object' },
          discount_amount: { type: 'number' },
          discount_rate: { type: 'number' },
          min_amount: { type: 'number' },
          max_discount: { type: 'number' },
          total_count: { type: 'number' },
          limit_per_user: { type: 'number' },
          valid_days: { type: 'number' },
          start_time: { type: 'string' },
          end_time: { type: 'string' },
          coupon_status: { type: 'number' },
          applicable_products: { type: 'array' },
          applicable_categories: { type: 'array' },
          description: { type: 'string' },
          sort_order: { type: 'number' }
        }
      }
    },
    delete: {
      params: {
        type: 'object',
        properties: {
          coupon_id: { type: 'string' }
        },
        required: ['coupon_id']
      }
    }
  },
  '/api/proj/coupon': {
    post: {
      body: {
        type: 'object',
        properties: {
          coupon_name: { type: 'string', minLength: 1, maxLength: 200 },
          coupon_type: { type: 'number' },
          coupon_config: { type: 'object' },
          discount_amount: { type: 'number' },
          discount_rate: { type: 'number' },
          min_amount: { type: 'number' },
          max_discount: { type: 'number' },
          total_count: { type: 'number' },
          limit_per_user: { type: 'number' },
          valid_days: { type: 'number' },
          start_time: { type: 'string' },
          end_time: { type: 'string' },
          applicable_products: { type: 'array' },
          applicable_categories: { type: 'array' },
          description: { type: 'string' },
          sort_order: { type: 'number' },
          created_by: { type: 'string' }
        },
        required: ['coupon_name']
      }
    },
    put: {
      body: {
        type: 'object',
        properties: {
          coupon_id: { type: 'string' },
          coupon_name: { type: 'string', minLength: 1, maxLength: 200 },
          coupon_type: { type: 'number' },
          coupon_config: { type: 'object' },
          discount_amount: { type: 'number' },
          discount_rate: { type: 'number' },
          min_amount: { type: 'number' },
          max_discount: { type: 'number' },
          total_count: { type: 'number' },
          limit_per_user: { type: 'number' },
          valid_days: { type: 'number' },
          start_time: { type: 'string' },
          end_time: { type: 'string' },
          coupon_status: { type: 'number' },
          applicable_products: { type: 'array' },
          applicable_categories: { type: 'array' },
          description: { type: 'string' },
          sort_order: { type: 'number' }
        },
        required: ['coupon_id']
      }
    }
  },
  '/api/proj/coupon/batch-delete': {
    post: {
      body: {
        type: 'object',
        properties: {
          coupon_ids: {
            type: 'array',
            items: { type: 'string' },
            minItems: 1
          }
        },
        required: ['coupon_ids']
      }
    }
  }
}
