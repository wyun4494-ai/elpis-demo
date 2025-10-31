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
     * @param {Object} ctx.request.body - 请求体参数
     * @param {string} ctx.request.body.user_id - 用户ID
     * @returns {Promise<void>}
     */
    async deleteUser(ctx) {
      const { user_id: userId } = ctx.request.body

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
     * @param {Object} ctx.request.body - 请求体参数
     * @param {string} ctx.request.body.user_id - 用户ID
     * @param {string} [ctx.request.body.nickname] - 昵称
     * @param {string} [ctx.request.body.desc] - 描述
     * @param {number} [ctx.request.body.sex] - 性别（1-男，2-女）
     * @returns {Promise<void>}
     */
    async updateUser(ctx) {
      const {
        user_id: userId,
        nickname,
        desc,
        sex
      } = ctx.request.body

      const { user: userService } = app.service
      await userService.updateUser(userId, {
        nickname,
        desc,
        sex
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
     * @param {string} ctx.request.body.username - 用户名
     * @param {string} ctx.request.body.nickname - 昵称
     * @param {number} ctx.request.body.sex - 性别（1-男，2-女）
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
     * 获取用户详情
     *
     * @param {Object} ctx - Koa 上下文对象
     * @param {Object} ctx.request.query - 查询参数
     * @param {string} ctx.request.query.user_id - 用户ID
     * @returns {Promise<void>}
     */
    async getUser(ctx) {
      const { user_id: userId } = ctx.request.query

      const { user: userService } = app.service
      const userItem = await userService.getUser(userId)

      // 格式化时间
      userItem.create_time = moment(userItem.create_time).format('YYYY-MM-DD HH:mm:ss')

      this.success(ctx, userItem)
    }

    /**
     * 获取用户列表（分页）
     *
     * @param {Object} ctx - Koa 上下文对象
     * @param {Object} ctx.request.query - 查询参数
     * @param {string} [ctx.request.query.username] - 用户名（模糊查询）
     * @param {string} [ctx.request.query.nickname] - 昵称（模糊查询）
     * @param {number} [ctx.request.query.sex] - 性别（1-男，2-女）
     * @param {string} [ctx.request.query.create_time_start] - 创建时间开始
     * @param {string} [ctx.request.query.create_time_end] - 创建时间结束
     * @param {number} [ctx.request.query.page=1] - 页码
     * @param {number} [ctx.request.query.pageSize=10] - 每页数量
     * @returns {Promise<void>}
     */
    async getUserList(ctx) {
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
  }
}