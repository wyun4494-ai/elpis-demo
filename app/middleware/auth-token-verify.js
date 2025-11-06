const jwt = require('jsonwebtoken')

module.exports = (app) => {
  // 白名单：不需要 Token 验证的接口
  const whiteList = [
    '/view/auth/login',           // 登录页面
    '/api/proj/auth/login',       // 登录接口
    '/api/proj/auth/register',    // 注册接口
    '/api/proj/auth/logout',      // 登出接口
    '/api/auth/login',            // 旧的登录接口（兼容）
    '/api/auth/logout',           // 旧的登出接口（兼容）
  ]

  return async (ctx, next) => {
    if (whiteList.includes(ctx.path)) {
      return await next()
    }

    let isLogin = true

    ctx.token = ctx.cookies.get('token')
    if(!ctx.token) { // 检查是否有token
      isLogin = false
    } else { // 检查token是否有效
      try {
        const { jwtSecretKey } = app.config
        const decoded = jwt.verify(ctx.token, jwtSecretKey)
        ctx.userId = decoded.user_id // 修复：使用 user_id 而不是 userId
        ctx.username = decoded.username
        ctx.roleId = decoded.role_id
        isLogin = true
      } catch (error) {
        isLogin = false
      }
    }
    if (!isLogin) {
      ctx.cookies.set('token', '', {
        httpOnly: true,
        expires: new Date(0)
      })

      if (ctx.url.indexOf('/api') > -1) {
        ctx.body = {
          success: false,
          message: '请先登录',
          code: 50000
        }
      } else {
        ctx.status = 302
        ctx.redirect(`/view/auth/login?callback=${encodeURIComponent(ctx.url)}`)
      }
      return
    }

    await next()
  }
}