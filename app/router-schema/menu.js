/**
 * 菜单管理路由参数验证规则
 */
module.exports = {
  // 获取所有菜单列表
  '/api/proj/menu/list': {
    get: {
      query: {
        type: 'object',
        properties: {}
      }
    }
  }
}

