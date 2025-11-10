/**
 * 用户管理控制器
 * 处理用户相关的 HTTP 请求（CRUD）
 *
 * @class UserController
 * @extends BaseController
 */
module.exports = (app) => {
  const moment = require('moment')
  const baseController = require('@lesheng/elpis').Controller.Base(app)

  return class UserController extends baseController {

    /**
     * 删除用户（软删除）
     *
     * @param {Object} ctx - Koa 上下文对象
     * @param {Object} ctx.params - 路径参数
     * @param {string} ctx.params.user_id - 用户ID
     * @returns {Promise<void>}
     */
    async deleteUser(ctx) {
      const { user_id: userId } = ctx.params

      const { user: userService } = app.service
      await userService.deleteUser(userId)

      this.success(ctx, {
        message: '删除成功',
        user_id: userId
      })
    }

    /**
     * 更新用户信息
     *
     * @param {Object} ctx - Koa 上下文对象
     * @param {Object} ctx.params - 路径参数
     * @param {string} ctx.params.user_id - 用户ID
     * @param {Object} ctx.request.body - 请求体参数
     * @param {string} [ctx.request.body.nickname] - 昵称
     * @param {string} [ctx.request.body.desc] - 描述
     * @param {number} [ctx.request.body.sex] - 性别（1-男，2-女）
     * @param {number} [ctx.request.body.role_id] - 角色ID
     * @returns {Promise<void>}
     */
    async updateUser(ctx) {
      const { user_id: userId } = ctx.params
      const {
        nickname,
        desc,
        sex,
        role_id: roleId
      } = ctx.request.body

      const { user: userService } = app.service
      await userService.updateUser(userId, {
        nickname,
        desc,
        sex,
        role_id: roleId
      })

      this.success(ctx, {
        message: '更新成功',
        user_id: userId
      })
    }

    /**
     * 创建用户
     *
     * @param {Object} ctx - Koa 上下文对象
     * @param {Object} ctx.request.body - 请求体参数
     * @param {string} ctx.request.body.username - 用户名（必填）
     * @param {string} [ctx.request.body.nickname] - 昵称
     * @param {number} [ctx.request.body.sex] - 性别（1-男，2-女）
     * @param {string} [ctx.request.body.desc] - 描述
     * @returns {Promise<void>}
     */
    async createUser(ctx) {
      const {
        username,
        nickname,
        sex,
        desc
      } = ctx.request.body

      const { user: userService } = app.service
      const userId = await userService.createUser({
        username,
        nickname,
        sex,
        desc
      })

      this.success(ctx, {
        message: '创建成功',
        user_id: userId
      })
    }

    /**
     * 获取用户详情或用户列表
     *
     * 支持两种调用方式：
     * 1. 获取用户详情：GET /api/proj/user/:user_id（路径参数）或 GET /api/proj/user?user_id=xxx（查询参数）
     * 2. 获取用户列表：GET /api/proj/user/list 或 GET /api/proj/user?page=1&pageSize=10（查询参数）
     *
     * @param {Object} ctx - Koa 上下文对象
     * @param {Object} ctx.params - 路径参数
     * @param {string} [ctx.params.user_id] - 用户ID（路径参数）
     * @param {Object} ctx.request.query - 查询参数
     * @param {string} [ctx.request.query.user_id] - 用户ID（查询参数）
     * @param {string} [ctx.request.query.page] - 页码（用于获取列表）
     * @param {string} [ctx.request.query.pageSize] - 每页数量（用于获取列表）
     * @returns {Promise<void>}
     */
    async getUser(ctx) {
      // 优先从路径参数获取 user_id，其次从查询参数获取
      const userIdFromParams = ctx.params.user_id
      const userIdFromQuery = ctx.request.query.user_id
      const userId = userIdFromParams || userIdFromQuery

      // 如果有 user_id，获取单个用户详情
      if (userId) {
        const { user: userService } = app.service
        const userItem = await userService.getUser(userId)

        // 格式化时间
        userItem.create_time = moment(userItem.create_time).format('YYYY-MM-DD HH:mm:ss')

        this.success(ctx, userItem)
        return
      }

      // 否则获取用户列表
      const {
        username,
        nickname,
        sex,
        create_time_start: createTimeStart,
        create_time_end: createTimeEnd,
        page,
        pageSize
      } = ctx.request.query

      const { user: userService } = app.service

      // 1. 并行查询列表数据和总数（优化性能）
      const jobs = []
      jobs.push(userService.getUserList({
        username,
        nickname,
        sex: Number(sex),
        createTimeStart,
        createTimeEnd,
        page: Number(page),
        pageSize: Number(pageSize),
      }))
      jobs.push(userService.getUserListTotal({
        username,
        nickname,
        sex,
        createTimeStart,
        createTimeEnd,
      }))

      const res = await Promise.all(jobs)

      // 2. 处理空数据情况
      if (res[0].length === 0 || !res[0]) {
        this.success(ctx, [], { total: 0 })
        return
      }

      // 3. 格式化展示数据
      const userList = res[0]
      userList.forEach(item => {
        // 性别转换为文本
        item.sex = item.sex === 1 ? '男' : '女'
        // 格式化时间
        item.create_time = moment(item.create_time).format('YYYY-MM-DD HH:mm:ss')
      })
      const total = res[1]

      this.success(ctx, userList, { total })
    }

    /**
     * 获取用户列表（分页）
     *
     * 该方法用于 GET /api/proj/user/list 路由
     * 实际逻辑已合并到 getUser() 方法中
     *
     * @param {Object} ctx - Koa 上下文对象
     * @returns {Promise<void>}
     */
    async getUserList(ctx) {
      // 直接调用 getUser 方法处理
      await this.getUser(ctx)
    }
  }
}