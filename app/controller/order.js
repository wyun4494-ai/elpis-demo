/**
 * 订单管理控制器
 * 处理订单相关的 HTTP 请求
 *
 * @class OrderController
 * @extends BaseController
 */
module.exports = (app) => {
  const BaseController = require('@lesheng/elpis').Controller.Base(app);

  return class OrderController extends BaseController {

    /**
     * 获取订单列表
     *
     * @param {Object} ctx - Koa 上下文对象
     * @returns {Promise<void>}
     */
    async getList(ctx) {
      try {
        const params = ctx.query;
        const { order: orderService } = app.service;
        
        const result = await orderService.getOrderList(params);
        
        this.success(ctx, result.list, {
          total: result.total,
          page: result.page,
          pageSize: result.pageSize
        });
      } catch (error) {
        app.logger.error('获取订单列表失败:', error);
        this.error(ctx, error.message || '获取订单列表失败');
      }
    }

    /**
     * 获取订单详情
     *
     * @param {Object} ctx - Koa 上下文对象
     * @returns {Promise<void>}
     */
    async get(ctx) {
      try {
        // 支持两种方式获取订单ID：路径参数（RESTful）或 query 参数
        const orderId = ctx.params.order_id || ctx.query.order_id;
        
        if (!orderId) {
          this.fail(ctx, '订单ID不能为空', 400);
          return;
        }

        const { order: orderService } = app.service;
        const orderDetail = await orderService.getOrderDetail(orderId);
        
        this.success(ctx, orderDetail);
      } catch (error) {
        app.logger.error('获取订单详情失败:', error);
        this.error(ctx, error.message || '获取订单详情失败');
      }
    }

    /**
     * 更新订单信息
     *
     * @param {Object} ctx - Koa 上下文对象
     * @returns {Promise<void>}
     */
    async update(ctx) {
      try {
        // 支持两种方式获取订单ID：路径参数（RESTful）或 query 参数
        const orderId = ctx.params.order_id || ctx.query.order_id;
        const data = ctx.request.body;
        
        if (!orderId) {
          this.fail(ctx, '订单ID不能为空', 400);
          return;
        }

        const { order: orderService } = app.service;
        const result = await orderService.updateOrder(orderId, data);
        
        if (result) {
          this.success(ctx, null, '更新成功');
        } else {
          this.fail(ctx, '更新失败', 400);
        }
      } catch (error) {
        app.logger.error('更新订单失败:', error);
        this.error(ctx, error.message || '更新订单失败');
      }
    }

    /**
     * 取消订单
     *
     * @param {Object} ctx - Koa 上下文对象
     * @returns {Promise<void>}
     */
    async cancel(ctx) {
      try {
        const { order_id: orderId } = ctx.request.body;
        const { cancel_reason: cancelReason } = ctx.request.body;
        
        if (!orderId) {
          this.fail(ctx, '订单ID不能为空', 400);
          return;
        }

        if (!cancelReason) {
          this.fail(ctx, '取消原因不能为空', 400);
          return;
        }

        // 获取当前操作人信息（从 token 中获取）
        const operatorId = ctx.state.user?.user_id || 'admin';
        const operatorName = ctx.state.user?.nickname || '管理员';

        const { order: orderService } = app.service;
        await orderService.cancelOrder(orderId, cancelReason, operatorId, operatorName);
        
        this.success(ctx, null, '订单已取消');
      } catch (error) {
        app.logger.error('取消订单失败:', error);
        this.error(ctx, error.message || '取消订单失败');
      }
    }

    /**
     * 发货
     *
     * @param {Object} ctx - Koa 上下文对象
     * @returns {Promise<void>}
     */
    async deliver(ctx) {
      try {
        const { order_id: orderId, ...logisticsData } = ctx.request.body;
        
        if (!orderId) {
          this.fail(ctx, '订单ID不能为空', 400);
          return;
        }

        if (!logisticsData.logistics_company) {
          this.fail(ctx, '物流公司不能为空', 400);
          return;
        }

        if (!logisticsData.logistics_no) {
          this.fail(ctx, '物流单号不能为空', 400);
          return;
        }

        // 获取当前操作人信息
        const operatorId = ctx.state.user?.user_id || 'admin';
        const operatorName = ctx.state.user?.nickname || '管理员';

        const { order: orderService } = app.service;
        await orderService.deliverOrder(orderId, logisticsData, operatorId, operatorName);
        
        this.success(ctx, null, '发货成功');
      } catch (error) {
        app.logger.error('发货失败:', error);
        this.error(ctx, error.message || '发货失败');
      }
    }

    /**
     * 确认收货
     *
     * @param {Object} ctx - Koa 上下文对象
     * @returns {Promise<void>}
     */
    async confirmReceive(ctx) {
      try {
        const { order_id: orderId } = ctx.request.body;
        
        if (!orderId) {
          this.fail(ctx, '订单ID不能为空', 400);
          return;
        }

        // 获取当前操作人信息
        const operatorId = ctx.state.user?.user_id || 'admin';
        const operatorName = ctx.state.user?.nickname || '管理员';

        const { order: orderService } = app.service;
        await orderService.confirmReceive(orderId, operatorId, operatorName);
        
        this.success(ctx, null, '确认收货成功');
      } catch (error) {
        app.logger.error('确认收货失败:', error);
        this.error(ctx, error.message || '确认收货失败');
      }
    }

    /**
     * 删除订单
     *
     * @param {Object} ctx - Koa 上下文对象
     * @returns {Promise<void>}
     */
    async delete(ctx) {
      try {
        // 支持两种方式获取订单ID：路径参数（RESTful）或 query 参数
        const orderId = ctx.params.order_id || ctx.query.order_id;
        
        if (!orderId) {
          this.fail(ctx, '订单ID不能为空', 400);
          return;
        }

        const { order: orderService } = app.service;
        await orderService.deleteOrder(orderId);
        
        this.success(ctx, null, '删除成功');
      } catch (error) {
        app.logger.error('删除订单失败:', error);
        this.error(ctx, error.message || '删除订单失败');
      }
    }

    /**
     * 批量取消订单
     *
     * @param {Object} ctx - Koa 上下文对象
     * @returns {Promise<void>}
     */
    async batchCancel(ctx) {
      try {
        const { order_ids: orderIds, cancel_reason: cancelReason } = ctx.request.body;
        
        if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
          this.fail(ctx, '订单ID列表不能为空', 400);
          return;
        }

        if (!cancelReason) {
          this.fail(ctx, '取消原因不能为空', 400);
          return;
        }

        // 获取当前操作人信息
        const operatorId = ctx.state.user?.user_id || 'admin';
        const operatorName = ctx.state.user?.nickname || '管理员';

        const { order: orderService } = app.service;
        const result = await orderService.batchCancelOrder(orderIds, cancelReason, operatorId, operatorName);
        
        if (result.failCount > 0) {
          this.success(ctx, result, `批量取消完成，成功 ${result.successCount} 个，失败 ${result.failCount} 个`);
        } else {
          this.success(ctx, result, `批量取消成功，共 ${result.successCount} 个订单`);
        }
      } catch (error) {
        app.logger.error('批量取消订单失败:', error);
        this.error(ctx, error.message || '批量取消订单失败');
      }
    }

    /**
     * 批量删除订单
     *
     * @param {Object} ctx - Koa 上下文对象
     * @returns {Promise<void>}
     */
    async batchDelete(ctx) {
      try {
        const { order_ids: orderIds } = ctx.request.body;
        
        if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
          this.fail(ctx, '订单ID列表不能为空', 400);
          return;
        }

        const { order: orderService } = app.service;
        const result = await orderService.batchDeleteOrder(orderIds);
        
        if (result.failCount > 0) {
          this.success(ctx, result, `批量删除完成，成功 ${result.successCount} 个，失败 ${result.failCount} 个`);
        } else {
          this.success(ctx, result, `批量删除成功，共 ${result.successCount} 个订单`);
        }
      } catch (error) {
        app.logger.error('批量删除订单失败:', error);
        this.error(ctx, error.message || '批量删除订单失败');
      }
    }

    /**
     * 导出订单
     *
     * @param {Object} ctx - Koa 上下文对象
     * @returns {Promise<void>}
     */
    async export(ctx) {
      try {
        const params = ctx.query;
        const { order: orderService } = app.service;
        
        const list = await orderService.exportOrders(params);
        
        // 这里简化处理，直接返回 JSON 数据
        // 实际项目中应该使用 Excel 库生成 Excel 文件
        this.success(ctx, list, '导出成功');
      } catch (error) {
        app.logger.error('导出订单失败:', error);
        this.error(ctx, error.message || '导出订单失败');
      }
    }
  };
};
