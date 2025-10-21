module.exports = (app) => {
  const moment = require('moment')
  const baseController = require('@lesheng/elpis').Controller.Base(app)
  return class userController extends baseController {

    async deleteUser(ctx) {
      const {
        user_id: userId
      } = ctx.request.body

      const { user: userService } = app.service
      await userService.deleteUser(userId)

      this.success(ctx, {
        message: '删除成功',
        user_id: userId
      })
      
    }

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

    async getUser(ctx) {
      const { user_id: userId } = ctx.request.query

      const { user: userService } = app.service
      const userItem = await userService.getUser(userId)

      userItem.create_time = moment(userItem.create_time).format('YYYY-MM-DD HH:mm:ss')

      this.success(ctx, userItem)
    }

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

      const jobs = []
      // 获取数据列表
      jobs.push(userService.getUserList({
        username,
        nickname,
        sex: Number(sex),
        createTimeStart,
        createTimeEnd,
        page: Number(page),
        pageSize: Number(pageSize),
      }))
      // 获取总数
      jobs.push(userService.getUserListTotal({
        username,
        nickname,
        sex,
        createTimeStart,
        createTimeEnd,
      }))

      const res = await Promise.all(jobs)

      if(res[0].length === 0 || !res[0]) {
        this.success(ctx, [], { total: 0 })
        return
      }

      // 展示的数据处理
      const userList = res[0]
      userList.forEach(item => {
        item.sex = item.sex === 1 ? '男' : '女'
        item.create_time = moment(item.create_time).format('YYYY-MM-DD HH:mm:ss')
      })
      const total = res[1]

      this.success(ctx, userList, { total })
    }
  }
}