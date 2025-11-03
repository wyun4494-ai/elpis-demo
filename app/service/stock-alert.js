/**
 * 库存预警服务
 * 处理库存预警相关的业务逻辑和数据库操作
 *
 * 预警级别说明：
 * - 0-正常：库存 ≥ 预警值
 * - 1-警告：预警值 > 库存 > 预警值×50%
 * - 2-严重：库存 ≤ 预警值×50%
 * - 3-缺货：库存 = 0
 *
 * @class StockAlertService
 * @extends BaseService
 */
module.exports = (app) => {
  const BaseService = require('@lesheng/elpis').Service.Base(app);
  const { v4: uuidv4 } = require('uuid');
  const moment = require('moment');

  return class StockAlertService extends BaseService {

    /**
     * 获取库存预警列表（分页）
     *
     * 业务流程：
     * 1. 查询所有 SKU（关联商品表）
     * 2. 计算每个 SKU 的预警级别
     * 3. 过滤掉正常库存的 SKU（level=0）
     * 4. 根据筛选条件过滤（商品名称、预警级别、创建时间范围）
     * 5. 排序（支持动态排序）
     * 6. 内存分页返回结果
     *
     * @param {Object} params - 查询参数
     * @param {string} [params.product_name] - 商品名称（模糊查询）
     * @param {string} [params.category_id] - 分类ID
     * @param {number} [params.alert_level] - 预警级别（1-警告，2-严重，3-缺货）
     * @param {string} [params.start_time] - 创建时间开始（YYYY-MM-DD）
     * @param {string} [params.end_time] - 创建时间结束（YYYY-MM-DD）
     * @param {string} [params.sort_field] - 排序字段（create_time）
     * @param {string} [params.sort_order] - 排序方向（asc/desc）
     * @param {number} [params.page=1] - 页码
     * @param {number} [params.pageSize=50] - 每页数量
     * @returns {Promise<Object>} 返回预警列表和分页信息
     * @returns {Array} returns.list - 预警列表
     * @returns {number} returns.total - 总数
     * @returns {number} returns.page - 当前页码
     * @returns {number} returns.pageSize - 每页数量
     */
    async getAlertList(params) {
      const {
        product_name: productName,
        category_id: categoryId,
        alert_level: alertLevel,
        start_time: startTime,
        end_time: endTime,
        sort_field: sortField,
        sort_order: sortOrder,
        page = 1,
        pageSize = 50
      } = params;

      const offset = (parseInt(page) - 1) * parseInt(pageSize);

      // 1. 查询所有需要预警的 SKU（关联商品表）
      let query = app.database('t_product_sku as sku')
        .leftJoin('t_product as p', 'sku.product_id', 'p.product_id')
        .where('sku.status', 1)
        .where('p.status', 1);

      // 商品名称筛选
      if (productName) {
        query = query.where('p.product_name', 'like', `%${productName}%`);
      }

      // 分类筛选
      if (categoryId) {
        query = query.where('p.category_id', categoryId);
      }

      // 创建时间范围筛选
      if (startTime) {
        query = query.where('sku.create_time', '>=', `${startTime} 00:00:00`);
      }

      if (endTime) {
        query = query.where('sku.create_time', '<=', `${endTime} 23:59:59`);
      }

      // 查询所有 SKU
      const allSkus = await query
        .select(
          'sku.sku_id',
          'sku.product_id',
          'sku.sku_name',
          'sku.inventory',
          'sku.stock_alert',
          'p.product_name',
          'sku.create_time'
        );

      // 2. 计算每个 SKU 的预警级别并过滤
      const alertList = [];

      for (const sku of allSkus) {
        const inventory = parseInt(sku.inventory);
        const stockAlert = parseInt(sku.stock_alert);
        const level = this.calculateAlertLevel(inventory, stockAlert);

        // 根据筛选条件过滤
        if (alertLevel !== undefined && alertLevel !== -999 && level.level !== parseInt(alertLevel)) {
          continue;
        }

        // 只显示有预警的（级别 >= 1）
        if (level.level === 0) {
          continue;
        }

        alertList.push({
          ...sku,
          alert_level: level.level,
          alert_label: level.label,
          alert_color: level.color,
          inventory: parseInt(sku.inventory),
          stock_alert: parseInt(sku.stock_alert),
          create_time: moment(sku.create_time).format('YYYY-MM-DD HH:mm:ss')
        });
      }

      // 3. 排序（内存排序）
      if (sortField && sortOrder) {
        alertList.sort((a, b) => {
          const aValue = a[sortField];
          const bValue = b[sortField];

          if (sortOrder === 'asc') {
            return aValue > bValue ? 1 : -1;
          } else {
            return aValue < bValue ? 1 : -1;
          }
        });
      } else {
        // 默认排序：按库存升序（最紧急的在前面）
        alertList.sort((a, b) => a.inventory - b.inventory);
      }

      // 4. 内存分页
      const total = alertList.length;
      const list = alertList.slice(offset, offset + parseInt(pageSize));

      return {
        list,
        total,
        page: parseInt(page),
        pageSize: parseInt(pageSize)
      };
    }

    /**
     * 计算库存预警级别
     *
     * 算法说明：
     * - 库存 = 0 → 3-缺货（黑色）
     * - 库存 ≤ 预警值×50% → 2-严重（红色）
     * - 库存 < 预警值 → 1-警告（橙色）
     * - 库存 ≥ 预警值 → 0-正常（绿色）
     *
     * @param {number} inventory - 当前库存
     * @param {number} stockAlert - 预警阈值
     * @returns {Object} 返回预警级别对象
     * @returns {number} returns.level - 预警级别（0-3）
     * @returns {string} returns.label - 预警标签（正常/警告/严重/缺货）
     * @returns {string} returns.color - 预警颜色（success/warning/danger/black）
     */
    calculateAlertLevel(inventory, stockAlert) {
      if (inventory === 0) {
        return { level: 3, label: '缺货', color: 'black' };
      }
      if (inventory <= stockAlert * 0.5) {
        return { level: 2, label: '严重', color: 'danger' };
      }
      if (inventory < stockAlert) {
        return { level: 1, label: '警告', color: 'warning' };
      }
      return { level: 0, label: '正常', color: 'success' };
    }

    /**
     * 创建预警日志
     *
     * 业务规则：
     * - 只记录需要预警的情况（level >= 1）
     * - 自动计算预警级别
     * - 记录商品名称、SKU名称、当前库存、预警阈值等信息
     *
     * @param {string} skuId - SKU ID
     * @returns {Promise<string|null>} 返回日志ID，如果不需要预警则返回 null
     * @throws {Error} 如果 SKU 不存在，抛出异常
     */
    async createAlertLog(skuId) {
      // 1. 获取 SKU 信息
      const sku = await app.database('t_product_sku')
        .where('sku_id', skuId)
        .first();

      if (!sku) {
        throw new Error('SKU不存在');
      }

      // 2. 获取商品信息
      const product = await app.database('t_product')
        .where('product_id', sku.product_id)
        .first();

      // 3. 计算预警级别
      const alertLevel = this.calculateAlertLevel(sku.inventory, sku.stock_alert);

      // 4. 只记录需要预警的情况（level >= 1）
      if (alertLevel.level === 0) {
        return null;
      }

      // 5. 插入预警日志
      const logId = uuidv4();

      await app.database('t_stock_alert_log').insert({
        log_id: logId,
        product_id: sku.product_id,
        sku_id: skuId,
        product_name: product ? product.product_name : '',
        sku_name: sku.sku_name,
        current_stock: sku.inventory,
        alert_threshold: sku.stock_alert,
        alert_level: alertLevel.level,
        is_handled: 0,
        alert_time: new Date()
      });

      return logId;
    }

    /**
     * 获取预警日志列表（分页）
     *
     * @param {Object} params - 查询参数
     * @param {string} [params.product_name] - 商品名称（模糊查询）
     * @param {number} [params.alert_level] - 预警级别（1-警告，2-严重，3-缺货）
     * @param {number} [params.is_handled] - 是否已处理（0-未处理，1-已处理）
     * @param {string} [params.start_time] - 预警时间开始
     * @param {string} [params.end_time] - 预警时间结束
     * @param {number} [params.page=1] - 页码
     * @param {number} [params.pageSize=50] - 每页数量
     * @returns {Promise<Object>} 返回预警日志列表和分页信息
     * @returns {Array} returns.list - 预警日志列表
     * @returns {number} returns.total - 总数
     * @returns {number} returns.page - 当前页码
     * @returns {number} returns.pageSize - 每页数量
     */
    async getAlertLogList(params) {
      const {
        product_name: productName,
        alert_level: alertLevel,
        is_handled: isHandled,
        start_time: startTime,
        end_time: endTime,
        page = 1,
        pageSize = 50
      } = params;

      const offset = (parseInt(page) - 1) * parseInt(pageSize);

      // 1. 构建查询条件
      let query = app.database('t_stock_alert_log');

      if (productName) {
        query = query.where('product_name', 'like', `%${productName}%`);
      }

      if (alertLevel !== undefined && alertLevel !== -999) {
        query = query.where('alert_level', parseInt(alertLevel));
      }

      if (isHandled !== undefined && isHandled !== -999) {
        query = query.where('is_handled', parseInt(isHandled));
      }

      if (startTime) {
        query = query.where('alert_time', '>=', startTime);
      }

      if (endTime) {
        query = query.where('alert_time', '<=', endTime);
      }

      // 2. 查询总数
      const countResult = await query.clone().count('* as count').first();
      const total = countResult.count;

      // 3. 查询列表数据
      const list = await query
        .select('*')
        .orderBy('alert_time', 'desc')
        .limit(parseInt(pageSize))
        .offset(offset);

      // 4. 格式化时间
      list.forEach(item => {
        item.alert_time = moment(item.alert_time).format('YYYY-MM-DD HH:mm:ss');
        if (item.handle_time) {
          item.handle_time = moment(item.handle_time).format('YYYY-MM-DD HH:mm:ss');
        }
      });

      return {
        list,
        total,
        page: parseInt(page),
        pageSize: parseInt(pageSize)
      };
    }

    /**
     * 处理预警
     *
     * @param {string} logId - 预警日志ID
     * @param {string} handler - 处理人
     * @param {string} [handleNote] - 处理备注
     * @returns {Promise<boolean>} 返回 true
     */
    async handleAlert(logId, handler, handleNote) {
      await app.database('t_stock_alert_log')
        .where('log_id', logId)
        .update({
          is_handled: 1,
          handle_time: new Date(),
          handler,
          handle_note: handleNote || ''
        });

      return true;
    }

    /**
     * 批量处理预警
     *
     * @param {Array<string>} logIds - 预警日志ID列表
     * @param {string} handler - 处理人
     * @param {string} [handleNote] - 处理备注
     * @returns {Promise<boolean>} 返回 true
     */
    async batchHandleAlert(logIds, handler, handleNote) {
      await app.database('t_stock_alert_log')
        .whereIn('log_id', logIds)
        .update({
          is_handled: 1,
          handle_time: new Date(),
          handler,
          handle_note: handleNote || ''
        });

      return true;
    }

    /**
     * 获取预警统计
     *
     * 统计说明：
     * - 只统计未处理的预警（is_handled=0）
     * - 按预警级别分组统计
     *
     * @returns {Promise<Object>} 返回预警统计数据
     * @returns {number} returns.total - 总预警数
     * @returns {number} returns.outOfStock - 缺货数（level=3）
     * @returns {number} returns.severe - 严重数（level=2）
     * @returns {number} returns.warning - 警告数（level=1）
     */
    async getAlertStatistics() {
      // 1. 统计各级别预警数量（只统计未处理的）
      const stats = await app.database('t_stock_alert_log')
        .where('is_handled', 0)
        .select('alert_level')
        .count('* as count')
        .groupBy('alert_level');

      // 2. 构建统计结果
      const result = {
        total: 0,
        outOfStock: 0,   // 缺货（level=3）
        severe: 0,       // 严重（level=2）
        warning: 0       // 警告（level=1）
      };

      stats.forEach(stat => {
        const count = parseInt(stat.count);
        result.total += count;

        switch (stat.alert_level) {
          case 3:
            result.outOfStock = count;
            break;
          case 2:
            result.severe = count;
            break;
          case 1:
            result.warning = count;
            break;
        }
      });

      return result;
    }

    /**
     * 库存补货
     *
     * 业务流程：
     * 1. 验证参数（SKU ID、补货数量）
     * 2. 更新 SKU 库存（原库存 + 补货数量）
     * 3. 同步更新商品总库存（所有 SKU 库存之和）
     *
     * @param {Object} params - 补货参数
     * @param {string} params.sku_id - SKU ID
     * @param {number} params.restock_quantity - 补货数量
     * @param {string} [params.note] - 补货备注
     * @returns {Promise<Object>} 返回补货结果
     * @returns {number} returns.old_inventory - 原库存
     * @returns {number} returns.restock_quantity - 补货数量
     * @returns {number} returns.new_inventory - 新库存
     * @returns {number} returns.product_total_inventory - 商品总库存
     * @throws {Error} 如果参数无效或 SKU 不存在，抛出异常
     */
    async restock(params) {
      const { sku_id: skuId, restock_quantity: quantity, note = '' } = params;

      // 1. 验证参数
      if (!skuId) {
        throw new Error('SKU ID不能为空');
      }

      if (!quantity || quantity <= 0) {
        throw new Error('补货数量必须大于0');
      }

      // 2. 获取当前SKU信息
      const sku = await app.database('t_product_sku')
        .where('sku_id', skuId)
        .first();

      if (!sku) {
        throw new Error('SKU不存在');
      }

      // 3. 更新SKU库存（原库存 + 补货数量）
      const newInventory = parseInt(sku.inventory) + parseInt(quantity);

      await app.database('t_product_sku')
        .where('sku_id', skuId)
        .update({
          inventory: newInventory,
          update_time: new Date()
        });

      // 4. 同步更新商品总库存（所有SKU库存之和）
      const allSkus = await app.database('t_product_sku')
        .where('product_id', sku.product_id)
        .where('status', 1)
        .select('inventory');

      const totalInventory = allSkus.reduce((sum, item) => sum + parseInt(item.inventory), 0);

      await app.database('t_product')
        .where('product_id', sku.product_id)
        .update({
          inventory: totalInventory,
          update_time: new Date()
        });

      return {
        old_inventory: sku.inventory,
        restock_quantity: quantity,
        new_inventory: newInventory,
        product_total_inventory: totalInventory
      };
    }

    /**
     * 批量库存补货
     *
     * 业务流程：
     * 1. 验证参数（SKU ID 列表、补货数量）
     * 2. 使用事务批量更新 SKU 库存
     * 3. 同步更新每个商品的总库存
     *
     * @param {Object} params - 批量补货参数
     * @param {Array<Object>} params.restock_list - 补货列表
     * @param {string} params.restock_list[].sku_id - SKU ID
     * @param {number} params.restock_list[].restock_quantity - 补货数量
     * @param {string} [params.note] - 补货备注
     * @returns {Promise<Object>} 返回批量补货结果
     * @returns {number} returns.success_count - 成功数量
     * @returns {number} returns.fail_count - 失败数量
     * @returns {Array} returns.details - 详细结果列表
     * @throws {Error} 如果参数无效，抛出异常
     */
    async batchRestock(params) {
      const { restock_list: restockList, note = '' } = params;

      // 1. 验证参数
      if (!restockList || !Array.isArray(restockList) || restockList.length === 0) {
        throw new Error('补货列表不能为空');
      }

      const results = {
        success_count: 0,
        fail_count: 0,
        details: []
      };

      // 2. 使用事务批量处理
      await app.database.transaction(async (trx) => {
        for (const item of restockList) {
          const { sku_id: skuId, restock_quantity: quantity } = item;

          try {
            // 验证参数
            if (!skuId) {
              throw new Error('SKU ID不能为空');
            }

            if (!quantity || quantity <= 0) {
              throw new Error('补货数量必须大于0');
            }

            // 获取当前SKU信息
            const sku = await trx('t_product_sku')
              .where('sku_id', skuId)
              .first();

            if (!sku) {
              throw new Error('SKU不存在');
            }

            // 更新SKU库存（原库存 + 补货数量）
            const newInventory = parseInt(sku.inventory) + parseInt(quantity);

            await trx('t_product_sku')
              .where('sku_id', skuId)
              .update({
                inventory: newInventory,
                update_time: new Date()
              });

            // 同步更新商品总库存（所有SKU库存之和）
            const allSkus = await trx('t_product_sku')
              .where('product_id', sku.product_id)
              .where('status', 1)
              .select('inventory');

            const totalInventory = allSkus.reduce((sum, s) => sum + parseInt(s.inventory), 0);

            await trx('t_product')
              .where('product_id', sku.product_id)
              .update({
                inventory: totalInventory,
                update_time: new Date()
              });

            results.success_count++;
            results.details.push({
              sku_id: skuId,
              success: true,
              old_inventory: sku.inventory,
              restock_quantity: quantity,
              new_inventory: newInventory
            });
          } catch (error) {
            results.fail_count++;
            results.details.push({
              sku_id: skuId,
              success: false,
              error: error.message
            });
          }
        }
      });

      return results;
    }
  };
};

