/**
 * 用户认证控制器
 * 处理用户登录、登出相关的 HTTP 请求
 *
 * 认证机制：
 * - 使用 JWT（JSON Web Token）生成 Token
 * - Token 存储在 HttpOnly Cookie 中（防止 XSS 攻击）
 * - Token 有效期：1 天
 *
 * @class AuthController
 * @extends BaseController
 */
module.exports = (app) => {
  const jwt = require('jsonwebtoken')
  const baseController = require('@lesheng/elpis').Controller.Base(app)

  return class AuthController extends baseController {

    /**
     * 用户登录
     *
     * @param {Object} ctx - Koa 上下文对象
     * @param {Object} ctx.request.body - 请求体参数
     * @param {string} ctx.request.body.username - 用户名
     * @param {string} ctx.request.body.password - 密码
     * @returns {Promise<void>}
     */
    async login(ctx) {
      const { username, password } = ctx.request.body

      // 1. 验证用户名和密码
      const { user: userService } = app.service
      const userItem = await userService.getByUsernameAndPassword({ username, password })

      if (!userItem) {
        return this.fail(ctx, '账号或密码错误', 50000)
      }

      // 2. 生成 JWT Token
      const payload = { userId: userItem.user_id }
      const { jwtSecretKey } = app.config
      const token = jwt.sign(payload, jwtSecretKey, {
        expiresIn: 60 * 60 * 24 // 1天有效
      })

      // 3. 将 Token 存储到 Cookie（HttpOnly 防止 XSS 攻击）
      const expires = new Date()
      expires.setTime(expires.getTime() + 60 * 60 * 24 * 1000)
      ctx.cookies.set('token', token, {
        httpOnly: true,
        expires,
      })

      // 4. 返回用户信息
      this.success(ctx, {
        nickname: userItem.nickname
      })
    }

    /**
     * 用户登出
     *
     * @param {Object} ctx - Koa 上下文对象
     * @returns {Promise<void>}
     */
    async logout(ctx) {
      // 1. 清空 Cookie 中的 Token
      ctx.cookies.set('token', '', {
        httpOnly: true,
        expires: new Date(0)
      })

      // 2. 重定向到登录页
      ctx.status = 302
      ctx.redirect('/view/auth/login')
    }
  }
}