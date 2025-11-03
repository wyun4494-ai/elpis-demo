module.exports = (app) => {
  const BaseController = require('@lesheng/elpis').Controller.Base(app);

  return class CategoryParamController extends BaseController {

    /**
     * 获取分类参数关联列表（分页）
     *
     * @param {Object} ctx - Koa 上下文对象
     * @param {Object} ctx.query - 查询参数
     * @param {string} [ctx.query.param_name] - 参数名称（模糊查询）
     * @param {string} [ctx.query.category_id] - 分类ID
     * @param {string} [ctx.query.sort_field] - 排序字段（sort_order）
     * @param {string} [ctx.query.sort_order] - 排序方向（asc/desc）
     * @param {number} [ctx.query.page=1] - 页码
     * @param {number} [ctx.query.pageSize=10] - 每页数量
     * @returns {Promise<void>}
     */
    async getCategoryParamList(ctx) {
      const params = ctx.query;
      const { categoryParam: categoryParamService } = app.service;
      const result = await categoryParamService.getCategoryParamList(params);
      this.success(ctx, result.list, {
        total: result.total,
        page: result.page,
        pageSize: result.pageSize
      });
    }

    async get(ctx) {
      const { id } = ctx.query;
      const { categoryParam: categoryParamService } = app.service;
      const param = await categoryParamService.getCategoryParam(id);
      
      if (!param) {
        this.fail(ctx, '参数配置不存在', 404);
        return;
      }
      
      this.success(ctx, param);
    }

    async addFromLibrary(ctx) {
      const params = ctx.request.body;
      const { categoryParam: categoryParamService } = app.service;
      await categoryParamService.addParamFromLibrary(params);
      this.success(ctx, { message: '添加成功' });
    }

    async createNewParam(ctx) {
      const params = ctx.request.body;
      const { categoryParam: categoryParamService } = app.service;
      const paramId = await categoryParamService.createNewParam(params);
      this.success(ctx, { param_id: paramId });
    }

    async update(ctx) {
      const params = ctx.request.body;
      const { categoryParam: categoryParamService } = app.service;
      await categoryParamService.updateCategoryParam(params);
      this.success(ctx, { message: '更新成功' });
    }

    async remove(ctx) {
      const { id } = ctx.request.body;
      const { categoryParam: categoryParamService } = app.service;
      await categoryParamService.deleteCategoryParam(id);
      this.success(ctx, { message: '删除成功' });
    }
  };
};

