module.exports = {
  // 获取审核列表
  '/api/proj/product-audit/list': {
    method: 'get',
    schema: {
      type: 'object',
      properties: {
        product_name: { type: 'string' },
        audit_status: { type: ['number', 'string'] },
        create_time_start: { type: 'string' },
        create_time_end: { type: 'string' },
        sort_field: { type: 'string' },
        sort_order: { type: 'string', enum: ['asc', 'desc'] },
        page: { type: ['number', 'string'] },
        pageSize: { type: ['number', 'string'] }
      }
    }
  },

  // 获取审核详情
  '/api/proj/product-audit': {
    method: 'get',
    schema: {
      type: 'object',
      properties: {
        product_id: { type: 'string' }
      },
      required: ['product_id']
    }
  },

  // 执行审核
  '/api/proj/product-audit/audit': {
    method: 'post',
    schema: {
      type: 'object',
      properties: {
        product_id: { type: 'string' },
        audit_status: { type: 'number', enum: [1, 2] },
        audit_reason: { type: 'string' }
      },
      required: ['product_id', 'audit_status']
    }
  },

  // 获取审核历史
  '/api/proj/product-audit/history': {
    method: 'get',
    schema: {
      type: 'object',
      properties: {
        product_id: { type: 'string' }
      },
      required: ['product_id']
    }
  }
};

