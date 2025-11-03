/**
 * 参数分类服务
 * 处理参数分类和参数库管理相关的业务逻辑和数据库操作
 *
 * 业务说明：
 * - 参数分类表（t_param_category）用于组织参数库中的参数
 * - 参数库（t_product_param_library）通过 param_category 字段关联参数分类
 * - 支持查看、编辑、删除参数分类及其下的参数
 * - 删除前检查是否有分类参数关联（t_category_param）正在使用该分类下的参数
 *
 * @class ParamCategoryService
 * @extends BaseService
 */
module.exports = (app) => {
  const BaseService = require('@lesheng/elpis').Service.Base(app);
  const { v4: uuidv4 } = require('uuid');
  const moment = require('moment');

  return class ParamCategoryService extends BaseService {

    /**
     * 获取参数分类列表（分页）
     *
     * @param {Object} params - 查询参数
     * @param {string} [params.category_name] - 分类名称（模糊查询）
     * @param {string} [params.sort_field] - 排序字段（sort_order/create_time/update_time）
     * @param {string} [params.sort_order] - 排序方向（asc/desc）
     * @param {number} [params.page=1] - 页码
     * @param {number} [params.pageSize=10] - 每页数量
     * @returns {Promise<Object>} 返回参数分类列表和分页信息
     * @returns {Array} returns.list - 参数分类列表
     * @returns {number} returns.total - 总数
     * @returns {number} returns.page - 当前页码
     * @returns {number} returns.pageSize - 每页数量
     */
    async getParamCategoryList(params) {
      const {
        category_name: categoryName,
        sort_field: sortField,
        sort_order: sortOrder,
        page = 1,
        pageSize = 10
      } = params;

      const offset = (parseInt(page) - 1) * parseInt(pageSize);

      // 1. 构建查询条件
      let query = app.database('t_param_category');

      // 分类名称筛选（模糊查询）
      if (categoryName) {
        query = query.where('category_name', 'like', `%${categoryName}%`);
      }

      // 2. 查询总数
      const totalResult = await query.clone().count('* as count').first();
      const total = totalResult ? totalResult.count : 0;

      // 3. 查询列表数据
      let listQuery = query.select('*');

      // 动态排序
      if (sortField && sortOrder) {
        listQuery = listQuery.orderBy(sortField, sortOrder);
      } else {
        // 默认排序：先按排序字段，再按创建时间倒序
        listQuery = listQuery.orderBy('sort_order', 'asc').orderBy('create_time', 'desc');
      }

      const list = await listQuery
        .limit(parseInt(pageSize))
        .offset(offset);

      // 4. 批量查询每个分类下的参数数量（避免 N+1 查询）
      // 注意：param_category 字段存储的是分类名称，需要通过名称关联
      const categoryNames = list.map(item => item.category_name);
      if (categoryNames.length > 0) {
        const paramCounts = await app.database('t_product_param_library')
          .whereIn('param_category', categoryNames)
          .where('status', 1)
          .select('param_category')
          .count('* as count')
          .groupBy('param_category');

        // 构建参数数量映射（按分类名称）
        const paramCountMap = {};
        paramCounts.forEach(item => {
          paramCountMap[item.param_category] = item.count;
        });

        // 将参数数量添加到列表中
        list.forEach(item => {
          item.param_count = paramCountMap[item.category_name] || 0;
          item.create_time = moment(item.create_time).format('YYYY-MM-DD HH:mm:ss');
          item.update_time = item.update_time ? moment(item.update_time).format('YYYY-MM-DD HH:mm:ss') : null;
          item.sort_order = parseInt(item.sort_order);
        });
      }

      return {
        list,
        total: parseInt(total),
        page: parseInt(page),
        pageSize: parseInt(pageSize)
      };
    }

    /**
     * 获取参数分类详情（包含该分类下的所有参数）
     *
     * @param {string} categoryId - 参数分类ID
     * @returns {Promise<Object|null>} 返回参数分类详情和参数列表，不存在则返回 null
     */
    async getParamCategory(categoryId) {
      // 1. 查询参数分类
      const category = await app.database('t_param_category')
        .where('category_id', categoryId)
        .first();

      if (!category) {
        return null;
      }

      // 2. 查询该分类下的所有参数
      // 注意：param_category 字段存储的是分类名称，不是 category_id
      const params = await app.database('t_product_param_library')
        .where('param_category', category.category_name)
        .where('status', 1)
        .select('*')
        .orderBy('sort_order', 'asc');

      // 格式化数据
      category.create_time = moment(category.create_time).format('YYYY-MM-DD HH:mm:ss');
      category.update_time = category.update_time ? moment(category.update_time).format('YYYY-MM-DD HH:mm:ss') : null;
      category.sort_order = parseInt(category.sort_order);
      category.params = params.map(param => ({
        ...param,
        create_time: moment(param.create_time).format('YYYY-MM-DD HH:mm:ss'),
        sort_order: parseInt(param.sort_order),
        status: parseInt(param.status)
      }));

      return category;
    }

    /**
     * 创建参数分类
     *
     * 业务规则：
     * - 检查分类名称是否重复
     * - 自动生成分类ID（PCAT + 时间戳 + 随机字符串）
     *
     * @param {Object} params - 分类数据
     * @param {string} params.category_name - 分类名称
     * @param {number} [params.sort_order=0] - 排序值
     * @returns {Promise<string>} 返回新创建的分类ID
     * @throws {Error} 如果分类名称已存在，抛出异常
     */
    async createParamCategory(params) {
      const { category_name, sort_order = 0 } = params;

      // 1. 检查分类名称是否重复
      const existing = await app.database('t_param_category')
        .where('category_name', category_name)
        .first();

      if (existing) {
        throw new Error('参数分类名称已存在');
      }

      // 2. 生成分类ID（PCAT + 时间戳 + 随机字符串）
      const categoryId = `PCAT${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

      // 3. 插入新分类
      await app.database('t_param_category').insert({
        category_id: categoryId,
        category_name,
        sort_order: parseInt(sort_order),
        create_time: new Date()
      });

      return categoryId;
    }

    /**
     * 更新参数分类
     *
     * 业务规则：
     * - 检查分类是否存在
     * - 如果修改分类名称，检查是否重名
     *
     * @param {Object} params - 更新数据
     * @param {string} params.category_id - 分类ID
     * @param {string} [params.category_name] - 分类名称
     * @param {number} [params.sort_order] - 排序值
     * @returns {Promise<boolean>} 返回 true
     * @throws {Error} 如果分类不存在或分类名称已存在，抛出异常
     */
    async updateParamCategory(params) {
      const { category_id, category_name, sort_order } = params;

      // 1. 检查分类是否存在
      const category = await app.database('t_param_category')
        .where('category_id', category_id)
        .first();

      if (!category) {
        throw new Error('参数分类不存在');
      }

      // 2. 如果修改分类名称，检查是否重名
      if (category_name && category_name !== category.category_name) {
        const existing = await app.database('t_param_category')
          .where('category_name', category_name)
          .whereNot('category_id', category_id)
          .first();

        if (existing) {
          throw new Error('参数分类名称已存在');
        }
      }

      // 3. 构建更新数据
      const updateData = {
        update_time: new Date()
      };

      if (category_name) {
        updateData.category_name = category_name;
      }

      if (sort_order !== undefined) {
        updateData.sort_order = parseInt(sort_order);
      }

      // 4. 更新分类
      await app.database('t_param_category')
        .where('category_id', category_id)
        .update(updateData);

      return true;
    }

    /**
     * 删除参数分类
     *
     * 业务规则：
     * - 删除前检查该分类下是否有参数
     * - 如果有参数，检查这些参数是否被分类参数关联（t_category_param）使用
     * - 如果有关联，抛出异常，禁止删除
     * - 删除分类时，同时硬删除该分类下的所有参数
     *
     * @param {string} categoryId - 分类ID
     * @returns {Promise<boolean>} 返回 true
     * @throws {Error} 如果该分类下的参数正在被使用，抛出异常
     */
    async deleteParamCategory(categoryId) {
      // 1. 查询该分类
      const category = await app.database('t_param_category')
        .where('category_id', categoryId)
        .first();

      if (!category) {
        throw new Error('参数分类不存在');
      }

      // 2. 查询该分类下的所有参数（使用分类名称查询）
      const params = await app.database('t_product_param_library')
        .where('param_category', category.category_name)
        .where('status', 1)
        .select('param_id');

      if (params.length > 0) {
        // 3. 检查这些参数是否被分类参数关联使用
        const paramIds = params.map(p => p.param_id);
        const usedParams = await app.database('t_category_param')
          .whereIn('param_id', paramIds)
          .count('* as count')
          .first();

        if (usedParams.count > 0) {
          throw new Error('该分类下的参数正在被使用，无法删除');
        }

        // 4. 硬删除该分类下的所有参数
        await app.database('t_product_param_library')
          .whereIn('param_id', paramIds)
          .delete();
      }

      // 5. 硬删除参数分类
      await app.database('t_param_category')
        .where('category_id', categoryId)
        .delete();

      return true;
    }

    /**
     * 获取参数分类下拉选项（用于下拉选择）
     *
     * @returns {Promise<Array>} 返回参数分类选项列表
     * @returns {string} returns[].value - 分类ID
     * @returns {string} returns[].label - 分类名称
     */
    async getParamCategoryOptions() {
      const categories = await app.database('t_param_category')
        .select('category_id', 'category_name')
        .orderBy('sort_order', 'asc');

      return categories.map(item => ({
        value: item.category_id,
        label: item.category_name
      }));
    }

    /**
     * 批量更新参数分类下的参数
     *
     * 业务规则：
     * - 更新现有参数（根据 param_id）
     * - 创建新参数（param_id 为 undefined）
     * - 删除指定的参数（软删除）
     *
     * @param {Object} params - 参数对象
     * @param {string} params.category_id - 分类ID
     * @param {Array} params.params - 参数列表
     * @param {Array} params.deleted_param_ids - 删除的参数ID列表
     * @returns {Promise<boolean>} 返回 true
     */
    async updateParams({ category_id, params, deleted_param_ids }) {
      const { v4: uuidv4 } = require('uuid');

      await app.database.transaction(async (trx) => {
        // 1. 处理参数更新和创建
        for (const param of params) {
          if (param.param_id && !param.param_id.startsWith('NEW_')) {
            // 更新现有参数 - 检查是否与其他参数重名
            const existing = await trx('t_product_param_library')
              .where('param_name', param.param_name)
              .where('param_category', param.param_category)
              .whereNot('param_id', param.param_id)
              .where('status', 1)
              .first();

            if (existing) {
              throw new Error(`参数"${param.param_name}"在分类"${param.param_category}"中已存在`);
            }

            await trx('t_product_param_library')
              .where('param_id', param.param_id)
              .update({
                param_name: param.param_name,
                param_type: param.param_type,
                param_values: param.param_values,
                param_category: param.param_category,
                sort_order: param.sort_order,
                status: param.status,
                update_time: new Date()
              });
          } else {
            // 创建新参数 - 检查是否重名
            const existing = await trx('t_product_param_library')
              .where('param_name', param.param_name)
              .where('param_category', param.param_category)
              .where('status', 1)
              .first();

            if (existing) {
              throw new Error(`参数"${param.param_name}"在分类"${param.param_category}"中已存在`);
            }

            const paramId = `PARAM_${uuidv4().replace(/-/g, '').substring(0, 16).toUpperCase()}`;
            await trx('t_product_param_library').insert({
              param_id: paramId,
              param_name: param.param_name,
              param_type: param.param_type,
              param_values: param.param_values,
              param_category: param.param_category,
              sort_order: param.sort_order,
              status: param.status || 1,
              create_time: new Date(),
              update_time: new Date()
            });
          }
        }

        // 2. 处理删除的参数（硬删除）
        if (deleted_param_ids && deleted_param_ids.length > 0) {
          // 检查这些参数是否被使用
          const usedParams = await trx('t_category_param')
            .whereIn('param_id', deleted_param_ids)
            .count('* as count')
            .first();

          if (usedParams.count > 0) {
            throw new Error('部分参数正在被使用，无法删除');
          }

          // 硬删除参数
          await trx('t_product_param_library')
            .whereIn('param_id', deleted_param_ids)
            .delete();
        }
      });

      return true;
    }
  };
};

