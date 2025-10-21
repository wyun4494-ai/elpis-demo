module.exports = (app) => {
  const jwt = require('jsonwebtoken')
  const baseController = require('@lesheng/elpis').Controller.Base(app)
  return class authController extends baseController{
    async login(ctx) {
      const { username, password } = ctx.request.body

      const { user: userService } = app.service
      const userItem = await userService.getByUsernameAndPassword({ username, password }) 

      if(!userItem) {
        return this.fail(ctx, '账号或密码错误', 50000)
      }

      // 利用 jwt 生成一个 token 
      const payload = { userId: userItem.user_id}
      const { jwtSecretKey } = app.config
      const token = jwt.sign(payload, jwtSecretKey, {
        expiresIn: 60 * 60 * 24 // 1天有效
      })
      
      // 挂载到 cookie 上
      const expires = new Date()
      expires.setTime(expires.getTime() + 60 * 60 * 24 * 1000)
      ctx.cookies.set('token', token, {
        httpOnly: true,
        expires,
      })

      this.success(ctx, {
        nickname: userItem.nickname
      })
    }

    async logout(ctx) {
      // 清空cookie
      ctx.cookies.set('token', '', {
        httpOnly: true,
        expires: new Date(0)
      })
      // 重定向到登录页
      ctx.status = 302
      ctx.redirect('/view/auth/login')
    }
  }
}