/**
 * 广告推荐服务
 */
module.exports = (app) => {
  const { v4: uuidv4 } = require('uuid')

  return class AdvertisementService {
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
     * 计算广告状态
     * @param {String} startTime - 开始时间
     * @param {String} endTime - 结束时间
     * @returns {Number} 广告状态（0-未开始，1-进行中，2-已结束）
     */
    calculateAdStatus(startTime, endTime) {
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
     * 获取广告列表
     * @param {Object} params - 查询参数
     * @returns {Promise<Object>} 返回列表和总数
     */
    async getAdvertisementList(params) {
      const {
        page = 1,
        pageSize = 10,
        ad_name,
        ad_position,
        ad_type,
        is_enabled,
        ad_status,
        sort_field: sortField,
        sort_order: sortOrder
      } = params

      const offset = (page - 1) * pageSize

      // 构建查询
      let query = app.database('t_advertisement')
        .where('status', 1)

      // 搜索条件
      if (ad_name) {
        query = query.where('ad_name', 'like', `%${ad_name}%`)
      }
      if (ad_position) {
        query = query.where('ad_position', ad_position)
      }
      if (ad_type !== undefined && ad_type !== null && ad_type !== '') {
        query = query.where('ad_type', ad_type)
      }
      if (is_enabled !== undefined && is_enabled !== null && is_enabled !== '') {
        query = query.where('is_enabled', is_enabled)
      }
      if (ad_status !== undefined && ad_status !== null && ad_status !== '') {
        query = query.where('ad_status', ad_status)
      }

      // 排序
      const allowedSortFields = ['sort_order', 'create_time', 'click_count']
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
          const calculatedStatus = this.calculateAdStatus(item.start_time, item.end_time)
          if (calculatedStatus !== item.ad_status) {
            await app.database('t_advertisement')
              .where('ad_id', item.ad_id)
              .update({ ad_status: calculatedStatus })
            item.ad_status = calculatedStatus
          }
        }
        
        // 添加中文显示字段
        const typeMap = { 1: '图片', 2: '视频', 3: 'HTML' }
        item.ad_type_text = typeMap[item.ad_type] || '-'
        
        const statusMap = { 0: '未开始', 1: '进行中', 2: '已结束' }
        item.ad_status_text = statusMap[item.ad_status] || '-'
        
        item.is_enabled_text = item.is_enabled === 1 ? '已启用' : '已禁用'
        
        const linkTypeMap = { 1: '商品', 2: '分类', 3: '品牌', 4: '专题', 5: '外部链接' }
        item.link_type_text = item.link_type ? linkTypeMap[item.link_type] : '-'
        
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
     * 获取广告详情
     * @param {String} adId - 广告ID
     * @returns {Promise<Object>} 广告详情
     */
    async getAdvertisementDetail(adId) {
      const ad = await app.database('t_advertisement')
        .where('ad_id', adId)
        .where('status', 1)
        .first()

      if (!ad) {
        throw new Error('广告不存在')
      }

      // 自动更新状态
      if (!ad.manual_control || ad.manual_control === 0) {
        const calculatedStatus = this.calculateAdStatus(ad.start_time, ad.end_time)
        if (calculatedStatus !== ad.ad_status) {
          await app.database('t_advertisement')
            .where('ad_id', adId)
            .update({ ad_status: calculatedStatus })
          ad.ad_status = calculatedStatus
        }
      }

      // 格式化时间
      ad.start_time = this.formatDateTime(ad.start_time)
      ad.end_time = this.formatDateTime(ad.end_time)
      ad.create_time = this.formatDateTime(ad.create_time)
      ad.update_time = this.formatDateTime(ad.update_time)

      return ad
    }

    /**
     * 创建广告
     * @param {Object} data - 广告数据
     * @returns {Promise<String>} 广告ID
     */
    async createAdvertisement(data) {
      const {
        ad_name,
        ad_position,
        ad_type,
        ad_image,
        ad_video,
        ad_html,
        link_url,
        link_type,
        link_target,
        sort_order = 0,
        is_enabled = 1,
        start_time,
        end_time,
        created_by
      } = data

      // 验证必填字段
      if (!ad_name) {
        throw new Error('广告名称不能为空')
      }
      if (!ad_position) {
        throw new Error('广告位置不能为空')
      }
      if (!ad_type || ![1, 2, 3].includes(Number(ad_type))) {
        throw new Error('广告类型无效')
      }

      // 根据广告类型验证内容
      if (Number(ad_type) === 1 && !ad_image) {
        throw new Error('图片广告必须上传图片')
      }
      if (Number(ad_type) === 2 && !ad_video) {
        throw new Error('视频广告必须上传视频')
      }
      if (Number(ad_type) === 3 && !ad_html) {
        throw new Error('HTML广告必须填写HTML代码')
      }

      // 计算广告状态
      const ad_status = this.calculateAdStatus(start_time, end_time)

      // 生成广告ID
      const ad_id = uuidv4().replace(/-/g, '')

      // 插入数据
      await app.database('t_advertisement').insert({
        ad_id,
        ad_name,
        ad_position,
        ad_type: Number(ad_type),
        ad_image,
        ad_video,
        ad_html,
        link_url,
        link_type: link_type ? Number(link_type) : null,
        link_target,
        sort_order: Number(sort_order),
        is_enabled: Number(is_enabled),
        ad_status,
        manual_control: 0,
        start_time,
        end_time,
        click_count: 0,
        status: 1,
        created_by
      })

      return ad_id
    }

    /**
     * 更新广告
     * @param {String} adId - 广告ID
     * @param {Object} data - 更新数据
     * @returns {Promise<void>}
     */
    async updateAdvertisement(adId, data) {
      const {
        ad_name,
        ad_position,
        ad_type,
        ad_image,
        ad_video,
        ad_html,
        link_url,
        link_type,
        link_target,
        sort_order,
        is_enabled,
        start_time,
        end_time
      } = data

      // 检查广告是否存在
      const ad = await app.database('t_advertisement')
        .where('ad_id', adId)
        .where('status', 1)
        .first()

      if (!ad) {
        throw new Error('广告不存在')
      }

      // 构建更新对象
      const updateObj = {}

      if (ad_name !== undefined) updateObj.ad_name = ad_name
      if (ad_position !== undefined) updateObj.ad_position = ad_position
      if (ad_type !== undefined) updateObj.ad_type = Number(ad_type)
      if (ad_image !== undefined) updateObj.ad_image = ad_image
      if (ad_video !== undefined) updateObj.ad_video = ad_video
      if (ad_html !== undefined) updateObj.ad_html = ad_html
      if (link_url !== undefined) updateObj.link_url = link_url
      if (link_type !== undefined) updateObj.link_type = link_type ? Number(link_type) : null
      if (link_target !== undefined) updateObj.link_target = link_target
      if (sort_order !== undefined) updateObj.sort_order = Number(sort_order)
      if (start_time !== undefined) updateObj.start_time = start_time
      if (end_time !== undefined) updateObj.end_time = end_time

      // 如果传入了 is_enabled，标记为手动控制
      if (is_enabled !== undefined && is_enabled !== null) {
        updateObj.is_enabled = Number(is_enabled)
        updateObj.manual_control = 1
      }

      // 重新计算广告状态
      const newStartTime = start_time !== undefined ? start_time : ad.start_time
      const newEndTime = end_time !== undefined ? end_time : ad.end_time
      updateObj.ad_status = this.calculateAdStatus(newStartTime, newEndTime)

      // 更新数据
      await app.database('t_advertisement')
        .where('ad_id', adId)
        .update(updateObj)
    }

    /**
     * 删除广告（软删除）
     * @param {String} adId - 广告ID
     * @returns {Promise<void>}
     */
    async deleteAdvertisement(adId) {
      const ad = await app.database('t_advertisement')
        .where('ad_id', adId)
        .where('status', 1)
        .first()

      if (!ad) {
        throw new Error('广告不存在')
      }

      await app.database('t_advertisement')
        .where('ad_id', adId)
        .update({ status: 0 })
    }

    /**
     * 切换启用状态
     * @param {String} adId - 广告ID
     * @param {Number} isEnabled - 是否启用
     * @returns {Promise<void>}
     */
    async toggleEnabled(adId, isEnabled) {
      const ad = await app.database('t_advertisement')
        .where('ad_id', adId)
        .where('status', 1)
        .first()

      if (!ad) {
        throw new Error('广告不存在')
      }

      await app.database('t_advertisement')
        .where('ad_id', adId)
        .update({ 
          is_enabled: Number(isEnabled),
          manual_control: 1
        })
    }

    /**
     * 批量启用
     * @param {Array} adIds - 广告ID数组
     * @returns {Promise<void>}
     */
    async batchEnable(adIds) {
      if (!adIds || adIds.length === 0) {
        throw new Error('请选择要操作的广告')
      }

      await app.database('t_advertisement')
        .whereIn('ad_id', adIds)
        .where('status', 1)
        .update({ is_enabled: 1, manual_control: 1 })
    }

    /**
     * 批量禁用
     * @param {Array} adIds - 广告ID数组
     * @returns {Promise<void>}
     */
    async batchDisable(adIds) {
      if (!adIds || adIds.length === 0) {
        throw new Error('请选择要操作的广告')
      }

      await app.database('t_advertisement')
        .whereIn('ad_id', adIds)
        .where('status', 1)
        .update({ is_enabled: 0, manual_control: 1 })
    }

    /**
     * 批量删除
     * @param {Array} adIds - 广告ID数组
     * @returns {Promise<void>}
     */
    async batchDelete(adIds) {
      if (!adIds || adIds.length === 0) {
        throw new Error('请选择要删除的广告')
      }

      await app.database('t_advertisement')
        .whereIn('ad_id', adIds)
        .update({ status: 0 })
    }
  }
}
