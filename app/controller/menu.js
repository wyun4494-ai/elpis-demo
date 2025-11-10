/**
 * 菜单管理 Controller
 */
module.exports = (app) => {
  return class MenuController {
    constructor() {
      this.app = app
    }

    /**
     * 获取所有菜单列表
     * 从项目配置中读取菜单信息
     *
     * @param {Object} ctx - Koa 上下文对象
     * @returns {Promise<void>}
     */
    async list(ctx) {
      try {
        // 从 project service 获取 model 列表
        const { project: projectService } = app.service
        const modelList = await projectService.getModelList()
        const menuList = []

        // 遍历所有 model 项
        if (Array.isArray(modelList)) {
          modelList.forEach(modelItem => {
            if (!modelItem.project) return

            // 遍历每个 model 下的所有项目
            for (const projKey in modelItem.project) {
              const projectConfig = modelItem.project[projKey]
              if (!projectConfig.menu) continue

              // 添加菜单项
              projectConfig.menu.forEach(menu => {
                menuList.push({
                  id: `${projKey}_${menu.key}`,
                  project_key: projKey,
                  project_name: projectConfig.name,
                  menu_key: menu.key,
                  menu_name: menu.name
                })
              })
            }
          })
        }

        this.success(ctx, menuList)
      } catch (error) {
        app.logger.error('获取菜单列表失败', error)
        this.fail(ctx, error.message || '获取菜单列表失败', 400)
      }
    }

    /**
     * 成功响应
     */
    success(ctx, data, metadata = {}) {
      ctx.body = {
        success: true,
        code: 200,
        data,
        metadata
      }
    }

    /**
     * 失败响应
     */
    fail(ctx, message, code = 400) {
      ctx.body = {
        success: false,
        code,
        message
      }
    }
  }
}

