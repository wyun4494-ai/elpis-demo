/**
 * 秒杀商品服务
 * 处理秒杀商品相关的业务逻辑
 */
module.exports = (app) => {
  const { nanoid } = require('nanoid')

  return class FlashSaleProductService {
    /**
     * 获取秒杀商品列表
     * @param {Object} params - 查询参数
     * @returns {Promise<Array>} 秒杀商品列表
     */
    async getFlashSaleProductList(params = {}) {
      const { 
        flash_sale_id: flashSaleId,
        slot_id: slotId,
        product_name: productName 
      } = params

      let query = app.database('t_flash_sale_product as fsp')
        .leftJoin('t_product as p', 'fsp.product_id', 'p.product_id')
        .leftJoin('t_product_sku as ps', 'fsp.sku_id', 'ps.sku_id')
        .select(
          'fsp.*',
          'p.product_name',
          'p.item_number',
          'p.price as original_price',
          'p.inventory as total_inventory',
          'ps.sku_code',
          'ps.sku_name',
          'ps.price as sku_price',
          'ps.inventory as sku_inventory'
        )
        .where('fsp.status', 1)
        .orderBy('fsp.sort_order', 'asc')
        .orderBy('fsp.create_time', 'desc')

      if (flashSaleId) {
        query = query.where('fsp.flash_sale_id', flashSaleId)
      }

      if (slotId) {
        query = query.where('fsp.slot_id', slotId)
      }

      if (productName) {
        query = query.where('p.product_name', 'like', `%${productName}%`)
      }

      const list = await query

      // 处理价格和库存逻辑
      for (const item of list) {
        // 如果指定了 SKU，使用 SKU 价格和库存
        if (item.sku_id && item.sku_price !== null) {
          item.original_price = item.sku_price
          item.total_inventory = item.sku_inventory
        } else if (!item.sku_id) {
          // 如果没有指定 SKU（全部 SKU 参与），查询该商品的最低 SKU 价格
          const minSkuPrice = await app.database('t_product_sku')
            .where('product_id', item.product_id)
            .where('status', 1)
            .min('price as min_price')
            .first()
          
          if (minSkuPrice && minSkuPrice.min_price !== null) {
            item.original_price = minSkuPrice.min_price
          }
          // 如果没有 SKU，保持使用商品价格（已经在查询中获取）
        }
        
        // 计算剩余库存
        item.remaining_stock = item.flash_sale_stock - item.sold_count
      }

      return list
    }

    /**
     * 获取秒杀商品详情
     * @param {String} flashSaleProductId - 秒杀商品ID
     * @returns {Promise<Object>} 秒杀商品详情
     */
    async getFlashSaleProduct(flashSaleProductId) {
      const product = await app.database('t_flash_sale_product as fsp')
        .leftJoin('t_product as p', 'fsp.product_id', 'p.product_id')
        .leftJoin('t_product_sku as ps', 'fsp.sku_id', 'ps.sku_id')
        .select(
          'fsp.*',
          'p.product_name',
          'p.item_number',
          'p.price as original_price',
          'p.inventory as total_inventory',
          'ps.sku_code',
          'ps.sku_name',
          'ps.price as sku_price',
          'ps.inventory as sku_inventory'
        )
        .where('fsp.flash_sale_product_id', flashSaleProductId)
        .where('fsp.status', 1)
        .first()

      if (!product) {
        throw new Error('秒杀商品不存在')
      }

      // 如果指定了 SKU，使用 SKU 价格和库存
      if (product.sku_id && product.sku_price !== null) {
        product.original_price = product.sku_price
        product.total_inventory = product.sku_inventory
      } else if (!product.sku_id) {
        // 如果没有指定 SKU（全部 SKU 参与），查询该商品的最低 SKU 价格
        const minSkuPrice = await app.database('t_product_sku')
          .where('product_id', product.product_id)
          .where('status', 1)
          .min('price as min_price')
          .first()
        
        if (minSkuPrice && minSkuPrice.min_price !== null) {
          product.original_price = minSkuPrice.min_price
        }
        // 如果没有 SKU，保持使用商品价格（已经在查询中获取）
      }

      product.remaining_stock = product.flash_sale_stock - product.sold_count

      return product
    }

    /**
     * 创建秒杀商品
     * @param {Object} data - 秒杀商品数据
     * @returns {Promise<String>} 秒杀商品ID
     */
    async createFlashSaleProduct(data) {
      const {
        flash_sale_id: flashSaleId,
        slot_id: slotId,
        product_id: productId,
        sku_id: skuId,
        original_price: originalPrice,
        flash_sale_price: flashSalePrice,
        flash_sale_stock: flashSaleStock,
        limit_per_user: limitPerUser = 1,
        sort_order: sortOrder = 0
      } = data

      // 验证必填字段
      if (!flashSaleId || !slotId || !productId || !flashSalePrice || !flashSaleStock) {
        throw new Error('缺少必填字段')
      }

      // 验证秒杀价格必须小于原价
      if (Number(flashSalePrice) >= Number(originalPrice)) {
        throw new Error('秒杀价格必须小于原价')
      }

      // 验证秒杀库存
      if (Number(flashSaleStock) <= 0) {
        throw new Error('秒杀库存必须大于0')
      }

      // 检查商品是否已存在于该时间段
      const existingProduct = await app.database('t_flash_sale_product')
        .where('flash_sale_id', flashSaleId)
        .where('slot_id', slotId)
        .where('product_id', productId)
        .where('sku_id', skuId || null)
        .where('status', 1)
        .first()

      if (existingProduct) {
        throw new Error('该商品已添加到此时间段')
      }

      const flashSaleProductId = `FSP${nanoid(10)}`

      await app.database('t_flash_sale_product').insert({
        flash_sale_product_id: flashSaleProductId,
        flash_sale_id: flashSaleId,
        slot_id: slotId,
        product_id: productId,
        sku_id: skuId || null,
        original_price: originalPrice,
        flash_sale_price: flashSalePrice,
        flash_sale_stock: flashSaleStock,
        sold_count: 0,
        limit_per_user: limitPerUser,
        sort_order: sortOrder,
        is_enabled: 1,
        status: 1
      })

      return flashSaleProductId
    }

    /**
     * 更新秒杀商品
     * @param {String} flashSaleProductId - 秒杀商品ID
     * @param {Object} data - 更新数据
     * @returns {Promise<void>}
     */
    async updateFlashSaleProduct(flashSaleProductId, data) {
      const {
        flash_sale_price: flashSalePrice,
        flash_sale_stock: flashSaleStock,
        limit_per_user: limitPerUser,
        sort_order: sortOrder,
        is_enabled: isEnabled
      } = data

      // 检查商品是否存在
      const existingProduct = await this.getFlashSaleProduct(flashSaleProductId)

      const updateObj = {}

      if (flashSalePrice !== undefined && flashSalePrice !== null) {
        // 验证秒杀价格必须小于原价
        if (Number(flashSalePrice) >= Number(existingProduct.original_price)) {
          throw new Error('秒杀价格必须小于原价')
        }
        updateObj.flash_sale_price = Number(flashSalePrice)
      }

      if (flashSaleStock !== undefined && flashSaleStock !== null) {
        if (Number(flashSaleStock) <= 0) {
          throw new Error('秒杀库存必须大于0')
        }
        updateObj.flash_sale_stock = Number(flashSaleStock)
      }

      if (limitPerUser !== undefined && limitPerUser !== null) {
        updateObj.limit_per_user = Number(limitPerUser)
      }

      if (sortOrder !== undefined && sortOrder !== null) {
        updateObj.sort_order = Number(sortOrder)
      }

      if (isEnabled !== undefined && isEnabled !== null) {
        updateObj.is_enabled = Number(isEnabled)
      }

      if (Object.keys(updateObj).length === 0) {
        return
      }

      await app.database('t_flash_sale_product')
        .where('flash_sale_product_id', flashSaleProductId)
        .where('status', 1)
        .update(updateObj)
    }

    /**
     * 删除秒杀商品（软删除）
     * @param {String} flashSaleProductId - 秒杀商品ID
     * @returns {Promise<void>}
     */
    async deleteFlashSaleProduct(flashSaleProductId) {
      await app.database('t_flash_sale_product')
        .where('flash_sale_product_id', flashSaleProductId)
        .where('status', 1)
        .update({ status: -1 })
    }

    /**
     * 批量删除秒杀商品（软删除）
     * @param {Array<String>} flashSaleProductIds - 秒杀商品ID数组
     * @returns {Promise<void>}
     */
    async batchDeleteFlashSaleProduct(flashSaleProductIds) {
      await app.database('t_flash_sale_product')
        .whereIn('flash_sale_product_id', flashSaleProductIds)
        .where('status', 1)
        .update({ status: -1 })
    }

    /**
     * 获取时间段的商品数量统计
     * @param {String} flashSaleId - 秒杀活动ID
     * @returns {Promise<Object>} 时间段商品数量映射
     */
    async getSlotProductCount(flashSaleId) {
      const counts = await app.database('t_flash_sale_product')
        .select('slot_id')
        .count('* as count')
        .where('flash_sale_id', flashSaleId)
        .where('status', 1)
        .groupBy('slot_id')

      const countMap = {}
      counts.forEach(item => {
        countMap[item.slot_id] = item.count
      })

      return countMap
    }
  }
}
