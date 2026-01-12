/**
 * 广告位置参数验证规则
 */
module.exports = {
  '/api/proj/ad-position/list': {
    get: {
      query: {
        type: 'object',
        properties: {
          keyword: { type: 'string' },
          is_enabled: { type: 'string' },
          page: { type: 'string' },
          pageSize: { type: 'string' }
        }
      }
    }
  },
  '/api/proj/ad-position': {
    get: {
      query: {
        type: 'object',
        properties: {
          position_id: { type: 'string' }
        },
        required: ['position_id']
      }
    },
    post: {
      body: {
        type: 'object',
        properties: {
          position_key: { type: 'string', minLength: 1, maxLength: 50 },
          position_name: { type: 'string', minLength: 1, maxLength: 100 },
          position_desc: { type: 'string', maxLength: 500 },
          width: { type: 'number', minimum: 0 },
          height: { type: 'number', minimum: 0 },
          max_count: { type: 'number', minimum: 1 },
          is_enabled: { type: 'number' },
          sort_order: { type: 'number' }
        },
        required: ['position_key', 'position_name']
      }
    },
    put: {
      body: {
        type: 'object',
        properties: {
          position_id: { type: 'string' },
          position_key: { type: 'string', minLength: 1, maxLength: 50 },
          position_name: { type: 'string', minLength: 1, maxLength: 100 },
          position_desc: { type: 'string', maxLength: 500 },
          width: { type: 'number', minimum: 0 },
          height: { type: 'number', minimum: 0 },
          max_count: { type: 'number', minimum: 1 },
          is_enabled: { type: 'number' },
          sort_order: { type: 'number' }
        },
        required: ['position_id']
      }
    },
    delete: {
      query: {
        type: 'object',
        properties: {
          position_id: { type: 'string' }
        },
        required: ['position_id']
      }
    }
  },
  '/api/proj/ad-position/toggle': {
    post: {
      body: {
        type: 'object',
        properties: {
          position_id: { type: 'string' },
          is_enabled: { type: 'number' }
        },
        required: ['position_id', 'is_enabled']
      }
    }
  },
  '/api/proj/ad-position/batch/enable': {
    post: {
      body: {
        type: 'object',
        properties: {
          position_ids: {
            type: 'array',
            items: { type: 'string' },
            minItems: 1
          }
        },
        required: ['position_ids']
      }
    }
  },
  '/api/proj/ad-position/batch/disable': {
    post: {
      body: {
        type: 'object',
        properties: {
          position_ids: {
            type: 'array',
            items: { type: 'string' },
            minItems: 1
          }
        },
        required: ['position_ids']
      }
    }
  },
  '/api/proj/ad-position/batch/delete': {
    post: {
      body: {
        type: 'object',
        properties: {
          position_ids: {
            type: 'array',
            items: { type: 'string' },
            minItems: 1
          }
        },
        required: ['position_ids']
      }
    }
  }
};
