/**
 * 角色管理服务
 * 处理角色相关的业务逻辑和数据库操作
 *
 * @class RoleService
 * @extends BaseService
 */
module.exports = (app) => {
  const BaseService = require('@lesheng/elpis').Service.Base(app)
  const { v4: uuidv4 } = require('uuid')
  const moment = require('moment')

  return class RoleService extends BaseService {
    /**
     * 获取角色列表（分页）
     * 包含用户数量统计
     *
     * @param {Object} params - 查询参数
     * @param {number} [params.page=1] - 页码
     * @param {number} [params.pageSize=10] - 每页数量
     * @param {string} [params.role_name] - 角色名称（模糊查询）
     * @returns {Promise<Object>} 返回角色列表和分页信息
     */
    async getRoleList(params) {
      const { page = 1, pageSize = 10, role_name } = params
      const offset = (page - 1) * pageSize

      let query = app.database('t_role').where('status', 1)

      if (role_name) {
        query = query.where('role_name', 'like', `%${role_name}%`)
      }

      // 查询总数
      const countQuery = app.database('t_role').where('status', 1)
      if (role_name) {
        countQuery.where('role_name', 'like', `%${role_name}%`)
      }
      const total = await countQuery.count('* as count').first()

      // 查询列表
      const list = await query
        .select('*')
        .orderBy('role_id', 'asc')
        .limit(pageSize)
        .offset(offset)

      // 为每个角色添加用户数量
      for (const role of list) {
        const userCount = await app.database('t_user')
          .where('role_id', role.role_id)
          .where('status', 1)
          .count('* as count')
          .first()
        role.user_count = userCount.count || 0
      }

      return {
        list,
        total: total.count,
        page: parseInt(page),
        pageSize: parseInt(pageSize)
      }
    }

    /**
     * 根据 role_id 获取角色详情
     *
     * @param {number} roleId - 角色ID
     * @returns {Promise<Object>} 返回角色详情
     */
    async getRoleById(roleId) {
      const role = await app.database('t_role')
        .where('role_id', roleId)
        .where('status', 1)
        .first()

      return role
    }

    /**
     * 创建角色
     *
     * @param {Object} data - 角色数据
     * @param {string} data.role_name - 角色名称
     * @param {string} [data.role_code] - 角色代码（可选，如果不提供则自动生成）
     * @param {string} [data.role_desc] - 角色描述
     * @returns {Promise<Object>} 返回创建的角色
     */
    async createRole(data) {
      let { role_name, role_code, role_desc } = data

      // 如果没有提供 role_code，则自动生成
      if (!role_code) {
        // 生成规则：将角色名称转换为大写，替换空格为下划线
        role_code = role_name
          .toUpperCase()
          .replace(/\s+/g, '_')
          .replace(/[^A-Z0-9_]/g, '')
      }

      // 检查角色代码是否已存在
      const existingRole = await app.database('t_role')
        .where('role_code', role_code)
        .first()

      if (existingRole) {
        throw new Error(`角色代码 ${role_code} 已存在`)
      }

      const roleData = {
        role_name,
        role_code,
        role_desc: role_desc || '',
        status: 1,
        create_time: moment().format('YYYY-MM-DD HH:mm:ss')
      }

      const result = await app.database('t_role').insert(roleData)
      const roleId = result[0]

      return this.getRoleById(roleId)
    }

    /**
     * 更新角色
     *
     * @param {number} roleId - 角色ID
     * @param {Object} data - 更新数据
     * @returns {Promise<Object>} 返回更新后的角色
     */
    async updateRole(roleId, data) {
      const { role_name, role_desc, status } = data

      const updateData = {}
      if (role_name !== undefined) updateData.role_name = role_name
      if (role_desc !== undefined) updateData.role_desc = role_desc
      if (status !== undefined) updateData.status = status
      updateData.update_time = moment().format('YYYY-MM-DD HH:mm:ss')

      await app.database('t_role')
        .where('role_id', roleId)
        .update(updateData)

      return this.getRoleById(roleId)
    }

    /**
     * 删除角色（硬删除）
     * 删除前检查是否有用户使用此角色
     *
     * @param {number} roleId - 角色ID
     * @returns {Promise<void>}
     */
    async deleteRole(roleId) {
      // 检查是否有用户使用此角色
      const userCount = await app.database('t_user')
        .where('role_id', roleId)
        .where('status', 1)
        .count('* as count')
        .first()

      if (userCount.count > 0) {
        throw new Error('该角色下有用户，无法删除')
      }

      // 硬删除：从 t_role 表中删除
      await app.database('t_role')
        .where('role_id', roleId)
        .delete()

      // 级联删除：删除 t_role_menu 中的权限记录
      await app.database('t_role_menu')
        .where('role_id', roleId)
        .delete()
    }

    /**
     * 获取角色的菜单权限列表
     *
     * @param {number} roleId - 角色ID
     * @returns {Promise<Array>} 返回菜单权限列表
     */
    async getRoleMenuList(roleId) {
      const menuList = await app.database('t_role_menu')
        .where('role_id', roleId)
        .select('menu_key', 'project_key')
        .orderBy('project_key', 'asc')
        .orderBy('menu_key', 'asc')

      return menuList
    }

    /**
     * 更新角色的菜单权限
     *
     * @param {number} roleId - 角色ID
     * @param {Array} menuList - 菜单权限列表 [{ menu_key, project_key }, ...]
     * @returns {Promise<void>}
     */
    async updateRoleMenu(roleId, menuList) {
      // 删除旧的权限
      await app.database('t_role_menu')
        .where('role_id', roleId)
        .delete()

      // 插入新的权限
      if (menuList && menuList.length > 0) {
        const insertData = menuList.map(item => ({
          role_id: roleId,
          menu_key: item.menu_key,
          project_key: item.project_key,
          create_time: moment().format('YYYY-MM-DD HH:mm:ss')
        }))

        await app.database('t_role_menu').insert(insertData)
      }
    }

    /**
     * 获取用户的菜单权限列表
     *
     * @param {number} userId - 用户ID
     * @returns {Promise<Array>} 返回用户有权限的菜单列表
     */
    async getUserMenuList(userId) {
      // 1. 获取用户的角色ID
      const user = await app.database('t_user')
        .where('user_id', userId)
        .where('status', 1)
        .first()

      if (!user) {
        return []
      }

      // 2. 获取角色的菜单权限
      const menuList = await app.database('t_role_menu')
        .where('role_id', user.role_id)
        .select('menu_key', 'project_key')

      return menuList
    }

    /**
     * 检查用户是否有权限访问菜单
     *
     * @param {number} userId - 用户ID
     * @param {string} menuKey - 菜单标识
     * @param {string} projectKey - 项目标识
     * @returns {Promise<boolean>} 返回是否有权限
     */
    async hasMenuPermission(userId, menuKey, projectKey) {
      const user = await app.database('t_user')
        .where('user_id', userId)
        .where('status', 1)
        .first()

      if (!user) {
        return false
      }

      const permission = await app.database('t_role_menu')
        .where('role_id', user.role_id)
        .where('menu_key', menuKey)
        .where('project_key', projectKey)
        .first()

      return !!permission
    }

    /**
     * 检查用户是否有权限访问项目
     * 只要用户在该项目中有任何菜单权限，就认为有权限访问该项目
     *
     * @param {number} userId - 用户ID
     * @param {string} projectKey - 项目标识
     * @returns {Promise<boolean>} 返回是否有权限
     */
    async hasProjectPermission(userId, projectKey) {
      const user = await app.database('t_user')
        .where('user_id', userId)
        .where('status', 1)
        .first()

      if (!user) {
        return false
      }

      const permission = await app.database('t_role_menu')
        .where('role_id', user.role_id)
        .where('project_key', projectKey)
        .first()

      return !!permission
    }

    /**
     * 获取用户有权限访问的所有项目
     *
     * @param {number} userId - 用户ID
     * @returns {Promise<Array>} 返回项目标识列表
     */
    async getUserProjectList(userId) {
      const user = await app.database('t_user')
        .where('user_id', userId)
        .where('status', 1)
        .first()

      if (!user) {
        return []
      }

      const projects = await app.database('t_role_menu')
        .where('role_id', user.role_id)
        .distinct('project_key')
        .select('project_key')

      return projects.map(item => item.project_key)
    }
  }
}

