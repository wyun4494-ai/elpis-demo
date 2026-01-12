module.exports = (app) => {
  const BaseService = require('@lesheng/elpis').Service.Base(app);
  const { v4: uuidv4 } = require('uuid');
  const moment = require('moment');

  return class CategoryService extends BaseService {

    /**
     * 获取分类列表（分页）
     *
     * @param {Object} params - 查询参数
     * @param {string} [params.category_name] - 分类名称（模糊查询）
     * @param {string} [params.parent_id] - 父级分类ID
     * @param {number} [params.level] - 分类层级（1-4）
     * @param {number} [params.status] - 状态（1-正常，0-已删除）
     * @param {string} [params.sort_field] - 排序字段（level/sort_order/create_time）
     * @param {string} [params.sort_order] - 排序方向（asc/desc）
     * @param {number} [params.page=1] - 页码
     * @param {number} [params.pageSize=10] - 每页数量
     * @returns {Promise<Object>} 返回分类列表和分页信息
     * @returns {Array} returns.list - 分类列表
     * @returns {number} returns.total - 总数
     * @returns {number} returns.page - 当前页码
     * @returns {number} returns.pageSize - 每页数量
     */
    async getCategoryList(params) {
      const {
        category_name: categoryName,
        parent_id: parentId,
        level,
        status,
        sort_field: sortField,
        sort_order: sortOrder,
        page = 1,
        pageSize = 10
      } = params;

      const offset = (parseInt(page) - 1) * parseInt(pageSize);

      // 构建查询条件
      let query = app.database('t_product_category').where('status', '>', 0);

      // 父级筛选（查看子分类时使用）
      if (parentId !== undefined) {
        if (parentId === null || parentId === 'null') {
          query = query.whereNull('parent_id');
        } else {
          query = query.where('parent_id', parentId);
        }
      }

      // 分类名称筛选（模糊查询）
      if (categoryName) {
        query = query.where('category_name', 'like', `%${categoryName}%`);
      }

      // 层级筛选
      if (level && level !== -999 && level !== '-999') {
        query = query.where('level', parseInt(level));
      }

      // 状态筛选
      if (status !== undefined && status !== -999 && status !== '-999') {
        query = query.where('status', parseInt(status));
      }

      // 查询总数
      const totalResult = await query.clone().count('* as count').first();
      const total = totalResult ? totalResult.count : 0;

      // 查询列表数据
      let listQuery = query.select('*');

      // 动态排序
      if (sortField && sortOrder) {
        listQuery = listQuery.orderBy(sortField, sortOrder);
      } else {
        // 默认排序：先按层级，再按排序字段
        listQuery = listQuery.orderBy('level', 'asc').orderBy('sort_order', 'asc');
      }

      const list = await listQuery
        .limit(parseInt(pageSize))
        .offset(offset);

      // 格式化数据
      list.forEach(item => {
        item.create_time = moment(item.create_time).format('YYYY-MM-DD HH:mm:ss');
        item.level = parseInt(item.level);
        item.status = parseInt(item.status);
        item.has_children = parseInt(item.has_children);
        item.sort_order = parseInt(item.sort_order);
      });

      return {
        list,
        total: parseInt(total),
        page: parseInt(page),
        pageSize: parseInt(pageSize)
      };
    }

    /**
     * 获取分类详情
     */
    async getCategory(categoryId) {
      const category = await app.database('t_product_category')
        .where('category_id', categoryId)
        .where('status', '>', 0)
        .first();

      if (category) {
        category.create_time = moment(category.create_time).format('YYYY-MM-DD HH:mm:ss');
        category.level = parseInt(category.level);
        category.status = parseInt(category.status);
        category.has_children = parseInt(category.has_children);
        category.sort_order = parseInt(category.sort_order);
      }

      return category;
    }

    /**
     * 创建分类
     *
     * 业务规则：
     * 1. 同一父级下分类名称不能重复
     * 2. 分类层级最多 4 级
     * 3. 自动计算 category_path（如 /CAT001/CAT001001）
     * 4. 自动计算 full_name（如 手机数码/手机/智能手机）
     * 5. 自动更新父级的 has_children 标记
     *
     * @param {Object} params - 创建参数
     * @param {string} params.category_name - 分类名称
     * @param {string} [params.parent_id] - 父级分类ID（为空表示一级分类）
     * @param {number} [params.sort_order=0] - 排序值
     * @returns {Promise<string>} 返回新创建的分类ID
     */
    async createCategory(params) {
      const { category_name, parent_id, sort_order = 0 } = params;
      const status = 1;  // 分类默认启用

      // 1. 检查分类名称是否重复（同一父级下）
      const existing = await app.database('t_product_category')
        .where('category_name', category_name)
        .where('parent_id', parent_id || null)
        .where('status', '>', 0)
        .first();

      if (existing) {
        throw new Error('同级分类名称已存在');
      }

      let level = 1;
      let category_path = '';
      let full_name = category_name;

      // 2. 如果有父级，计算层级和路径
      if (parent_id) {
        const parent = await app.database('t_product_category')
          .where('category_id', parent_id)
          .first();

        if (!parent) {
          throw new Error('父级分类不存在');
        }

        level = parent.level + 1;

        // 检查层级限制（最多4级）
        if (level > 4) {
          throw new Error('分类层级不能超过4级');
        }

        // 计算分类路径（如 /CAT001/CAT001001）
        category_path = parent.category_path
          ? `${parent.category_path}/${parent_id}`
          : `/${parent_id}`;

        // 计算完整名称（如 手机数码/手机/智能手机）
        full_name = parent.full_name ? `${parent.full_name}/${category_name}` : category_name;

        // 3. 更新父级的 has_children 标记
        await app.database('t_product_category')
          .where('category_id', parent_id)
          .update({ has_children: 1 });
      }

      // 4. 生成分类ID（格式：CAT + 时间戳 + 随机字符串）
      const categoryId = `CAT${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

      // 5. 插入新分类
      await app.database('t_product_category').insert({
        category_id: categoryId,
        category_name,
        parent_id: parent_id || null,
        level,
        category_path: category_path || `/${categoryId}`,
        full_name,
        has_children: 0,  // 新创建的分类默认没有子分类
        sort_order: parseInt(sort_order),
        status: parseInt(status),
        create_time: new Date()
      });

      return categoryId;
    }

    /**
     * 更新分类
     */
    async updateCategory(params) {
      const { category_id, category_name, sort_order } = params;

      // 检查分类是否存在
      const category = await app.database('t_product_category')
        .where('category_id', category_id)
        .first();

      if (!category) {
        throw new Error('分类不存在');
      }

      // 检查同级是否有重名
      if (category_name && category_name !== category.category_name) {
        const existing = await app.database('t_product_category')
          .where('category_name', category_name)
          .where('parent_id', category.parent_id || null)
          .where('category_id', '!=', category_id)
          .where('status', '>', 0)
          .first();

        if (existing) {
          throw new Error('同级分类名称已存在');
        }
      }

      // 更新分类
      const updateData = {
        update_time: new Date()
      };

      if (category_name) updateData.category_name = category_name;
      if (sort_order !== undefined) updateData.sort_order = parseInt(sort_order);

      await app.database('t_product_category')
        .where('category_id', category_id)
        .update(updateData);

      // 如果修改了分类名称，需要更新自己和所有子孙分类的 full_name
      if (category_name && category_name !== category.category_name) {
        // 先更新自己的 full_name
        await this.updateCategoryFullName(category_id);
        // 再更新所有子孙分类的 full_name
        await this.updateChildrenFullName(category_id);
      }

      return true;
    }

    /**
     * 删除分类（软删除）
     */
    async deleteCategory(categoryId) {
      // 检查是否有子分类
      const children = await app.database('t_product_category')
        .where('parent_id', categoryId)
        .where('status', '>', 0)
        .count('* as count')
        .first();

      if (children.count > 0) {
        throw new Error('该分类下存在子分类，无法删除');
      }

      // 检查是否有商品使用该分类
      const products = await app.database('t_product')
        .where('category_id', categoryId)
        .where('status', 1)
        .count('* as count')
        .first();

      if (products.count > 0) {
        throw new Error('该分类下存在商品，无法删除');
      }

      // 软删除
      await app.database('t_product_category')
        .where('category_id', categoryId)
        .update({ status: 0, update_time: new Date() });

      // 检查父级是否还有其他子分类，如果没有则更新 has_children
      const category = await app.database('t_product_category')
        .where('category_id', categoryId)
        .first();

      if (category.parent_id) {
        const siblingCount = await app.database('t_product_category')
          .where('parent_id', category.parent_id)
          .where('status', '>', 0)
          .count('* as count')
          .first();

        if (siblingCount.count === 0) {
          await app.database('t_product_category')
            .where('category_id', category.parent_id)
            .update({ has_children: 0 });
        }
      }

      return true;
    }

    /**
     * 获取子分类列表（用于级联选择器）
     */
    async getCategoryChildren(parentId, level) {
      let query = app.database('t_product_category')
        .where('status', 1);

      if (parentId) {
        query = query.where('parent_id', parentId);
      } else {
        query = query.whereNull('parent_id');
      }

      if (level) {
        query = query.where('level', parseInt(level));
      }

      const children = await query
        .select('category_id', 'category_name', 'level', 'has_children', 'sort_order')
        .orderBy('sort_order', 'asc');

      return children;
    }

    /**
     * 获取分类的完整路径（ID数组）
     */
    async getCategoryPath(categoryId) {
      const category = await app.database('t_product_category')
        .where('category_id', categoryId)
        .first();

      if (!category) {
        return [];
      }

      if (!category.category_path) {
        return [categoryId];
      }

      // category_path = "/CAT001/CAT001001"
      const path = category.category_path.split('/').filter(Boolean);
      path.push(categoryId);

      return path;
    }

    /**
     * 更新当前分类的 full_name
     */
    async updateCategoryFullName(categoryId) {
      const category = await app.database('t_product_category')
        .where('category_id', categoryId)
        .first();

      if (!category) return;

      // 计算 full_name
      let fullName = category.category_name;

      if (category.parent_id) {
        // 有父级，需要拼接父级的 full_name
        const parent = await app.database('t_product_category')
          .where('category_id', category.parent_id)
          .first();
        
        if (parent) {
          fullName = `${parent.full_name}/${category.category_name}`;
        }
      }

      // 更新 full_name
      await app.database('t_product_category')
        .where('category_id', categoryId)
        .update({ full_name: fullName });
    }

    /**
     * 递归更新所有子孙分类的 full_name（不包括当前分类）
     */
    async updateChildrenFullName(categoryId) {
      // 查询所有直接子分类
      const children = await app.database('t_product_category')
        .where('parent_id', categoryId)
        .where('status', '>', 0)
        .select('*');

      // 递归更新每个子分类
      for (const child of children) {
        // 更新子分类的 full_name
        await this.updateCategoryFullName(child.category_id);
        
        // 递归更新孙分类
        await this.updateChildrenFullName(child.category_id);
      }
    }

    /**
     * 根据分类ID获取所有层级ID
     */
    async getCategoryLevels(categoryId) {
      const category = await app.database('t_product_category')
        .where('category_id', categoryId)
        .first();

      if (!category) {
        return {
          category_l1_id: null,
          category_l2_id: null,
          category_l3_id: null,
          category_l4_id: null
        };
      }

      const pathIds = category.category_path 
        ? category.category_path.split('/').filter(Boolean)
        : [];
      pathIds.push(categoryId);

      return {
        category_l1_id: pathIds[0] || null,
        category_l2_id: pathIds[1] || null,
        category_l3_id: pathIds[2] || null,
        category_l4_id: pathIds[3] || null
      };
    }

    /**
     * 获取分类树形结构（用于级联选择器）
     */
    async getCategoryTree() {
      // 查询所有启用的分类
      const allCategories = await app.database('t_product_category')
        .where('status', 1)
        .orderBy('sort_order', 'asc')
        .select('category_id', 'category_name', 'parent_id', 'level', 'has_children', 'full_name');

      // 构建树形结构
      const buildTree = (parentId = null) => {
        const nodes = allCategories
          .filter(cat => cat.parent_id === parentId)
          .map(cat => {
            const node = {
              category_id: cat.category_id,
              category_name: cat.category_name,
              full_name: cat.full_name,
              level: cat.level,
              has_children: cat.has_children
            };

            // 如果有子分类，递归构建
            if (cat.has_children) {
              const children = buildTree(cat.category_id);
              if (children.length > 0) {
                node.children = children;
              }
            }

            return node;
          });
        
        return nodes;
      };

      const tree = buildTree();
      
      return tree;
    }
  };
};

