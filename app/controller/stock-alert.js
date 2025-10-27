module.exports = (app) => {
  const BaseController = require('@lesheng/elpis').Controller.Base(app);
  
  return class StockAlertController extends BaseController {

    /**
     * 获取库存预警列表
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
     * 获取预警日志列表
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
     */
    async handleAlert(ctx) {
      const { log_id: logId, handle_note: handleNote } = ctx.request.body;
      const { stockAlert: stockAlertService } = app.service;
      
      const userId = ctx.userId || 'system';

      await stockAlertService.handleAlert(logId, userId, handleNote);

      this.success(ctx, {
        message: '处理成功'
      });
    }

    /**
     * 批量处理预警
     */
    async batchHandleAlert(ctx) {
      const { log_ids: logIds, handle_note: handleNote } = ctx.request.body;
      const { stockAlert: stockAlertService } = app.service;
      
      const userId = ctx.userId || 'system';

      await stockAlertService.batchHandleAlert(logIds, userId, handleNote);

      this.success(ctx, {
        message: '批量处理成功'
      });
    }

    /**
     * 获取预警统计
     */
    async getStatistics(ctx) {
      const { stockAlert: stockAlertService } = app.service;

      const stats = await stockAlertService.getAlertStatistics();

      this.success(ctx, stats);
    }

    /**
     * 库存补货
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

