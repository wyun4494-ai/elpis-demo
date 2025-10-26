module.exports = (app) => {
  const BaseController = require('@lesheng/elpis').Controller.Base(app);
  
  return class AttributeController extends BaseController {

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

    async create(ctx) {
      const params = ctx.request.body;
      const { attribute: attributeService } = app.service;
      const attrId = await attributeService.createAttribute(params);
      this.success(ctx, { attr_id: attrId });
    }

    async update(ctx) {
      const params = ctx.request.body;
      const { attribute: attributeService } = app.service;
      await attributeService.updateAttribute(params);
      this.success(ctx, { message: '更新成功' });
    }

    async remove(ctx) {
      const { attr_id: attrId } = ctx.request.body;
      const { attribute: attributeService } = app.service;
      await attributeService.deleteAttribute(attrId);
      this.success(ctx, { message: '删除成功' });
    }
  };
};

