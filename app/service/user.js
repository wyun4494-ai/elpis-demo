/**
 * 用户管理服务
 * 处理用户相关的业务逻辑和数据库操作
 *
 * @class UserService
 * @extends BaseService
 */
module.exports = (app) => {
  const moment = require('moment')
  const { v4: uuidv4 } = require('uuid')
  const generatePassword = require('generate-password')
  const BaseService = require('@lesheng/elpis').Service.Base(app)

  return class UserService extends BaseService {

    /**
     * 删除用户（软删除）
     *
     * @param {string} userId - 用户ID
     * @returns {Promise<string>} 返回用户ID
     */
    async deleteUser(userId) {
      await app.database('t_user').update({
        status: app.status.DELETE,
        update_time: moment().format('YYYY-MM-DD HH:mm:ss')
      }).where({
        user_id: userId
      })
      return userId
    }

    /**
     * 更新用户信息
     *
     * @param {string} userId - 用户ID
     * @param {Object} data - 更新数据
     * @param {string} [data.nickname] - 昵称
     * @param {string} [data.desc] - 描述
     * @param {number} [data.sex] - 性别（1-男，2-女）
     * @param {number} [data.role_id] - 角色ID
     * @returns {Promise<string>} 返回用户ID
     */
    async updateUser(userId, { nickname, desc, sex, role_id: roleId }) {
      // 1. 构建更新对象（只更新传入的字段）
      const updateObj = {}
      if (nickname) {
        updateObj.nickname = nickname
      }
      if (sex && sex !== -999) {
        updateObj.sex = sex
      }
      if (desc) {
        updateObj.desc = desc
      }
      if (roleId !== undefined) {
        updateObj.role_id = roleId
      }

      // 2. 更新数据库
      await app.database('t_user').update({
        ...updateObj,
        update_time: moment().format('YYYY-MM-DD HH:mm:ss')
      }).where({
        user_id: userId,
        status: app.status.NORMAL
      })

      return userId
    }

    /**
     * 创建用户
     *
     * 业务规则：
     * - 自动生成 UUID 作为用户ID
     * - 自动生成随机密码（10位，包含数字、符号、大小写字母）
     *
     * @param {Object} data - 用户数据
     * @param {string} data.username - 用户名
     * @param {string} data.nickname - 昵称
     * @param {number} data.sex - 性别（1-男，2-女）
     * @param {string} [data.desc] - 描述
     * @returns {Promise<string>} 返回新创建的用户ID
     */
    async createUser({ username, nickname, sex, desc }) {
      // 1. 生成用户ID（UUID，去掉连字符）
      const userId = uuidv4().replace(/-/g, '')

      // 2. 生成随机密码（10位，包含数字、符号、大小写字母）
      const password = generatePassword.generate({
        length: 10,
        numbers: true,
        symbols: true,
        uppercase: true,
        lowercase: true
      })

      // 3. 插入数据库
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

    /**
     * 获取用户详情
     *
     * @param {string} userId - 用户ID
     * @returns {Promise<Object>} 返回用户信息
     */
    async getUser(userId) {
      const result = await app.database('t_user').select('*').where({
        user_id: userId,
        status: app.status.NORMAL
      })
      return result[0] ?? {}
    }

    /**
     * 根据用户名和密码获取用户（用于登录验证）
     *
     * @param {Object} credentials - 登录凭证
     * @param {string} credentials.username - 用户名
     * @param {string} credentials.password - 密码
     * @returns {Promise<Object|undefined>} 返回用户信息，不存在则返回 undefined
     */
    async getByUsernameAndPassword({ username, password }) {
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