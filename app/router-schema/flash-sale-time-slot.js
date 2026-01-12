/**
 * 秒杀时间段 API 参数验证规则
 */
module.exports = {
  '/api/proj/flash-sale-time-slot/list': {
    get: {
      query: {
        type: 'object',
        properties: {
          flash_sale_id: { type: 'string' }
        }
      }
    }
  },
  '/api/proj/flash-sale-time-slot/:slot_id': {
    get: {
      params: {
        type: 'object',
        properties: {
          slot_id: { type: 'string' }
        },
        required: ['slot_id']
      }
    },
    put: {
      params: {
        type: 'object',
        properties: {
          slot_id: { type: 'string' }
        },
        required: ['slot_id']
      },
      body: {
        type: 'object',
        properties: {
          slot_name: { type: 'string', minLength: 1, maxLength: 100 },
          start_time: { type: 'string', pattern: '^([01]\\d|2[0-3]):([0-5]\\d):([0-5]\\d)$' },
          end_time: { type: 'string', pattern: '^([01]\\d|2[0-3]):([0-5]\\d):([0-5]\\d)$' },
          slot_status: { type: 'number', minimum: 0, maximum: 2 },
          sort_order: { type: 'number' }
        }
      }
    },
    delete: {
      params: {
        type: 'object',
        properties: {
          slot_id: { type: 'string' }
        },
        required: ['slot_id']
      }
    }
  },
  '/api/proj/flash-sale-time-slot': {
    post: {
      body: {
        type: 'object',
        properties: {
          flash_sale_id: { type: 'string' },
          slot_name: { type: 'string', minLength: 1, maxLength: 100 },
          start_time: { type: 'string', pattern: '^([01]\\d|2[0-3]):([0-5]\\d):([0-5]\\d)$' },
          end_time: { type: 'string', pattern: '^([01]\\d|2[0-3]):([0-5]\\d):([0-5]\\d)$' },
          sort_order: { type: 'number' }
        },
        required: ['flash_sale_id', 'slot_name', 'start_time', 'end_time']
      }
    }
  },
  '/api/proj/flash-sale-time-slot/batch-delete': {
    post: {
      body: {
        type: 'object',
        properties: {
          slot_ids: {
            type: 'array',
            items: { type: 'string' },
            minItems: 1
          }
        },
        required: ['slot_ids']
      }
    }
  },
  '/api/proj/flash-sale-time-slot/:slot_id/toggle-status': {
    put: {
      params: {
        type: 'object',
        properties: {
          slot_id: { type: 'string' }
        },
        required: ['slot_id']
      },
      body: {
        type: 'object',
        properties: {
          slot_status: { type: 'number', minimum: 0, maximum: 2 }
        },
        required: ['slot_status']
      }
    }
  }
}
