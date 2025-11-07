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
    let shouldRotateToken = false

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

        // 令牌轮换机制：检查 Token 是否即将过期（剩余时间少于 1 天）
        const now = Math.floor(Date.now() / 1000) // 当前时间（秒）
        const expiresAt = decoded.exp // Token 过期时间（秒）
        const timeRemaining = expiresAt - now // 剩余时间（秒）
        const oneDayInSeconds = 24 * 60 * 60

        // 如果剩余时间少于 1 天，生成新 Token
        if (timeRemaining < oneDayInSeconds) {
          shouldRotateToken = true
        }
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

    // 执行业务逻辑
    await next()

    // 令牌轮换：在响应前生成新 Token 并设置到 Cookie
    if (shouldRotateToken && isLogin) {
      try {
        const { jwtSecretKey } = app.config

        // 生成新 Token（保持原有的过期时间策略）
        const newToken = jwt.sign(
          {
            user_id: ctx.userId,
            username: ctx.username,
            role_id: ctx.roleId
          },
          jwtSecretKey,
          { expiresIn: '7d' } // 默认 7 天（如果需要区分"记住我"，需要从数据库读取用户偏好）
        )

        // 更新 Cookie 中的 Token
        const isProduction = app.config.env === 'prod'
        ctx.cookies.set('token', newToken, {
          httpOnly: true,
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 天
          overwrite: true,
          secure: isProduction,
          sameSite: 'lax',
          path: '/'
        })

        // 在响应头中添加新 Token（供前端更新）
        ctx.set('X-New-Token', newToken)

        app.logger.info(`Token 已轮换：用户 ${ctx.username}（${ctx.userId}）`)
      } catch (error) {
        app.logger.error('Token 轮换失败', error)
      }
    }
  }
}