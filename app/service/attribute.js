/**
 * 商品属性服务
 * 处理商品属性相关的业务逻辑和数据库操作
 *
 * 业务说明：
 * - 属性用于生成 SKU 规格（如颜色、内存、尺寸等）
 * - 每个属性可配置预定义值（如颜色：红色、蓝色、绿色）
 * - 支持自定义值（allow_custom=1）
 * - 支持必填验证（is_required=1）
 *
 * @class AttributeService
 * @extends BaseService
 */
module.exports = (app) => {
  const BaseService = require('@lesheng/elpis').Service.Base(app);

  return class AttributeService extends BaseService {

    /**
     * 获取属性列表（分页）
     *
     * @param {Object} params - 查询参数
     * @param {string} [params.attr_name] - 属性名称（模糊查询）
     * @param {string} [params.category_id] - 分类ID
     * @param {number} [params.page=1] - 页码
     * @param {number} [params.pageSize=50] - 每页数量
     * @returns {Promise<Object>} 返回属性列表和分页信息
     * @returns {Array} returns.list - 属性列表
     * @returns {number} returns.total - 总数
     * @returns {number} returns.page - 当前页码
     * @returns {number} returns.pageSize - 每页数量
     */
    async getAttributeList(params) {
      const {
        attr_name: attrName,
        category_id: categoryId,
        page = 1,
        pageSize = 50
      } = params;

      const offset = (parseInt(page) - 1) * parseInt(pageSize);

      // 1. 构建查询条件
      let query = app.database('t_category_attribute');

      if (attrName) {
        query = query.where('attr_name', 'like', `%${attrName}%`);
      }

      if (categoryId) {
        query = query.where('category_id', categoryId);
      }

      // 2. 查询总数
      const countResult = await query.clone().count('* as count').first();
      const total = countResult.count;

      // 3. 查询列表数据
      const list = await query
        .select('*')
        .orderBy('category_id', 'asc')
        .orderBy('sort_order', 'asc')
        .limit(parseInt(pageSize))
        .offset(offset);

      // 4. 补充分类名称和解析预定义值
      for (const item of list) {
        // 获取分类名称
        if (item.category_id) {
          const category = await app.database('t_product_category')
            .where('category_id', item.category_id)
            .first();

          if (category) {
            item.type_name = category.full_name;
          }
        }

        // 解析预定义值（JSON 字符串转数组）
        if (item.predefined_values) {
          try {
            item.predefined_values = JSON.parse(item.predefined_values);
          } catch {
            item.predefined_values = [];
          }
        }
      }

      return {
        list,
        total,
        page: parseInt(page),
        pageSize: parseInt(pageSize)
      };
    }

    /**
     * 获取属性详情
     *
     * @param {string} attrId - 属性ID
     * @returns {Promise<Object|null>} 返回属性详情，不存在则返回 null
     */
    async getAttribute(attrId) {
      const attr = await app.database('t_category_attribute')
        .where('attr_id', attrId)
        .first();

      if (!attr) {
        return null;
      }

      // 1. 获取分类名称
      if (attr.category_id) {
        const category = await app.database('t_product_category')
          .where('category_id', attr.category_id)
          .first();

        if (category) {
          attr.type_name = category.full_name;
        }
      }

      // 2. 解析预定义值（JSON 字符串转数组）
      if (attr.predefined_values) {
        try {
          attr.predefined_values = JSON.parse(attr.predefined_values);
        } catch {
          attr.predefined_values = [];
        }
      }

      return attr;
    }

    /**
     * 创建属性
     *
     * @param {Object} params - 属性数据
     * @param {string} params.attr_name - 属性名称
     * @param {string} params.category_id - 分类ID
     * @param {Array} [params.predefined_values=[]] - 预定义值列表
     * @param {number} [params.allow_custom=1] - 是否允许自定义（1-允许，0-不允许）
     * @param {number} [params.is_required=1] - 是否必填（1-必填，0-非必填）
     * @param {number} [params.sort_order=0] - 排序值
     * @returns {Promise<string>} 返回新创建的属性ID
     */
    async createAttribute(params) {
      const {
        attr_name,
        category_id,
        predefined_values = [],
        allow_custom = 1,
        is_required = 1,
        sort_order = 0
      } = params;

      // 生成属性ID（ATTR + 时间戳 + 随机字符串）
      const attrId = `ATTR${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

      await app.database('t_category_attribute').insert({
        attr_id: attrId,
        category_id,
        attr_name,
        predefined_values: predefined_values.length > 0 ? JSON.stringify(predefined_values) : null,
        allow_custom,
        is_required,
        sort_order: parseInt(sort_order),
        create_time: new Date()
      });

      return attrId;
    }

    /**
     * 更新属性
     *
     * @param {Object} params - 更新数据
     * @param {string} params.attr_id - 属性ID
     * @param {string} [params.attr_name] - 属性名称
     * @param {Array} [params.predefined_values] - 预定义值列表
     * @param {number} [params.allow_custom] - 是否允许自定义
     * @param {number} [params.is_required] - 是否必填
     * @param {number} [params.sort_order] - 排序值
     * @returns {Promise<boolean>} 返回 true
     */
    async updateAttribute(params) {
      const {
        attr_id,
        attr_name,
        predefined_values,
        allow_custom,
        is_required,
        sort_order
      } = params;

      // 构建更新对象（只更新传入的字段）
      const updateData = {};

      if (attr_name) updateData.attr_name = attr_name;
      if (predefined_values !== undefined) {
        updateData.predefined_values = Array.isArray(predefined_values) && predefined_values.length > 0
          ? JSON.stringify(predefined_values)
          : null;
      }
      if (allow_custom !== undefined) updateData.allow_custom = allow_custom;
      if (is_required !== undefined) updateData.is_required = is_required;
      if (sort_order !== undefined) updateData.sort_order = parseInt(sort_order);

      await app.database('t_category_attribute')
        .where('attr_id', attr_id)
        .update(updateData);

      return true;
    }

    /**
     * 删除属性（硬删除）
     *
     * @param {string} attrId - 属性ID
     * @returns {Promise<boolean>} 返回 true
     */
    async deleteAttribute(attrId) {
      await app.database('t_category_attribute')
        .where('attr_id', attrId)
        .delete();

      return true;
    }
  };
};

