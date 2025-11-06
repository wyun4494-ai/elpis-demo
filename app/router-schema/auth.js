/**
 * 认证路由参数验证
 * 使用 ajv 验证 API 请求参数
 *
 * 验证规则：
 * - 用户注册：nickname/username/password 必填
 * - 用户登录：username/password 必填，remember 可选
 * - 用户登出：无参数
 * - 获取用户信息：无参数（从 Token 中解析）
 */
module.exports = {
  // 用户注册
  '/api/proj/auth/register': {
    post: {
      body: {
        type: 'object',
        properties: {
          nickname: {
            type: 'string',
            minLength: 1,
            maxLength: 50
          },
          username: {
            type: 'string',
            minLength: 3,
            maxLength: 50,
            pattern: '^[a-zA-Z0-9_]+$' // 只允许字母、数字、下划线
          },
          password: {
            type: 'string',
            minLength: 6,
            maxLength: 50
          }
        },
        required: ['nickname', 'username', 'password']
      }
    }
  },

  // 用户登录
  '/api/proj/auth/login': {
    post: {
      body: {
        type: 'object',
        properties: {
          username: {
            type: 'string'
          },
          password: {
            type: 'string'
          },
          remember: {
            type: 'boolean'
          }
        },
        required: ['username', 'password']
      }
    }
  },

  // 用户登出
  '/api/proj/auth/logout': {
    post: {
      body: {
        type: 'object',
        properties: {}
      }
    }
  },

  // 获取当前用户信息
  '/api/proj/auth/user-info': {
    get: {
      query: {
        type: 'object',
        properties: {}
      }
    }
  }
}