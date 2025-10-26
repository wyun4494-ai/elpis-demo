module.exports = {
  '/api/proj/type/list': {
    get: {
      query: {
        type: 'object',
        properties: {
          page: { type: 'string' },
          pageSize: { type: 'string' },
          type_name: { type: 'string' },
        },
      }
    }
  },
  '/api/proj/type': {
    get: { 
      query: {
        type: 'object',
        properties: {
          category_id: { type: 'string' },
        },
        required: ['category_id'],
      }
    },
    delete: {
      body: {
        type: 'object',
        properties: {
          category_id: { type: 'string' },
        },
        required: ['category_id'],
      }
    }
  },
  '/api/proj/type/by-category': {
    get: {
      query: {
        type: 'object',
        properties: {
          category_id: { type: 'string' },
        },
        required: ['category_id'],
      }
    }
  },
  '/api/proj/type/attributes': {
    post: {
      body: {
        type: 'object',
        properties: {
          category_id: { type: 'string' },
          attributes: { type: 'array' },
        },
        required: ['category_id', 'attributes'],
      }
    }
  },
  '/api/proj/type/params': {
    post: {
      body: {
        type: 'object',
        properties: {
          category_id: { type: 'string' },
          params: { type: 'array' },
        },
        required: ['category_id', 'params'],
      }
    }
  },
  '/api/proj/param-library/list': {
    get: {
      query: {
        type: 'object',
        properties: {
          page: { type: 'string' },
          pageSize: { type: 'string' },
          param_name: { type: 'string' },
          category: { type: 'string' },
        },
      }
    }
  },
};

