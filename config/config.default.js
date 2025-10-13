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
  }
}