/**
 * 专题推荐参数验证规则
 */
module.exports = {
  '/api/proj/topic-recommend': {
    get: {
      query: {
        type: 'object',
        properties: {
          page: { type: 'string' },
          pageSize: { type: 'string' },
          topic_name: { type: 'string' },
          topic_type: { type: 'string' },
          is_enabled: { type: 'string' },
          topic_status: { type: 'string' },
          topic_id: { type: 'string' },
          sort_field: { type: 'string' },
          sort_order: { type: 'string' }
        }
      }
    },
    post: {
      body: {
        type: 'object',
        properties: {
          topic_name: { type: 'string' },
          topic_desc: { type: ['string', 'null'] },
          cover_image: { type: 'string' },
          banner_image: { type: ['string', 'null'] },
          topic_type: { type: 'number' },
          related_products: { type: ['array', 'null'] },
          related_brands: { type: ['array', 'null'] },
          related_categories: { type: ['array', 'null'] },
          link_url: { type: ['string', 'null'] },
          sort_order: { type: ['number', 'null'] },
          is_enabled: { type: ['number', 'null'] },
          start_time: { type: ['string', 'null'] },
          end_time: { type: ['string', 'null'] }
        },
        required: ['topic_name', 'cover_image', 'topic_type']
      }
    },
    put: {
      body: {
        type: 'object',
        properties: {
          topic_id: { type: 'string' },
          topic_name: { type: ['string', 'null'] },
          topic_desc: { type: ['string', 'null'] },
          cover_image: { type: ['string', 'null'] },
          banner_image: { type: ['string', 'null'] },
          topic_type: { type: ['number', 'null'] },
          related_products: { type: ['array', 'null'] },
          related_brands: { type: ['array', 'null'] },
          related_categories: { type: ['array', 'null'] },
          link_url: { type: ['string', 'null'] },
          sort_order: { type: ['number', 'null'] },
          is_enabled: { type: ['number', 'null'] },
          start_time: { type: ['string', 'null'] },
          end_time: { type: ['string', 'null'] }
        },
        required: ['topic_id']
      }
    }
  },
  '/api/proj/topic-recommend/:id': {
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
          topic_name: { type: ['string', 'null'] },
          topic_desc: { type: ['string', 'null'] },
          cover_image: { type: ['string', 'null'] },
          banner_image: { type: ['string', 'null'] },
          topic_type: { type: ['number', 'null'] },
          related_products: { type: ['array', 'null'] },
          related_brands: { type: ['array', 'null'] },
          related_categories: { type: ['array', 'null'] },
          link_url: { type: ['string', 'null'] },
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
  '/api/proj/topic-recommend/toggle': {
    put: {
      body: {
        type: 'object',
        properties: {
          topic_id: { type: 'string' },
          is_enabled: { type: 'number' }
        },
        required: ['topic_id', 'is_enabled']
      }
    }
  },
  '/api/proj/topic-recommend/batch-enable': {
    post: {
      body: {
        type: 'object',
        properties: {
          topic_ids: {
            type: 'array',
            items: { type: 'string' }
          }
        },
        required: ['topic_ids']
      }
    }
  },
  '/api/proj/topic-recommend/batch/enable': {
    post: {
      body: {
        type: 'object',
        properties: {
          topic_ids: {
            type: 'array',
            items: { type: 'string' }
          }
        },
        required: ['topic_ids']
      }
    }
  },
  '/api/proj/topic-recommend/batch-disable': {
    post: {
      body: {
        type: 'object',
        properties: {
          topic_ids: {
            type: 'array',
            items: { type: 'string' }
          }
        },
        required: ['topic_ids']
      }
    }
  },
  '/api/proj/topic-recommend/batch/disable': {
    post: {
      body: {
        type: 'object',
        properties: {
          topic_ids: {
            type: 'array',
            items: { type: 'string' }
          }
        },
        required: ['topic_ids']
      }
    }
  },
  '/api/proj/topic-recommend/batch-delete': {
    post: {
      body: {
        type: 'object',
        properties: {
          topic_ids: {
            type: 'array',
            items: { type: 'string' }
          }
        },
        required: ['topic_ids']
      }
    }
  },
  '/api/proj/topic-recommend/batch/delete': {
    post: {
      body: {
        type: 'object',
        properties: {
          topic_ids: {
            type: 'array',
            items: { type: 'string' }
          }
        },
        required: ['topic_ids']
      }
    }
  },
  '/api/proj/topic-recommend/list': {
    get: {
      query: {
        type: 'object',
        properties: {
          page: { type: 'string' },
          pageSize: { type: 'string' },
          topic_name: { type: 'string' },
          topic_type: { type: 'string' },
          is_enabled: { type: 'string' },
          topic_status: { type: 'string' },
          sort_field: { type: 'string' },
          sort_order: { type: 'string' }
        }
      }
    }
  }
}
