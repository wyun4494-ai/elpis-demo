/**
 * 客户管理控制器
 * 处理普通用户（商城客户）相关的 HTTP 请求（CRUD）
 *
 * @class CustomerController
 * @extends BaseController
 */
module.exports = (app) => {
  const moment = require('moment')
  const baseController = require('@lesheng/elpis').Controller.Base(app)

  return class CustomerController extends baseController {

    /**
     * 批量删除客户（软删除）
     *
     * @param {Object} ctx - Koa 上下文对象
     * @param {Object} ctx.request.body - 请求体参数
     * @param {Array<string>} ctx.request.body.customer_ids - 客户ID数组
     * @returns {Promise<void>}
     */
    async batchDeleteCustomer(ctx) {
      const { customer_ids: customerIds } = ctx.request.body

      if (!customerIds || !Array.isArray(customerIds) || customerIds.length === 0) {
        this.fail(ctx, '客户ID数组不能为空', 400)
        return
      }

      const { customer: customerService } = app.service
      await customerService.batchDeleteCustomer(customerIds)

      this.success(ctx, {
        message: '批量删除成功',
        count: customerIds.length
      })
    }

    /**
     * 删除客户（软删除）
     *
     * @param {Object} ctx - Koa 上下文对象
     * @param {Object} ctx.params - 路径参数
     * @param {string} ctx.params.customer_id - 客户ID
     * @returns {Promise<void>}
     */
    async deleteCustomer(ctx) {
      const { customer_id: customerId } = ctx.params

      const { customer: customerService } = app.service
      await customerService.deleteCustomer(customerId)

      this.success(ctx, {
        message: '删除成功',
        customer_id: customerId
      })
    }

    /**
     * 更新客户信息
     *
     * 支持两种方式：
     * 1. PUT /api/proj/customer/:customer_id（路径参数）
     * 2. PUT /api/proj/customer（body 中包含 customer_id）
     *
     * @param {Object} ctx - Koa 上下文对象
     * @param {Object} ctx.params - 路径参数
     * @param {string} [ctx.params.customer_id] - 客户ID（路径参数）
     * @param {Object} ctx.request.body - 请求体参数
     * @param {string} [ctx.request.body.customer_id] - 客户ID（body 参数）
     * @param {string} [ctx.request.body.nickname] - 昵称
     * @param {string} [ctx.request.body.email] - 邮箱地址（可选）
     * @param {string} [ctx.request.body.phone] - 手机号（可选）
     * @param {number} [ctx.request.body.sex] - 性别（1-男，2-女，3-其他）
     * @param {string} [ctx.request.body.avatar] - 头像URL（可选）
     * @param {string} [ctx.request.body.address] - 收货地址（可选）
     * @param {string} [ctx.request.body.new_password] - 新密码（可选）
     * @param {string} [ctx.request.body.confirm_password] - 确认密码（可选）
     * @returns {Promise<void>}
     */
    async updateCustomer(ctx) {
      // 优先从路径参数获取 customer_id，其次从 body 中获取
      const customerIdFromParams = ctx.params.customer_id
      const customerIdFromBody = ctx.request.body.customer_id
      const customerId = customerIdFromParams || customerIdFromBody

      if (!customerId) {
        this.fail(ctx, '客户ID不能为空', 400)
        return
      }

      const {
        nickname,
        email,
        phone,
        sex,
        avatar,
        address,
        new_password: newPassword,
        confirm_password: confirmPassword
      } = ctx.request.body

      const { customer: customerService } = app.service

      try {
        await customerService.updateCustomer(customerId, {
          nickname,
          email,
          phone,
          sex,
          avatar,
          address,
          new_password: newPassword,
          confirm_password: confirmPassword
        })

        this.success(ctx, {
          message: '更新成功',
          customer_id: customerId
        })
      } catch (error) {
        this.fail(ctx, error.message || '更新失败', 400)
      }
    }

    /**
     * 创建客户
     *
     * @param {Object} ctx - Koa 上下文对象
     * @param {Object} ctx.request.body - 请求体参数
     * @param {string} ctx.request.body.username - 用户名（必填）
     * @param {string} [ctx.request.body.nickname] - 昵称
     * @param {number} [ctx.request.body.sex] - 性别（1-男，2-女，3-其他）
     * @param {string} [ctx.request.body.email] - 邮箱地址（可选）
     * @param {string} [ctx.request.body.phone] - 手机号（可选）
     * @param {string} [ctx.request.body.avatar] - 头像URL（可选）
     * @param {string} [ctx.request.body.address] - 收货地址（可选）
     * @param {string} [ctx.request.body.new_password] - 自定义密码（可选）
     * @param {string} [ctx.request.body.confirm_password] - 确认密码（可选）
     * @returns {Promise<void>}
     */
    async createCustomer(ctx) {
      const {
        username,
        nickname,
        sex,
        email,
        phone,
        avatar,
        address,
        new_password: newPassword,
        confirm_password: confirmPassword
      } = ctx.request.body

      const { customer: customerService } = app.service

      try {
        const customerId = await customerService.createCustomer({
          username,
          nickname,
          sex,
          email,
          phone,
          avatar,
          address,
          new_password: newPassword,
          confirm_password: confirmPassword
        })

        this.success(ctx, {
          message: '创建成功',
          customer_id: customerId
        })
      } catch (error) {
        this.fail(ctx, error.message || '创建失败', 400)
      }
    }

    /**
     * 获取客户详情或客户列表
     *
     * 支持两种调用方式：
     * 1. 获取客户详情：GET /api/proj/customer/:customer_id（路径参数）或 GET /api/proj/customer?customer_id=xxx（查询参数）
     * 2. 获取客户列表：GET /api/proj/customer/list 或 GET /api/proj/customer?page=1&pageSize=10（查询参数）
     *
     * @param {Object} ctx - Koa 上下文对象
     * @param {Object} ctx.params - 路径参数
     * @param {string} [ctx.params.customer_id] - 客户ID（路径参数）
     * @param {Object} ctx.request.query - 查询参数
     * @param {string} [ctx.request.query.customer_id] - 客户ID（查询参数）
     * @param {string} [ctx.request.query.page] - 页码（用于获取列表）
     * @param {string} [ctx.request.query.pageSize] - 每页数量（用于获取列表）
     * @returns {Promise<void>}
     */
    async getCustomer(ctx) {
      // 优先从路径参数获取 customer_id，其次从查询参数获取
      const customerIdFromParams = ctx.params.customer_id
      const customerIdFromQuery = ctx.request.query.customer_id
      const customerId = customerIdFromParams || customerIdFromQuery

      // 如果有 customer_id，获取单个客户详情
      if (customerId) {
        const { customer: customerService } = app.service
        const customerItem = await customerService.getCustomer(customerId)

        // 格式化时间
        customerItem.create_time = moment(customerItem.create_time).format('YYYY-MM-DD HH:mm:ss')
        // 格式化最后登录时间
        if (customerItem.last_login_time) {
          customerItem.last_login_time = moment(customerItem.last_login_time).format('YYYY-MM-DD HH:mm:ss')
        }

        this.success(ctx, customerItem)
        return
      }

      // 否则获取客户列表
      const {
        username,
        nickname,
        email,
        phone,
        sex,
        create_time_start: createTimeStart,
        create_time_end: createTimeEnd,
        page,
        pageSize
      } = ctx.request.query

      const { customer: customerService } = app.service

      // 1. 并行查询列表数据和总数（优化性能）
      const jobs = []
      jobs.push(customerService.getCustomerList({
        username,
        nickname,
        email,
        phone,
        sex: sex ? Number(sex) : undefined,
        createTimeStart,
        createTimeEnd,
        page: Number(page),
        pageSize: Number(pageSize)
      }))
      jobs.push(customerService.getCustomerListTotal({
        username,
        nickname,
        email,
        phone,
        sex: sex ? Number(sex) : undefined,
        createTimeStart,
        createTimeEnd
      }))

      const res = await Promise.all(jobs)

      // 2. 处理空数据情况
      if (res[0].length === 0 || !res[0]) {
        this.success(ctx, [], { total: 0 })
        return
      }

      // 3. 格式化展示数据
      const customerList = res[0]
      customerList.forEach(item => {
        // 性别转换为文本
        if (item.sex === 1) {
          item.sex = '男'
        } else if (item.sex === 2) {
          item.sex = '女'
        } else {
          item.sex = '其他'
        }
        // 格式化时间
        item.create_time = moment(item.create_time).format('YYYY-MM-DD HH:mm:ss')
        // 格式化最后登录时间
        if (item.last_login_time) {
          item.last_login_time = moment(item.last_login_time).format('YYYY-MM-DD HH:mm:ss')
        }
      })
      const total = res[1]

      this.success(ctx, customerList, { total })
    }

    /**
     * 获取客户列表（分页）
     *
     * 该方法用于 GET /api/proj/customer/list 路由
     * 实际逻辑已合并到 getCustomer() 方法中
     *
     * @param {Object} ctx - Koa 上下文对象
     * @returns {Promise<void>}
     */
    async getCustomerList(ctx) {
      // 直接调用 getCustomer 方法处理
      await this.getCustomer(ctx)
    }
  }
}
