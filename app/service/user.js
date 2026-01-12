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
  const bcrypt = require('bcrypt')
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
     * @param {string} [data.email] - 邮箱地址（可选）
     * @param {string} [data.new_password] - 新密码（可选）
     * @param {string} [data.confirm_password] - 确认密码（可选）
     * @returns {Promise<string>} 返回用户ID
     * @throws {Error} 如果新密码和确认密码不一致，或邮箱格式不正确
     */
    async updateUser(userId, { nickname, desc, sex, role_id: roleId, email, new_password: newPassword, confirm_password: confirmPassword }) {
      // 1. 验证邮箱格式
      this.validateEmail(email)

      // 2. 验证密码字段（如果提供了新密码）
      if (newPassword !== undefined && newPassword !== null && newPassword !== '') {
        // 2.1 验证新密码不能为空字符串
        if (newPassword.trim() === '') {
          throw new Error('新密码不能为空')
        }

        // 2.2 验证新密码长度至少 6 位
        if (newPassword.length < 6) {
          throw new Error('新密码长度至少 6 位')
        }

        // 2.3 验证新密码和确认密码一致
        if (newPassword !== confirmPassword) {
          throw new Error('新密码和确认密码不一致')
        }
      }

      // 3. 构建更新对象（只更新传入的字段）
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
      if (email !== undefined) {
        updateObj.email = email
      }
      if (roleId !== undefined) {
        updateObj.role_id = roleId
      }

      // 4. 如果提供了新密码，使用 bcrypt 加密后更新
      if (newPassword !== undefined && newPassword !== null && newPassword !== '') {
        const hashedPassword = await bcrypt.hash(newPassword, 10)
        updateObj.password = hashedPassword
      }

      // 5. 更新数据库
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
     * 验证邮箱格式
     *
     * @param {string} email - 邮箱地址
     * @throws {Error} 如果邮箱格式不正确
     */
    validateEmail(email) {
      if (!email) return // 邮箱为空时不验证（选填字段）
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        throw new Error('邮箱格式不正确')
      }
    }

    /**
     * 创建用户
     *
     * 业务规则：
     * - 自动生成 UUID 作为用户ID
     * - 如果提供了密码，使用提供的密码；否则自动生成随机密码（10位，包含数字、符号、大小写字母）
     * - 邮箱为选填字段，需要验证格式
     *
     * @param {Object} data - 用户数据
     * @param {string} data.username - 用户名
     * @param {string} data.nickname - 昵称
     * @param {number} data.sex - 性别（1-男，2-女）
     * @param {string} [data.desc] - 描述
     * @param {string} [data.email] - 邮箱地址（可选）
     * @param {string} [data.new_password] - 自定义密码（可选）
     * @param {string} [data.confirm_password] - 确认密码（可选）
     * @returns {Promise<string>} 返回新创建的用户ID
     * @throws {Error} 如果密码和确认密码不一致，或邮箱格式不正确
     */
    async createUser({ username, nickname, sex, desc, email, new_password: newPassword, confirm_password: confirmPassword }) {
      // 1. 验证邮箱格式
      this.validateEmail(email)

      // 2. 生成用户ID（UUID，去掉连字符）
      const userId = uuidv4().replace(/-/g, '')

      // 3. 处理密码
      let password
      if (newPassword !== undefined && newPassword !== null && newPassword !== '') {
        // 3.1 验证密码不能为空字符串
        if (newPassword.trim() === '') {
          throw new Error('密码不能为空')
        }

        // 3.2 验证密码长度至少 6 位
        if (newPassword.length < 6) {
          throw new Error('密码长度至少 6 位')
        }

        // 3.3 验证密码和确认密码一致
        if (newPassword !== confirmPassword) {
          throw new Error('密码和确认密码不一致')
        }

        // 3.4 使用 bcrypt 加密密码
        password = await bcrypt.hash(newPassword, 10)
      } else {
        // 3.5 自动生成随机密码（10位，包含数字、符号、大小写字母）
        const randomPassword = generatePassword.generate({
          length: 10,
          numbers: true,
          symbols: true,
          uppercase: true,
          lowercase: true
        })
        password = await bcrypt.hash(randomPassword, 10)
      }

      // 4. 插入数据库
      await app.database('t_user').insert({
        user_id: userId,
        username,
        nickname,
        sex,
        desc,
        email,
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
      email,
      role_id: roleId,
      createTimeStart,
      createTimeEnd,
      page,
      pageSize
    }) {
      const queryObj = { 't_user.status': app.status.NORMAL }
      if(username) {
        queryObj['t_user.username'] = username
      }
      if(nickname) {
        queryObj['t_user.nickname'] = nickname
      }
      // sex 需要转换为数字，并排除 -999（表示"全部"）
      if(sex !== undefined && sex !== null && sex !== '' && sex !== -999) {
        queryObj['t_user.sex'] = Number(sex)
      }
      if(email) {
        queryObj['t_user.email'] = email
      }
      if(roleId !== undefined && roleId !== null && roleId !== '' && roleId !== -999) {
        queryObj['t_user.role_id'] = roleId
      }

      let sql = app.database('t_user')
        .leftJoin('t_role', 't_user.role_id', 't_role.role_id')
        .select(
          't_user.*',
          't_role.role_name'
        )
        .where(queryObj)

      if(createTimeStart) {
        sql = sql.andWhere('t_user.create_time', '>=', createTimeStart)
      }
      if(createTimeEnd) {
        sql = sql.andWhere('t_user.create_time', '<=', createTimeEnd)
      }
      const offset = (page - 1) * pageSize
      sql = sql.offset(offset).limit(pageSize)

      return await sql
    }

    async getUserListTotal({
      username,
      nickname,
      sex,
      email,
      role_id: roleId,
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
      // sex 需要转换为数字，并排除 -999（表示"全部"）
      if(sex !== undefined && sex !== null && sex !== '' && sex !== -999) {
        queryObj.sex = Number(sex)
      }
      if(email) {
        queryObj.email = email
      }
      if(roleId !== undefined && roleId !== null && roleId !== '' && roleId !== -999) {
        queryObj.role_id = roleId
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