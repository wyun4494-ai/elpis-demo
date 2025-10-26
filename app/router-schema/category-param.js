module.exports = {
  '/api/proj/category-param/list': {
    get: {
      query: {
        type: 'object',
        properties: {
          page: { type: 'string' },
          pageSize: { type: 'string' },
          param_name: { type: 'string' },
          category_id: { type: 'string' },
        },
      }
    }
  },
  '/api/proj/category-param': {
    get: {
      query: {
        type: 'object',
        properties: {
          id: { type: 'string' },
        },
        required: ['id'],
      }
    },
    put: {
      body: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          is_required: { type: 'number' },
          allow_custom: { type: 'number' },
          sort_order: { type: 'number' },
        },
        required: ['id'],
      }
    },
    delete: {
      body: {
        type: 'object',
        properties: {
          id: { type: 'string' },
        },
        required: ['id'],
      }
    }
  },
  '/api/proj/category-param/add-from-library': {
    post: {
      body: {
        type: 'object',
        properties: {
          category_id: { type: 'string' },
          param_ids: { type: 'array' },
        },
        required: ['category_id', 'param_ids'],
      }
    }
  },
  '/api/proj/category-param/create-new': {
    post: {
      body: {
        type: 'object',
        properties: {
          category_id: { type: 'string' },
          param_name: { type: 'string' },
          param_type: { type: 'string' },
          param_values: { type: 'array' },
          param_category: { type: 'string' },
          is_required: { type: 'number' },
          allow_custom: { type: 'number' },
        },
        required: ['category_id', 'param_name'],
      }
    }
  }
};

