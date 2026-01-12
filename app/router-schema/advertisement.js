/**
 * 广告推荐参数验证规则
 */
module.exports = {
  '/api/proj/advertisement': {
    get: {
      query: {
        type: 'object',
        properties: {
          page: { type: 'string' },
          pageSize: { type: 'string' },
          ad_name: { type: 'string' },
          ad_position: { type: 'string' },
          ad_type: { type: 'string' },
          is_enabled: { type: 'string' },
          ad_status: { type: 'string' },
          ad_id: { type: 'string' },
          sort_field: { type: 'string' },
          sort_order: { type: 'string' }
        }
      }
    },
    post: {
      body: {
        type: 'object',
        properties: {
          ad_name: { type: 'string' },
          ad_position: { type: 'string' },
          ad_type: { type: 'number' },
          ad_image: { type: ['string', 'null'] },
          ad_video: { type: ['string', 'null'] },
          ad_html: { type: ['string', 'null'] },
          link_url: { type: ['string', 'null'] },
          link_type: { type: ['number', 'null'] },
          link_target: { type: ['string', 'null'] },
          sort_order: { type: ['number', 'null'] },
          is_enabled: { type: ['number', 'null'] },
          start_time: { type: ['string', 'null'] },
          end_time: { type: ['string', 'null'] }
        },
        required: ['ad_name', 'ad_position', 'ad_type']
      }
    },
    put: {
      body: {
        type: 'object',
        properties: {
          ad_id: { type: 'string' },
          ad_name: { type: ['string', 'null'] },
          ad_position: { type: ['string', 'null'] },
          ad_type: { type: ['number', 'null'] },
          ad_image: { type: ['string', 'null'] },
          ad_video: { type: ['string', 'null'] },
          ad_html: { type: ['string', 'null'] },
          link_url: { type: ['string', 'null'] },
          link_type: { type: ['number', 'null'] },
          link_target: { type: ['string', 'null'] },
          sort_order: { type: ['number', 'null'] },
          is_enabled: { type: ['number', 'null'] },
          start_time: { type: ['string', 'null'] },
          end_time: { type: ['string', 'null'] }
        },
        required: ['ad_id']
      }
    }
  },
  '/api/proj/advertisement/:id': {
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
          ad_name: { type: ['string', 'null'] },
          ad_position: { type: ['string', 'null'] },
          ad_type: { type: ['number', 'null'] },
          ad_image: { type: ['string', 'null'] },
          ad_video: { type: ['string', 'null'] },
          ad_html: { type: ['string', 'null'] },
          link_url: { type: ['string', 'null'] },
          link_type: { type: ['number', 'null'] },
          link_target: { type: ['string', 'null'] },
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
  '/api/proj/advertisement/toggle': {
    put: {
      body: {
        type: 'object',
        properties: {
          ad_id: { type: 'string' },
          is_enabled: { type: 'number' }
        },
        required: ['ad_id', 'is_enabled']
      }
    }
  },
  '/api/proj/advertisement/batch-enable': {
    post: {
      body: {
        type: 'object',
        properties: {
          ad_ids: {
            type: 'array',
            items: { type: 'string' }
          }
        },
        required: ['ad_ids']
      }
    }
  },
  '/api/proj/advertisement/batch/enable': {
    post: {
      body: {
        type: 'object',
        properties: {
          ad_ids: {
            type: 'array',
            items: { type: 'string' }
          }
        },
        required: ['ad_ids']
      }
    }
  },
  '/api/proj/advertisement/batch-disable': {
    post: {
      body: {
        type: 'object',
        properties: {
          ad_ids: {
            type: 'array',
            items: { type: 'string' }
          }
        },
        required: ['ad_ids']
      }
    }
  },
  '/api/proj/advertisement/batch/disable': {
    post: {
      body: {
        type: 'object',
        properties: {
          ad_ids: {
            type: 'array',
            items: { type: 'string' }
          }
        },
        required: ['ad_ids']
      }
    }
  },
  '/api/proj/advertisement/batch-delete': {
    post: {
      body: {
        type: 'object',
        properties: {
          ad_ids: {
            type: 'array',
            items: { type: 'string' }
          }
        },
        required: ['ad_ids']
      }
    }
  },
  '/api/proj/advertisement/batch/delete': {
    post: {
      body: {
        type: 'object',
        properties: {
          ad_ids: {
            type: 'array',
            items: { type: 'string' }
          }
        },
        required: ['ad_ids']
      }
    }
  },
  '/api/proj/advertisement/list': {
    get: {
      query: {
        type: 'object',
        properties: {
          page: { type: 'string' },
          pageSize: { type: 'string' },
          ad_name: { type: 'string' },
          ad_position: { type: 'string' },
          ad_type: { type: 'string' },
          is_enabled: { type: 'string' },
          ad_status: { type: 'string' },
          sort_field: { type: 'string' },
          sort_order: { type: 'string' }
        }
      }
    }
  }
}
