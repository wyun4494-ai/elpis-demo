/**
 * 库存预警控制器
 * 处理库存预警相关的 HTTP 请求（预警列表、预警日志、预警处理、补货等）
 *
 * 预警级别说明：
 * - 0-正常：库存 ≥ 预警值
 * - 1-警告：预警值 > 库存 > 预警值×50%
 * - 2-严重：库存 ≤ 预警值×50%
 * - 3-缺货：库存 = 0
 *
 * @class StockAlertController
 * @extends BaseController
 */
module.exports = (app) => {
  const BaseController = require('@lesheng/elpis').Controller.Base(app);

  return class StockAlertController extends BaseController {

    /**
     * 获取库存预警列表（分页）
     *
     * @param {Object} ctx - Koa 上下文对象
     * @param {Object} ctx.query - 查询参数
     * @param {string} [ctx.query.product_name] - 商品名称（模糊查询）
     * @param {string} [ctx.query.sku_name] - SKU名称（模糊查询）
     * @param {number} [ctx.query.alert_level] - 预警级别（0-正常，1-警告，2-严重，3-缺货）
     * @param {number} [ctx.query.page=1] - 页码
     * @param {number} [ctx.query.pageSize=10] - 每页数量
     * @returns {Promise<void>}
     */
    async getAlertList(ctx) {
      const params = ctx.query;
      const { stockAlert: stockAlertService } = app.service;

      const result = await stockAlertService.getAlertList(params);

      this.success(ctx, result.list, {
        total: result.total,
        page: result.page,
        pageSize: result.pageSize
      });
    }

    /**
     * 获取预警日志列表（分页）
     *
     * @param {Object} ctx - Koa 上下文对象
     * @param {Object} ctx.query - 查询参数
     * @param {string} [ctx.query.product_name] - 商品名称（模糊查询）
     * @param {number} [ctx.query.alert_level] - 预警级别
     * @param {number} [ctx.query.is_handled] - 是否已处理（0-未处理，1-已处理）
     * @param {string} [ctx.query.alert_time_start] - 预警时间开始
     * @param {string} [ctx.query.alert_time_end] - 预警时间结束
     * @param {number} [ctx.query.page=1] - 页码
     * @param {number} [ctx.query.pageSize=10] - 每页数量
     * @returns {Promise<void>}
     */
    async getAlertLogList(ctx) {
      const params = ctx.query;
      const { stockAlert: stockAlertService } = app.service;

      const result = await stockAlertService.getAlertLogList(params);

      this.success(ctx, result.list, {
        total: result.total,
        page: result.page,
        pageSize: result.pageSize
      });
    }

    /**
     * 处理预警
     *
     * @param {Object} ctx - Koa 上下文对象
     * @param {Object} ctx.request.body - 请求体参数
     * @param {string} ctx.request.body.log_id - 预警日志ID
     * @param {string} [ctx.request.body.handle_note] - 处理备注
     * @returns {Promise<void>}
     */
    async handleAlert(ctx) {
      const { log_id: logId, handle_note: handleNote } = ctx.request.body;
      const { stockAlert: stockAlertService } = app.service;

      // 获取当前用户ID（从 Token 中解析或默认为 system）
      const userId = ctx.userId || 'system';

      await stockAlertService.handleAlert(logId, userId, handleNote);

      this.success(ctx, {
        message: '处理成功'
      });
    }

    /**
     * 批量处理预警
     *
     * @param {Object} ctx - Koa 上下文对象
     * @param {Object} ctx.request.body - 请求体参数
     * @param {Array<string>} ctx.request.body.log_ids - 预警日志ID列表
     * @param {string} [ctx.request.body.handle_note] - 处理备注
     * @returns {Promise<void>}
     */
    async batchHandleAlert(ctx) {
      const { log_ids: logIds, handle_note: handleNote } = ctx.request.body;
      const { stockAlert: stockAlertService } = app.service;

      // 获取当前用户ID（从 Token 中解析或默认为 system）
      const userId = ctx.userId || 'system';

      await stockAlertService.batchHandleAlert(logIds, userId, handleNote);

      this.success(ctx, {
        message: '批量处理成功'
      });
    }

    /**
     * 获取预警统计
     *
     * @param {Object} ctx - Koa 上下文对象
     * @returns {Promise<void>}
     * @returns {Object} 返回预警统计数据
     * @returns {number} returns.total - 总预警数
     * @returns {number} returns.warning - 警告数
     * @returns {number} returns.severe - 严重数
     * @returns {number} returns.outOfStock - 缺货数
     * @returns {number} returns.unhandled - 未处理数
     */
    async getStatistics(ctx) {
      const { stockAlert: stockAlertService } = app.service;

      const stats = await stockAlertService.getAlertStatistics();

      this.success(ctx, stats);
    }

    /**
     * 库存补货
     *
     * @param {Object} ctx - Koa 上下文对象
     * @param {Object} ctx.request.body - 请求体参数
     * @param {string} ctx.request.body.sku_id - SKU ID
     * @param {number} ctx.request.body.restock_quantity - 补货数量
     * @param {string} [ctx.request.body.restock_note] - 补货备注
     * @returns {Promise<void>}
     */
    async restock(ctx) {
      const params = ctx.request.body;
      const { stockAlert: stockAlertService } = app.service;

      const result = await stockAlertService.restock(params);

      this.success(ctx, {
        message: '补货成功',
        ...result
      });
    }
  };
};

