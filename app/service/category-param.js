/**
 * 分类参数服务
 * 处理分类参数关联相关的业务逻辑和数据库操作
 *
 * 业务说明：
 * - 分类参数关联表（t_category_param）关联分类和参数库（t_product_param_library）
 * - 参数库包含 30 个预定义参数（基本/服装/数码/家电/通用）
 * - 分类可从参数库中选择参数并关联
 * - 支持自定义扩展值（custom_values）
 *
 * @class CategoryParamService
 * @extends BaseService
 */
module.exports = (app) => {
  const BaseService = require('@lesheng/elpis').Service.Base(app);
  const { v4: uuidv4 } = require('uuid');

  return class CategoryParamService extends BaseService {

    /**
     * 获取分类参数关联列表（分页）
     *
     * @param {Object} params - 查询参数
     * @param {string} [params.param_name] - 参数名称（模糊查询）
     * @param {string} [params.category_id] - 分类ID
     * @param {number} [params.page=1] - 页码
     * @param {number} [params.pageSize=50] - 每页数量
     * @returns {Promise<Object>} 返回参数关联列表和分页信息
     * @returns {Array} returns.list - 参数关联列表
     * @returns {number} returns.total - 总数
     * @returns {number} returns.page - 当前页码
     * @returns {number} returns.pageSize - 每页数量
     */
    async getCategoryParamList(params) {
      const {
        param_name: paramName,
        category_id: categoryId,
        page = 1,
        pageSize = 50
      } = params;

      const offset = (parseInt(page) - 1) * parseInt(pageSize);

      // 1. 构建筛选条件（查询总数）
      let countQuery = app.database('t_category_param as cp')
        .leftJoin('t_product_param_library as pl', 'cp.param_id', 'pl.param_id');

      if (paramName) {
        countQuery = countQuery.where('pl.param_name', 'like', `%${paramName}%`);
      }

      if (categoryId) {
        countQuery = countQuery.where('cp.category_id', categoryId);
      }

      // 查询总数（只 select count，避免 GROUP BY 问题）
      const countResult = await countQuery.count('cp.id as count').first();
      const total = countResult.count;

      // 2. 查询列表（重新构建query，关联参数库）
      let listQuery = app.database('t_category_param as cp')
        .leftJoin('t_product_param_library as pl', 'cp.param_id', 'pl.param_id')
        .select(
          'cp.*',
          'pl.param_name',
          'pl.param_type',
          'pl.param_category',
          'pl.param_values as library_values'
        );

      if (paramName) {
        listQuery = listQuery.where('pl.param_name', 'like', `%${paramName}%`);
      }

      if (categoryId) {
        listQuery = listQuery.where('cp.category_id', categoryId);
      }

      const list = await listQuery
        .orderBy('cp.category_id', 'asc')
        .orderBy('cp.sort_order', 'asc')
        .limit(parseInt(pageSize))
        .offset(offset);

      // 3. 获取分类名称
      for (const item of list) {
        if (item.category_id) {
          const category = await app.database('t_product_category')
            .where('category_id', item.category_id)
            .first();

          if (category) {
            item.type_name = category.full_name;
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
     * 获取参数关联详情
     *
     * @param {string} id - 参数关联ID
     * @returns {Promise<Object|null>} 返回参数关联详情，不存在则返回 null
     */
    async getCategoryParam(id) {
      // 1. 查询参数关联（关联参数库）
      const param = await app.database('t_category_param as cp')
        .leftJoin('t_product_param_library as pl', 'cp.param_id', 'pl.param_id')
        .where('cp.id', id)
        .select(
          'cp.*',
          'pl.param_name',
          'pl.param_type',
          'pl.param_category',
          'pl.param_values as library_values'
        )
        .first();

      if (!param) {
        return null;
      }

      // 2. 获取分类名称
      if (param.category_id) {
        const category = await app.database('t_product_category')
          .where('category_id', param.category_id)
          .first();

        if (category) {
          param.type_name = category.full_name;
        }
      }

      return param;
    }

    /**
     * 从参数库添加参数到分类
     *
     * 业务规则：
     * - 批量添加参数关联
     * - 检查是否已存在，跳过已存在的参数
     * - 自动生成关联ID（UUID）
     *
     * @param {Object} params - 添加参数
     * @param {string} params.category_id - 分类ID
     * @param {Array<string>} params.param_ids - 参数ID列表（参数库中的ID）
     * @returns {Promise<boolean>} 返回 true
     * @throws {Error} 如果未选择参数，抛出异常
     */
    async addParamFromLibrary(params) {
      const { category_id: categoryId, param_ids: paramIds } = params;

      if (!paramIds || paramIds.length === 0) {
        throw new Error('请选择参数');
      }

      // 批量添加
      for (let i = 0; i < paramIds.length; i++) {
        const paramId = paramIds[i];

        // 检查是否已存在
        const existing = await app.database('t_category_param')
          .where('category_id', categoryId)
          .where('param_id', paramId)
          .first();

        if (existing) {
          continue;  // 跳过已存在的
        }

        const id = uuidv4();

        await app.database('t_category_param').insert({
          id,
          category_id: categoryId,
          param_id: paramId,
          custom_values: null,
          allow_custom: 1,
          is_required: 0,
          sort_order: i,
          create_time: new Date()
        });
      }

      return true;
    }

    /**
     * 创建新参数（添加到参数库，然后关联到分类）
     *
     * 业务流程：
     * 1. 先添加到参数库（t_product_param_library）
     * 2. 然后关联到分类（t_category_param）
     *
     * @param {Object} params - 参数数据
     * @param {string} params.category_id - 分类ID
     * @param {string} params.param_name - 参数名称
     * @param {string} [params.param_type='input'] - 参数类型（input/select/textarea）
     * @param {Array} [params.param_values=[]] - 参数值列表
     * @param {string} [params.param_category='自定义参数'] - 参数分类
     * @param {number} [params.is_required=0] - 是否必填
     * @param {number} [params.allow_custom=1] - 是否允许自定义
     * @returns {Promise<string>} 返回新创建的参数ID
     */
    async createNewParam(params) {
      const {
        category_id: categoryId,
        param_name,
        param_type = 'input',
        param_values = [],
        param_category = '自定义参数',
        is_required = 0,
        allow_custom = 1
      } = params;

      // 1. 先添加到参数库
      const paramId = `PARAM${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

      await app.database('t_product_param_library').insert({
        param_id: paramId,
        param_name,
        param_type,
        param_values: param_values.length > 0 ? JSON.stringify(param_values) : null,
        param_category,
        sort_order: 999,
        status: 1,
        create_time: new Date()
      });

      // 2. 然后关联到分类
      const id = uuidv4();

      await app.database('t_category_param').insert({
        id,
        category_id: categoryId,
        param_id: paramId,
        custom_values: null,
        allow_custom,
        is_required,
        sort_order: 0,
        create_time: new Date()
      });

      return paramId;
    }

    /**
     * 更新分类参数配置
     *
     * @param {Object} params - 更新数据
     * @param {string} params.id - 参数关联ID
     * @param {number} [params.is_required] - 是否必填
     * @param {number} [params.allow_custom] - 是否允许自定义
     * @param {number} [params.sort_order] - 排序值
     * @returns {Promise<boolean>} 返回 true
     */
    async updateCategoryParam(params) {
      const { id, is_required, allow_custom, sort_order } = params;

      // 构建更新对象（只更新传入的字段）
      const updateData = {};

      if (is_required !== undefined) updateData.is_required = is_required;
      if (allow_custom !== undefined) updateData.allow_custom = allow_custom;
      if (sort_order !== undefined) updateData.sort_order = parseInt(sort_order);

      await app.database('t_category_param')
        .where('id', id)
        .update(updateData);

      return true;
    }

    /**
     * 删除分类参数关联（硬删除）
     *
     * @param {string} id - 参数关联ID
     * @returns {Promise<boolean>} 返回 true
     */
    async deleteCategoryParam(id) {
      await app.database('t_category_param')
        .where('id', id)
        .delete();

      return true;
    }
  };
};

