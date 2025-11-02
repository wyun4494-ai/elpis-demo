module.exports = {
  '/api/proj/brand/list': {
    get: {
      query: {
        type: 'object',
        properties: {
          page: { type: 'string' },
          pageSize: { type: 'string' },
          brand_name: { type: 'string' },
          first_letter: { type: 'string' }
        }
      }
    }
  },
  '/api/proj/brand': {
    get: {
      query: {
        type: 'object',
        properties: {
          brand_id: { type: 'string' },
          value: { type: 'string' }  // remote-select 组件回显时使用 value 参数
        }
        // 不设置 required，允许 brand_id 或 value 任意一个
      }
    },
    post: {
      body: {
        type: 'object',
        properties: {
          brand_name: { type: 'string' },
          brand_name_en: { type: 'string' },
          logo_url: { type: 'string' },
          description: { type: 'string' },
          sort_order: { type: 'number' }
        },
        required: ['brand_name']
      }
    },
    put: {
      body: {
        type: 'object',
        properties: {
          brand_id: { type: 'string' },
          brand_name: { type: 'string' },
          brand_name_en: { type: 'string' },
          logo_url: { type: 'string' },
          description: { type: 'string' },
          sort_order: { type: 'number' }
        },
        required: ['brand_id']
      }
    },
    delete: {
      body: {
        type: 'object',
        properties: {
          brand_id: { type: 'string' }
        },
        required: ['brand_id']
      }
    }
  },
  '/api/proj/brand/search': {
    get: {
      query: {
        type: 'object',
        properties: {
          keyword: { type: 'string' }
        }
      }
    }
  }
};

