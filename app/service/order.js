/**
 * 订单管理服务
 * 处理订单相关的业务逻辑和数据库操作
 *
 * @class OrderService
 */
module.exports = (app) => {
  const moment = require('moment');

  return class OrderService {

    /**
     * 订单状态映射
     */
    getOrderStatusText(status) {
      const statusMap = {
        0: '待支付',
        1: '待发货',
        2: '待收货',
        3: '已完成',
        4: '已取消',
        5: '退款中',
        6: '已退款'
      };
      return statusMap[status] || '未知';
    }

    /**
     * 支付状态映射
     */
    getPayStatusText(status) {
      const statusMap = {
        0: '未支付',
        1: '已支付',
        2: '已退款'
      };
      return statusMap[status] || '未知';
    }

    /**
     * 发货状态映射
     */
    getDeliveryStatusText(status) {
      const statusMap = {
        0: '未发货',
        1: '已发货',
        2: '已收货'
      };
      return statusMap[status] || '未知';
    }

    /**
     * 格式化时间
     */
    formatDateTime(datetime) {
      if (!datetime) return '';
      return moment(datetime).format('YYYY-MM-DD HH:mm:ss');
    }

    /**
     * 转换订单数据（添加中文状态字段）
     */
    transformOrderData(order) {
      if (!order) return order;
      
      return {
        ...order,
        order_status_text: this.getOrderStatusText(order.order_status),
        pay_status_text: this.getPayStatusText(order.pay_status),
        delivery_status_text: this.getDeliveryStatusText(order.delivery_status)
      };
    }

    /**
     * 获取订单列表（分页）
     *
     * @param {Object} params - 查询参数
     * @param {string} [params.order_no] - 订单号（精确查询）
     * @param {string} [params.customer_name] - 用户姓名（模糊查询）
     * @param {number} [params.order_status] - 订单状态
     * @param {number} [params.pay_status] - 支付状态
     * @param {string} [params.order_time_start] - 下单时间开始
     * @param {string} [params.order_time_end] - 下单时间结束
     * @param {string} [params.sort_field] - 排序字段
     * @param {string} [params.sort_order] - 排序方向（asc/desc）
     * @param {number} [params.page=1] - 页码
     * @param {number} [params.pageSize=10] - 每页数量
     * @returns {Promise<Object>} 返回订单列表和分页信息
     */
    async getOrderList(params) {
      const {
        order_no: orderNo,
        customer_name: customerName,
        order_status: orderStatus,
        pay_status: payStatus,
        order_time_start: orderTimeStart,
        order_time_end: orderTimeEnd,
        sort_field: sortField,
        sort_order: sortOrder,
        page = 1,
        pageSize = 10
      } = params;

      const offset = (parseInt(page) - 1) * parseInt(pageSize);

      // 1. 构建查询条件
      let query = app.database('t_order').where('deleted', 0);

      // 2. 订单号筛选（精确查询）
      if (orderNo) {
        query = query.where('order_no', orderNo);
      }

      // 3. 用户姓名筛选（模糊查询）
      if (customerName) {
        query = query.where('customer_name', 'like', `%${customerName}%`);
      }

      // 4. 订单状态筛选
      if (orderStatus !== undefined && orderStatus !== null && orderStatus !== '' && orderStatus !== 'all') {
        query = query.where('order_status', parseInt(orderStatus));
      }

      // 5. 支付状态筛选
      if (payStatus !== undefined && payStatus !== null && payStatus !== '' && payStatus !== 'all') {
        query = query.where('pay_status', parseInt(payStatus));
      }

      // 6. 下单时间范围筛选
      if (orderTimeStart) {
        query = query.where('order_time', '>=', orderTimeStart);
      }
      if (orderTimeEnd) {
        query = query.where('order_time', '<=', orderTimeEnd);
      }

      // 7. 排序处理
      const allowedSortFields = ['order_time', 'pay_amount', 'total_amount', 'order_status'];
      let orderByField = 'order_time';
      let orderByDirection = 'desc';

      if (sortField && allowedSortFields.includes(sortField)) {
        orderByField = sortField;
        orderByDirection = sortOrder === 'asc' ? 'asc' : 'desc';
      }

      // 8. 查询总数
      const countQuery = query.clone();
      const totalResult = await countQuery.count('* as count').first();
      const total = totalResult ? totalResult.count : 0;

      // 9. 查询列表数据
      const list = await query
        .orderBy(orderByField, orderByDirection)
        .limit(parseInt(pageSize))
        .offset(offset)
        .select('*');

      // 10. 查询每个订单的商品数量并转换状态
      for (const order of list) {
        const itemCount = await app.database('t_order_item')
          .where('order_id', order.order_id)
          .where('deleted', 0)
          .count('* as count')
          .first();
        
        order.item_count = itemCount ? itemCount.count : 0;

        // 获取第一个商品信息用于展示
        const firstItem = await app.database('t_order_item')
          .where('order_id', order.order_id)
          .where('deleted', 0)
          .first();
        
        if (firstItem) {
          order.first_product_name = firstItem.product_name;
          order.first_product_image = firstItem.product_image;
        }

        // 添加中文状态字段
        order.order_status_text = this.getOrderStatusText(order.order_status);
        order.pay_status_text = this.getPayStatusText(order.pay_status);
        order.delivery_status_text = this.getDeliveryStatusText(order.delivery_status);

        // 格式化时间字段
        if (order.order_time) {
          order.order_time = this.formatDateTime(order.order_time);
        }
        if (order.pay_time) {
          order.pay_time = this.formatDateTime(order.pay_time);
        }
        if (order.delivery_time) {
          order.delivery_time = this.formatDateTime(order.delivery_time);
        }
        if (order.receive_time) {
          order.receive_time = this.formatDateTime(order.receive_time);
        }
        if (order.finish_time) {
          order.finish_time = this.formatDateTime(order.finish_time);
        }
        if (order.cancel_time) {
          order.cancel_time = this.formatDateTime(order.cancel_time);
        }
      }

      return {
        list,
        total,
        page: parseInt(page),
        pageSize: parseInt(pageSize)
      };
    }

    /**
     * 获取订单详情
     *
     * @param {string} orderId - 订单ID
     * @returns {Promise<Object>} 返回订单详情
     */
    async getOrderDetail(orderId) {
      // 1. 查询订单基本信息
      const order = await app.database('t_order')
        .where('order_id', orderId)
        .where('deleted', 0)
        .first();

      if (!order) {
        throw new Error('订单不存在');
      }

      // 2. 查询订单商品列表
      const items = await app.database('t_order_item')
        .where('order_id', orderId)
        .where('deleted', 0)
        .select('*');

      order.items = items;

      // 3. 查询物流信息
      const logistics = await app.database('t_order_logistics')
        .where('order_id', orderId)
        .where('deleted', 0)
        .first();

      order.logistics = logistics || null;

      // 4. 查询状态流转记录
      const statusLogs = await app.database('t_order_status_log')
        .where('order_id', orderId)
        .orderBy('create_time', 'desc')
        .select('*');

      order.status_logs = statusLogs;

      // 5. 添加中文状态字段
      order.order_status_text = this.getOrderStatusText(order.order_status);
      order.pay_status_text = this.getPayStatusText(order.pay_status);
      order.delivery_status_text = this.getDeliveryStatusText(order.delivery_status);

      // 6. 格式化时间字段
      if (order.order_time) {
        order.order_time = this.formatDateTime(order.order_time);
      }
      if (order.pay_time) {
        order.pay_time = this.formatDateTime(order.pay_time);
      }
      if (order.delivery_time) {
        order.delivery_time = this.formatDateTime(order.delivery_time);
      }
      if (order.receive_time) {
        order.receive_time = this.formatDateTime(order.receive_time);
      }
      if (order.finish_time) {
        order.finish_time = this.formatDateTime(order.finish_time);
      }
      if (order.cancel_time) {
        order.cancel_time = this.formatDateTime(order.cancel_time);
      }

      return order;
    }

    /**
     * 更新订单信息
     *
     * @param {string} orderId - 订单ID
     * @param {Object} data - 更新数据
     * @returns {Promise<boolean>} 返回是否更新成功
     */
    async updateOrder(orderId, data) {
      const updateObj = {};

      // 允许更新的字段
      const allowedFields = [
        'seller_remark',
        'receiver_name',
        'receiver_phone',
        'receiver_province',
        'receiver_city',
        'receiver_district',
        'receiver_address',
        'receiver_postcode'
      ];

      allowedFields.forEach(field => {
        if (data[field] !== undefined) {
          updateObj[field] = data[field];
        }
      });

      if (Object.keys(updateObj).length === 0) {
        return false;
      }

      const result = await app.database('t_order')
        .where('order_id', orderId)
        .where('deleted', 0)
        .update(updateObj);

      return result > 0;
    }

    /**
     * 取消订单
     *
     * @param {string} orderId - 订单ID
     * @param {string} cancelReason - 取消原因
     * @param {string} operatorId - 操作人ID
     * @param {string} operatorName - 操作人姓名
     * @returns {Promise<boolean>} 返回是否取消成功
     */
    async cancelOrder(orderId, cancelReason, operatorId, operatorName) {
      // 1. 查询订单信息
      const order = await app.database('t_order')
        .where('order_id', orderId)
        .where('deleted', 0)
        .first();

      if (!order) {
        throw new Error('订单不存在');
      }

      // 2. 验证订单状态（只有待支付的订单可以取消）
      if (order.order_status !== 0) {
        throw new Error('只有待支付的订单可以取消');
      }

      // 3. 更新订单状态
      await app.database('t_order')
        .where('order_id', orderId)
        .update({
          order_status: 4, // 已取消
          cancel_reason: cancelReason,
          cancel_time: app.database.fn.now()
        });

      // 4. 记录状态流转日志
      await this.addStatusLog({
        order_id: orderId,
        order_no: order.order_no,
        status_from: order.order_status,
        status_to: 4,
        status_name: '已取消',
        operator_type: 2, // 管理员
        operator_id: operatorId,
        operator_name: operatorName,
        remark: cancelReason
      });

      return true;
    }

    /**
     * 发货
     *
     * @param {string} orderId - 订单ID
     * @param {Object} logisticsData - 物流信息
     * @param {string} operatorId - 操作人ID
     * @param {string} operatorName - 操作人姓名
     * @returns {Promise<boolean>} 返回是否发货成功
     */
    async deliverOrder(orderId, logisticsData, operatorId, operatorName) {
      // 1. 查询订单信息
      const order = await app.database('t_order')
        .where('order_id', orderId)
        .where('deleted', 0)
        .first();

      if (!order) {
        throw new Error('订单不存在');
      }

      // 2. 验证订单状态（只有待发货的订单可以发货）
      if (order.order_status !== 1) {
        throw new Error('只有待发货的订单可以发货');
      }

      // 3. 生成物流ID
      const logisticsId = this.generateId();

      // 4. 创建物流记录
      await app.database('t_order_logistics').insert({
        logistics_id: logisticsId,
        order_id: orderId,
        order_no: order.order_no,
        logistics_company: logisticsData.logistics_company,
        logistics_no: logisticsData.logistics_no,
        logistics_status: 1, // 运输中
        sender_name: logisticsData.sender_name,
        sender_phone: logisticsData.sender_phone,
        sender_address: logisticsData.sender_address,
        send_time: app.database.fn.now(),
        last_update_time: app.database.fn.now()
      });

      // 5. 更新订单状态
      await app.database('t_order')
        .where('order_id', orderId)
        .update({
          order_status: 2, // 待收货
          delivery_status: 1, // 已发货
          delivery_time: app.database.fn.now()
        });

      // 6. 记录状态流转日志
      await this.addStatusLog({
        order_id: orderId,
        order_no: order.order_no,
        status_from: order.order_status,
        status_to: 2,
        status_name: '待收货',
        operator_type: 2, // 管理员
        operator_id: operatorId,
        operator_name: operatorName,
        remark: `已发货，物流公司：${logisticsData.logistics_company}，运单号：${logisticsData.logistics_no}`
      });

      return true;
    }

    /**
     * 确认收货
     *
     * @param {string} orderId - 订单ID
     * @param {string} operatorId - 操作人ID
     * @param {string} operatorName - 操作人姓名
     * @returns {Promise<boolean>} 返回是否确认成功
     */
    async confirmReceive(orderId, operatorId, operatorName) {
      // 1. 查询订单信息
      const order = await app.database('t_order')
        .where('order_id', orderId)
        .where('deleted', 0)
        .first();

      if (!order) {
        throw new Error('订单不存在');
      }

      // 2. 验证订单状态（只有待收货的订单可以确认收货）
      if (order.order_status !== 2) {
        throw new Error('只有待收货的订单可以确认收货');
      }

      // 3. 更新订单状态
      await app.database('t_order')
        .where('order_id', orderId)
        .update({
          order_status: 3, // 已完成
          delivery_status: 2, // 已收货
          receive_time: app.database.fn.now(),
          finish_time: app.database.fn.now()
        });

      // 4. 更新物流状态
      await app.database('t_order_logistics')
        .where('order_id', orderId)
        .update({
          logistics_status: 3, // 已签收
          receive_time: app.database.fn.now()
        });

      // 5. 记录状态流转日志
      await this.addStatusLog({
        order_id: orderId,
        order_no: order.order_no,
        status_from: order.order_status,
        status_to: 3,
        status_name: '已完成',
        operator_type: 1, // 用户
        operator_id: operatorId,
        operator_name: operatorName,
        remark: '用户已确认收货'
      });

      return true;
    }

    /**
     * 删除订单（软删除）
     *
     * @param {string} orderId - 订单ID
     * @returns {Promise<boolean>} 返回是否删除成功
     */
    async deleteOrder(orderId) {
      // 1. 查询订单信息
      const order = await app.database('t_order')
        .where('order_id', orderId)
        .where('deleted', 0)
        .first();

      if (!order) {
        throw new Error('订单不存在');
      }

      // 2. 验证订单状态（只有已取消或已完成的订单可以删除）
      if (order.order_status !== 3 && order.order_status !== 4) {
        throw new Error('只有已完成或已取消的订单可以删除');
      }

      // 3. 软删除订单
      await app.database('t_order')
        .where('order_id', orderId)
        .update({ deleted: 1 });

      // 4. 软删除订单商品
      await app.database('t_order_item')
        .where('order_id', orderId)
        .update({ deleted: 1 });

      return true;
    }

    /**
     * 添加状态流转日志
     *
     * @param {Object} logData - 日志数据
     * @returns {Promise<boolean>} 返回是否添加成功
     */
    async addStatusLog(logData) {
      const logId = this.generateId();

      await app.database('t_order_status_log').insert({
        log_id: logId,
        order_id: logData.order_id,
        order_no: logData.order_no,
        status_from: logData.status_from,
        status_to: logData.status_to,
        status_name: logData.status_name,
        operator_type: logData.operator_type,
        operator_id: logData.operator_id,
        operator_name: logData.operator_name,
        remark: logData.remark
      });

      return true;
    }

    /**
     * 批量取消订单
     *
     * @param {Array} orderIds - 订单ID数组
     * @param {string} cancelReason - 取消原因
     * @param {string} operatorId - 操作人ID
     * @param {string} operatorName - 操作人姓名
     * @returns {Promise<Object>} 返回成功和失败的数量
     */
    async batchCancelOrder(orderIds, cancelReason, operatorId, operatorName) {
      let successCount = 0;
      let failCount = 0;
      const errors = [];

      for (const orderId of orderIds) {
        try {
          await this.cancelOrder(orderId, cancelReason, operatorId, operatorName);
          successCount++;
        } catch (error) {
          failCount++;
          errors.push({ orderId, error: error.message });
        }
      }

      return {
        successCount,
        failCount,
        errors
      };
    }

    /**
     * 批量删除订单
     *
     * @param {Array} orderIds - 订单ID数组
     * @returns {Promise<Object>} 返回成功和失败的数量
     */
    async batchDeleteOrder(orderIds) {
      let successCount = 0;
      let failCount = 0;
      const errors = [];

      for (const orderId of orderIds) {
        try {
          await this.deleteOrder(orderId);
          successCount++;
        } catch (error) {
          failCount++;
          errors.push({ orderId, error: error.message });
        }
      }

      return {
        successCount,
        failCount,
        errors
      };
    }

    /**
     * 导出订单数据
     *
     * @param {Object} params - 查询参数
     * @returns {Promise<Array>} 返回订单列表
     */
    async exportOrders(params) {
      // 获取所有符合条件的订单（不分页）
      const {
        order_no: orderNo,
        customer_name: customerName,
        order_status: orderStatus,
        pay_status: payStatus,
        order_time_start: orderTimeStart,
        order_time_end: orderTimeEnd
      } = params;

      let query = app.database('t_order').where('deleted', 0);

      if (orderNo) {
        query = query.where('order_no', orderNo);
      }

      if (customerName) {
        query = query.where('customer_name', 'like', `%${customerName}%`);
      }

      if (orderStatus !== undefined && orderStatus !== null && orderStatus !== '' && orderStatus !== 'all') {
        query = query.where('order_status', parseInt(orderStatus));
      }

      if (payStatus !== undefined && payStatus !== null && payStatus !== '' && payStatus !== 'all') {
        query = query.where('pay_status', parseInt(payStatus));
      }

      if (orderTimeStart) {
        query = query.where('order_time', '>=', orderTimeStart);
      }
      if (orderTimeEnd) {
        query = query.where('order_time', '<=', orderTimeEnd);
      }

      const list = await query
        .orderBy('order_time', 'desc')
        .select('*');

      // 添加中文状态字段
      for (const order of list) {
        order.order_status_text = this.getOrderStatusText(order.order_status);
        order.pay_status_text = this.getPayStatusText(order.pay_status);
        order.delivery_status_text = this.getDeliveryStatusText(order.delivery_status);

        // 格式化时间字段
        if (order.order_time) {
          order.order_time = this.formatDateTime(order.order_time);
        }
        if (order.pay_time) {
          order.pay_time = this.formatDateTime(order.pay_time);
        }
      }

      return list;
    }

    /**
     * 生成唯一ID（雪花ID）
     *
     * @returns {string} 返回生成的ID
     */
    generateId() {
      return Date.now().toString() + Math.random().toString(36).substr(2, 9);
    }
  };
};
