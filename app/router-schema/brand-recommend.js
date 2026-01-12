/**
 * 品牌推荐参数验证规则
 */
module.exports = {
  '/api/proj/brand-recommend': {
    get: {
      query: {
        type: 'object',
        properties: {
          page: { type: 'string' },
          pageSize: { type: 'string' },
          brand_name: { type: 'string' },
          is_enabled: { type: 'string' },
          recommend_status: { type: 'string' },
          sort_field: { type: 'string' },
          sort_order: { type: 'string' }
        }
      }
    },
    post: {
      body: {
        type: 'object',
        properties: {
          brand_id: { type: 'string' },
          recommend_title: { type: 'string' },
          recommend_desc: { type: 'string' },
          banner_image: { type: 'string' },
          link_url: { type: 'string' },
          sort_order: { type: 'number' },
          is_enabled: { type: 'number' },
          start_time: { type: 'string' },
          end_time: { type: 'string' }
        },
        required: ['brand_id']
      }
    }
  },
  '/api/proj/brand-recommend/:id': {
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
          recommend_title: { type: 'string' },
          recommend_desc: { type: 'string' },
          banner_image: { type: 'string' },
          link_url: { type: 'string' },
          sort_order: { type: 'number' },
          is_enabled: { type: 'number' },
          start_time: { type: 'string' },
          end_time: { type: 'string' }
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
  '/api/proj/brand-recommend/toggle': {
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
  '/api/proj/brand-recommend/sort': {
    put: {
      body: {
        type: 'object',
        properties: {
          recommend_id: { type: 'string' },
          sort_order: { type: 'number' }
        },
        required: ['recommend_id', 'sort_order']
      }
    }
  },
  '/api/proj/brand-recommend/batch-enable': {
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
  '/api/proj/brand-recommend/batch/enable': {
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
  '/api/proj/brand-recommend/batch-disable': {
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
  '/api/proj/brand-recommend/batch/disable': {
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
  '/api/proj/brand-recommend/batch-delete': {
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
  '/api/proj/brand-recommend/batch/delete': {
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
  '/api/proj/brand-recommend/available-brands': {
    get: {
      query: {
        type: 'object',
        properties: {}
      }
    }
  }
}
