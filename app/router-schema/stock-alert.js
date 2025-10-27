module.exports = {
  '/api/proj/stock-alert/list': {
    get: {
      query: {
        type: 'object',
        properties: {
          page: { type: 'string' },
          pageSize: { type: 'string' },
          product_name: { type: 'string' },
          category_id: { type: 'string' },
          alert_level: { type: 'string' },
          is_handled: { type: 'string' },
        },
      }
    }
  },
  '/api/proj/stock-alert/log/list': {
    get: {
      query: {
        type: 'object',
        properties: {
          page: { type: 'string' },
          pageSize: { type: 'string' },
          product_name: { type: 'string' },
          alert_level: { type: 'string' },
          is_handled: { type: 'string' },
          start_time: { type: 'string' },
          end_time: { type: 'string' },
        },
      }
    }
  },
  '/api/proj/stock-alert/handle': {
    post: {
      body: {
        type: 'object',
        properties: {
          log_id: { type: 'string' },
          handle_note: { type: 'string' },
        },
        required: ['log_id'],
      }
    }
  },
  '/api/proj/stock-alert/batch-handle': {
    post: {
      body: {
        type: 'object',
        properties: {
          log_ids: { type: 'array' },
          handle_note: { type: 'string' },
        },
        required: ['log_ids'],
      }
    }
  },
  '/api/proj/stock-alert/statistics': {
    get: {}
  },
  '/api/proj/stock-alert/restock': {
    post: {
      body: {
        type: 'object',
        properties: {
          sku_id: { type: 'string' },
          restock_quantity: { type: 'number' },
          note: { type: 'string' },
        },
        required: ['sku_id', 'restock_quantity'],
      }
    }
  },
};

