/**
 * 秒杀活动管理 API 参数验证规则
 */
module.exports = {
  '/api/proj/flash-sale/list': {
    get: {
      query: {
        type: 'object',
        properties: {
          activity_name: { type: 'string' },
          activity_status: { type: 'string' },
          start_time_start: { type: 'string' },
          start_time_end: { type: 'string' },
          page: { type: 'string' },
          pageSize: { type: 'string' }
        }
      }
    }
  },
  '/api/proj/flash-sale/:flash_sale_id': {
    get: {
      params: {
        type: 'object',
        properties: {
          flash_sale_id: { type: 'string' }
        },
        required: ['flash_sale_id']
      }
    },
    put: {
      params: {
        type: 'object',
        properties: {
          flash_sale_id: { type: 'string' }
        },
        required: ['flash_sale_id']
      },
      body: {
        type: 'object',
        properties: {
          flash_sale_id: { type: 'string' },
          activity_name: { type: 'string', minLength: 1, maxLength: 200 },
          activity_desc: { type: 'string' },
          start_time: { type: 'string' },
          end_time: { type: 'string' },
          activity_status: { type: 'number', minimum: 0, maximum: 3 },
          limit_per_product: { type: 'number', minimum: 0 },
          sort_order: { type: 'number' },
          banner_image: { type: 'string' }
        }
      }
    }
  },
  '/api/proj/flash-sale': {
    get: {
      query: {
        type: 'object',
        properties: {
          flash_sale_id: { type: 'string' }
        },
        required: ['flash_sale_id']
      }
    },
    post: {
      body: {
        type: 'object',
        properties: {
          activity_name: { type: 'string', minLength: 1, maxLength: 200 },
          activity_desc: { type: 'string' },
          start_time: { type: 'string' },
          end_time: { type: 'string' },
          limit_per_product: { type: 'number', minimum: 0 },
          sort_order: { type: 'number' },
          banner_image: { type: 'string' }
        },
        required: ['activity_name', 'start_time', 'end_time']
      }
    },
    put: {
      body: {
        type: 'object',
        properties: {
          flash_sale_id: { type: 'string' },
          activity_name: { type: 'string', minLength: 1, maxLength: 200 },
          activity_desc: { type: 'string' },
          start_time: { type: 'string' },
          end_time: { type: 'string' },
          activity_status: { type: 'number', minimum: 0, maximum: 3 },
          limit_per_product: { type: 'number', minimum: 0 },
          sort_order: { type: 'number' },
          banner_image: { type: 'string' }
        }
      }
    }
  },
  '/api/proj/flash-sale/batch-delete': {
    post: {
      body: {
        type: 'object',
        properties: {
          flash_sale_ids: {
            type: 'array',
            items: { type: 'string' },
            minItems: 1
          }
        },
        required: ['flash_sale_ids']
      }
    }
  }
}
