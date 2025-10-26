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
          product_name: {
            type: 'string',
          },
          category_id: {
            type: 'string',
          },
          brand_id: {
            type: 'string',
          },
          price: {
            type: 'string',
          },
          item_number: {
            type: 'string',
          },
          inventory: {
            type: 'string',
          },
          shelf_status: {
            type: 'string',
          },
          create_time_start: {
            type: 'string',
          },
          create_time_end: {
            type: 'string',
          },
        },
      }
    }
  },
  '/api/proj/product': {
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
    },
    post: {
      body: {
        type: 'object',
        properties: {
          product_name: {
            type: 'string',
          },
          category_id: {
            type: 'string',
          },
          brand_id: {
            type: 'string',
          },
          price: {
            type: 'number',
          },
          item_number: {
            type: 'string',
          },
          inventory: {
            type: 'number',
          },
          shelf_status: {
            type: 'number',
          },
          skus: {
            type: 'array',
          },
          params: {
            type: 'object',
          },
        },
        required: ['product_name', 'category_id'],
      }
    },
    put: {
      body: {
        type: 'object',
        properties: {
          product_id: {
            type: 'string',
          },
          product_name: {
            type: 'string',
          },
          category_id: {
            type: 'string',
          },
          brand_id: {
            type: 'string',
          },
          price: {
            type: 'number',
          },
          item_number: {
            type: 'string',
          },
          inventory: {
            type: 'number',
          },
          shelf_status: {
            type: 'number',
          },
        },
        required: ['product_id'],
      }
    },
    delete: {
      body: {
        type: 'object',
        properties: {
          product_id: {
            type: 'string',
          },
          delete_reason: {
            type: 'string',
          },
        },
        required: ['product_id', 'delete_reason'],
      }
    }
  },
  // 枚举值 API 路由验证
  '/api/proj/product_enum/list': {
    get: {}
  },
          '/api/proj/price_enum/list': {
            get: {}
          },
          '/api/proj/inventory_enum/list': {
            get: {}
          },
          // 远程搜索路由验证
          '/api/proj/product/search': {
            get: {
              query: {
                type: 'object',
                properties: {
                  keyword: {
                    type: 'string',
                  },
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
          '/api/proj/product/recycle': {
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
          '/api/proj/product/recycle/list': {
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
                  product_name: { type: 'string' },
                  delete_time_start: { type: 'string' },
                  delete_time_end: { type: 'string' }
                },
              }
            }
          },
          '/api/proj/product/recycle/restore': {
            post: {
              body: {
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
          '/api/proj/product/recycle/permanent': {
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
            }
          }
};
