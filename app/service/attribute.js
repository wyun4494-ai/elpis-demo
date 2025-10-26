module.exports = (app) => {
  const BaseService = require('@lesheng/elpis').Service.Base(app);
  const moment = require('moment');

  return class AttributeService extends BaseService {

    /**
     * 获取属性列表
     */
    async getAttributeList(params) {
      const { 
        attr_name: attrName,
        category_id: categoryId,
        page = 1, 
        pageSize = 50 
      } = params;

      const offset = (parseInt(page) - 1) * parseInt(pageSize);

      let query = app.database('t_category_attribute');

      if (attrName) {
        query = query.where('attr_name', 'like', `%${attrName}%`);
      }

      if (categoryId) {
        query = query.where('category_id', categoryId);
      }

      const countResult = await query.clone().count('* as count').first();
      const total = countResult.count;

      const list = await query
        .select('*')
        .orderBy('category_id', 'asc')
        .orderBy('sort_order', 'asc')
        .limit(parseInt(pageSize))
        .offset(offset);

      // 获取分类名称
      for (const item of list) {
        if (item.category_id) {
          const category = await app.database('t_product_category')
            .where('category_id', item.category_id)
            .first();
          
          if (category) {
            item.type_name = category.full_name;
          }
        }

        // 解析预定义值
        if (item.predefined_values) {
          try {
            item.predefined_values = JSON.parse(item.predefined_values);
          } catch (e) {
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
     */
    async getAttribute(attrId) {
      const attr = await app.database('t_category_attribute')
        .where('attr_id', attrId)
        .first();

      if (!attr) {
        return null;
      }

      // 获取分类名称
      if (attr.category_id) {
        const category = await app.database('t_product_category')
          .where('category_id', attr.category_id)
          .first();
        
        if (category) {
          attr.type_name = category.full_name;
        }
      }

      // 解析预定义值
      if (attr.predefined_values) {
        try {
          attr.predefined_values = JSON.parse(attr.predefined_values);
        } catch (e) {
          attr.predefined_values = [];
        }
      }

      return attr;
    }

    /**
     * 创建属性
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
     * 删除属性
     */
    async deleteAttribute(attrId) {
      await app.database('t_category_attribute')
        .where('attr_id', attrId)
        .delete();

      return true;
    }
  };
};

