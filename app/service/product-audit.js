/**
 * 商品审核服务
 * 处理商品审核相关的业务逻辑和数据库操作
 *
 * @class ProductAuditService
 * @extends BaseService
 */
module.exports = (app) => {
  const BaseService = require('@lesheng/elpis').Service.Base(app);
  const moment = require('moment');

  return class ProductAuditService extends BaseService {

    /**
     * 获取审核列表（分页）
     *
     * @param {Object} params - 查询参数
     * @param {string} [params.product_name] - 商品名称（模糊查询）
     * @param {number} [params.audit_status] - 审核状态（0-未审核，1-已审核，2-审核不通过）
     * @param {string} [params.create_time_start] - 创建时间开始
     * @param {string} [params.create_time_end] - 创建时间结束
     * @param {string} [params.sort_field] - 排序字段
     * @param {string} [params.sort_order] - 排序方向（asc/desc）
     * @param {number} [params.page=1] - 页码
     * @param {number} [params.pageSize=10] - 每页数量
     * @returns {Promise<Object>} 返回审核列表和分页信息
     */
    async getAuditList(params) {
      const {
        product_name: productName,
        audit_status: auditStatus,
        create_time_start: createTimeStart,
        create_time_end: createTimeEnd,
        sort_field: sortField,
        sort_order: sortOrder,
        page = 1,
        pageSize = 10
      } = params;

      const offset = (parseInt(page) - 1) * parseInt(pageSize);

      // 1. 构建数据查询（包含 JOIN 以获取分类名称和品牌名称）
      let query = app.database('t_product')
        .select(
          't_product.*',
          't_product_category.category_name',
          't_product_brand.brand_name'
        )
        .leftJoin('t_product_category', 't_product.category_id', 't_product_category.category_id')
        .leftJoin('t_product_brand', 't_product.brand_id', 't_product_brand.brand_id')
        .where('t_product.status', 1);

      // 2. 商品名称筛选（模糊查询）
      if (productName) {
        query = query.where('t_product.product_name', 'like', `%${productName}%`);
      }

      // 3. 审核状态筛选
      if (auditStatus !== undefined && auditStatus !== null && auditStatus !== '' && auditStatus !== -999 && auditStatus !== '-999') {
        query = query.where('t_product.audit_status', auditStatus);
      }

      // 4. 创建时间范围筛选
      if (createTimeStart) {
        query = query.where('t_product.create_time', '>=', createTimeStart);
      }
      if (createTimeEnd) {
        query = query.where('t_product.create_time', '<=', createTimeEnd);
      }

      // 5. 查询总数（构建独立的 count 查询，只包含 where 条件，不包含 select 和 join）
      let countQuery = app.database('t_product').where('t_product.status', 1);

      // 应用相同的筛选条件
      if (productName) {
        countQuery = countQuery.where('t_product.product_name', 'like', `%${productName}%`);
      }
      if (auditStatus !== undefined && auditStatus !== null && auditStatus !== '' && auditStatus !== -999 && auditStatus !== '-999') {
        countQuery = countQuery.where('t_product.audit_status', auditStatus);
      }
      if (createTimeStart) {
        countQuery = countQuery.where('t_product.create_time', '>=', createTimeStart);
      }
      if (createTimeEnd) {
        countQuery = countQuery.where('t_product.create_time', '<=', createTimeEnd);
      }

      const totalResult = await countQuery.count('* as count').first();
      const total = totalResult ? totalResult.count : 0;

      // 6. 排序
      const allowedSortFields = ['create_time', 'audit_status', 'price', 'product_id'];
      if (sortField && allowedSortFields.includes(sortField)) {
        const order = sortOrder === 'asc' ? 'asc' : 'desc';
        query = query.orderBy(`t_product.${sortField}`, order);
      } else {
        // 默认按创建时间倒序
        query = query.orderBy('t_product.create_time', 'desc');
      }

      // 7. 分页查询
      const list = await query.limit(parseInt(pageSize)).offset(offset);

      // 8. 数据类型转换
      list.forEach(item => {
        item.create_time = moment(item.create_time).format('YYYY-MM-DD HH:mm:ss');
        item.update_time = item.update_time ? moment(item.update_time).format('YYYY-MM-DD HH:mm:ss') : null;
        item.price = parseFloat(item.price);
        item.inventory = parseInt(item.inventory);
        item.status = parseInt(item.status);
        item.shelf_status = parseInt(item.shelf_status);
        item.sort_order = parseInt(item.sort_order) || 0;
        item.audit_status = parseInt(item.audit_status) || 0;
      });

      return {
        list,
        total: parseInt(total),
        page: parseInt(page),
        pageSize: parseInt(pageSize)
      };
    }

    /**
     * 获取商品审核详情
     *
     * @param {string} productId - 商品ID
     * @returns {Promise<Object>} 商品详情（包括SKU列表和参数值）
     */
    async getAuditDetail(productId) {
      // 1. 获取商品基本信息
      const product = await app.database('t_product')
        .select(
          't_product.*',
          't_product_category.category_name',
          't_product_brand.brand_name'
        )
        .leftJoin('t_product_category', 't_product.category_id', 't_product_category.category_id')
        .leftJoin('t_product_brand', 't_product.brand_id', 't_product_brand.brand_id')
        .where('t_product.product_id', productId)
        .first();

      if (!product) {
        throw new Error('商品不存在');
      }

      // 2. 数据类型转换
      product.create_time = moment(product.create_time).format('YYYY-MM-DD HH:mm:ss');
      product.update_time = product.update_time ? moment(product.update_time).format('YYYY-MM-DD HH:mm:ss') : null;
      product.price = parseFloat(product.price);
      product.inventory = parseInt(product.inventory);
      product.status = parseInt(product.status);
      product.shelf_status = parseInt(product.shelf_status);
      product.sort_order = parseInt(product.sort_order) || 0;
      product.audit_status = parseInt(product.audit_status) || 0;

      // 3. 获取SKU列表
      const skus = await app.database('t_product_sku')
        .where('product_id', productId)
        .where('status', 1);

      skus.forEach(sku => {
        sku.price = parseFloat(sku.price);
        sku.promotion_price = sku.promotion_price ? parseFloat(sku.promotion_price) : null;
        sku.inventory = parseInt(sku.inventory);
        sku.stock_alert = parseInt(sku.stock_alert);
        sku.status = parseInt(sku.status);
        // 解析 SKU 属性 JSON
        if (sku.sku_attributes) {
          try {
            sku.sku_attributes = typeof sku.sku_attributes === 'string' 
              ? JSON.parse(sku.sku_attributes) 
              : sku.sku_attributes;
          } catch (e) {
            console.error('SKU attributes parse error:', e);
          }
        }
      });

      product.skus = skus;

      // 4. 获取商品参数值
      const params = await app.database('t_product_param_value')
        .select(
          't_product_param_value.*',
          't_product_param_library.param_name'
        )
        .leftJoin('t_product_param_library', 't_product_param_value.param_id', 't_product_param_library.param_id')
        .where('t_product_param_value.product_id', productId);

      product.params = params;

      return product;
    }

    /**
     * 执行审核操作
     *
     * @param {string} productId - 商品ID
     * @param {number} auditStatus - 审核结果（1-审核通过，2-审核不通过）
     * @param {string} auditReason - 审核意见/不通过原因
     * @param {string} auditorId - 审核人ID
     * @param {string} auditorName - 审核人姓名
     * @returns {Promise<Object>} 审核结果
     */
    async auditProduct(productId, auditStatus, auditReason, auditorId, auditorName) {
      const trx = await app.database.transaction();

      try {
        // 1. 检查商品是否存在
        const product = await trx('t_product')
          .where('product_id', productId)
          .where('status', 1)
          .first();

        if (!product) {
          throw new Error('商品不存在');
        }

        // 2. 更新商品审核状态
        await trx('t_product')
          .where('product_id', productId)
          .update({
            audit_status: auditStatus,
            update_time: app.database.fn.now()
          });

        // 3. 插入审核记录
        const auditTime = moment().format('YYYY-MM-DD HH:mm:ss');
        await trx('t_product_audit').insert({
          product_id: productId,
          audit_type: 1, // 默认为新建审核，编辑审核在编辑时处理
          audit_status: auditStatus,
          audit_reason: auditReason || '',
          auditor_id: auditorId,
          auditor_name: auditorName,
          audit_time: auditTime
        });

        await trx.commit();

        return {
          success: true,
          message: auditStatus === 1 ? '审核通过' : '审核不通过'
        };
      } catch (error) {
        await trx.rollback();
        throw error;
      }
    }

    /**
     * 获取商品的审核历史记录
     *
     * @param {string} productId - 商品ID
     * @returns {Promise<Array>} 审核历史记录列表
     */
    async getAuditHistory(productId) {
      const history = await app.database('t_product_audit')
        .where('product_id', productId)
        .orderBy('audit_time', 'desc');

      // 格式化时间和解析 JSON 数据
      history.forEach(record => {
        record.audit_time = moment(record.audit_time).format('YYYY-MM-DD HH:mm:ss');
        record.create_time = moment(record.create_time).format('YYYY-MM-DD HH:mm:ss');
        record.audit_type = parseInt(record.audit_type);
        record.audit_status = parseInt(record.audit_status);

        // 解析 old_data 和 new_data
        if (record.old_data) {
          try {
            record.old_data = typeof record.old_data === 'string' 
              ? JSON.parse(record.old_data) 
              : record.old_data;
          } catch (e) {
            console.error('old_data parse error:', e);
          }
        }
        if (record.new_data) {
          try {
            record.new_data = typeof record.new_data === 'string' 
              ? JSON.parse(record.new_data) 
              : record.new_data;
          } catch (e) {
            console.error('new_data parse error:', e);
          }
        }
      });

      return history;
    }

    /**
     * 记录编辑审核（在商品编辑时调用）
     *
     * @param {string} productId - 商品ID
     * @param {Object} oldData - 编辑前的数据
     * @param {Object} newData - 编辑后的数据
     * @returns {Promise<void>}
     */
    async recordEditAudit(productId, oldData, newData) {
      await app.database('t_product_audit').insert({
        product_id: productId,
        audit_type: 2, // 编辑审核
        audit_status: 0, // 待审核
        old_data: JSON.stringify(oldData),
        new_data: JSON.stringify(newData),
        audit_time: moment().format('YYYY-MM-DD HH:mm:ss')
      });
    }

    /**
     * 批量审核商品
     *
     * @param {Array<string>} productIds - 商品ID列表
     * @param {number} auditStatus - 审核结果（1-审核通过，2-审核不通过）
     * @param {string} auditReason - 审核意见/不通过原因
     * @param {string} auditorId - 审核人ID
     * @param {string} auditorName - 审核人姓名
     * @returns {Promise<Object>} 返回批量审核结果
     */
    async batchAudit(productIds, auditStatus, auditReason, auditorId, auditorName) {
      if (!productIds || productIds.length === 0) {
        throw new Error('商品ID列表不能为空');
      }

      if (auditStatus === 2 && !auditReason) {
        throw new Error('审核不通过时必须填写拒绝原因');
      }

      const auditTime = moment().format('YYYY-MM-DD HH:mm:ss');
      let successCount = 0;
      let failCount = 0;
      const errors = [];

      // 使用事务处理批量审核
      await app.database.transaction(async (trx) => {
        for (const productId of productIds) {
          try {
            // 1. 检查商品是否存在且待审核
            const product = await trx('t_product')
              .where('product_id', productId)
              .where('status', 1)
              .first();

            if (!product) {
              failCount++;
              errors.push({ product_id: productId, reason: '商品不存在或已删除' });
              continue;
            }

            if (product.audit_status !== 0) {
              failCount++;
              errors.push({ product_id: productId, reason: '商品已审核，无需重复审核' });
              continue;
            }

            // 2. 更新商品审核状态
            await trx('t_product')
              .where('product_id', productId)
              .update({
                audit_status: auditStatus,
                update_time: auditTime
              });

            // 3. 插入审核历史记录
            await trx('t_product_audit').insert({
              product_id: productId,
              audit_type: 1, // 新建审核
              audit_status: auditStatus,
              audit_reason: auditReason || (auditStatus === 1 ? '批量审核通过' : '批量审核不通过'),
              auditor_id: auditorId,
              auditor_name: auditorName,
              audit_time: auditTime
            });

            successCount++;
          } catch (error) {
            failCount++;
            errors.push({ product_id: productId, reason: error.message });
          }
        }
      });

      return {
        success: true,
        success_count: successCount,
        fail_count: failCount,
        errors: errors,
        message: `批量审核完成：成功 ${successCount} 条，失败 ${failCount} 条`
      };
    }
  };
};

