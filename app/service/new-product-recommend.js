/**
 * 新品推荐服务
 */
module.exports = (app) => {
  const { v4: uuidv4 } = require('uuid')

  return class NewProductRecommendService {
    /**
     * 格式化日期时间
     * @param {Date|String} datetime - 日期时间
     * @returns {String} 格式化后的日期时间
     */
    formatDateTime(datetime) {
      if (!datetime) return null
      
      const date = new Date(datetime)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      const seconds = String(date.getSeconds()).padStart(2, '0')
      
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    }

    /**
     * 计算推荐状态
     * @param {String} startTime - 开始时间
     * @param {String} endTime - 结束时间
     * @returns {Number} 推荐状态（0-未开始，1-进行中，2-已结束）
     */
    calculateRecommendStatus(startTime, endTime) {
      const now = new Date()
      
      if (startTime && new Date(startTime) > now) {
        return 0  // 未开始
      }
      
      if (endTime && new Date(endTime) < now) {
        return 2  // 已结束
      }
      
      return 1  // 进行中
    }

    /**
     * 获取新品推荐列表
     * @param {Object} params - 查询参数
     * @returns {Promise<Object>} 返回列表和总数
     */
    async getNewProductRecommendList(params) {
      const {
        page = 1,
        pageSize = 10,
        product_name,
        recommend_status,
        sort_field: sortField,
        sort_order: sortOrder
      } = params

      const offset = (page - 1) * pageSize

      // 构建查询
      let query = app.database('t_new_product_recommend as npr')
        .leftJoin('t_product as p', 'npr.product_id', 'p.product_id')
        .where('npr.status', 1)

      // 搜索条件
      if (product_name) {
        query = query.where(function() {
          this.where('p.product_name', 'like', `%${product_name}%`)
            .andWhere('p.status', 1)
        })
      } else {
        // 如果没有商品名称搜索，也要过滤商品状态
        query = query.where(function() {
          this.whereNull('p.product_id').orWhere('p.status', 1)
        })
      }

      if (recommend_status !== undefined && recommend_status !== null && recommend_status !== '') {
        query = query.where('npr.recommend_status', recommend_status)
      }

      // 排序
      const allowedSortFields = ['sort_order', 'create_time', 'view_count']
      let orderByField = 'npr.sort_order'
      let orderByDirection = 'asc'

      if (sortField && allowedSortFields.includes(sortField)) {
        orderByField = `npr.${sortField}`
        orderByDirection = sortOrder === 'desc' ? 'desc' : 'asc'
      }

      // 查询列表
      const list = await query
        .clone()
        .select(
          'npr.*',
          'p.product_name',
          'p.product_images',
          'p.price'
        )
        .orderBy(orderByField, orderByDirection)
        .limit(pageSize)
        .offset(offset)

      // 查询总数
      const totalResult = await query.clone().count('* as count').first()
      const total = totalResult ? totalResult.count : 0

      // 自动更新推荐状态
      for (const item of list) {
        // 只有非手动控制的才自动计算
        if (!item.manual_control || item.manual_control === 0) {
          const calculatedStatus = this.calculateRecommendStatus(item.start_time, item.end_time)
          if (calculatedStatus !== item.recommend_status) {
            await app.database('t_new_product_recommend')
              .where('recommend_id', item.recommend_id)
              .update({ recommend_status: calculatedStatus })
            item.recommend_status = calculatedStatus
          }
        }
        
        // 添加中文显示字段
        const statusMap = { 0: '未开始', 1: '进行中', 2: '已结束' }
        item.recommend_status_text = statusMap[item.recommend_status] || '-'
        item.is_enabled_text = item.is_enabled === 1 ? '已启用' : '已禁用'
        
        // 格式化时间范围
        if (item.start_time && item.end_time) {
          item.time_range = `${this.formatDateTime(item.start_time)} ~ ${this.formatDateTime(item.end_time)}`
        } else if (item.start_time) {
          item.time_range = `${this.formatDateTime(item.start_time)} 起`
        } else if (item.end_time) {
          item.time_range = `至 ${this.formatDateTime(item.end_time)}`
        } else {
          item.time_range = '长期有效'
        }
      }

      return { list, total }
    }

    /**
     * 获取新品推荐详情
     * @param {String} recommendId - 推荐ID
     * @returns {Promise<Object>} 推荐详情
     */
    async getNewProductRecommendDetail(recommendId) {
      const recommend = await app.database('t_new_product_recommend as npr')
        .leftJoin('t_product as p', 'npr.product_id', 'p.product_id')
        .where('npr.recommend_id', recommendId)
        .where('npr.status', 1)
        .where(function() {
          this.whereNull('p.product_id').orWhere('p.status', 1)
        })
        .select(
          'npr.*',
          'p.product_name',
          'p.product_images',
          'p.price'
        )
        .first()

      if (!recommend) {
        throw new Error('新品推荐不存在')
      }

      // 自动更新状态
      if (!recommend.manual_control || recommend.manual_control === 0) {
        const calculatedStatus = this.calculateRecommendStatus(recommend.start_time, recommend.end_time)
        if (calculatedStatus !== recommend.recommend_status) {
          await app.database('t_new_product_recommend')
            .where('recommend_id', recommendId)
            .update({ recommend_status: calculatedStatus })
          recommend.recommend_status = calculatedStatus
        }
      }

      // 格式化时间
      recommend.start_time = this.formatDateTime(recommend.start_time)
      recommend.end_time = this.formatDateTime(recommend.end_time)
      recommend.create_time = this.formatDateTime(recommend.create_time)
      recommend.update_time = this.formatDateTime(recommend.update_time)

      return recommend
    }

    /**
     * 创建新品推荐
     * @param {Object} data - 推荐数据
     * @returns {Promise<String>} 推荐ID
     */
    async createNewProductRecommend(data) {
      const {
        product_id,
        recommend_title,
        recommend_desc,
        recommend_image,
        sort_order = 0,
        is_enabled = 1,
        start_time,
        end_time,
        created_by
      } = data

      // 验证商品是否存在
      const product = await app.database('t_product')
        .where('product_id', product_id)
        .where('status', 1)
        .first()

      if (!product) {
        throw new Error('商品不存在')
      }

      // 检查商品是否已被推荐
      const existingRecommend = await app.database('t_new_product_recommend')
        .where('product_id', product_id)
        .where('status', 1)
        .first()

      if (existingRecommend) {
        throw new Error('该商品已被推荐')
      }

      // 计算推荐状态
      const recommend_status = this.calculateRecommendStatus(start_time, end_time)

      // 生成推荐ID
      const recommend_id = uuidv4().replace(/-/g, '')

      // 插入数据
      await app.database('t_new_product_recommend').insert({
        recommend_id,
        product_id,
        recommend_title,
        recommend_desc,
        recommend_image,
        sort_order: Number(sort_order),
        is_enabled: Number(is_enabled),
        recommend_status,
        manual_control: 0,
        start_time,
        end_time,
        view_count: 0,
        status: 1,
        created_by
      })

      return recommend_id
    }

    /**
     * 更新新品推荐
     * @param {String} recommendId - 推荐ID
     * @param {Object} data - 更新数据
     * @returns {Promise<void>}
     */
    async updateNewProductRecommend(recommendId, data) {
      const {
        recommend_title,
        recommend_desc,
        recommend_image,
        sort_order,
        is_enabled,
        start_time,
        end_time
      } = data

      // 检查推荐是否存在
      const recommend = await app.database('t_new_product_recommend')
        .where('recommend_id', recommendId)
        .where('status', 1)
        .first()

      if (!recommend) {
        throw new Error('新品推荐不存在')
      }

      // 构建更新对象
      const updateObj = {}

      if (recommend_title !== undefined) updateObj.recommend_title = recommend_title
      if (recommend_desc !== undefined) updateObj.recommend_desc = recommend_desc
      if (recommend_image !== undefined) updateObj.recommend_image = recommend_image
      if (sort_order !== undefined) updateObj.sort_order = Number(sort_order)
      if (start_time !== undefined) updateObj.start_time = start_time
      if (end_time !== undefined) updateObj.end_time = end_time

      // 如果传入了 is_enabled，标记为手动控制
      if (is_enabled !== undefined && is_enabled !== null) {
        updateObj.is_enabled = Number(is_enabled)
        updateObj.manual_control = 1
      }

      // 重新计算推荐状态
      const newStartTime = start_time !== undefined ? start_time : recommend.start_time
      const newEndTime = end_time !== undefined ? end_time : recommend.end_time
      updateObj.recommend_status = this.calculateRecommendStatus(newStartTime, newEndTime)

      // 更新数据
      await app.database('t_new_product_recommend')
        .where('recommend_id', recommendId)
        .update(updateObj)
    }

    /**
     * 删除新品推荐（软删除）
     * @param {String} recommendId - 推荐ID
     * @returns {Promise<void>}
     */
    async deleteNewProductRecommend(recommendId) {
      const recommend = await app.database('t_new_product_recommend')
        .where('recommend_id', recommendId)
        .where('status', 1)
        .first()

      if (!recommend) {
        throw new Error('新品推荐不存在')
      }

      await app.database('t_new_product_recommend')
        .where('recommend_id', recommendId)
        .update({ status: 0 })
    }

    /**
     * 切换推荐状态
     * @param {String} recommendId - 推荐ID
     * @param {Number} isEnabled - 是否启用
     * @returns {Promise<void>}
     */
    async toggleRecommend(recommendId, isEnabled) {
      const recommend = await app.database('t_new_product_recommend')
        .where('recommend_id', recommendId)
        .where('status', 1)
        .first()

      if (!recommend) {
        throw new Error('新品推荐不存在')
      }

      await app.database('t_new_product_recommend')
        .where('recommend_id', recommendId)
        .update({ 
          is_enabled: Number(isEnabled),
          manual_control: 1
        })
    }

    /**
     * 批量设为推荐
     * @param {Array} recommendIds - 推荐ID数组
     * @returns {Promise<void>}
     */
    async batchEnable(recommendIds) {
      if (!recommendIds || recommendIds.length === 0) {
        throw new Error('请选择要操作的推荐')
      }

      await app.database('t_new_product_recommend')
        .whereIn('recommend_id', recommendIds)
        .where('status', 1)
        .update({ is_enabled: 1, manual_control: 1 })
    }

    /**
     * 批量取消推荐
     * @param {Array} recommendIds - 推荐ID数组
     * @returns {Promise<void>}
     */
    async batchDisable(recommendIds) {
      if (!recommendIds || recommendIds.length === 0) {
        throw new Error('请选择要操作的推荐')
      }

      await app.database('t_new_product_recommend')
        .whereIn('recommend_id', recommendIds)
        .where('status', 1)
        .update({ is_enabled: 0, manual_control: 1 })
    }

    /**
     * 批量删除
     * @param {Array} recommendIds - 推荐ID数组
     * @returns {Promise<void>}
     */
    async batchDelete(recommendIds) {
      if (!recommendIds || recommendIds.length === 0) {
        throw new Error('请选择要删除的推荐')
      }

      await app.database('t_new_product_recommend')
        .whereIn('recommend_id', recommendIds)
        .update({ status: 0 })
    }

    /**
     * 获取可推荐的商品列表（未被推荐的商品）
     * @param {Object} params - 查询参数
     * @param {String} params.keyword - 搜索关键词
     * @returns {Promise<Array>} 商品列表
     */
    async getAvailableProducts(params = {}) {
      const { keyword } = params

      // 获取所有已推荐的商品ID
      const recommendedProductIds = await app.database('t_new_product_recommend')
        .where('status', 1)
        .pluck('product_id')

      // 查询未被推荐的商品
      let query = app.database('t_product')
        .where('status', 1)

      if (recommendedProductIds.length > 0) {
        query = query.whereNotIn('product_id', recommendedProductIds)
      }

      // 根据关键词搜索
      if (keyword) {
        query = query.where('product_name', 'like', `%${keyword}%`)
      }

      const products = await query
        .select('product_id', 'product_name', 'product_images', 'price')
        .orderBy('create_time', 'desc')
        .limit(100)

      return products
    }
  }
}
