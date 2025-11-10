/**
 * 权限验证中间件
 * 验证用户是否有权限访问指定的菜单
 *
 * 权限验证策略：
 * 1. 列表接口（/list）不进行权限验证，允许所有已登录用户访问
 * 2. 创建、编辑、删除接口需要权限验证
 * 3. 白名单接口直接放行
 *
 * 使用方式：
 * 1. 在请求头中传递 proj_key（项目标识）
 * 2. 在查询参数中传递 menu_key（菜单标识）
 * 3. 中间件会自动验证用户是否有权限
 *
 * 示例：
 * GET /api/proj/product/list?menu_key=product-list&proj_key=business  // 不验证权限
 * POST /api/proj/product?menu_key=product&proj_key=business           // 验证权限
 */

module.exports = (app) => {
  // 白名单：不需要权限验证的接口
  const whiteList = [
    '/api/proj/auth/login',
    '/api/proj/auth/register',
    '/api/proj/auth/logout',
    '/api/proj/auth/user-info',
    '/api/proj/user/menu',  // 获取用户菜单权限列表
    '/api/proj/user/project-list',  // 获取用户有权限访问的项目列表
    '/api/proj/user/check-project-permission',  // 检查用户是否有权限访问项目
    '/api/project',         // 获取项目配置
    '/api/project/list',    // 获取项目列表
    '/api/project/model_list' // 获取模型列表
  ]

  return async (ctx, next) => {
    // 白名单接口直接放行
    if (whiteList.includes(ctx.path)) {
      return await next()
    }

    // 非 /api/proj/ 接口直接放行
    if (ctx.path.indexOf('/api/proj/') < 0) {
      return await next()
    }

    // 列表接口（/list）不进行权限验证，直接放行
    // 这样用户可以查看有权限的菜单的数据
    if (ctx.path.endsWith('/list')) {
      return await next()
    }

    // 获取菜单标识和项目标识
    const menuKey = ctx.query.menu_key || ctx.request.body?.menu_key
    const projectKey = ctx.query.proj_key || ctx.request.body?.proj_key || ctx.request.headers['proj_key']

    // 如果没有传递菜单标识或项目标识，直接放行（由其他中间件处理）
    if (!menuKey || !projectKey) {
      return await next()
    }

    // 获取用户ID
    const userId = ctx.userId

    if (!userId) {
      ctx.status = 401
      ctx.body = {
        success: false,
        message: '请先登录',
        code: 50000
      }
      return
    }

    // 验证用户是否有权限访问该菜单
    try {
      const { role: roleService } = app.service
      const hasPermission = await roleService.hasMenuPermission(userId, menuKey, projectKey)

      if (!hasPermission) {
        ctx.status = 403
        ctx.body = {
          success: false,
          message: '您没有权限访问此菜单',
          code: 403
        }
        return
      }

      // 权限验证通过，继续执行
      await next()
    } catch (error) {
      app.logger.error('权限验证失败', error)
      ctx.status = 500
      ctx.body = {
        success: false,
        message: '权限验证失败',
        code: 500
      }
    }
  }
}

