/**
 * 商品分类控制器
 * 处理商品分类相关的 HTTP 请求（CRUD、树形结构管理等）
 *
 * @class CategoryController
 * @extends BaseController
 */
module.exports = (app) => {
  const BaseController = require('@lesheng/elpis').Controller.Base(app);

  return class CategoryController extends BaseController {

    /**
     * 获取分类列表（分页）
     *
     * @param {Object} ctx - Koa 上下文对象
     * @param {Object} ctx.query - 查询参数
     * @param {string} [ctx.query.category_name] - 分类名称（模糊查询）
     * @param {string} [ctx.query.parent_id] - 父级分类ID
     * @param {number} [ctx.query.level] - 分类层级（1-4）
     * @param {number} [ctx.query.status] - 状态（1-正常，0-已删除）
     * @param {number} [ctx.query.page=1] - 页码
     * @param {number} [ctx.query.pageSize=10] - 每页数量
     * @returns {Promise<void>}
     */
    async getCategoryList(ctx) {
      const params = ctx.query;
      const { category: categoryService } = app.service;

      try {
        const result = await categoryService.getCategoryList(params);
        this.success(ctx, result.list, {
          total: result.total,
          page: result.page,
          pageSize: result.pageSize
        });
      } catch (error) {
        this.fail(ctx, error.message, 500);
      }
    }

    /**
     * 获取分类详情
     *
     * @param {Object} ctx - Koa 上下文对象
     * @param {Object} ctx.query - 查询参数
     * @param {string} ctx.query.category_id - 分类ID
     * @returns {Promise<void>}
     */
    async getCategory(ctx) {
      const { category_id } = ctx.query;
      const { category: categoryService } = app.service;

      try {
        const category = await categoryService.getCategory(category_id);
        if (!category) {
          this.fail(ctx, '分类不存在', 404);
          return;
        }
        this.success(ctx, category);
      } catch (error) {
        this.fail(ctx, error.message, 500);
      }
    }

    /**
     * 创建分类
     *
     * @param {Object} ctx - Koa 上下文对象
     * @param {Object} ctx.request.body - 请求体参数
     * @param {string} ctx.request.body.category_name - 分类名称
     * @param {string} [ctx.request.body.parent_id] - 父级分类ID（为空表示一级分类）
     * @param {number} [ctx.request.body.sort_order=0] - 排序值
     * @returns {Promise<void>}
     */
    async create(ctx) {
      const params = ctx.request.body;
      const { category: categoryService } = app.service;

      try {
        const categoryId = await categoryService.createCategory(params);
        this.success(ctx, { category_id: categoryId });
      } catch (error) {
        this.fail(ctx, error.message, 500);
      }
    }

    /**
     * 更新分类
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
      const { category: categoryService } = app.service;

      try {
        await categoryService.updateCategory(params);
        this.success(ctx, { success: true });
      } catch (error) {
        this.fail(ctx, error.message, 500);
      }
    }

    /**
     * 删除分类（软删除）
     *
     * @param {Object} ctx - Koa 上下文对象
     * @param {Object} ctx.request.body - 请求体参数
     * @param {string} ctx.request.body.category_id - 分类ID
     * @returns {Promise<void>}
     */
    async remove(ctx) {
      const { category_id } = ctx.request.body;
      const { category: categoryService } = app.service;
      
      try {
        await categoryService.deleteCategory(category_id);
        this.success(ctx, { success: true });
      } catch (error) {
        this.fail(ctx, error.message, 500);
      }
    }

    /**
     * 获取子分类列表（用于级联选择器）
     */
    async getCategoryChildren(ctx) {
      const { parent_id, level } = ctx.query;
      const { category: categoryService } = app.service;
      
      try {
        const children = await categoryService.getCategoryChildren(parent_id, level);
        this.success(ctx, children);
      } catch (error) {
        this.fail(ctx, error.message, 500);
      }
    }

    /**
     * 获取分类路径（用于级联选择器回显）
     */
    async getCategoryPath(ctx) {
      const { category_id } = ctx.query;
      const { category: categoryService } = app.service;
      
      try {
        const path = await categoryService.getCategoryPath(category_id);
        this.success(ctx, path);
      } catch (error) {
        this.fail(ctx, error.message, 500);
      }
    }
  };
};

