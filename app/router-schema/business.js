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
          sort_field: {
            type: 'string',
          },
          sort_order: {
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
          product_images: {
            type: 'array',
          },
          product_detail: {
            type: 'string',
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
          product_images: {
            type: 'array',
          },
          product_detail: {
            type: 'string',
          },
          skus: {
            type: 'array',
          },
          params: {
            type: 'object',
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
          },
          // 批量操作路由验证
          '/api/proj/product/batch/shelf-on': {
            post: {
              body: {
                type: 'object',
                properties: {
                  product_ids: {
                    type: 'array',
                    items: {
                      type: 'string'
                    }
                  }
                },
                required: ['product_ids']
              }
            }
          },
          '/api/proj/product/batch/shelf-off': {
            post: {
              body: {
                type: 'object',
                properties: {
                  product_ids: {
                    type: 'array',
                    items: {
                      type: 'string'
                    }
                  }
                },
                required: ['product_ids']
              }
            }
          },
          '/api/proj/product/batch/delete': {
            post: {
              body: {
                type: 'object',
                properties: {
                  product_ids: {
                    type: 'array',
                    items: {
                      type: 'string'
                    }
                  },
                  delete_reason: {
                    type: 'string'
                  }
                },
                required: ['product_ids']
              }
            }
          },
          '/api/proj/product/batch-restore': {
            post: {
              body: {
                type: 'object',
                properties: {
                  product_ids: {
                    type: 'array',
                    items: {
                      type: 'string'
                    }
                  },
                  note: {
                    type: 'string'
                  }
                },
                required: ['product_ids']
              }
            }
          },
          '/api/proj/product/batch-permanent-delete': {
            post: {
              body: {
                type: 'object',
                properties: {
                  product_ids: {
                    type: 'array',
                    items: {
                      type: 'string'
                    }
                  },
                  note: {
                    type: 'string'
                  }
                },
                required: ['product_ids']
              }
            }
          }

  // 注意：带路径参数的 API（如 /api/proj/product/:product_id/skus）
  // 不能在 router-schema 中定义，因为中间件使用 ctx.path（实际路径）进行匹配
  // 实际路径（如 /api/proj/product/PROD000014/skus）无法匹配路由模式
  // 这些 API 会跳过参数验证
};
