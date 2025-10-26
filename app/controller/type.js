module.exports = (app) => {
  const BaseController = require('@lesheng/elpis').Controller.Base(app);
  
  return class TypeController extends BaseController {

    /**
     * 获取商品类型列表
     */
    async getTypeList(ctx) {
      const params = ctx.query;
      const { type: typeService } = app.service;

      const result = await typeService.getTypeList(params);

      this.success(ctx, result.list, {
        total: result.total,
        page: result.page,
        pageSize: result.pageSize
      });
    }

    /**
     * 获取商品类型详情
     */
    async get(ctx) {
      const { type_id: typeId } = ctx.query;
      const { type: typeService } = app.service;

      const typeItem = await typeService.getType(typeId);

      if (!typeItem) {
        this.fail(ctx, '商品类型不存在', 404);
        return;
      }

      this.success(ctx, typeItem);
    }

    /**
     * 根据分类获取类型
     */
    async getTypeByCategoryId(ctx) {
      const { category_id: categoryId } = ctx.query;
      const { type: typeService } = app.service;

      const typeItem = await typeService.getTypeByCategoryId(categoryId);

      this.success(ctx, typeItem);
    }

    /**
     * 创建商品类型
     */
    async create(ctx) {
      const params = ctx.request.body;
      const { type: typeService } = app.service;

      const typeId = await typeService.createType(params);

      this.success(ctx, {
        message: '创建成功',
        type_id: typeId
      });
    }

    /**
     * 更新商品类型
     */
    async update(ctx) {
      const params = ctx.request.body;
      const { type: typeService } = app.service;

      await typeService.updateType(params);

      this.success(ctx, {
        message: '更新成功'
      });
    }

    /**
     * 删除商品类型配置
     */
    async remove(ctx) {
      const { category_id: categoryId } = ctx.request.body;
      const { type: typeService } = app.service;

      await typeService.deleteType(categoryId);

      this.success(ctx, {
        message: '删除成功'
      });
    }

    /**
     * 保存分类的属性配置
     */
    async saveAttributes(ctx) {
      const { category_id: categoryId, attributes } = ctx.request.body;
      const { type: typeService } = app.service;

      await typeService.saveAttributes(categoryId, attributes);

      this.success(ctx, {
        message: '保存成功'
      });
    }

    /**
     * 保存分类的参数配置
     */
    async saveParams(ctx) {
      const { category_id: categoryId, params } = ctx.request.body;
      const { type: typeService } = app.service;

      await typeService.saveParams(categoryId, params);

      this.success(ctx, {
        message: '保存成功'
      });
    }

    /**
     * 获取参数库列表
     */
    async getParamLibraryList(ctx) {
      const params = ctx.query;
      const { type: typeService } = app.service;

      const result = await typeService.getParamLibraryList(params);

      this.success(ctx, result.list, {
        total: result.total,
        page: result.page,
        pageSize: result.pageSize
      });
    }
  };
};

