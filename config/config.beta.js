module.exports = {
  name: 'elpis-demo-beta',
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