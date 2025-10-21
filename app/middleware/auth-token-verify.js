const jwt = require('jsonwebtoken')

module.exports = (app) => {
  const whiteList = [
    '/view/auth/login',
    '/api/auth/login',
    '/api/auth/logout',
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
        ctx.userId = decoded.userId
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