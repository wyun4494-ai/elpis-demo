/**
 * 商品审核控制器
 * 处理商品审核相关的 HTTP 请求
 *
 * @class ProductAuditController
 * @extends BaseController
 */
module.exports = (app) => {
  const BaseController = require('@lesheng/elpis').Controller.Base(app);

  return class ProductAuditController extends BaseController {

    /**
     * 获取审核列表
     *
     * @param {Object} ctx - Koa 上下文对象
     * @param {Object} ctx.query - 查询参数
     * @returns {Promise<void>}
     */
    async getAuditList(ctx) {
      const params = ctx.query;
      const { productAudit: productAuditService } = app.service;

      try {
        const result = await productAuditService.getAuditList(params);
        this.success(ctx, result.list, {
          total: result.total,
          page: result.page,
          pageSize: result.pageSize
        });
      } catch (error) {
        app.logger.error('获取审核列表失败', error);
        this.fail(ctx, error.message, 500);
      }
    }

    /**
     * 获取商品审核详情
     *
     * @param {Object} ctx - Koa 上下文对象
     * @param {Object} ctx.query - 查询参数
     * @param {string} ctx.query.product_id - 商品ID
     * @returns {Promise<void>}
     */
    async getAuditDetail(ctx) {
      const { product_id: productId } = ctx.query;
      const { productAudit: productAuditService } = app.service;

      try {
        const product = await productAuditService.getAuditDetail(productId);
        this.success(ctx, product);
      } catch (error) {
        app.logger.error('获取审核详情失败', error);
        this.fail(ctx, error.message, 500);
      }
    }

    /**
     * 执行审核操作
     *
     * @param {Object} ctx - Koa 上下文对象
     * @param {Object} ctx.request.body - 请求体参数
     * @param {string} ctx.request.body.product_id - 商品ID
     * @param {number} ctx.request.body.audit_status - 审核结果（1-审核通过，2-审核不通过）
     * @param {string} [ctx.request.body.audit_reason] - 审核意见/不通过原因
     * @returns {Promise<void>}
     */
    async auditProduct(ctx) {
      const { 
        product_id: productId, 
        audit_status: auditStatus, 
        audit_reason: auditReason 
      } = ctx.request.body;

      const { productAudit: productAuditService } = app.service;

      // 获取当前用户ID和姓名（从JWT Token中解析）
      const auditorId = ctx.userId || 'system';
      const auditorName = ctx.userName || '系统管理员';

      try {
        const result = await productAuditService.auditProduct(
          productId, 
          auditStatus, 
          auditReason, 
          auditorId, 
          auditorName
        );
        this.success(ctx, result);
      } catch (error) {
        app.logger.error('审核操作失败', error);
        this.fail(ctx, error.message, 500);
      }
    }

    /**
     * 获取商品的审核历史记录
     *
     * @param {Object} ctx - Koa 上下文对象
     * @param {Object} ctx.query - 查询参数
     * @param {string} ctx.query.product_id - 商品ID
     * @returns {Promise<void>}
     */
    async getAuditHistory(ctx) {
      const { product_id: productId } = ctx.query;
      const { productAudit: productAuditService } = app.service;

      try {
        const history = await productAuditService.getAuditHistory(productId);
        this.success(ctx, history);
      } catch (error) {
        app.logger.error('获取审核历史失败', error);
        this.fail(ctx, error.message, 500);
      }
    }
  };
};

