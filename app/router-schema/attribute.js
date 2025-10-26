module.exports = {
  '/api/proj/attribute/list': {
    get: {
      query: {
        type: 'object',
        properties: {
          page: { type: 'string' },
          pageSize: { type: 'string' },
          attr_name: { type: 'string' },
          category_id: { type: 'string' },
        },
      }
    }
  },
  '/api/proj/attribute': {
    get: {
      query: {
        type: 'object',
        properties: {
          attr_id: { type: 'string' },
        },
        required: ['attr_id'],
      }
    },
    post: {
      body: {
        type: 'object',
        properties: {
          attr_name: { type: 'string' },
          category_id: { type: 'string' },
          predefined_values: { type: 'array' },
          allow_custom: { type: 'number' },
          is_required: { type: 'number' },
          sort_order: { type: 'number' },
        },
        required: ['attr_name', 'category_id'],
      }
    },
    put: {
      body: {
        type: 'object',
        properties: {
          attr_id: { type: 'string' },
          attr_name: { type: 'string' },
          predefined_values: { type: 'array' },
          allow_custom: { type: 'number' },
          is_required: { type: 'number' },
          sort_order: { type: 'number' },
        },
        required: ['attr_id'],
      }
    },
    delete: {
      body: {
        type: 'object',
        properties: {
          attr_id: { type: 'string' },
        },
        required: ['attr_id'],
      }
    }
  },
};

