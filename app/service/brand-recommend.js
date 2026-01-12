/**
 * 品牌推荐服务
 */
module.exports = (app) => {
  const { v4: uuidv4 } = require('uuid')

  return class BrandRecommendService {
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
     * 获取品牌推荐列表
     * @param {Object} params - 查询参数
     * @returns {Promise<Object>} 返回列表和总数
     */
    async getBrandRecommendList(params) {
      const {
        page = 1,
        pageSize = 10,
        brand_name,
        is_enabled,
        recommend_status,
        sort_field: sortField,
        sort_order: sortOrder
      } = params

      const offset = (page - 1) * pageSize

      // 构建查询
      let query = app.database('t_brand_recommend as br')
        .leftJoin('t_product_brand as pb', 'br.brand_id', 'pb.brand_id')
        .where('br.status', 1)

      // 搜索条件
      if (brand_name) {
        query = query.where(function() {
          this.where('pb.brand_name', 'like', `%${brand_name}%`)
            .andWhere('pb.status', 1)
        })
      } else {
        // 如果没有品牌名称搜索，也要过滤品牌状态
        query = query.where(function() {
          this.whereNull('pb.brand_id').orWhere('pb.status', 1)
        })
      }
      if (is_enabled !== undefined && is_enabled !== null && is_enabled !== '') {
        query = query.where('br.is_enabled', is_enabled)
      }
      if (recommend_status !== undefined && recommend_status !== null && recommend_status !== '') {
        query = query.where('br.recommend_status', recommend_status)
      }

      // 排序
      const allowedSortFields = ['sort_order', 'create_time', 'view_count']
      let orderByField = 'br.sort_order'
      let orderByDirection = 'asc'

      if (sortField && allowedSortFields.includes(sortField)) {
        orderByField = `br.${sortField}`
        orderByDirection = sortOrder === 'desc' ? 'desc' : 'asc'
      }

      // 查询列表
      const list = await query
        .clone()
        .select(
          'br.*',
          'pb.brand_name',
          'pb.brand_name_en',
          'pb.logo_url as brand_logo',
          'pb.first_letter'
        )
        .orderBy(orderByField, orderByDirection)
        .limit(pageSize)
        .offset(offset)

      // 查询总数
      const totalResult = await query.clone().count('* as count').first()
      const total = totalResult ? totalResult.count : 0

      // 自动更新推荐状态
      for (const item of list) {
        const calculatedStatus = this.calculateRecommendStatus(item.start_time, item.end_time)
        if (calculatedStatus !== item.recommend_status) {
          await app.database('t_brand_recommend')
            .where('recommend_id', item.recommend_id)
            .update({ recommend_status: calculatedStatus })
          item.recommend_status = calculatedStatus
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
     * 获取品牌推荐详情
     * @param {String} recommendId - 推荐ID
     * @returns {Promise<Object>} 推荐详情
     */
    async getBrandRecommendDetail(recommendId) {
      const recommend = await app.database('t_brand_recommend as br')
        .leftJoin('t_product_brand as pb', 'br.brand_id', 'pb.brand_id')
        .where('br.recommend_id', recommendId)
        .where('br.status', 1)
        .where(function() {
          this.whereNull('pb.brand_id').orWhere('pb.status', 1)
        })
        .select(
          'br.*',
          'pb.brand_name',
          'pb.brand_name_en',
          'pb.logo_url as brand_logo',
          'pb.first_letter'
        )
        .first()

      if (!recommend) {
        throw new Error('品牌推荐不存在')
      }

      // 自动更新状态
      const calculatedStatus = this.calculateRecommendStatus(recommend.start_time, recommend.end_time)
      if (calculatedStatus !== recommend.recommend_status) {
        await app.database('t_brand_recommend')
          .where('recommend_id', recommendId)
          .update({ recommend_status: calculatedStatus })
        recommend.recommend_status = calculatedStatus
      }

      // 格式化时间
      recommend.start_time = this.formatDateTime(recommend.start_time)
      recommend.end_time = this.formatDateTime(recommend.end_time)
      recommend.create_time = this.formatDateTime(recommend.create_time)
      recommend.update_time = this.formatDateTime(recommend.update_time)

      return recommend
    }

    /**
     * 创建品牌推荐
     * @param {Object} data - 推荐数据
     * @returns {Promise<String>} 推荐ID
     */
    async createBrandRecommend(data) {
      const {
        brand_id,
        recommend_title,
        recommend_desc,
        banner_image,
        link_url,
        sort_order = 0,
        is_enabled = 1,
        start_time,
        end_time,
        created_by
      } = data

      // 验证品牌是否存在
      const brand = await app.database('t_product_brand')
        .where('brand_id', brand_id)
        .where('status', 1)
        .first()

      if (!brand) {
        throw new Error('品牌不存在')
      }

      // 检查品牌是否已被推荐
      const existingRecommend = await app.database('t_brand_recommend')
        .where('brand_id', brand_id)
        .where('status', 1)
        .first()

      if (existingRecommend) {
        throw new Error('该品牌已被推荐')
      }

      // 计算推荐状态
      const recommend_status = this.calculateRecommendStatus(start_time, end_time)

      // 生成推荐ID
      const recommend_id = uuidv4().replace(/-/g, '')

      // 插入数据
      await app.database('t_brand_recommend').insert({
        recommend_id,
        brand_id,
        recommend_title,
        recommend_desc,
        banner_image,
        link_url,
        sort_order: Number(sort_order),
        is_enabled: Number(is_enabled),
        recommend_status,
        start_time,
        end_time,
        view_count: 0,
        status: 1,
        created_by
      })

      return recommend_id
    }

    /**
     * 更新品牌推荐
     * @param {String} recommendId - 推荐ID
     * @param {Object} data - 更新数据
     * @returns {Promise<void>}
     */
    async updateBrandRecommend(recommendId, data) {
      const {
        recommend_title,
        recommend_desc,
        banner_image,
        link_url,
        sort_order,
        is_enabled,
        start_time,
        end_time
      } = data

      // 检查推荐是否存在
      const recommend = await app.database('t_brand_recommend')
        .where('recommend_id', recommendId)
        .where('status', 1)
        .first()

      if (!recommend) {
        throw new Error('品牌推荐不存在')
      }

      // 构建更新对象
      const updateObj = {}

      if (recommend_title !== undefined) updateObj.recommend_title = recommend_title
      if (recommend_desc !== undefined) updateObj.recommend_desc = recommend_desc
      if (banner_image !== undefined) updateObj.banner_image = banner_image
      if (link_url !== undefined) updateObj.link_url = link_url
      if (sort_order !== undefined) updateObj.sort_order = Number(sort_order)
      if (is_enabled !== undefined) updateObj.is_enabled = Number(is_enabled)
      if (start_time !== undefined) updateObj.start_time = start_time
      if (end_time !== undefined) updateObj.end_time = end_time

      // 重新计算推荐状态
      const newStartTime = start_time !== undefined ? start_time : recommend.start_time
      const newEndTime = end_time !== undefined ? end_time : recommend.end_time
      updateObj.recommend_status = this.calculateRecommendStatus(newStartTime, newEndTime)

      // 更新数据
      await app.database('t_brand_recommend')
        .where('recommend_id', recommendId)
        .update(updateObj)
    }

    /**
     * 删除品牌推荐（软删除）
     * @param {String} recommendId - 推荐ID
     * @returns {Promise<void>}
     */
    async deleteBrandRecommend(recommendId) {
      const recommend = await app.database('t_brand_recommend')
        .where('recommend_id', recommendId)
        .where('status', 1)
        .first()

      if (!recommend) {
        throw new Error('品牌推荐不存在')
      }

      await app.database('t_brand_recommend')
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
      const recommend = await app.database('t_brand_recommend')
        .where('recommend_id', recommendId)
        .where('status', 1)
        .first()

      if (!recommend) {
        throw new Error('品牌推荐不存在')
      }

      await app.database('t_brand_recommend')
        .where('recommend_id', recommendId)
        .update({ is_enabled: Number(isEnabled) })
    }

    /**
     * 设置排序
     * @param {String} recommendId - 推荐ID
     * @param {Number} sortOrder - 排序值
     * @returns {Promise<void>}
     */
    async setSortOrder(recommendId, sortOrder) {
      const recommend = await app.database('t_brand_recommend')
        .where('recommend_id', recommendId)
        .where('status', 1)
        .first()

      if (!recommend) {
        throw new Error('品牌推荐不存在')
      }

      await app.database('t_brand_recommend')
        .where('recommend_id', recommendId)
        .update({ sort_order: Number(sortOrder) })
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

      await app.database('t_brand_recommend')
        .whereIn('recommend_id', recommendIds)
        .where('status', 1)
        .update({ is_enabled: 1 })
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

      await app.database('t_brand_recommend')
        .whereIn('recommend_id', recommendIds)
        .where('status', 1)
        .update({ is_enabled: 0 })
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

      await app.database('t_brand_recommend')
        .whereIn('recommend_id', recommendIds)
        .update({ status: 0 })
    }

    /**
     * 获取可推荐的品牌列表（未被推荐的品牌）
     * @param {Object} params - 查询参数
     * @param {String} params.keyword - 搜索关键词
     * @returns {Promise<Array>} 品牌列表
     */
    async getAvailableBrands(params = {}) {
      const { keyword } = params

      // 获取所有已推荐的品牌ID
      const recommendedBrandIds = await app.database('t_brand_recommend')
        .where('status', 1)
        .pluck('brand_id')

      // 查询未被推荐的品牌
      let query = app.database('t_product_brand')
        .where('status', 1)

      if (recommendedBrandIds.length > 0) {
        query = query.whereNotIn('brand_id', recommendedBrandIds)
      }

      // 根据关键词搜索
      if (keyword) {
        query = query.where(function() {
          this.where('brand_name', 'like', `%${keyword}%`)
            .orWhere('brand_name_en', 'like', `%${keyword}%`)
        })
      }

      const brands = await query
        .select('brand_id', 'brand_name', 'brand_name_en', 'logo_url', 'first_letter')
        .orderBy('sort_order', 'asc')
        .limit(100)

      return brands
    }
  }
}
