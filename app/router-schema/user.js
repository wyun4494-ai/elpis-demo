/**
 * 用户管理路由参数验证规则
 * 使用 ajv schema 定义 API 参数验证规则
 */
module.exports = {
  // 获取用户列表（schema-table 会自动添加 /list 后缀）
  '/api/proj/user/list': {
    get: {
      query: {
        type: 'object',
        properties: {
          page: { type: 'string' },
          pageSize: { type: 'string' },
          username: { type: 'string' },
          nickname: { type: 'string' },
          sex: { type: 'number' },
          create_time_start: { type: 'string' },
          create_time_end: { type: 'string' }
        },
        required: ['page', 'pageSize']
      }
    }
  },

  // 获取用户列表或用户详情、创建用户
  '/api/proj/user': {
    get: {
      query: {
        type: 'object',
        properties: {
          user_id: { type: 'string' },
          page: { type: 'string' },
          pageSize: { type: 'string' },
          username: { type: 'string' },
          nickname: { type: 'string' },
          sex: { type: 'number' },
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
          desc: { type: 'string' }
        },
        required: ['username']
      }
    }
  },

  // 获取用户详情、更新用户、删除用户
  '/api/proj/user/:user_id': {
    get: {
      params: {
        type: 'object',
        properties: {
          user_id: { type: 'string' }
        },
        required: ['user_id']
      }
    },
    put: {
      params: {
        type: 'object',
        properties: {
          user_id: { type: 'string' }
        },
        required: ['user_id']
      },
      body: {
        type: 'object',
        properties: {
          nickname: { type: 'string' },
          sex: { type: 'number' },
          desc: { type: 'string' },
          role_id: { type: 'number' }
        }
      }
    },
    delete: {
      params: {
        type: 'object',
        properties: {
          user_id: { type: 'string' }
        },
        required: ['user_id']
      }
    }
  }
}