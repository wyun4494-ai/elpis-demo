module.exports = (app) => {
  const BaseService = require('@lesheng/elpis').Service.Base(app);
  const { v4: uuidv4 } = require('uuid');

  return class CategoryParamService extends BaseService {

    /**
     * 获取分类参数关联列表
     */
    async getCategoryParamList(params) {
      const { 
        param_name: paramName,
        category_id: categoryId,
        page = 1, 
        pageSize = 50 
      } = params;

      const offset = (parseInt(page) - 1) * parseInt(pageSize);

      // 先构建筛选条件
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

      // 查询列表（重新构建query）
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

      // 获取分类名称并解析参数值
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
     */
    async getCategoryParam(id) {
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

      // 获取分类名称
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
     * 创建新参数（添加到参数库，然后关联）
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

      // 先添加到参数库
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

      // 然后关联到分类
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
     */
    async updateCategoryParam(params) {
      const { id, is_required, allow_custom, sort_order } = params;

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
     * 删除分类参数关联
     */
    async deleteCategoryParam(id) {
      await app.database('t_category_param')
        .where('id', id)
        .delete();

      return true;
    }
  };
};

