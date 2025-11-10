/**
 * 角色管理控制器
 * 处理角色相关的 HTTP 请求
 *
 * @class RoleController
 * @extends BaseController
 */
module.exports = (app) => {
  const BaseController = require('@lesheng/elpis').Controller.Base(app)

  return class RoleController extends BaseController {
    /**
     * 获取角色列表（分页）
     *
     * @param {Object} ctx - Koa 上下文对象
     * @returns {Promise<void>}
     */
    async list(ctx) {
      const params = ctx.query
      const { role: roleService } = app.service

      try {
        const result = await roleService.getRoleList(params)
        this.success(ctx, result.list, {
          total: result.total,
          page: result.page,
          pageSize: result.pageSize
        })
      } catch (error) {
        app.logger.error('获取角色列表失败', error)
        this.fail(ctx, error.message || '获取角色列表失败', 400)
      }
    }

    /**
     * 获取角色详情
     *
     * @param {Object} ctx - Koa 上下文对象
     * @returns {Promise<void>}
     */
    async detail(ctx) {
      const { role_id: roleId } = ctx.params
      const { role: roleService } = app.service

      try {
        const role = await roleService.getRoleById(roleId)

        if (!role) {
          this.fail(ctx, '角色不存在', 404)
          return
        }

        this.success(ctx, role)
      } catch (error) {
        app.logger.error('获取角色详情失败', error)
        this.fail(ctx, error.message || '获取角色详情失败', 400)
      }
    }

    /**
     * 创建角色
     *
     * @param {Object} ctx - Koa 上下文对象
     * @returns {Promise<void>}
     */
    async create(ctx) {
      const data = ctx.request.body
      const { role: roleService } = app.service

      try {
        const role = await roleService.createRole(data)
        this.success(ctx, role)
      } catch (error) {
        app.logger.error('创建角色失败', error)
        this.fail(ctx, error.message || '创建角色失败', 400)
      }
    }

    /**
     * 更新角色
     *
     * @param {Object} ctx - Koa 上下文对象
     * @returns {Promise<void>}
     */
    async update(ctx) {
      const { role_id: roleId } = ctx.params
      const data = ctx.request.body
      const { role: roleService } = app.service

      try {
        const role = await roleService.updateRole(roleId, data)
        this.success(ctx, role)
      } catch (error) {
        app.logger.error('更新角色失败', error)
        this.fail(ctx, error.message || '更新角色失败', 400)
      }
    }

    /**
     * 更新角色状态（Switch 开关）
     *
     * @param {Object} ctx - Koa 上下文对象
     * @returns {Promise<void>}
     */
    async updateStatus(ctx) {
      const data = ctx.request.body
      const { role_id: roleId, status } = data
      const { role: roleService } = app.service

      if (!roleId || status === undefined) {
        this.fail(ctx, '角色ID和状态不能为空', 400)
        return
      }

      try {
        const role = await roleService.updateRole(roleId, { status })
        this.success(ctx, role)
      } catch (error) {
        app.logger.error('更新角色状态失败', error)
        this.fail(ctx, error.message || '更新角色状态失败', 400)
      }
    }

    /**
     * 删除角色
     *
     * @param {Object} ctx - Koa 上下文对象
     * @returns {Promise<void>}
     */
    async delete(ctx) {
      const { role_id: roleId } = ctx.params
      const { role: roleService } = app.service

      try {
        await roleService.deleteRole(roleId)
        this.success(ctx, { message: '删除成功' })
      } catch (error) {
        app.logger.error('删除角色失败', error)
        this.fail(ctx, error.message || '删除角色失败', 400)
      }
    }

    /**
     * 获取角色的菜单权限列表
     *
     * @param {Object} ctx - Koa 上下文对象
     * @returns {Promise<void>}
     */
    async getMenuList(ctx) {
      const { role_id: roleId } = ctx.params
      const { role: roleService } = app.service

      try {
        const menuList = await roleService.getRoleMenuList(roleId)
        this.success(ctx, menuList)
      } catch (error) {
        app.logger.error('获取角色菜单权限失败', error)
        this.fail(ctx, error.message || '获取角色菜单权限失败', 400)
      }
    }

    /**
     * 更新角色的菜单权限
     *
     * @param {Object} ctx - Koa 上下文对象
     * @returns {Promise<void>}
     */
    async updateMenuList(ctx) {
      const { role_id: roleId } = ctx.params
      const { menu_list: menuList } = ctx.request.body
      const { role: roleService } = app.service

      try {
        await roleService.updateRoleMenu(roleId, menuList)
        this.success(ctx, { message: '更新成功' })
      } catch (error) {
        app.logger.error('更新角色菜单权限失败', error)
        this.fail(ctx, error.message || '更新角色菜单权限失败', 400)
      }
    }

    /**
     * 获取当前用户的菜单权限列表
     *
     * @param {Object} ctx - Koa 上下文对象
     * @returns {Promise<void>}
     */
    async getUserMenuList(ctx) {
      const userId = ctx.userId
      const { role: roleService } = app.service

      try {
        const menuList = await roleService.getUserMenuList(userId)
        this.success(ctx, menuList)
      } catch (error) {
        app.logger.error('获取用户菜单权限失败', error)
        this.fail(ctx, error.message || '获取用户菜单权限失败', 400)
      }
    }

    /**
     * 获取当前用户有权限访问的项目列表
     *
     * @param {Object} ctx - Koa 上下文对象
     * @returns {Promise<void>}
     */
    async getUserProjectList(ctx) {
      const userId = ctx.userId
      const { role: roleService } = app.service

      try {
        const projectList = await roleService.getUserProjectList(userId)
        this.success(ctx, projectList)
      } catch (error) {
        app.logger.error('获取用户项目权限失败', error)
        this.fail(ctx, error.message || '获取用户项目权限失败', 400)
      }
    }

    /**
     * 检查用户是否有权限访问项目
     *
     * @param {Object} ctx - Koa 上下文对象
     * @returns {Promise<void>}
     */
    async checkProjectPermission(ctx) {
      const userId = ctx.userId
      const { project_key: projectKey } = ctx.query
      const { role: roleService } = app.service

      if (!projectKey) {
        this.fail(ctx, '项目标识不能为空', 400)
        return
      }

      try {
        const hasPermission = await roleService.hasProjectPermission(userId, projectKey)
        this.success(ctx, { has_permission: hasPermission })
      } catch (error) {
        app.logger.error('检查项目权限失败', error)
        this.fail(ctx, error.message || '检查项目权限失败', 400)
      }
    }
  }
}

