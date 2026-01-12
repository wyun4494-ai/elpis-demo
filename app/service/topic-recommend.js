/**
 * 专题推荐服务
 */
module.exports = (app) => {
  const { v4: uuidv4 } = require('uuid')

  return class TopicRecommendService {
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
     * 计算专题状态
     * @param {String} startTime - 开始时间
     * @param {String} endTime - 结束时间
     * @returns {Number} 专题状态（0-未开始，1-进行中，2-已结束）
     */
    calculateTopicStatus(startTime, endTime) {
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
     * 解析 JSON 字段
     * @param {String} jsonStr - JSON 字符串
     * @returns {Array} 解析后的数组
     */
    parseJsonField(jsonStr) {
      if (!jsonStr) return []
      try {
        return JSON.parse(jsonStr)
      } catch (error) {
        return []
      }
    }

    /**
     * 获取专题推荐列表
     * @param {Object} params - 查询参数
     * @returns {Promise<Object>} 返回列表和总数
     */
    async getTopicRecommendList(params) {
      const {
        page = 1,
        pageSize = 10,
        topic_name,
        topic_type,
        is_enabled,
        topic_status,
        sort_field: sortField,
        sort_order: sortOrder
      } = params

      const offset = (page - 1) * pageSize

      // 构建查询
      let query = app.database('t_topic_recommend')
        .where('status', 1)

      // 搜索条件
      if (topic_name) {
        query = query.where('topic_name', 'like', `%${topic_name}%`)
      }
      if (topic_type !== undefined && topic_type !== null && topic_type !== '') {
        query = query.where('topic_type', topic_type)
      }
      if (is_enabled !== undefined && is_enabled !== null && is_enabled !== '') {
        query = query.where('is_enabled', is_enabled)
      }
      if (topic_status !== undefined && topic_status !== null && topic_status !== '') {
        query = query.where('topic_status', topic_status)
      }

      // 排序
      const allowedSortFields = ['sort_order', 'create_time', 'view_count']
      let orderByField = 'sort_order'
      let orderByDirection = 'asc'

      if (sortField && allowedSortFields.includes(sortField)) {
        orderByField = sortField
        orderByDirection = sortOrder === 'desc' ? 'desc' : 'asc'
      }

      // 查询列表
      const list = await query
        .clone()
        .select('*')
        .orderBy(orderByField, orderByDirection)
        .limit(pageSize)
        .offset(offset)

      // 查询总数
      const totalResult = await query.clone().count('* as count').first()
      const total = totalResult ? totalResult.count : 0

      // 处理列表数据
      for (const item of list) {
        // 只有非手动控制的才自动计算
        if (!item.manual_control || item.manual_control === 0) {
          const calculatedStatus = this.calculateTopicStatus(item.start_time, item.end_time)
          if (calculatedStatus !== item.topic_status) {
            await app.database('t_topic_recommend')
              .where('topic_id', item.topic_id)
              .update({ topic_status: calculatedStatus })
            item.topic_status = calculatedStatus
          }
        }
        
        // 添加中文显示字段
        const typeMap = { 1: '商品专题', 2: '品牌专题', 3: '分类专题' }
        item.topic_type_text = typeMap[item.topic_type] || '-'
        
        const statusMap = { 0: '未开始', 1: '进行中', 2: '已结束' }
        item.topic_status_text = statusMap[item.topic_status] || '-'
        
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

        // 解析关联数据并统计数量
        const relatedProducts = this.parseJsonField(item.related_products)
        const relatedBrands = this.parseJsonField(item.related_brands)
        const relatedCategories = this.parseJsonField(item.related_categories)
        
        item.related_count = relatedProducts.length + relatedBrands.length + relatedCategories.length
      }

      return { list, total }
    }

    /**
     * 获取专题推荐详情
     * @param {String} topicId - 专题ID
     * @returns {Promise<Object>} 专题详情
     */
    async getTopicRecommendDetail(topicId) {
      const topic = await app.database('t_topic_recommend')
        .where('topic_id', topicId)
        .where('status', 1)
        .first()

      if (!topic) {
        throw new Error('专题推荐不存在')
      }

      // 自动更新状态
      if (!topic.manual_control || topic.manual_control === 0) {
        const calculatedStatus = this.calculateTopicStatus(topic.start_time, topic.end_time)
        if (calculatedStatus !== topic.topic_status) {
          await app.database('t_topic_recommend')
            .where('topic_id', topicId)
            .update({ topic_status: calculatedStatus })
          topic.topic_status = calculatedStatus
        }
      }

      // 格式化时间
      topic.start_time = this.formatDateTime(topic.start_time)
      topic.end_time = this.formatDateTime(topic.end_time)
      topic.create_time = this.formatDateTime(topic.create_time)
      topic.update_time = this.formatDateTime(topic.update_time)

      // 解析关联数据
      topic.related_products_array = this.parseJsonField(topic.related_products)
      topic.related_brands_array = this.parseJsonField(topic.related_brands)
      topic.related_categories_array = this.parseJsonField(topic.related_categories)

      // 根据专题类型获取关联数据的详细信息
      if (topic.topic_type === 1 && topic.related_products_array.length > 0) {
        // 商品专题 - 获取商品详情
        const products = await app.database('t_product')
          .whereIn('product_id', topic.related_products_array)
          .where('status', 1)
          .select('product_id', 'product_name', 'product_images', 'price')
        topic.related_products_detail = products
      }

      if (topic.topic_type === 2 && topic.related_brands_array.length > 0) {
        // 品牌专题 - 获取品牌详情
        const brands = await app.database('t_product_brand')
          .whereIn('brand_id', topic.related_brands_array)
          .where('status', 1)
          .select('brand_id', 'brand_name', 'brand_name_en', 'logo_url')
        topic.related_brands_detail = brands
      }

      if (topic.topic_type === 3 && topic.related_categories_array.length > 0) {
        // 分类专题 - 获取分类详情
        const categories = await app.database('t_product_category')
          .whereIn('category_id', topic.related_categories_array)
          .where('status', 1)
          .select('category_id', 'category_name', 'full_name', 'category_image')
        topic.related_categories_detail = categories
      }

      return topic
    }

    /**
     * 创建专题推荐
     * @param {Object} data - 专题数据
     * @returns {Promise<String>} 专题ID
     */
    async createTopicRecommend(data) {
      const {
        topic_name,
        topic_desc,
        cover_image,
        banner_image,
        topic_type,
        related_products,
        related_brands,
        related_categories,
        link_url,
        sort_order = 0,
        is_enabled = 1,
        start_time,
        end_time,
        created_by
      } = data

      // 验证必填字段
      if (!topic_name) {
        throw new Error('专题名称不能为空')
      }
      if (!cover_image) {
        throw new Error('封面图片不能为空')
      }
      if (!topic_type || ![1, 2, 3].includes(Number(topic_type))) {
        throw new Error('专题类型无效')
      }

      // 计算专题状态
      const topic_status = this.calculateTopicStatus(start_time, end_time)

      // 生成专题ID
      const topic_id = uuidv4().replace(/-/g, '')

      // 处理关联数据（转换为 JSON 字符串）
      const relatedProductsJson = related_products ? JSON.stringify(related_products) : null
      const relatedBrandsJson = related_brands ? JSON.stringify(related_brands) : null
      const relatedCategoriesJson = related_categories ? JSON.stringify(related_categories) : null

      // 插入数据
      await app.database('t_topic_recommend').insert({
        topic_id,
        topic_name,
        topic_desc,
        cover_image,
        banner_image,
        topic_type: Number(topic_type),
        related_products: relatedProductsJson,
        related_brands: relatedBrandsJson,
        related_categories: relatedCategoriesJson,
        link_url,
        sort_order: Number(sort_order),
        is_enabled: Number(is_enabled),
        topic_status,
        manual_control: 0,
        start_time,
        end_time,
        view_count: 0,
        status: 1,
        created_by
      })

      return topic_id
    }

    /**
     * 更新专题推荐
     * @param {String} topicId - 专题ID
     * @param {Object} data - 更新数据
     * @returns {Promise<void>}
     */
    async updateTopicRecommend(topicId, data) {
      const {
        topic_name,
        topic_desc,
        cover_image,
        banner_image,
        topic_type,
        related_products,
        related_brands,
        related_categories,
        link_url,
        sort_order,
        is_enabled,
        start_time,
        end_time
      } = data

      // 检查专题是否存在
      const topic = await app.database('t_topic_recommend')
        .where('topic_id', topicId)
        .where('status', 1)
        .first()

      if (!topic) {
        throw new Error('专题推荐不存在')
      }

      // 构建更新对象
      const updateObj = {}

      if (topic_name !== undefined) updateObj.topic_name = topic_name
      if (topic_desc !== undefined) updateObj.topic_desc = topic_desc
      if (cover_image !== undefined) updateObj.cover_image = cover_image
      if (banner_image !== undefined) updateObj.banner_image = banner_image
      if (topic_type !== undefined) updateObj.topic_type = Number(topic_type)
      if (link_url !== undefined) updateObj.link_url = link_url
      if (sort_order !== undefined) updateObj.sort_order = Number(sort_order)
      if (start_time !== undefined) updateObj.start_time = start_time
      if (end_time !== undefined) updateObj.end_time = end_time

      // 处理关联数据
      if (related_products !== undefined) {
        updateObj.related_products = related_products ? JSON.stringify(related_products) : null
      }
      if (related_brands !== undefined) {
        updateObj.related_brands = related_brands ? JSON.stringify(related_brands) : null
      }
      if (related_categories !== undefined) {
        updateObj.related_categories = related_categories ? JSON.stringify(related_categories) : null
      }

      // 如果传入了 is_enabled，标记为手动控制
      if (is_enabled !== undefined && is_enabled !== null) {
        updateObj.is_enabled = Number(is_enabled)
        updateObj.manual_control = 1
      }

      // 重新计算专题状态
      const newStartTime = start_time !== undefined ? start_time : topic.start_time
      const newEndTime = end_time !== undefined ? end_time : topic.end_time
      updateObj.topic_status = this.calculateTopicStatus(newStartTime, newEndTime)

      // 更新数据
      await app.database('t_topic_recommend')
        .where('topic_id', topicId)
        .update(updateObj)
    }

    /**
     * 删除专题推荐（软删除）
     * @param {String} topicId - 专题ID
     * @returns {Promise<void>}
     */
    async deleteTopicRecommend(topicId) {
      const topic = await app.database('t_topic_recommend')
        .where('topic_id', topicId)
        .where('status', 1)
        .first()

      if (!topic) {
        throw new Error('专题推荐不存在')
      }

      await app.database('t_topic_recommend')
        .where('topic_id', topicId)
        .update({ status: 0 })
    }

    /**
     * 切换推荐状态
     * @param {String} topicId - 专题ID
     * @param {Number} isEnabled - 是否启用
     * @returns {Promise<void>}
     */
    async toggleRecommend(topicId, isEnabled) {
      const topic = await app.database('t_topic_recommend')
        .where('topic_id', topicId)
        .where('status', 1)
        .first()

      if (!topic) {
        throw new Error('专题推荐不存在')
      }

      await app.database('t_topic_recommend')
        .where('topic_id', topicId)
        .update({ 
          is_enabled: Number(isEnabled),
          manual_control: 1
        })
    }

    /**
     * 批量设为推荐
     * @param {Array} topicIds - 专题ID数组
     * @returns {Promise<void>}
     */
    async batchEnable(topicIds) {
      if (!topicIds || topicIds.length === 0) {
        throw new Error('请选择要操作的专题')
      }

      await app.database('t_topic_recommend')
        .whereIn('topic_id', topicIds)
        .where('status', 1)
        .update({ is_enabled: 1, manual_control: 1 })
    }

    /**
     * 批量取消推荐
     * @param {Array} topicIds - 专题ID数组
     * @returns {Promise<void>}
     */
    async batchDisable(topicIds) {
      if (!topicIds || topicIds.length === 0) {
        throw new Error('请选择要操作的专题')
      }

      await app.database('t_topic_recommend')
        .whereIn('topic_id', topicIds)
        .where('status', 1)
        .update({ is_enabled: 0, manual_control: 1 })
    }

    /**
     * 批量删除
     * @param {Array} topicIds - 专题ID数组
     * @returns {Promise<void>}
     */
    async batchDelete(topicIds) {
      if (!topicIds || topicIds.length === 0) {
        throw new Error('请选择要删除的专题')
      }

      await app.database('t_topic_recommend')
        .whereIn('topic_id', topicIds)
        .update({ status: 0 })
    }
  }
}
