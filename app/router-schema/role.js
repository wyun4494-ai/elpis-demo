/**
 * 角色管理路由参数验证规则
 * 使用 ajv schema 定义 API 参数验证规则
 */
module.exports = {
  // 获取角色列表（schema-table 会自动添加 /list 后缀）
  '/api/proj/role/list': {
    get: {
      query: {
        type: 'object',
        properties: {
          page: { type: 'string' },
          pageSize: { type: 'string' },
          role_name: { type: 'string' }
        }
      }
    }
  },

  // 获取角色列表、创建角色
  '/api/proj/role': {
    get: {
      query: {
        type: 'object',
        properties: {
          page: { type: 'string' },
          pageSize: { type: 'string' },
          role_name: { type: 'string' }
        }
      }
    },
    // 创建角色
    post: {
      body: {
        type: 'object',
        properties: {
          role_name: { type: 'string' },
          role_code: { type: 'string' },
          role_desc: { type: 'string' }
        },
        required: ['role_name']  // role_code 可选，会自动生成
      }
    }
  },

  // 获取角色详情、更新角色、删除角色
  '/api/proj/role/:role_id': {
    get: {
      params: {
        type: 'object',
        properties: {
          role_id: { type: 'string' }
        },
        required: ['role_id']
      }
    },
    put: {
      params: {
        type: 'object',
        properties: {
          role_id: { type: 'string' }
        },
        required: ['role_id']
      },
      body: {
        type: 'object',
        properties: {
          role_name: { type: 'string' },
          role_desc: { type: 'string' },
          status: { type: 'number' }
        }
      }
    },
    delete: {
      params: {
        type: 'object',
        properties: {
          role_id: { type: 'string' }
        },
        required: ['role_id']
      }
    }
  },

  // 更新角色状态（Switch 开关）
  '/api/proj/role/status': {
    put: {
      body: {
        type: 'object',
        properties: {
          role_id: { type: 'number' },
          status: { type: 'number' }
        },
        required: ['role_id', 'status']
      }
    }
  },

  // 获取角色的菜单权限、更新角色的菜单权限
  '/api/proj/role/:role_id/menu': {
    get: {
      params: {
        type: 'object',
        properties: {
          role_id: { type: 'string' }
        },
        required: ['role_id']
      }
    },
    put: {
      params: {
        type: 'object',
        properties: {
          role_id: { type: 'string' }
        },
        required: ['role_id']
      },
      body: {
        type: 'object',
        properties: {
          menu_list: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                menu_key: { type: 'string' },
                project_key: { type: 'string' }
              },
              required: ['menu_key', 'project_key']
            }
          }
        },
        required: ['menu_list']
      }
    }
  },

  // 获取当前用户的菜单权限
  '/api/proj/user/menu': {
    get: {}
  },

  // 获取当前用户有权限访问的项目列表
  '/api/proj/user/project-list': {
    get: {}
  },

  // 检查用户是否有权限访问项目
  '/api/proj/user/check-project-permission': {
    get: {
      query: {
        type: 'object',
        properties: {
          project_key: { type: 'string' }
        },
        required: ['project_key']
      }
    }
  }
}

