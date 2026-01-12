/**
 * 秒杀商品 API 参数验证规则
 */
module.exports = {
  '/api/proj/flash-sale-product/list': {
    get: {
      query: {
        type: 'object',
        properties: {
          flash_sale_id: { type: 'string' },
          slot_id: { type: 'string' },
          product_name: { type: 'string' }
        }
      }
    }
  },
  '/api/proj/flash-sale-product/slot-count': {
    get: {
      query: {
        type: 'object',
        properties: {
          flash_sale_id: { type: 'string' }
        },
        required: ['flash_sale_id']
      }
    }
  },
  '/api/proj/flash-sale-product/:flash_sale_product_id': {
    get: {
      params: {
        type: 'object',
        properties: {
          flash_sale_product_id: { type: 'string' }
        },
        required: ['flash_sale_product_id']
      }
    },
    put: {
      params: {
        type: 'object',
        properties: {
          flash_sale_product_id: { type: 'string' }
        },
        required: ['flash_sale_product_id']
      },
      body: {
        type: 'object',
        properties: {
          flash_sale_price: { type: 'number', minimum: 0 },
          flash_sale_stock: { type: 'number', minimum: 0 },
          limit_per_user: { type: 'number', minimum: 0 },
          sort_order: { type: 'number' },
          is_enabled: { type: 'number', minimum: 0, maximum: 1 }
        }
      }
    },
    delete: {
      params: {
        type: 'object',
        properties: {
          flash_sale_product_id: { type: 'string' }
        },
        required: ['flash_sale_product_id']
      }
    }
  },
  '/api/proj/flash-sale-product': {
    post: {
      body: {
        type: 'object',
        properties: {
          flash_sale_id: { type: 'string' },
          slot_id: { type: 'string' },
          product_id: { type: 'string' },
          sku_id: { type: ['string', 'null'] },
          original_price: { type: 'number', minimum: 0 },
          flash_sale_price: { type: 'number', minimum: 0 },
          flash_sale_stock: { type: 'number', minimum: 1 },
          limit_per_user: { type: 'number', minimum: 0 },
          sort_order: { type: 'number' }
        },
        required: ['flash_sale_id', 'slot_id', 'product_id', 'original_price', 'flash_sale_price', 'flash_sale_stock']
      }
    }
  },
  '/api/proj/flash-sale-product/batch-delete': {
    post: {
      body: {
        type: 'object',
        properties: {
          flash_sale_product_ids: {
            type: 'array',
            items: { type: 'string' },
            minItems: 1
          }
        },
        required: ['flash_sale_product_ids']
      }
    }
  }
}
