module.exports = (app) => {
  const BaseController = require('@lesheng/elpis').Controller.Base(app);

  return class CategoryController extends BaseController {

    /**
     * 获取分类列表
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
     * 删除分类
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

