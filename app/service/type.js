/**
 * 商品类型服务
 * 处理商品类型相关的业务逻辑和数据库操作
 *
 * 业务说明：
 * - 商品类型 = 末级分类（has_children=0）
 * - 每个类型可配置属性（用于生成 SKU 规格）和参数（用于商品详情信息）
 * - 属性示例：颜色、内存、尺寸等（用于笛卡尔积生成 SKU）
 * - 参数示例：品牌、型号、产地等（用于商品详情展示）
 *
 * @class TypeService
 * @extends BaseService
 */
module.exports = (app) => {
  const BaseService = require('@lesheng/elpis').Service.Base(app);
  const { v4: uuidv4 } = require('uuid');
  const moment = require('moment');

  return class TypeService extends BaseService {

    /**
     * 获取商品类型列表（基于末级分类）
     *
     * @param {Object} params - 查询参数
     * @param {string} [params.type_name] - 类型名称（模糊查询）
     * @param {number} [params.page=1] - 页码
     * @param {number} [params.pageSize=50] - 每页数量
     * @returns {Promise<Object>} 返回类型列表和分页信息
     * @returns {Array} returns.list - 类型列表
     * @returns {number} returns.total - 总数
     * @returns {number} returns.page - 当前页码
     * @returns {number} returns.pageSize - 每页数量
     */
    async getTypeList(params) {
      const {
        type_name: typeName,
        page = 1,
        pageSize = 50
      } = params;

      const offset = (parseInt(page) - 1) * parseInt(pageSize);

      // 1. 查询所有末级分类（has_children = 0）
      let query = app.database('t_product_category')
        .where('status', 1)
        .where('has_children', 0);  // 只查询末级分类

      if (typeName) {
        query = query.where('full_name', 'like', `%${typeName}%`);
      }

      // 2. 查询总数
      const countResult = await query.clone().count('* as count').first();
      const total = countResult.count;

      // 3. 查询列表
      const list = await query
        .select('*')
        .orderBy('category_path', 'asc')
        .limit(parseInt(pageSize))
        .offset(offset);

      // 4. 统计每个分类的属性和参数数量
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
     *
     * @param {string} categoryId - 分类ID
     * @returns {Promise<Object|null>} 返回类型配置，不存在则返回 null
     * @returns {string} returns.category_id - 分类ID
     * @returns {string} returns.type_name - 类型名称
     * @returns {Array} returns.attributes - 属性列表
     * @returns {Array} returns.params - 参数列表
     */
    async getType(categoryId) {
      const category = await app.database('t_product_category')
        .where('category_id', categoryId)
        .first();

      if (!category) {
        return null;
      }

      // 1. 获取属性列表
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

      // 2. 获取参数列表（关联参数库）
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

      // 3. 解析参数值（合并参数库预定义值和分类自定义值）
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

        // 合并两个数组（参数库值 + 自定义值）
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
     * 根据分类ID获取类型（别名方法）
     *
     * @param {string} categoryId - 分类ID
     * @returns {Promise<Object|null>} 返回类型配置
     */
    async getTypeByCategoryId(categoryId) {
      return await this.getType(categoryId);
    }

    /**
     * 保存分类的属性配置
     *
     * 业务规则：
     * - 先删除旧属性，再插入新属性（全量替换）
     * - 自动生成属性ID（ATTR + 时间戳 + 索引 + 随机字符串）
     *
     * @param {string} categoryId - 分类ID
     * @param {Array} attributes - 属性配置列表
     * @param {string} attributes[].attr_name - 属性名称
     * @param {Array} [attributes[].predefined_values] - 预定义值列表
     * @param {number} [attributes[].allow_custom=1] - 是否允许自定义
     * @param {number} [attributes[].is_required=1] - 是否必填
     * @param {number} [attributes[].sort_order] - 排序值
     * @returns {Promise<boolean>} 返回 true
     */
    async saveAttributes(categoryId, attributes) {
      // 1. 删除旧属性（全量替换）
      await app.database('t_category_attribute')
        .where('category_id', categoryId)
        .delete();

      // 2. 插入新属性
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
     *
     * 业务规则：
     * - 先删除旧参数，再插入新参数（全量替换）
     * - 参数从参数库（t_product_param_library）关联
     * - 支持自定义扩展值（custom_values）
     *
     * @param {string} categoryId - 分类ID
     * @param {Array} params - 参数配置列表
     * @param {string} params[].param_id - 参数ID（参数库中的ID）
     * @param {Array} [params[].custom_values] - 自定义扩展值列表
     * @param {number} [params[].allow_custom=1] - 是否允许自定义
     * @param {number} [params[].is_required=0] - 是否必填
     * @param {number} [params[].sort_order] - 排序值
     * @returns {Promise<boolean>} 返回 true
     */
    async saveParams(categoryId, params) {
      // 1. 删除旧参数（全量替换）
      await app.database('t_category_param')
        .where('category_id', categoryId)
        .delete();

      // 2. 插入新参数
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
     *
     * 业务规则：
     * - 删除前检查是否有商品使用该分类
     * - 如果有商品，抛出异常，禁止删除
     *
     * @param {string} categoryId - 分类ID
     * @returns {Promise<boolean>} 返回 true
     * @throws {Error} 如果该分类下存在商品，抛出异常
     */
    async deleteType(categoryId) {
      // 1. 检查是否有商品使用该分类
      const products = await app.database('t_product')
        .where('category_id', categoryId)
        .where('status', 1)
        .count('* as count')
        .first();

      if (products.count > 0) {
        throw new Error('该分类下存在商品，无法删除配置');
      }

      // 2. 删除属性
      await app.database('t_category_attribute')
        .where('category_id', categoryId)
        .delete();

      // 3. 删除参数
      await app.database('t_category_param')
        .where('category_id', categoryId)
        .delete();

      return true;
    }

    /**
     * 获取参数库列表（分页）
     *
     * 参数库说明：
     * - 参数库包含 30 个预定义参数（基本/服装/数码/家电/通用）
     * - 分类可从参数库中选择参数并关联
     * - 支持按参数名称和分类筛选
     *
     * @param {Object} params - 查询参数
     * @param {string} [params.param_name] - 参数名称（模糊查询）
     * @param {string} [params.category] - 参数分类（基本/服装/数码/家电/通用）
     * @param {number} [params.page=1] - 页码
     * @param {number} [params.pageSize=100] - 每页数量
     * @returns {Promise<Object>} 返回参数库列表和分页信息
     * @returns {Array} returns.list - 参数列表
     * @returns {number} returns.total - 总数
     * @returns {number} returns.page - 当前页码
     * @returns {number} returns.pageSize - 每页数量
     */
    async getParamLibraryList(params) {
      const {
        param_name: paramName,
        category,
        page = 1,
        pageSize = 100
      } = params;

      const offset = (parseInt(page) - 1) * parseInt(pageSize);

      // 1. 构建查询条件
      let query = app.database('t_product_param_library').where('status', 1);

      if (paramName) {
        query = query.where('param_name', 'like', `%${paramName}%`);
      }

      if (category) {
        query = query.where('param_category', category);
      }

      // 2. 查询总数
      const countResult = await query.clone().count('* as count').first();
      const total = countResult.count;

      // 3. 查询列表数据
      const list = await query
        .select('*')
        .orderBy('param_category', 'asc')
        .orderBy('sort_order', 'asc')
        .limit(parseInt(pageSize))
        .offset(offset);

      // 4. 解析 param_values（JSON 字符串转数组）
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

