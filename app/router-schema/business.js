
module.exports = {
  '/api/proj/product/list': {
    get: {
      query: {
        type: 'object',
        properties: {
          page: {
            type: 'string',
          },
          pageSize: {
            type: 'string',
          },
        },
      }
    }
  },
  '/api/proj/product': {
    put: {
      body: {
        type: 'object',
        properties: {
          product_id: {
            type: 'string',
          },
          product_name:{
            type: 'string',
          },
          product_price: {
            type: 'number',
          },
          inventory: {
            type: 'number',
          },
        },
        required: ['product_id', 'product_name'],
      }
    },
    post: {
      body: {
        type: 'object',
        properties: {
          product_name:{
            type: 'string',
          },
          product_price: {
            type: 'number',
          },
          inventory: {
            type: 'number',
          },
        },
        required: ['product_name'],
      }
    },
    delete: {
      body: {
        type: 'object',
        properties: {
          product_id: {
            type: 'string',
          },
        },
        required: ['product_id'],
      }
    },
    get: { 
      query: {
        type: 'object',
        properties: {
          product_id: {
            type: 'string',
          },
        },
        required: ['product_id'],
      }
    }
  },
  '/api/proj/product_enum/list': {
    get: {}
  }
}