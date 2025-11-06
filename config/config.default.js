module.exports = {
  name: 'elpis-demo',
  jwtSecretKey: '822f838d62b39a5829f71df015f89b6f',
  // 数据库配置
  db: {
    client: 'mysql',
    connection: {
      host: 'localhost',
      port: '3306',
      user: 'root',
      password: '123456',
      database: 'elpis_beta'
    },
    pool: {
      min: 2,
      max: 10
    }
  },
  apiSignVerify: {
    whiteList: [
      '/api/proj/auth/register', // 注册接口无需 Token
      '/api/proj/auth/login',    // 登录接口无需 Token
      '/api/auth/logout'         // 旧的登出接口（兼容）
    ]
  }
}