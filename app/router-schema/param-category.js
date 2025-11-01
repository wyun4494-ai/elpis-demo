module.exports = {
  '/api/proj/param-category/list': {
    get: {
      query: {
        type: 'object',
        properties: {
          page: { type: 'string' },
          pageSize: { type: 'string' },
          category_name: { type: 'string' }
        }
      }
    }
  },
  '/api/proj/param-category': {
    get: {
      query: {
        type: 'object',
        properties: {
          category_id: { type: 'string' }
        },
        required: ['category_id']
      }
    },
    post: {
      body: {
        type: 'object',
        properties: {
          category_name: { type: 'string' },
          sort_order: { type: 'number' }
        },
        required: ['category_name']
      }
    },
    put: {
      body: {
        type: 'object',
        properties: {
          category_id: { type: 'string' },
          category_name: { type: 'string' },
          sort_order: { type: 'number' }
        },
        required: ['category_id']
      }
    },
    delete: {
      body: {
        type: 'object',
        properties: {
          category_id: { type: 'string' }
        },
        required: ['category_id']
      }
    }
  },
  '/api/proj/param-category/options': {
    get: {
      query: {}
    }
  },
  '/api/proj/param-category/update-params': {
    post: {
      body: {
        type: 'object',
        properties: {
          category_id: { type: 'string' },
          params: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                param_id: { type: 'string' },
                param_name: { type: 'string' },
                param_type: { type: 'string' },
                param_values: { type: ['string', 'null'] },
                param_category: { type: 'string' },
                sort_order: { type: 'number' },
                status: { type: 'number' }
              }
            }
          },
          deleted_param_ids: {
            type: 'array',
            items: { type: 'string' }
          }
        },
        required: ['category_id', 'params']
      }
    }
  }
};

