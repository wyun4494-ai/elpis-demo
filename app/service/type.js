module.exports = (app) => {
  const BaseService = require('@lesheng/elpis').Service.Base(app);
  const { v4: uuidv4 } = require('uuid');
  const moment = require('moment');

  return class TypeService extends BaseService {

    /**
     * 获取商品类型列表（基于末级分类）
     */
    async getTypeList(params) {
      const { 
        type_name: typeName,
        page = 1, 
        pageSize = 50 
      } = params;

      const offset = (parseInt(page) - 1) * parseInt(pageSize);

      // 查询所有末级分类（has_children = 0）
      let query = app.database('t_product_category')
        .where('status', 1)
        .where('has_children', 0);  // 只查询末级分类

      if (typeName) {
        query = query.where('full_name', 'like', `%${typeName}%`);
      }

      // 查询总数
      const countResult = await query.clone().count('* as count').first();
      const total = countResult.count;

      // 查询列表
      const list = await query
        .select('*')
        .orderBy('category_path', 'asc')
        .limit(parseInt(pageSize))
        .offset(offset);

      // 统计每个分类的属性和参数数量
      for (const item of list) {
        // 统计属性数量
        const attrCount = await app.database('t_category_attribute')
          .where('category_id', item.category_id)
          .count('* as count')
          .first();
        
        // 统计参数数量
        const paramCount = await app.database('t_category_param')
          .where('category_id', item.category_id)
          .count('* as count')
          .first();

        item.type_name = item.full_name;  // 类型名称 = 完整路径
        item.attr_count = attrCount.count;
        item.param_count = paramCount.count;
      }

      return {
        list,
        total,
        page: parseInt(page),
        pageSize: parseInt(pageSize)
      };
    }

    /**
     * 获取分类的类型配置（属性+参数）
     */
    async getType(categoryId) {
      const category = await app.database('t_product_category')
        .where('category_id', categoryId)
        .first();

      if (!category) {
        return null;
      }

      // 获取属性列表
      const attributes = await app.database('t_category_attribute')
        .where('category_id', categoryId)
        .orderBy('sort_order', 'asc')
        .select('*');

      // 解析预定义值（JSON字符串转数组）
      attributes.forEach(attr => {
        if (attr.predefined_values) {
          try {
            attr.predefined_values = JSON.parse(attr.predefined_values);
          } catch (e) {
            attr.predefined_values = [];
          }
        } else {
          attr.predefined_values = [];
        }
      });

      // 获取参数列表
      const params = await app.database('t_category_param as cp')
        .leftJoin('t_product_param_library as pl', 'cp.param_id', 'pl.param_id')
        .where('cp.category_id', categoryId)
        .orderBy('cp.sort_order', 'asc')
        .select(
          'cp.*',
          'pl.param_name',
          'pl.param_type',
          'pl.param_values as library_values',
          'pl.param_category'
        );

      // 解析参数值（合并预定义值和自定义值）
      params.forEach(param => {
        // 参数库的预定义值
        let libraryValues = [];
        if (param.library_values) {
          try {
            libraryValues = JSON.parse(param.library_values);
          } catch (e) {
            libraryValues = [];
          }
        }
        
        // 分类自定义的扩展值
        let customValues = [];
        if (param.custom_values) {
          try {
            customValues = JSON.parse(param.custom_values);
          } catch (e) {
            customValues = [];
          }
        }
        
        // 合并两个数组
        param.param_values = [...libraryValues, ...customValues];
        delete param.library_values;
      });

      return {
        category_id: category.category_id,
        type_name: category.full_name,
        attributes,
        params
      };
    }

    /**
     * 根据分类ID获取类型（现在category_id就是type_id）
     */
    async getTypeByCategoryId(categoryId) {
      return await this.getType(categoryId);
    }

    /**
     * 保存分类的属性配置
     */
    async saveAttributes(categoryId, attributes) {
      // 删除旧属性
      await app.database('t_category_attribute')
        .where('category_id', categoryId)
        .delete();

      // 插入新属性
      if (attributes && attributes.length > 0) {
        for (let i = 0; i < attributes.length; i++) {
          const attr = attributes[i];
          const attrId = `ATTR${Date.now()}${i}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
          
          await app.database('t_category_attribute').insert({
            attr_id: attrId,
            category_id: categoryId,
            attr_name: attr.attr_name,
            predefined_values: attr.predefined_values ? JSON.stringify(attr.predefined_values) : null,
            allow_custom: attr.allow_custom !== undefined ? attr.allow_custom : 1,
            is_required: attr.is_required !== undefined ? attr.is_required : 1,
            sort_order: attr.sort_order || i,
            create_time: new Date()
          });
        }
      }

      return true;
    }

    /**
     * 保存分类的参数配置
     */
    async saveParams(categoryId, params) {
      // 删除旧参数
      await app.database('t_category_param')
        .where('category_id', categoryId)
        .delete();

      // 插入新参数
      if (params && params.length > 0) {
        for (let i = 0; i < params.length; i++) {
          const param = params[i];
          const id = uuidv4();
          
          await app.database('t_category_param').insert({
            id,
            category_id: categoryId,
            param_id: param.param_id,
            custom_values: param.custom_values ? JSON.stringify(param.custom_values) : null,
            allow_custom: param.allow_custom !== undefined ? param.allow_custom : 1,
            is_required: param.is_required || 0,
            sort_order: param.sort_order || i,
            create_time: new Date()
          });
        }
      }

      return true;
    }

    /**
     * 删除分类的类型配置（删除所有属性和参数）
     */
    async deleteType(categoryId) {
      // 检查是否有商品使用该分类
      const products = await app.database('t_product')
        .where('category_id', categoryId)
        .where('status', 1)
        .count('* as count')
        .first();

      if (products.count > 0) {
        throw new Error('该分类下存在商品，无法删除配置');
      }

      // 删除属性
      await app.database('t_category_attribute')
        .where('category_id', categoryId)
        .delete();

      // 删除参数
      await app.database('t_category_param')
        .where('category_id', categoryId)
        .delete();

      return true;
    }

    /**
     * 获取参数库列表
     */
    async getParamLibraryList(params) {
      const { 
        param_name: paramName,
        category,
        page = 1, 
        pageSize = 100 
      } = params;

      const offset = (parseInt(page) - 1) * parseInt(pageSize);

      let query = app.database('t_product_param_library').where('status', 1);

      if (paramName) {
        query = query.where('param_name', 'like', `%${paramName}%`);
      }

      if (category) {
        query = query.where('param_category', category);
      }

      const countResult = await query.clone().count('* as count').first();
      const total = countResult.count;

      const list = await query
        .select('*')
        .orderBy('param_category', 'asc')
        .orderBy('sort_order', 'asc')
        .limit(parseInt(pageSize))
        .offset(offset);

      // 解析 param_values
      list.forEach(param => {
        if (param.param_values) {
          try {
            param.param_values = JSON.parse(param.param_values);
          } catch (e) {
            param.param_values = [];
          }
        }
      });

      return {
        list,
        total,
        page: parseInt(page),
        pageSize: parseInt(pageSize)
      };
    }
  };
};

