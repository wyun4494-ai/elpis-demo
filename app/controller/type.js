/**
 * 商品类型控制器
 * 处理商品类型相关的 HTTP 请求（CRUD、属性配置、参数配置）
 *
 * 业务说明：
 * - 商品类型 = 末级分类（has_children=0）
 * - 每个类型可配置属性（用于生成 SKU 规格）和参数（用于商品详情信息）
 *
 * @class TypeController
 * @extends BaseController
 */
module.exports = (app) => {
  const BaseController = require('@lesheng/elpis').Controller.Base(app);

  return class TypeController extends BaseController {

    /**
     * 获取商品类型列表（分页）
     *
     * @param {Object} ctx - Koa 上下文对象
     * @param {Object} ctx.query - 查询参数
     * @param {string} [ctx.query.category_name] - 分类名称（模糊查询）
     * @param {number} [ctx.query.page=1] - 页码
     * @param {number} [ctx.query.pageSize=10] - 每页数量
     * @returns {Promise<void>}
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
     *
     * @param {Object} ctx - Koa 上下文对象
     * @param {Object} ctx.query - 查询参数
     * @param {string} ctx.query.type_id - 类型ID
     * @returns {Promise<void>}
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
     * 根据分类ID获取类型配置
     *
     * @param {Object} ctx - Koa 上下文对象
     * @param {Object} ctx.query - 查询参数
     * @param {string} ctx.query.category_id - 分类ID
     * @returns {Promise<void>}
     */
    async getTypeByCategoryId(ctx) {
      const { category_id: categoryId } = ctx.query;
      const { type: typeService } = app.service;

      const typeItem = await typeService.getTypeByCategoryId(categoryId);

      this.success(ctx, typeItem);
    }

    /**
     * 创建商品类型
     *
     * @param {Object} ctx - Koa 上下文对象
     * @param {Object} ctx.request.body - 请求体参数
     * @param {string} ctx.request.body.category_id - 分类ID（必须是末级分类）
     * @returns {Promise<void>}
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
     *
     * @param {Object} ctx - Koa 上下文对象
     * @param {Object} ctx.request.body - 请求体参数
     * @param {string} ctx.request.body.type_id - 类型ID
     * @returns {Promise<void>}
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
     *
     * @param {Object} ctx - Koa 上下文对象
     * @param {Object} ctx.request.body - 请求体参数
     * @param {string} ctx.request.body.category_id - 分类ID
     * @returns {Promise<void>}
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
     *
     * 业务说明：
     * - 属性用于生成 SKU 规格（如颜色、内存、尺寸等）
     * - 支持预定义值和自定义值
     *
     * @param {Object} ctx - Koa 上下文对象
     * @param {Object} ctx.request.body - 请求体参数
     * @param {string} ctx.request.body.category_id - 分类ID
     * @param {Array} ctx.request.body.attributes - 属性配置列表
     * @param {string} ctx.request.body.attributes[].attr_name - 属性名称
     * @param {Array} ctx.request.body.attributes[].predefined_values - 预定义值列表
     * @param {number} ctx.request.body.attributes[].allow_custom - 是否允许自定义
     * @param {number} ctx.request.body.attributes[].is_required - 是否必填
     * @returns {Promise<void>}
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
     *
     * 业务说明：
     * - 参数用于商品详情信息（如品牌、型号、产地等）
     * - 从参数库（t_product_param_library）中选择关联
     *
     * @param {Object} ctx - Koa 上下文对象
     * @param {Object} ctx.request.body - 请求体参数
     * @param {string} ctx.request.body.category_id - 分类ID
     * @param {Array} ctx.request.body.params - 参数配置列表
     * @param {string} ctx.request.body.params[].param_id - 参数ID
     * @returns {Promise<void>}
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
     * 获取参数库列表（分页）
     *
     * @param {Object} ctx - Koa 上下文对象
     * @param {Object} ctx.query - 查询参数
     * @param {string} [ctx.query.param_name] - 参数名称（模糊查询）
     * @param {string} [ctx.query.param_category] - 参数分类（基本/服装/数码/家电/通用）
     * @param {number} [ctx.query.page=1] - 页码
     * @param {number} [ctx.query.pageSize=10] - 每页数量
     * @returns {Promise<void>}
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

