/**
 * 广告位置服务
 */
const { v4: uuidv4 } = require('uuid');

module.exports = (app) => {
  return class AdPositionService {
    /**
     * 获取广告位置列表
     */
    async getList(params) {
      const { keyword, is_enabled, page = 1, pageSize = 10 } = params;

      // 构建查询
      let query = app.database('t_ad_position')
        .where('status', 1);

      // 关键词搜索
      if (keyword) {
        query = query.where(function() {
          this.where('position_name', 'like', `%${keyword}%`)
            .orWhere('position_key', 'like', `%${keyword}%`)
            .orWhere('position_desc', 'like', `%${keyword}%`);
        });
      }

      // 启用状态筛选
      if (is_enabled !== undefined && is_enabled !== null && is_enabled !== '') {
        query = query.where('is_enabled', Number(is_enabled));
      }

      // 查询总数
      const countQuery = query.clone();
      const totalResult = await countQuery.count('* as total').first();
      const total = totalResult ? totalResult.total : 0;

      // 查询列表
      const list = await query
        .orderBy('sort_order', 'asc')
        .orderBy('create_time', 'desc')
        .limit(pageSize)
        .offset((page - 1) * pageSize);

      // 格式化数据
      const formattedList = list.map(item => ({
        ...item,
        is_enabled_text: item.is_enabled === 1 ? '已启用' : '已禁用',
        size_text: item.width && item.height ? `${item.width} × ${item.height}` : '未设置'
      }));

      return { list: formattedList, total, page: Number(page), pageSize: Number(pageSize) };
    }

    /**
     * 获取所有启用的广告位置（用于下拉选择）
     */
    async getAllEnabled() {
      const list = await app.database('t_ad_position')
        .where('status', 1)
        .where('is_enabled', 1)
        .orderBy('sort_order', 'asc')
        .select('position_id', 'position_key', 'position_name', 'position_desc', 'width', 'height');

      return list;
    }

    /**
     * 获取广告位置详情
     */
    async getDetail(positionId) {
      const detail = await app.database('t_ad_position')
        .where('position_id', positionId)
        .where('status', 1)
        .first();

      if (!detail) {
        throw new Error('广告位置不存在');
      }

      return detail;
    }

    /**
     * 创建广告位置
     */
    async create(data) {
      const { position_key, position_name, position_desc, width, height, max_count, is_enabled, sort_order } = data;

      // 检查位置标识是否已存在
      const existing = await app.database('t_ad_position')
        .where('position_key', position_key)
        .where('status', 1)
        .first();

      if (existing) {
        throw new Error('位置标识已存在');
      }

      // 生成ID
      const positionId = uuidv4().replace(/-/g, '');

      // 插入数据
      await app.database('t_ad_position').insert({
        position_id: positionId,
        position_key,
        position_name,
        position_desc: position_desc || null,
        width: width || null,
        height: height || null,
        max_count: max_count || 1,
        is_enabled: is_enabled !== undefined ? Number(is_enabled) : 1,
        sort_order: sort_order || 0,
        status: 1,
        created_by: 'system'
      });

      return { position_id: positionId };
    }

    /**
     * 更新广告位置
     */
    async update(data) {
      const { position_id, position_key, position_name, position_desc, width, height, max_count, is_enabled, sort_order } = data;

      // 检查位置是否存在
      const existing = await app.database('t_ad_position')
        .where('position_id', position_id)
        .where('status', 1)
        .first();

      if (!existing) {
        throw new Error('广告位置不存在');
      }

      // 如果修改了位置标识，检查是否重复
      if (position_key && position_key !== existing.position_key) {
        const duplicate = await app.database('t_ad_position')
          .where('position_key', position_key)
          .where('status', 1)
          .whereNot('position_id', position_id)
          .first();

        if (duplicate) {
          throw new Error('位置标识已存在');
        }
      }

      // 构建更新对象
      const updateObj = {};
      if (position_key !== undefined) updateObj.position_key = position_key;
      if (position_name !== undefined) updateObj.position_name = position_name;
      if (position_desc !== undefined) updateObj.position_desc = position_desc;
      if (width !== undefined) updateObj.width = width;
      if (height !== undefined) updateObj.height = height;
      if (max_count !== undefined) updateObj.max_count = max_count;
      if (is_enabled !== undefined) updateObj.is_enabled = Number(is_enabled);
      if (sort_order !== undefined) updateObj.sort_order = sort_order;

      // 更新数据
      await app.database('t_ad_position')
        .where('position_id', position_id)
        .update(updateObj);

      return { position_id };
    }

    /**
     * 删除广告位置（软删除）
     */
    async delete(positionId) {
      // 检查是否有广告使用该位置
      const adCount = await app.database('t_advertisement')
        .where('ad_position', positionId)
        .where('status', 1)
        .count('* as count')
        .first();

      if (adCount && adCount.count > 0) {
        throw new Error('该广告位置下还有广告，无法删除');
      }

      // 软删除
      await app.database('t_ad_position')
        .where('position_id', positionId)
        .update({ status: 0 });

      return { position_id: positionId };
    }

    /**
     * 切换启用状态
     */
    async toggle(positionId, isEnabled) {
      await app.database('t_ad_position')
        .where('position_id', positionId)
        .update({ is_enabled: Number(isEnabled) });

      return { position_id: positionId, is_enabled: Number(isEnabled) };
    }

    /**
     * 批量启用
     */
    async batchEnable(positionIds) {
      await app.database('t_ad_position')
        .whereIn('position_id', positionIds)
        .update({ is_enabled: 1 });

      return { count: positionIds.length };
    }

    /**
     * 批量禁用
     */
    async batchDisable(positionIds) {
      await app.database('t_ad_position')
        .whereIn('position_id', positionIds)
        .update({ is_enabled: 0 });

      return { count: positionIds.length };
    }

    /**
     * 批量删除
     */
    async batchDelete(positionIds) {
      // 检查是否有广告使用这些位置
      const adCount = await app.database('t_advertisement')
        .whereIn('ad_position', positionIds)
        .where('status', 1)
        .count('* as count')
        .first();

      if (adCount && adCount.count > 0) {
        throw new Error('部分广告位置下还有广告，无法删除');
      }

      // 批量软删除
      await app.database('t_ad_position')
        .whereIn('position_id', positionIds)
        .update({ status: 0 });

      return { count: positionIds.length };
    }
  };
};
