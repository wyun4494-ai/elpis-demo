module.exports = {
  '/api/proj/order/list': {
    get: {
      query: {
        type: 'object',
        properties: {
          page: { type: 'string' },
          pageSize: { type: 'string' },
          order_no: { type: 'string' },
          customer_name: { type: 'string' },
          order_status: { type: 'string' },
          pay_status: { type: 'string' },
          order_time_start: { type: 'string' },
          order_time_end: { type: 'string' },
          sort_field: { type: 'string' },
          sort_order: { type: 'string' }
        }
      }
    }
  },
  '/api/proj/order/:order_id': {
    get: {
      params: {
        type: 'object',
        properties: {
          order_id: { type: 'string' }
        },
        required: ['order_id']
      }
    },
    put: {
      params: {
        type: 'object',
        properties: {
          order_id: { type: 'string' }
        },
        required: ['order_id']
      },
      body: {
        type: 'object',
        properties: {
          seller_remark: { type: 'string' },
          receiver_name: { type: 'string' },
          receiver_phone: { type: 'string' },
          receiver_province: { type: 'string' },
          receiver_city: { type: 'string' },
          receiver_district: { type: 'string' },
          receiver_address: { type: 'string' },
          receiver_postcode: { type: 'string' }
        }
      }
    },
    delete: {
      params: {
        type: 'object',
        properties: {
          order_id: { type: 'string' }
        },
        required: ['order_id']
      }
    }
  },
  '/api/proj/order': {
    get: {
      query: {
        type: 'object',
        properties: {
          order_id: { type: 'string' }
        },
        required: ['order_id']
      }
    },
    put: {
      query: {
        type: 'object',
        properties: {
          order_id: { type: 'string' }
        },
        required: ['order_id']
      },
      body: {
        type: 'object',
        properties: {
          seller_remark: { type: 'string' },
          receiver_name: { type: 'string' },
          receiver_phone: { type: 'string' },
          receiver_province: { type: 'string' },
          receiver_city: { type: 'string' },
          receiver_district: { type: 'string' },
          receiver_address: { type: 'string' },
          receiver_postcode: { type: 'string' }
        }
      }
    },
    delete: {
      query: {
        type: 'object',
        properties: {
          order_id: { type: 'string' }
        },
        required: ['order_id']
      }
    }
  },
  '/api/proj/order/cancel': {
    post: {
      body: {
        type: 'object',
        properties: {
          order_id: { type: 'string' },
          cancel_reason: { type: 'string' }
        },
        required: ['order_id', 'cancel_reason']
      }
    }
  },
  '/api/proj/order/deliver': {
    post: {
      body: {
        type: 'object',
        properties: {
          order_id: { type: 'string' },
          logistics_company: { type: 'string' },
          logistics_no: { type: 'string' },
          sender_name: { type: 'string' },
          sender_phone: { type: 'string' },
          sender_address: { type: 'string' }
        },
        required: ['order_id', 'logistics_company', 'logistics_no']
      }
    }
  },
  '/api/proj/order/confirm-receive': {
    post: {
      body: {
        type: 'object',
        properties: {
          order_id: { type: 'string' }
        },
        required: ['order_id']
      }
    }
  },
  '/api/proj/order/batch-cancel': {
    post: {
      body: {
        type: 'object',
        properties: {
          order_ids: { 
            type: 'array',
            items: { type: 'string' }
          },
          cancel_reason: { type: 'string' }
        },
        required: ['order_ids', 'cancel_reason']
      }
    }
  },
  '/api/proj/order/batch-delete': {
    post: {
      body: {
        type: 'object',
        properties: {
          order_ids: { 
            type: 'array',
            items: { type: 'string' }
          }
        },
        required: ['order_ids']
      }
    }
  },
  '/api/proj/order/export': {
    get: {
      query: {
        type: 'object',
        properties: {
          order_no: { type: 'string' },
          customer_name: { type: 'string' },
          order_status: { type: 'string' },
          pay_status: { type: 'string' },
          order_time_start: { type: 'string' },
          order_time_end: { type: 'string' }
        }
      }
    }
  }
};
