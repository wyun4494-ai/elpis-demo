/**
 * 人气推荐参数验证规则
 */
module.exports = {
  '/api/proj/popular-product-recommend': {
    get: {
      query: {
        type: 'object',
        properties: {
          page: { type: 'string' },
          pageSize: { type: 'string' },
          product_name: { type: 'string' },
          recommend_status: { type: 'string' },
          recommend_id: { type: 'string' },
          sort_field: { type: 'string' },
          sort_order: { type: 'string' }
        }
      }
    },
    post: {
      body: {
        type: 'object',
        properties: {
          product_id: { type: 'string' },
          recommend_title: { type: ['string', 'null'] },
          recommend_desc: { type: ['string', 'null'] },
          recommend_image: { type: ['string', 'null'] },
          sort_order: { type: ['number', 'null'] },
          is_enabled: { type: ['number', 'null'] },
          start_time: { type: ['string', 'null'] },
          end_time: { type: ['string', 'null'] }
        },
        required: ['product_id']
      }
    },
    put: {
      body: {
        type: 'object',
        properties: {
          recommend_id: { type: 'string' },
          recommend_title: { type: ['string', 'null'] },
          recommend_desc: { type: ['string', 'null'] },
          recommend_image: { type: ['string', 'null'] },
          sort_order: { type: ['number', 'null'] },
          is_enabled: { type: ['number', 'null'] },
          start_time: { type: ['string', 'null'] },
          end_time: { type: ['string', 'null'] }
        },
        required: ['recommend_id']
      }
    }
  },
  '/api/proj/popular-product-recommend/:id': {
    get: {
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        },
        required: ['id']
      }
    },
    put: {
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        },
        required: ['id']
      },
      body: {
        type: 'object',
        properties: {
          recommend_title: { type: ['string', 'null'] },
          recommend_desc: { type: ['string', 'null'] },
          recommend_image: { type: ['string', 'null'] },
          sort_order: { type: ['number', 'null'] },
          is_enabled: { type: ['number', 'null'] },
          start_time: { type: ['string', 'null'] },
          end_time: { type: ['string', 'null'] }
        }
      }
    },
    delete: {
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        },
        required: ['id']
      }
    }
  },
  '/api/proj/popular-product-recommend/toggle': {
    put: {
      body: {
        type: 'object',
        properties: {
          recommend_id: { type: 'string' },
          is_enabled: { type: 'number' }
        },
        required: ['recommend_id', 'is_enabled']
      }
    }
  },
  '/api/proj/popular-product-recommend/batch-enable': {
    post: {
      body: {
        type: 'object',
        properties: {
          recommend_ids: {
            type: 'array',
            items: { type: 'string' }
          }
        },
        required: ['recommend_ids']
      }
    }
  },
  '/api/proj/popular-product-recommend/batch/enable': {
    post: {
      body: {
        type: 'object',
        properties: {
          recommend_ids: {
            type: 'array',
            items: { type: 'string' }
          }
        },
        required: ['recommend_ids']
      }
    }
  },
  '/api/proj/popular-product-recommend/batch-disable': {
    post: {
      body: {
        type: 'object',
        properties: {
          recommend_ids: {
            type: 'array',
            items: { type: 'string' }
          }
        },
        required: ['recommend_ids']
      }
    }
  },
  '/api/proj/popular-product-recommend/batch/disable': {
    post: {
      body: {
        type: 'object',
        properties: {
          recommend_ids: {
            type: 'array',
            items: { type: 'string' }
          }
        },
        required: ['recommend_ids']
      }
    }
  },
  '/api/proj/popular-product-recommend/batch-delete': {
    post: {
      body: {
        type: 'object',
        properties: {
          recommend_ids: {
            type: 'array',
            items: { type: 'string' }
          }
        },
        required: ['recommend_ids']
      }
    }
  },
  '/api/proj/popular-product-recommend/batch/delete': {
    post: {
      body: {
        type: 'object',
        properties: {
          recommend_ids: {
            type: 'array',
            items: { type: 'string' }
          }
        },
        required: ['recommend_ids']
      }
    }
  },
  '/api/proj/popular-product-recommend/available-products': {
    get: {
      query: {
        type: 'object',
        properties: {}
      }
    }
  },
  '/api/proj/popular-product-recommend/list': {
    get: {
      query: {
        type: 'object',
        properties: {
          page: { type: 'string' },
          pageSize: { type: 'string' },
          product_name: { type: 'string' },
          recommend_status: { type: 'string' },
          sort_field: { type: 'string' },
          sort_order: { type: 'string' }
        }
      }
    }
  }
}
