/**
 * 商品属性控制器
 * 处理商品属性相关的 HTTP 请求（CRUD）
 *
 * @class AttributeController
 * @extends BaseController
 */
module.exports = (app) => {
  const BaseController = require('@lesheng/elpis').Controller.Base(app);

  return class AttributeController extends BaseController {

    /**
     * 获取属性列表（分页）
     *
     * @param {Object} ctx - Koa 上下文对象
     * @param {Object} ctx.query - 查询参数
     * @param {string} [ctx.query.attr_name] - 属性名称（模糊查询）
     * @param {string} [ctx.query.category_id] - 分类ID
     * @param {string} [ctx.query.sort_field] - 排序字段（sort_order）
     * @param {string} [ctx.query.sort_order] - 排序方向（asc/desc）
     * @param {number} [ctx.query.page=1] - 页码
     * @param {number} [ctx.query.pageSize=10] - 每页数量
     * @returns {Promise<void>}
     */
    async getAttributeList(ctx) {
      const params = ctx.query;
      const { attribute: attributeService } = app.service;
      const result = await attributeService.getAttributeList(params);
      this.success(ctx, result.list, {
        total: result.total,
        page: result.page,
        pageSize: result.pageSize
      });
    }

    /**
     * 获取属性详情
     *
     * @param {Object} ctx - Koa 上下文对象
     * @param {Object} ctx.query - 查询参数
     * @param {string} ctx.query.attr_id - 属性ID
     * @returns {Promise<void>}
     */
    async get(ctx) {
      const { attr_id: attrId } = ctx.query;
      const { attribute: attributeService } = app.service;
      const attr = await attributeService.getAttribute(attrId);

      if (!attr) {
        this.fail(ctx, '属性不存在', 404);
        return;
      }

      this.success(ctx, attr);
    }

    /**
     * 创建属性
     *
     * @param {Object} ctx - Koa 上下文对象
     * @param {Object} ctx.request.body - 请求体参数
     * @param {string} ctx.request.body.attr_name - 属性名称
     * @param {Array} [ctx.request.body.predefined_values] - 预定义值列表
     * @param {number} [ctx.request.body.allow_custom=0] - 是否允许自定义（0-否，1-是）
     * @param {number} [ctx.request.body.is_required=0] - 是否必填（0-否，1-是）
     * @returns {Promise<void>}
     */
    async create(ctx) {
      const params = ctx.request.body;
      const { attribute: attributeService } = app.service;
      const attrId = await attributeService.createAttribute(params);
      this.success(ctx, { attr_id: attrId });
    }

    /**
     * 更新属性
     *
     * @param {Object} ctx - Koa 上下文对象
     * @param {Object} ctx.request.body - 请求体参数
     * @param {string} ctx.request.body.attr_id - 属性ID
     * @param {string} [ctx.request.body.attr_name] - 属性名称
     * @param {Array} [ctx.request.body.predefined_values] - 预定义值列表
     * @param {number} [ctx.request.body.allow_custom] - 是否允许自定义
     * @param {number} [ctx.request.body.is_required] - 是否必填
     * @returns {Promise<void>}
     */
    async update(ctx) {
      const params = ctx.request.body;
      const { attribute: attributeService } = app.service;
      await attributeService.updateAttribute(params);
      this.success(ctx, { message: '更新成功' });
    }

    /**
     * 删除属性（软删除）
     *
     * @param {Object} ctx - Koa 上下文对象
     * @param {Object} ctx.request.body - 请求体参数
     * @param {string} ctx.request.body.attr_id - 属性ID
     * @returns {Promise<void>}
     */
    async remove(ctx) {
      const { attr_id: attrId } = ctx.request.body;
      const { attribute: attributeService } = app.service;
      await attributeService.deleteAttribute(attrId);
      this.success(ctx, { message: '删除成功' });
    }
  };
};

