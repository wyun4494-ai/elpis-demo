/**
 * 客户管理服务
 * 处理普通用户（商城客户）相关的业务逻辑和数据库操作
 *
 * @class CustomerService
 * @extends BaseService
 */
module.exports = (app) => {
  const moment = require('moment')
  const { v4: uuidv4 } = require('uuid')
  const generatePassword = require('generate-password')
  const bcrypt = require('bcrypt')
  const BaseService = require('@lesheng/elpis').Service.Base(app)

  return class CustomerService extends BaseService {

    /**
     * 批量删除客户（软删除）
     *
     * @param {Array<string>} customerIds - 客户ID数组
     * @returns {Promise<number>} 返回删除的客户数量
     */
    async batchDeleteCustomer(customerIds) {
      await app.database('t_customer')
        .whereIn('customer_id', customerIds)
        .update({
          status: app.status.DELETE,
          update_time: moment().format('YYYY-MM-DD HH:mm:ss')
        })
      return customerIds.length
    }

    /**
     * 删除客户（软删除）
     *
     * @param {string} customerId - 客户ID
     * @returns {Promise<string>} 返回客户ID
     */
    async deleteCustomer(customerId) {
      await app.database('t_customer').update({
        status: app.status.DELETE,
        update_time: moment().format('YYYY-MM-DD HH:mm:ss')
      }).where({
        customer_id: customerId
      })
      return customerId
    }

    /**
     * 更新客户信息
     *
     * @param {string} customerId - 客户ID
     * @param {Object} data - 更新数据
     * @param {string} [data.nickname] - 昵称
     * @param {string} [data.email] - 邮箱地址（可选）
     * @param {string} [data.phone] - 手机号（可选）
     * @param {number} [data.sex] - 性别（1-男，2-女，3-其他）
     * @param {string} [data.avatar] - 头像URL（可选）
     * @param {string} [data.address] - 收货地址（可选）
     * @param {string} [data.new_password] - 新密码（可选）
     * @param {string} [data.confirm_password] - 确认密码（可选）
     * @returns {Promise<string>} 返回客户ID
     * @throws {Error} 如果新密码和确认密码不一致，或邮箱/手机号格式不正确
     */
    async updateCustomer(customerId, { nickname, email, phone, sex, avatar, address, new_password: newPassword, confirm_password: confirmPassword }) {
      // 1. 验证邮箱格式
      this.validateEmail(email)

      // 2. 验证手机号格式
      this.validatePhone(phone)

      // 3. 验证密码字段（如果提供了新密码）
      if (newPassword !== undefined && newPassword !== null && newPassword !== '') {
        // 3.1 验证新密码不能为空字符串
        if (newPassword.trim() === '') {
          throw new Error('新密码不能为空')
        }

        // 3.2 验证新密码长度至少 6 位
        if (newPassword.length < 6) {
          throw new Error('新密码长度至少 6 位')
        }

        // 3.3 验证新密码和确认密码一致
        if (newPassword !== confirmPassword) {
          throw new Error('新密码和确认密码不一致')
        }
      }

      // 4. 构建更新对象（只更新传入的字段）
      const updateObj = {}
      if (nickname !== undefined && nickname !== null) {
        updateObj.nickname = nickname
      }
      if (sex !== undefined && sex !== null && sex !== -999) {
        updateObj.sex = sex
      }
      if (email !== undefined && email !== null) {
        updateObj.email = email
      }
      if (phone !== undefined && phone !== null) {
        updateObj.phone = phone
      }
      if (avatar !== undefined) {
        updateObj.avatar = avatar
      }
      if (address !== undefined && address !== null) {
        updateObj.address = address
      }

      // 5. 如果提供了新密码，使用 bcrypt 加密后更新
      if (newPassword !== undefined && newPassword !== null && newPassword !== '') {
        const hashedPassword = await bcrypt.hash(newPassword, 10)
        updateObj.password = hashedPassword
      }

      // 6. 更新数据库
      await app.database('t_customer').update({
        ...updateObj,
        update_time: moment().format('YYYY-MM-DD HH:mm:ss')
      }).where({
        customer_id: customerId,
        status: app.status.NORMAL
      })

      return customerId
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
     * 验证手机号格式
     *
     * @param {string} phone - 手机号
     * @throws {Error} 如果手机号格式不正确
     */
    validatePhone(phone) {
      if (!phone) return // 手机号为空时不验证（选填字段）
      
      const phoneRegex = /^1[3-9]\d{9}$/
      if (!phoneRegex.test(phone)) {
        throw new Error('手机号格式不正确')
      }
    }

    /**
     * 创建客户
     *
     * 业务规则：
     * - 自动生成 UUID 作为客户ID
     * - 如果提供了密码，使用提供的密码；否则自动生成随机密码（10位，包含数字、符号、大小写字母）
     * - 邮箱和手机号为选填字段，需要验证格式
     *
     * @param {Object} data - 客户数据
     * @param {string} data.username - 用户名
     * @param {string} [data.nickname] - 昵称
     * @param {number} [data.sex] - 性别（1-男，2-女，3-其他）
     * @param {string} [data.email] - 邮箱地址（可选）
     * @param {string} [data.phone] - 手机号（可选）
     * @param {string} [data.avatar] - 头像URL（可选）
     * @param {string} [data.address] - 收货地址（可选）
     * @param {string} [data.new_password] - 自定义密码（可选）
     * @param {string} [data.confirm_password] - 确认密码（可选）
     * @returns {Promise<string>} 返回新创建的客户ID
     * @throws {Error} 如果密码和确认密码不一致，或邮箱/手机号格式不正确
     */
    async createCustomer({ username, nickname, sex, email, phone, avatar, address, new_password: newPassword, confirm_password: confirmPassword }) {
      // 1. 验证邮箱格式
      this.validateEmail(email)

      // 2. 验证手机号格式
      this.validatePhone(phone)

      // 3. 生成客户ID（UUID，去掉连字符）
      const customerId = uuidv4().replace(/-/g, '')

      // 4. 处理密码
      let password
      if (newPassword !== undefined && newPassword !== null && newPassword !== '') {
        // 4.1 验证密码不能为空字符串
        if (newPassword.trim() === '') {
          throw new Error('密码不能为空')
        }

        // 4.2 验证密码长度至少 6 位
        if (newPassword.length < 6) {
          throw new Error('密码长度至少 6 位')
        }

        // 4.3 验证密码和确认密码一致
        if (newPassword !== confirmPassword) {
          throw new Error('密码和确认密码不一致')
        }

        // 4.4 使用 bcrypt 加密密码
        password = await bcrypt.hash(newPassword, 10)
      } else {
        // 4.5 自动生成随机密码（10位，包含数字、符号、大小写字母）
        const randomPassword = generatePassword.generate({
          length: 10,
          numbers: true,
          symbols: true,
          uppercase: true,
          lowercase: true
        })
        password = await bcrypt.hash(randomPassword, 10)
      }

      // 5. 插入数据库
      await app.database('t_customer').insert({
        customer_id: customerId,
        username,
        nickname,
        sex: sex || 3,
        email,
        phone,
        avatar,
        address,
        password,
        status: app.status.NORMAL,
        create_time: moment().format('YYYY-MM-DD HH:mm:ss')
      })

      return customerId
    }

    /**
     * 获取客户详情
     *
     * @param {string} customerId - 客户ID
     * @returns {Promise<Object>} 返回客户信息
     */
    async getCustomer(customerId) {
      const result = await app.database('t_customer').select('*').where({
        customer_id: customerId,
        status: app.status.NORMAL
      })
      return result[0] ?? {}
    }

    /**
     * 获取客户列表
     *
     * @param {Object} params - 查询参数
     * @param {string} [params.username] - 用户名
     * @param {string} [params.nickname] - 昵称
     * @param {string} [params.email] - 邮箱
     * @param {string} [params.phone] - 手机号
     * @param {number} [params.sex] - 性别
     * @param {string} [params.createTimeStart] - 创建时间开始
     * @param {string} [params.createTimeEnd] - 创建时间结束
     * @param {number} params.page - 页码
     * @param {number} params.pageSize - 每页数量
     * @returns {Promise<Array>} 返回客户列表
     */
    async getCustomerList({
      username,
      nickname,
      email,
      phone,
      sex,
      createTimeStart,
      createTimeEnd,
      page,
      pageSize
    }) {
      const queryObj = { status: app.status.NORMAL }
      if (username) {
        queryObj.username = username
      }
      if (nickname) {
        queryObj.nickname = nickname
      }
      if (email) {
        queryObj.email = email
      }
      if (phone) {
        queryObj.phone = phone
      }
      // sex 需要转换为数字，并排除 -999（表示"全部"）
      if (sex !== undefined && sex !== null && sex !== '' && sex !== -999) {
        queryObj.sex = Number(sex)
      }

      let sql = app.database('t_customer').select('*').where(queryObj)

      if (createTimeStart) {
        sql = sql.andWhere('create_time', '>=', createTimeStart)
      }
      if (createTimeEnd) {
        sql = sql.andWhere('create_time', '<=', createTimeEnd)
      }
      const offset = (page - 1) * pageSize
      sql = sql.offset(offset).limit(pageSize)

      return await sql
    }

    /**
     * 获取客户列表总数
     *
     * @param {Object} params - 查询参数
     * @param {string} [params.username] - 用户名
     * @param {string} [params.nickname] - 昵称
     * @param {string} [params.email] - 邮箱
     * @param {string} [params.phone] - 手机号
     * @param {number} [params.sex] - 性别
     * @param {string} [params.createTimeStart] - 创建时间开始
     * @param {string} [params.createTimeEnd] - 创建时间结束
     * @returns {Promise<number>} 返回客户总数
     */
    async getCustomerListTotal({
      username,
      nickname,
      email,
      phone,
      sex,
      createTimeStart,
      createTimeEnd
    }) {
      const queryObj = { status: app.status.NORMAL }
      if (username) {
        queryObj.username = username
      }
      if (nickname) {
        queryObj.nickname = nickname
      }
      if (email) {
        queryObj.email = email
      }
      if (phone) {
        queryObj.phone = phone
      }
      // sex 需要转换为数字，并排除 -999（表示"全部"）
      if (sex !== undefined && sex !== null && sex !== '' && sex !== -999) {
        queryObj.sex = Number(sex)
      }

      let sql = app.database('t_customer').countDistinct('customer_id as customer_amount').where(queryObj)

      if (createTimeStart) {
        sql = sql.andWhere('create_time', '>=', createTimeStart)
      }
      if (createTimeEnd) {
        sql = sql.andWhere('create_time', '<=', createTimeEnd)
      }
      const res = await sql

      return res[0].customer_amount
    }
  }
}
