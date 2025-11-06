/**
 * 认证控制器
 * 处理用户注册、登录、登出等 HTTP 请求
 *
 * 认证机制：
 * - 使用 JWT（JSON Web Token）生成 Token
 * - 密码使用 bcrypt 加密存储
 * - 支持"记住我"功能（Token 有效期：记住我 7 天，否则 1 天）
 *
 * API 列表：
 * - POST /api/proj/auth/register - 用户注册
 * - POST /api/proj/auth/login - 用户登录
 * - POST /api/proj/auth/logout - 用户登出
 * - GET /api/proj/auth/user-info - 获取当前用户信息
 *
 * @class AuthController
 * @extends BaseController
 */
module.exports = (app) => {
  const baseController = require('@lesheng/elpis').Controller.Base(app)

  return class AuthController extends baseController {

    /**
     * 用户注册
     *
     * 请求参数：
     * - nickname: 昵称（必填）
     * - username: 用户名（必填）
     * - password: 密码（必填）
     *
     * 返回格式：
     * {
     *   success: true,
     *   data: {
     *     user_id: 'USER1234567890ABCDE',
     *     username: 'zhangsan',
     *     nickname: '张三',
     *     role_id: 2,
     *     sex: 3,
     *     create_time: '2025-11-05 10:30:00'
     *   }
     * }
     *
     * @param {Object} ctx - Koa Context
     */
    async register(ctx) {
      const { auth: authService } = app.service
      const params = ctx.request.body

      try {
        const newUser = await authService.register(params)
        this.success(ctx, newUser)
      } catch (error) {
        app.logger.error('用户注册失败', error)
        this.fail(ctx, error.message || '注册失败', 400)
      }
    }

    /**
     * 用户登录
     *
     * 请求参数：
     * - username: 用户名（必填）
     * - password: 密码（必填）
     * - remember: 是否记住我（可选，默认 false）
     *
     * 返回格式：
     * {
     *   success: true,
     *   data: {
     *     token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
     *     user: {
     *       user_id: 'USER1234567890ABCDE',
     *       username: 'zhangsan',
     *       nickname: '张三',
     *       role_id: 2,
     *       sex: 3,
     *       desc: '这是个人简介'
     *     }
     *   }
     * }
     *
     * @param {Object} ctx - Koa Context
     */
    async login(ctx) {
      const { auth: authService } = app.service
      const params = ctx.request.body

      try {
        const result = await authService.login(params)

        // 将 Token 设置到 Cookie 中（用于后续请求的身份验证）
        const expiresIn = params.remember ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000 // 记住我：7天，否则1天
        ctx.cookies.set('token', result.token, {
          httpOnly: true,
          maxAge: expiresIn,
          overwrite: true
        })

        this.success(ctx, result)
      } catch (error) {
        app.logger.error('用户登录失败', error)
        this.fail(ctx, error.message || '登录失败', 400)
      }
    }

    /**
     * 用户登出
     *
     * @param {Object} ctx - Koa 上下文对象
     * @returns {Promise<void>}
     */
    async logout(ctx) {
      // 1. 清空 Cookie 中的 Token（如果使用 Cookie 存储）
      ctx.cookies.set('token', '', {
        httpOnly: true,
        expires: new Date(0)
      })

      // 2. 返回成功响应
      this.success(ctx, { message: '登出成功' })
    }

    /**
     * 获取当前用户信息
     *
     * 请求头：
     * - Authorization: Bearer {token}
     *
     * 返回格式：
     * {
     *   success: true,
     *   data: {
     *     user_id: 'USER1234567890ABCDE',
     *     username: 'zhangsan',
     *     nickname: '张三',
     *     role_id: 2,
     *     sex: 3,
     *     desc: '这是个人简介',
     *     create_time: '2025-11-05 10:30:00'
     *   }
     * }
     *
     * @param {Object} ctx - Koa Context
     */
    async getUserInfo(ctx) {
      const { auth: authService } = app.service
      const userId = ctx.userId // 从 Token 中解析出的 user_id

      try {
        if (!userId) {
          this.fail(ctx, '未登录或 Token 已过期', 401)
          return
        }

        const user = await authService.getUserById(userId)

        if (!user) {
          this.fail(ctx, '用户不存在', 404)
          return
        }

        this.success(ctx, user)
      } catch (error) {
        app.logger.error('获取用户信息失败', error)
        this.fail(ctx, error.message || '获取用户信息失败', 400)
      }
    }
  }
}