/**
 * 客户管理路由参数验证规则
 * 使用 ajv schema 定义 API 参数验证规则
 */
module.exports = {
  // 获取客户列表（schema-table 会自动添加 /list 后缀）
  '/api/proj/customer/list': {
    get: {
      query: {
        type: 'object',
        properties: {
          page: { type: 'string' },
          pageSize: { type: 'string' },
          username: { type: 'string' },
          nickname: { type: 'string' },
          email: { type: 'string' },
          phone: { type: 'string' },
          sex: { type: 'string' },
          create_time_start: { type: 'string' },
          create_time_end: { type: 'string' }
        },
        required: ['page', 'pageSize']
      }
    }
  },

  // 批量删除客户
  '/api/proj/customer/batch-delete': {
    post: {
      body: {
        type: 'object',
        properties: {
          customer_ids: {
            type: 'array',
            items: { type: 'string' }
          }
        },
        required: ['customer_ids']
      }
    }
  },

  // 获取客户列表或客户详情、创建客户
  '/api/proj/customer': {
    get: {
      query: {
        type: 'object',
        properties: {
          customer_id: { type: 'string' },
          page: { type: 'string' },
          pageSize: { type: 'string' },
          username: { type: 'string' },
          nickname: { type: 'string' },
          email: { type: 'string' },
          phone: { type: 'string' },
          sex: { type: 'string' },
          create_time_start: { type: 'string' },
          create_time_end: { type: 'string' }
        }
      }
    },
    post: {
      body: {
        type: 'object',
        properties: {
          username: { type: 'string' },
          nickname: { type: 'string' },
          sex: { type: 'number' },
          email: { type: 'string' },
          phone: { type: 'string' },
          avatar: { type: 'string' },
          address: { type: 'string' },
          new_password: { type: 'string', minLength: 6 },
          confirm_password: { type: 'string' }
        },
        required: ['username']
      }
    },
    put: {
      body: {
        type: 'object',
        properties: {
          customer_id: { type: 'string' },
          nickname: { type: 'string' },
          sex: { type: 'number' },
          email: { type: 'string' },
          phone: { type: 'string' },
          avatar: { type: 'string' },
          address: { type: 'string' },
          new_password: { type: 'string', minLength: 6 },
          confirm_password: { type: 'string' }
        },
        required: ['customer_id']
      }
    }
  },

  // 获取客户详情、更新客户、删除客户
  '/api/proj/customer/:customer_id': {
    get: {
      params: {
        type: 'object',
        properties: {
          customer_id: { type: 'string' }
        },
        required: ['customer_id']
      }
    },
    put: {
      params: {
        type: 'object',
        properties: {
          customer_id: { type: 'string' }
        },
        required: ['customer_id']
      },
      body: {
        type: 'object',
        properties: {
          nickname: { type: 'string' },
          sex: { type: 'number' },
          email: { type: 'string' },
          phone: { type: 'string' },
          avatar: { type: 'string' },
          address: { type: 'string' },
          new_password: { type: 'string', minLength: 6 },
          confirm_password: { type: 'string' }
        }
      }
    },
    delete: {
      params: {
        type: 'object',
        properties: {
          customer_id: { type: 'string' }
        },
        required: ['customer_id']
      }
    }
  }
}
