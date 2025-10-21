module.exports = (app) => {
  const moment = require('moment')
  const { v4: uuidv4 } = require('uuid')
  const generatePassword = require('generate-password')
  const BaseService = require('@lesheng/elpis').Service.Base(app)
  return class userService extends BaseService { 

    async deleteUser(userId) {
      await app.database('t_user').update({
        status: app.status.DELETE,
        update_time: moment().format('YYYY-MM-DD HH:mm:ss')
      }).where({
        user_id: userId
      })
      return userId
    }

    async updateUser(userId, { nickname, desc, sex }) {
      const updateObj = {}
      if(nickname) {
        updateObj.nickname = nickname
      }
      if(sex && sex !== -999) {
        updateObj.sex = sex
      }
      if(desc) {
        updateObj.desc = desc
      }
      await app.database('t_user').update({
        ...updateObj,
        update_time: moment().format('YYYY-MM-DD HH:mm:ss')
      }).where({
        user_id: userId,
        status: app.status.NORMAL
      })

      return userId
    }

    async createUser({ username, nickname, sex, desc }) {
      const userId = uuidv4().replace(/-/g, '')
      const password = generatePassword.generate({
        length: 10,
        numbers: true,
        symbols: true,
        uppercase: true,
        lowercase: true
      })

      await app.database('t_user').insert({
        user_id: userId,
        username,
        nickname,
        sex,
        desc,
        password,
        status: app.status.NORMAL,
        create_time: moment().format('YYYY-MM-DD HH:mm:ss')
      })
      return userId
    }

    async getUser(userId) {
      const result = await app.database('t_user').select('*').where({
        user_id: userId,
        status: app.status.NORMAL
      })
      return result[0] ?? {}
    }

    async getByUsernameAndPassword({ username, password}) {
      const { database } = app
      const res = await database('t_user').select('*').where({
        username,
        password,
        status: app.status.NORMAL
      }).limit(1)

      return res[0]
    }

    async getUserList({
      username,
      nickname,
      sex,
      createTimeStart,
      createTimeEnd,
      page,
      pageSize
    }) {
      const queryObj = { status: app.status.NORMAL }
      if(username) {
        queryObj.username = username
      }
      if(nickname) {
        queryObj.nickname = nickname
      }
      if(sex && sex !== -999) {
        queryObj.sex = sex
      }

      let sql = app.database('t_user').select('*').where(queryObj)

      if(createTimeStart) {
        sql = sql.andWhere('create_time', '>=', createTimeStart)
      }
      if(createTimeEnd) {
        sql = sql.andWhere('create_time', '<=', createTimeEnd)
      }
      const offset = (page - 1) * pageSize
      sql = sql.offset(offset).limit(pageSize)

      return await sql
    }

    async getUserListTotal({
      username,
      nickname,
      sex,
      createTimeStart,
      createTimeEnd,
    }) {
      const queryObj = { status: app.status.NORMAL }
      if(username) {
        queryObj.username = username
      }
      if(nickname) {
        queryObj.nickname = nickname
      }
      if(sex && sex !== -999) {
        queryObj.sex = sex
      }

      let sql = app.database('t_user').countDistinct('user_id as user_amount').where(queryObj)

      if(createTimeStart) {
        sql = sql.andWhere('create_time', '>=', createTimeStart)
      }
      if(createTimeEnd) {
        sql = sql.andWhere('create_time', '<=', createTimeEnd)
      }
      const res = await sql

      return res[0].user_amount
    }
  }
}