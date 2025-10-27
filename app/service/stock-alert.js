module.exports = (app) => {
  const BaseService = require('@lesheng/elpis').Service.Base(app);
  const { v4: uuidv4 } = require('uuid');
  const moment = require('moment');

  return class StockAlertService extends BaseService {

    /**
     * 获取库存预警列表
     */
    async getAlertList(params) {
      const { 
        product_name: productName,
        category_id: categoryId,
        alert_level: alertLevel,
        is_handled: isHandled,
        page = 1, 
        pageSize = 50 
      } = params;

      const offset = (parseInt(page) - 1) * parseInt(pageSize);

      // 查询所有需要预警的 SKU
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
        )
        .orderBy('sku.inventory', 'asc');

      // 计算每个 SKU 的预警级别
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

      // 分页
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
     * @param {number} inventory 当前库存
     * @param {number} stockAlert 预警阈值
     * @returns {object} { level, label, color }
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
     */
    async createAlertLog(skuId) {
      const sku = await app.database('t_product_sku')
        .where('sku_id', skuId)
        .first();

      if (!sku) {
        throw new Error('SKU不存在');
      }

      const product = await app.database('t_product')
        .where('product_id', sku.product_id)
        .first();

      const alertLevel = this.calculateAlertLevel(sku.inventory, sku.stock_alert);

      // 只记录需要预警的情况
      if (alertLevel.level === 0) {
        return null;
      }

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
     * 获取预警日志列表
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

      const countResult = await query.clone().count('* as count').first();
      const total = countResult.count;

      const list = await query
        .select('*')
        .orderBy('alert_time', 'desc')
        .limit(parseInt(pageSize))
        .offset(offset);

      // 格式化数据
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
     */
    async getAlertStatistics() {
      // 统计各级别预警数量
      const stats = await app.database('t_stock_alert_log')
        .where('is_handled', 0)
        .select('alert_level')
        .count('* as count')
        .groupBy('alert_level');

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
     */
    async restock(params) {
      const { sku_id: skuId, restock_quantity: quantity, note = '' } = params;

      if (!skuId) {
        throw new Error('SKU ID不能为空');
      }

      if (!quantity || quantity <= 0) {
        throw new Error('补货数量必须大于0');
      }

      // 获取当前SKU信息
      const sku = await app.database('t_product_sku')
        .where('sku_id', skuId)
        .first();

      if (!sku) {
        throw new Error('SKU不存在');
      }

      // 更新SKU库存
      const newInventory = parseInt(sku.inventory) + parseInt(quantity);
      
      await app.database('t_product_sku')
        .where('sku_id', skuId)
        .update({
          inventory: newInventory,
          update_time: new Date()
        });

      // 同步更新商品总库存（所有SKU库存之和）
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
  };
};

