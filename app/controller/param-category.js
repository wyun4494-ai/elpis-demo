/**
 * 参数分类控制器
 * 处理参数分类和参数库管理相关的 HTTP 请求（CRUD、查看参数等）
 *
 * @class ParamCategoryController
 * @extends BaseController
 */
module.exports = (app) => {
  const BaseController = require('@lesheng/elpis').Controller.Base(app);

  return class ParamCategoryController extends BaseController {

    /**
     * 获取参数分类列表（分页）
     *
     * @param {Object} ctx - Koa 上下文对象
     * @param {Object} ctx.query - 查询参数
     * @param {string} [ctx.query.category_name] - 分类名称（模糊查询）
     * @param {number} [ctx.query.page=1] - 页码
     * @param {number} [ctx.query.pageSize=10] - 每页数量
     * @returns {Promise<void>}
     */
    async getParamCategoryList(ctx) {
      const params = ctx.query;
      const { paramCategory: paramCategoryService } = app.service;

      try {
        const result = await paramCategoryService.getParamCategoryList(params);
        this.success(ctx, result.list, {
          total: result.total,
          page: result.page,
          pageSize: result.pageSize
        });
      } catch (error) {
        app.logger.error('获取参数分类列表失败', error);
        this.fail(ctx, error.message, 500);
      }
    }

    /**
     * 获取参数分类详情（包含该分类下的所有参数）
     *
     * @param {Object} ctx - Koa 上下文对象
     * @param {Object} ctx.query - 查询参数
     * @param {string} ctx.query.category_id - 参数分类ID
     * @returns {Promise<void>}
     */
    async getParamCategory(ctx) {
      const { category_id } = ctx.query;
      const { paramCategory: paramCategoryService } = app.service;

      try {
        const category = await paramCategoryService.getParamCategory(category_id);
        if (!category) {
          this.fail(ctx, '参数分类不存在', 404);
          return;
        }
        this.success(ctx, category);
      } catch (error) {
        app.logger.error('获取参数分类详情失败', error);
        this.fail(ctx, error.message, 500);
      }
    }

    /**
     * 创建参数分类
     *
     * @param {Object} ctx - Koa 上下文对象
     * @param {Object} ctx.request.body - 请求体参数
     * @param {string} ctx.request.body.category_name - 分类名称
     * @param {number} [ctx.request.body.sort_order=0] - 排序值
     * @returns {Promise<void>}
     */
    async create(ctx) {
      const params = ctx.request.body;
      const { paramCategory: paramCategoryService } = app.service;

      try {
        const categoryId = await paramCategoryService.createParamCategory(params);
        this.success(ctx, { category_id: categoryId });
      } catch (error) {
        app.logger.error('创建参数分类失败', error);
        this.fail(ctx, error.message, 500);
      }
    }

    /**
     * 更新参数分类
     *
     * @param {Object} ctx - Koa 上下文对象
     * @param {Object} ctx.request.body - 请求体参数
     * @param {string} ctx.request.body.category_id - 分类ID
     * @param {string} [ctx.request.body.category_name] - 分类名称
     * @param {number} [ctx.request.body.sort_order] - 排序值
     * @returns {Promise<void>}
     */
    async update(ctx) {
      const params = ctx.request.body;
      const { paramCategory: paramCategoryService } = app.service;

      try {
        await paramCategoryService.updateParamCategory(params);
        this.success(ctx, { success: true });
      } catch (error) {
        app.logger.error('更新参数分类失败', error);
        this.fail(ctx, error.message, 500);
      }
    }

    /**
     * 删除参数分类
     *
     * @param {Object} ctx - Koa 上下文对象
     * @param {Object} ctx.request.body - 请求体参数
     * @param {string} ctx.request.body.category_id - 分类ID
     * @returns {Promise<void>}
     */
    async remove(ctx) {
      const { category_id } = ctx.request.body;
      const { paramCategory: paramCategoryService } = app.service;

      try {
        await paramCategoryService.deleteParamCategory(category_id);
        this.success(ctx, { success: true });
      } catch (error) {
        app.logger.error('删除参数分类失败', error);
        this.fail(ctx, error.message, 500);
      }
    }

    /**
     * 获取参数分类下拉选项（用于下拉选择）
     *
     * @param {Object} ctx - Koa 上下文对象
     * @returns {Promise<void>}
     */
    async getParamCategoryOptions(ctx) {
      const { paramCategory: paramCategoryService } = app.service;

      try {
        const options = await paramCategoryService.getParamCategoryOptions();
        this.success(ctx, options);
      } catch (error) {
        app.logger.error('获取参数分类选项失败', error);
        this.fail(ctx, error.message, 500);
      }
    }

    /**
     * 批量更新参数分类下的参数
     *
     * @param {Object} ctx - Koa 上下文对象
     * @param {Object} ctx.request.body - 请求体参数
     * @param {string} ctx.request.body.category_id - 分类ID
     * @param {Array} ctx.request.body.params - 参数列表
     * @param {Array} ctx.request.body.deleted_param_ids - 删除的参数ID列表
     * @returns {Promise<void>}
     */
    async updateParams(ctx) {
      const params = ctx.request.body;
      const { paramCategory: paramCategoryService } = app.service;

      try {
        await paramCategoryService.updateParams(params);
        this.success(ctx, { success: true });
      } catch (error) {
        app.logger.error('更新参数失败', error);
        this.fail(ctx, error.message, 500);
      }
    }
  };
};

