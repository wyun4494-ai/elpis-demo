module.exports = {
  '/api/proj/category/list': {
    get: {
      query: {
        type: 'object',
        properties: {
          page: { type: 'string' },
          pageSize: { type: 'string' },
          category_name: { type: 'string' },
          parent_id: { type: 'string' },
          level: { type: 'string' },
          status: { type: 'string' }
        }
      }
    }
  },
  '/api/proj/category': {
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
          parent_id: { type: 'string' },
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
  '/api/proj/category/children': {
    get: {
      query: {
        type: 'object',
        properties: {
          parent_id: { type: 'string' },
          level: { type: 'string' }
        }
      }
    }
  },
  '/api/proj/category/path': {
    get: {
      query: {
        type: 'object',
        properties: {
          category_id: { type: 'string' }
        },
        required: ['category_id']
      }
    }
  }
};

