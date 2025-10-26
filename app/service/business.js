module.exports = (app) => {
  const BaseService = require('@lesheng/elpis').Service.Base(app);
  const moment = require('moment');

  return class BusinessService extends BaseService {

    /**
     * 获取商品列表（分页）
     */
    async getProductList(params) {
      const { 
        product_name: productName,
        category_id: categoryId,
        brand_id: brandId,
        price, 
        item_number: itemNumber,
        inventory,
        shelf_status: shelfStatus,
        create_time_start: createTimeStart,
        create_time_end: createTimeEnd,
        page = 1, 
        pageSize = 10 
      } = params;

      const offset = (parseInt(page) - 1) * parseInt(pageSize);

      // 构建查询条件
      let query = app.database('t_product').where('status', 1);

      // 商品名称筛选（模糊查询）
      if (productName && productName !== 'all') {
        query = query.where('product_name', 'like', `%${productName}%`);
      }

      // 分类筛选（包括该分类及所有子分类下的商品）
      if (categoryId) {
        const { category: categoryService } = app.service;
        // 获取该分类信息
        const category = await categoryService.getCategory(categoryId);
        
        if (category) {
          // 根据层级筛选
          if (category.level === 1) {
            query = query.where('category_l1_id', categoryId);
          } else if (category.level === 2) {
            query = query.where('category_l2_id', categoryId);
          } else if (category.level === 3) {
            query = query.where('category_l3_id', categoryId);
          } else if (category.level === 4) {
            query = query.where('category_l4_id', categoryId);
          }
        }
      }

      // 品牌筛选
      if (brandId) {
        query = query.where('brand_id', brandId);
      }

      // 价格筛选
      if (price && price !== -999 && price !== '-999') {
        query = query.where('price', price);
      }

      // 货号筛选（模糊查询）
      if (itemNumber) {
        query = query.where('item_number', 'like', `%${itemNumber}%`);
      }

      // 库存筛选
      if (inventory && inventory !== -999 && inventory !== '-999') {
        query = query.where('inventory', inventory);
      }

      // 上架状态筛选
      if (shelfStatus !== undefined && shelfStatus !== -999 && shelfStatus !== '-999') {
        query = query.where('shelf_status', parseInt(shelfStatus));
      }

      // 时间范围筛选
      if (createTimeStart) {
        query = query.where('create_time', '>=', createTimeStart);
      }
      if (createTimeEnd) {
        query = query.where('create_time', '<=', createTimeEnd);
      }

      // 查询总数
      const totalResult = await query.clone().count('* as count').first();
      const total = totalResult ? totalResult.count : 0;

      // 查询列表数据
      const list = await query
        .select('*')
        .orderBy('create_time', 'desc')
        .limit(parseInt(pageSize))
        .offset(offset);

      // 批量获取所有商品的SKU状态（优化性能，避免N+1查询）
      const productIds = list.map(item => item.product_id);
      const skuStatusMap = await this.getBatchProductStockStatus(productIds);

      // 格式化数据
      list.forEach(item => {
        item.create_time = moment(item.create_time).format('YYYY-MM-DD HH:mm:ss');
        // 将 decimal 类型转换为数字
        item.price = parseFloat(item.price);
        item.inventory = parseInt(item.inventory);
        // 确保状态字段是数字类型
        item.status = parseInt(item.status);
        item.shelf_status = parseInt(item.shelf_status);

        // 设置 SKU 库存状态
        item.sku_stock_status = skuStatusMap[item.product_id] || '🟢 正常';
      });

      return {
        list,
        total: parseInt(total),
        page: parseInt(page),
        pageSize: parseInt(pageSize)
      };
    }

    /**
     * 批量获取多个商品的 SKU 库存状态（优化性能）
     */
    async getBatchProductStockStatus(productIds) {
      if (!productIds || productIds.length === 0) {
        return {};
      }

      // 一次性查询所有商品的所有 SKU
      const skus = await app.database('t_product_sku')
        .whereIn('product_id', productIds)
        .where('status', 1)
        .select('product_id', 'inventory', 'stock_alert');

      // 按商品分组并计算状态
      const statusMap = {};
      
      productIds.forEach(productId => {
        const productSkus = skus.filter(sku => sku.product_id === productId);
        
        if (productSkus.length === 0) {
          statusMap[productId] = '🟢 正常';
          return;
        }

        let hasOutOfStock = false;
        let hasSevere = false;
        let hasWarning = false;

        productSkus.forEach(sku => {
          const inventory = parseInt(sku.inventory);
          const alert = parseInt(sku.stock_alert);

          if (inventory === 0) {
            hasOutOfStock = true;
          } else if (inventory <= alert * 0.5) {
            hasSevere = true;
          } else if (inventory < alert) {
            hasWarning = true;
          }
        });

        // 返回最严重的状态
        if (hasOutOfStock) {
          statusMap[productId] = '⚫ 缺货';
        } else if (hasSevere) {
          statusMap[productId] = '🔴 严重';
        } else if (hasWarning) {
          statusMap[productId] = '🟠 警告';
        } else {
          statusMap[productId] = '🟢 正常';
        }
      });

      return statusMap;
    }

    /**
     * 获取商品的 SKU 库存状态
     */
    async getProductStockStatus(productId) {
      // 查询商品的所有 SKU
      const skus = await app.database('t_product_sku')
        .where('product_id', productId)
        .where('status', 1)
        .select('inventory', 'stock_alert');

      // 如果没有 SKU，返回正常状态
      if (!skus || skus.length === 0) {
        return '🟢 正常';
      }

      let hasOutOfStock = false;     // 有缺货
      let hasSevere = false;          // 有严重预警
      let hasWarning = false;         // 有一般预警

      skus.forEach(sku => {
        const inventory = parseInt(sku.inventory);
        const alert = parseInt(sku.stock_alert);

        if (inventory === 0) {
          hasOutOfStock = true;
        } else if (inventory <= alert * 0.5) {
          hasSevere = true;
        } else if (inventory < alert) {
          hasWarning = true;
        }
      });

      // 返回最严重的状态
      if (hasOutOfStock) return '⚫ 缺货';
      if (hasSevere) return '🔴 严重';
      if (hasWarning) return '🟠 警告';
      return '🟢 正常';
    }

    /**
     * 获取商品详情
     */
    async getProduct(productId) {
      const product = await app.database('t_product')
        .where('product_id', productId)
        .where('status', 1)
        .first();

      if (product) {
        product.create_time = moment(product.create_time).format('YYYY-MM-DD HH:mm:ss');
        // 将 decimal 类型转换为数字
        product.price = parseFloat(product.price);
        product.inventory = parseInt(product.inventory);
        // 确保状态字段是数字类型
        product.status = parseInt(product.status);
        product.shelf_status = parseInt(product.shelf_status);
        
        // 如果有分类，获取分类的完整名称
        if (product.category_id) {
          const category = await app.database('t_product_category')
            .where('category_id', product.category_id)
            .where('status', 1)
            .first();
          
          if (category && category.full_name) {
            // 使用分类表中的 full_name 字段
            product.category_name = category.full_name;
          } else {
            product.category_name = product.category_id;
          }
        } else {
          product.category_name = '未分类';
        }
        
        // 如果有品牌，获取品牌名称
        if (product.brand_id) {
          const brand = await app.database('t_product_brand')
            .where('brand_id', product.brand_id)
            .where('status', 1)
            .first();
          
          if (brand) {
            product.brand_name = brand.brand_name_en 
              ? `${brand.brand_name} (${brand.brand_name_en})`
              : brand.brand_name;
          } else {
            product.brand_name = product.brand_id;
          }
        } else {
          product.brand_name = '无品牌/其他';
        }
      }

      return product;
    }

    /**
     * 获取回收站商品详情
     */
    async getRecycleProduct(productId) {
      const product = await app.database('t_product')
        .where('product_id', productId)
        .where('status', 0)
        .first();

      if (product) {
        product.create_time = moment(product.create_time).format('YYYY-MM-DD HH:mm:ss');
        if (product.delete_time) {
          product.delete_time = moment(product.delete_time).format('YYYY-MM-DD HH:mm:ss');
        }
        // 将 decimal 类型转换为数字
        product.price = parseFloat(product.price);
        product.inventory = parseInt(product.inventory);
        product.status = parseInt(product.status);
        product.shelf_status = parseInt(product.shelf_status);
      }

      return product;
    }

    /**
     * 创建商品
     */
    async createProduct(params) {
      const { 
        product_name, 
        category_id, 
        brand_id, 
        price, 
        item_number, 
        inventory, 
        shelf_status,
        skus = [],
        params: productParams = {}
      } = params;

      // 生成商品ID
      const productId = `PROD${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

      // 如果选择了分类，获取分类的各层级ID
      let categoryLevels = {
        category_l1_id: null,
        category_l2_id: null,
        category_l3_id: null,
        category_l4_id: null
      };

      if (category_id) {
        const { category: categoryService } = app.service;
        categoryLevels = await categoryService.getCategoryLevels(category_id);
      }

      // 插入商品数据
      await app.database('t_product').insert({
        product_id: productId,
        product_name,
        category_id: category_id || null,
        category_l1_id: categoryLevels.category_l1_id,
        category_l2_id: categoryLevels.category_l2_id,
        category_l3_id: categoryLevels.category_l3_id,
        category_l4_id: categoryLevels.category_l4_id,
        brand_id: brand_id || null,
        price: price || 0,
        item_number: item_number || null,
        inventory: inventory || 0,
        status: 1,
        shelf_status: shelf_status !== undefined ? shelf_status : 0,
        create_time: new Date(),
        update_time: new Date()
      });

      // 保存SKU数据
      if (skus && skus.length > 0) {
        for (const sku of skus) {
          const skuId = `SKU${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
          
          await app.database('t_product_sku').insert({
            sku_id: skuId,
            product_id: productId,
            sku_name: sku.sku_name,
            sku_code: sku.sku_code,
            sku_attributes: JSON.stringify(sku.attributes),
            price: sku.price || 0,
            promotion_price: sku.promotion_price || null,
            inventory: sku.inventory || 0,
            stock_alert: sku.stock_alert || 50,
            status: 1,
            create_time: new Date(),
            update_time: new Date()
          });
        }
      }

      // 保存商品参数
      if (productParams && Object.keys(productParams).length > 0) {
        const { v4: uuidv4 } = require('uuid');
        
        for (const paramId in productParams) {
          const paramValue = productParams[paramId];
          
          await app.database('t_product_param_value').insert({
            id: uuidv4(),
            product_id: productId,
            param_id: paramId,
            param_value: Array.isArray(paramValue) ? JSON.stringify(paramValue) : paramValue,
            create_time: new Date()
          });
        }
      }

      return productId;
    }

    /**
     * 更新商品
     */
    async updateProduct(params) {
      const { product_id: productId, product_name, category_id, brand_id, price, item_number, inventory, shelf_status } = params;

      // 构建更新对象，只更新传入的字段
      const updateData = {
        update_time: new Date()
      };

      if (product_name !== undefined) updateData.product_name = product_name;
      if (brand_id !== undefined) updateData.brand_id = brand_id;
      if (price !== undefined) updateData.price = price;
      if (item_number !== undefined) updateData.item_number = item_number;
      if (inventory !== undefined) updateData.inventory = inventory;
      if (shelf_status !== undefined) updateData.shelf_status = shelf_status;

      // 如果修改了分类，需要更新各层级分类ID
      if (category_id !== undefined) {
        updateData.category_id = category_id;

        if (category_id) {
          const { category: categoryService } = app.service;
          const categoryLevels = await categoryService.getCategoryLevels(category_id);
          updateData.category_l1_id = categoryLevels.category_l1_id;
          updateData.category_l2_id = categoryLevels.category_l2_id;
          updateData.category_l3_id = categoryLevels.category_l3_id;
          updateData.category_l4_id = categoryLevels.category_l4_id;
        } else {
          updateData.category_l1_id = null;
          updateData.category_l2_id = null;
          updateData.category_l3_id = null;
          updateData.category_l4_id = null;
        }
      }

      await app.database('t_product')
        .where('product_id', productId)
        .update(updateData);

      return true;
    }

    /**
     * 删除商品（软删除）
     */
    async deleteProduct(productId, deleteReason, deletedBy) {
      // 获取商品信息
      const product = await app.database('t_product')
        .where('product_id', productId)
        .where('status', 1)
        .first();

      if (!product) {
        throw new Error('商品不存在或已删除');
      }

      // 开始事务
      const trx = await app.database.transaction();

      try {
        // 1. 更新商品表：标记为已删除
        await trx('t_product')
          .where('product_id', productId)
          .update({
            status: 0,
            delete_time: new Date(),
            delete_reason: deleteReason,
            deleted_by: deletedBy,
            update_time: new Date()
          });

        // 2. 插入删除日志
        await trx('t_product_delete_log').insert({
          product_id: productId,
          operation_type: 1, // 1-删除
          operation_time: new Date(),
          operation_by: deletedBy,
          delete_reason: deleteReason
        });

        await trx.commit();
        return true;
      } catch (error) {
        await trx.rollback();
        throw error;
      }
    }

    /**
     * 恢复商品
     */
    async restoreProduct(productId, restoredBy) {
      // 获取已删除的商品
      const product = await app.database('t_product')
        .where('product_id', productId)
        .where('status', 0)
        .first();

      if (!product) {
        throw new Error('回收站中未找到该商品');
      }

      // 开始事务
      const trx = await app.database.transaction();

      try {
        // 1. 更新商品表：恢复为正常状态
        await trx('t_product')
          .where('product_id', productId)
          .update({
            status: 1,
            delete_time: null,
            delete_reason: null,
            deleted_by: null,
            update_time: new Date()
          });

        // 2. 插入恢复日志
        await trx('t_product_delete_log').insert({
          product_id: productId,
          operation_type: 2, // 2-恢复
          operation_time: new Date(),
          operation_by: restoredBy
        });

        await trx.commit();
        return true;
      } catch (error) {
        await trx.rollback();
        throw error;
      }
    }

    /**
     * 获取回收站商品列表（status=0）
     */
    async getRecycleProductList(params) {
      const { 
        product_name: productName,
        delete_time_start: deleteTimeStart,
        delete_time_end: deleteTimeEnd,
        page = 1, 
        pageSize = 10 
      } = params;

      const offset = (parseInt(page) - 1) * parseInt(pageSize);

      let query = app.database('t_product').where('status', 0);

      // 商品名称筛选
      if (productName) {
        query = query.where('product_name', 'like', `%${productName}%`);
      }

      // 删除时间范围筛选
      if (deleteTimeStart) {
        query = query.where('delete_time', '>=', deleteTimeStart);
      }
      if (deleteTimeEnd) {
        query = query.where('delete_time', '<=', deleteTimeEnd);
      }

      // 查询总数
      const totalResult = await query.clone().count('* as count').first();
      const total = totalResult ? totalResult.count : 0;

      // 查询列表数据
      const list = await query
        .select('*')
        .orderBy('delete_time', 'desc')
        .limit(parseInt(pageSize))
        .offset(offset);

      // 格式化数据
      list.forEach(item => {
        item.create_time = moment(item.create_time).format('YYYY-MM-DD HH:mm:ss');
        if (item.delete_time) {
          item.delete_time = moment(item.delete_time).format('YYYY-MM-DD HH:mm:ss');
        }
        item.price = parseFloat(item.price);
        item.inventory = parseInt(item.inventory);
        item.status = parseInt(item.status);
        item.shelf_status = parseInt(item.shelf_status);
      });

      return {
        list,
        total: parseInt(total),
        page: parseInt(page),
        pageSize: parseInt(pageSize)
      };
    }

    /**
     * 永久删除商品（物理删除）
     */
    async permanentDeleteProduct(productId) {
      // 商品必须是已删除状态才能永久删除
      const result = await app.database('t_product')
        .where('product_id', productId)
        .where('status', 0)
        .del();

      // 注意：删除日志保留，用于历史审计
      return result > 0;
    }

    /**
     * 获取商品名称枚举列表（用于下拉选择）
     */
    async getProductNameEnum() {
      const list = await app.database('t_product')
        .select('product_id', 'product_name')
        .where('status', 1)
        .orderBy('create_time', 'desc');

      // 转换为枚举格式
      const enumList = [
        { label: '全部', value: 'all' }
      ];

      list.forEach(item => {
        enumList.push({
          label: item.product_name,
          value: item.product_name
        });
      });

      return enumList;
    }

    /**
     * 获取价格枚举列表
     */
    async getPriceEnum() {
      const list = await app.database('t_product')
        .distinct('price')
        .select('price')
        .where('status', 1)
        .orderBy('price', 'asc');

      const enumList = [
        { label: '全部', value: -999 }
      ];

      list.forEach(item => {
        const priceValue = parseFloat(item.price);
        enumList.push({
          label: `¥${priceValue.toFixed(2)}`,
          value: priceValue
        });
      });

      return enumList;
    }

    /**
     * 获取库存枚举列表
     */
    async getInventoryEnum() {
      const list = await app.database('t_product')
        .distinct('inventory')
        .select('inventory')
        .where('status', 1)
        .orderBy('inventory', 'asc');

      const enumList = [
        { label: '全部', value: -999 }
      ];

      list.forEach(item => {
        enumList.push({
          label: `${item.inventory}件`,
          value: item.inventory
        });
      });

      return enumList;
    }

    /**
     * 远程搜索商品（根据关键字模糊匹配商品名称）
     */
    async searchProduct(params) {
      const { keyword = '', page = 1, pageSize = 50 } = params;

      // 如果没有关键字，返回空数组
      if (!keyword) {
        return [];
      }

      // 模糊查询商品名称
      const list = await app.database('t_product')
        .select('product_id', 'product_name')
        .where('status', 1)
        .where('product_name', 'like', `%${keyword}%`)
        .limit(parseInt(pageSize))
        .offset((parseInt(page) - 1) * parseInt(pageSize))
        .orderBy('create_time', 'desc');

      // 转换为 remote-select 需要的格式
      return list.map(item => ({
        label: item.product_name,
        value: item.product_name  // 搜索时使用商品名称作为值
      }));
    }
  };
};

