/**
 * 品牌管理服务
 * 处理品牌相关的业务逻辑和数据库操作
 *
 * 业务说明：
 * - 品牌首字母自动计算（中文使用 pinyin-pro，英文取首字母大写，其他为 #）
 * - 支持中英文名称模糊搜索
 * - 支持首字母筛选
 * - 删除前检查是否有商品使用该品牌
 *
 * @class BrandService
 * @extends BaseService
 */
module.exports = (app) => {
  const BaseService = require('@lesheng/elpis').Service.Base(app);
  const { v4: uuidv4 } = require('uuid');
  const moment = require('moment');
  const { pinyin } = require('pinyin-pro');

  return class BrandService extends BaseService {

    /**
     * 获取品牌列表（分页）
     *
     * @param {Object} params - 查询参数
     * @param {string} [params.brand_name] - 品牌名称（模糊查询，支持中英文）
     * @param {string} [params.first_letter] - 首字母筛选
     * @param {number} [params.page=1] - 页码
     * @param {number} [params.pageSize=10] - 每页数量
     * @returns {Promise<Object>} 返回品牌列表和分页信息
     * @returns {Array} returns.list - 品牌列表
     * @returns {number} returns.total - 总数
     * @returns {number} returns.page - 当前页码
     * @returns {number} returns.pageSize - 每页数量
     */
    async getBrandList(params) {
      const {
        brand_name: brandName,
        first_letter: firstLetter,
        page = 1,
        pageSize = 10
      } = params;

      const offset = (parseInt(page) - 1) * parseInt(pageSize);

      // 1. 构建查询条件
      let query = app.database('t_product_brand').where('status', 1);

      // 品牌名称筛选（模糊查询，支持中英文）
      if (brandName) {
        query = query.where(function() {
          this.where('brand_name', 'like', `%${brandName}%`)
              .orWhere('brand_name_en', 'like', `%${brandName}%`);
        });
      }

      // 首字母筛选
      if (firstLetter && firstLetter !== -999 && firstLetter !== '-999') {
        query = query.where('first_letter', firstLetter);
      }

      // 2. 查询总数
      const totalResult = await query.clone().count('* as count').first();
      const total = totalResult ? totalResult.count : 0;

      // 3. 查询列表数据
      const list = await query
        .select('*')
        .orderBy('sort_order', 'asc')
        .orderBy('brand_name', 'asc')
        .limit(parseInt(pageSize))
        .offset(offset);

      // 4. 格式化数据
      list.forEach(item => {
        item.create_time = moment(item.create_time).format('YYYY-MM-DD HH:mm:ss');
        item.status = parseInt(item.status);
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
     * 远程搜索品牌（用于下拉选择）
     *
     * @param {string} keyword - 搜索关键词
     * @returns {Promise<Array>} 返回品牌选项列表
     * @returns {string} returns[].value - 品牌ID
     * @returns {string} returns[].label - 品牌名称（中文 + 英文）
     */
    async searchBrand(keyword) {
      if (!keyword) {
        return [];
      }

      // 1. 查询品牌（支持中英文名称和首字母搜索）
      const brands = await app.database('t_product_brand')
        .where('status', 1)
        .where(function() {
          this.where('brand_name', 'like', `%${keyword}%`)
              .orWhere('brand_name_en', 'like', `%${keyword}%`)
              .orWhere('first_letter', 'like', `%${keyword.toUpperCase()}%`);
        })
        .select('brand_id', 'brand_name', 'brand_name_en', 'first_letter')
        .orderBy('sort_order', 'asc')
        .limit(50);

      // 2. 格式化为下拉选项
      return brands.map(item => ({
        value: item.brand_id,
        label: item.brand_name_en
          ? `${item.brand_name} (${item.brand_name_en})`
          : item.brand_name,
        brand_id: item.brand_id,
        brand_name: item.brand_name,
        brand_name_en: item.brand_name_en
      }));
    }

    /**
     * 获取品牌详情
     *
     * @param {string} brandId - 品牌ID
     * @returns {Promise<Object|undefined>} 返回品牌详情，不存在则返回 undefined
     */
    async getBrand(brandId) {
      const brand = await app.database('t_product_brand')
        .where('brand_id', brandId)
        .where('status', 1)
        .first();

      if (brand) {
        brand.create_time = moment(brand.create_time).format('YYYY-MM-DD HH:mm:ss');
        brand.status = parseInt(brand.status);
        brand.sort_order = parseInt(brand.sort_order);
      }

      return brand;
    }

    /**
     * 创建品牌
     *
     * 业务规则：
     * - 检查品牌名称是否重复
     * - 自动计算首字母（使用 getFirstLetter 方法）
     * - 自动生成品牌ID（BRAND + 时间戳 + 随机字符串）
     *
     * @param {Object} params - 品牌数据
     * @param {string} params.brand_name - 品牌名称（中文）
     * @param {string} [params.brand_name_en] - 品牌名称（英文）
     * @param {string} [params.logo_url] - Logo URL
     * @param {string} [params.description] - 品牌描述
     * @param {number} [params.sort_order=0] - 排序值
     * @returns {Promise<string>} 返回新创建的品牌ID
     * @throws {Error} 如果品牌名称已存在，抛出异常
     */
    async createBrand(params) {
      const { brand_name, brand_name_en, logo_url, description, sort_order = 0 } = params;

      // 1. 检查品牌名称是否重复
      const existing = await app.database('t_product_brand')
        .where('brand_name', brand_name)
        .where('status', 1)
        .first();

      if (existing) {
        throw new Error('品牌名称已存在');
      }

      // 2. 自动计算首字母
      const firstLetter = this.getFirstLetter(brand_name);

      // 3. 生成品牌ID（BRAND + 时间戳 + 随机字符串）
      const brandId = `BRAND${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

      // 4. 插入新品牌
      await app.database('t_product_brand').insert({
        brand_id: brandId,
        brand_name,
        brand_name_en: brand_name_en || null,
        first_letter: firstLetter,
        logo_url: logo_url || null,
        description: description || null,
        sort_order: parseInt(sort_order),
        status: 1,
        create_time: new Date()
      });

      return brandId;
    }

    /**
     * 更新品牌
     *
     * 业务规则：
     * - 检查品牌是否存在
     * - 如果修改品牌名称，检查是否重名
     * - 如果修改品牌名称，自动重新计算首字母
     *
     * @param {Object} params - 更新数据
     * @param {string} params.brand_id - 品牌ID
     * @param {string} [params.brand_name] - 品牌名称（中文）
     * @param {string} [params.brand_name_en] - 品牌名称（英文）
     * @param {string} [params.logo_url] - Logo URL
     * @param {string} [params.description] - 品牌描述
     * @param {number} [params.sort_order] - 排序值
     * @returns {Promise<boolean>} 返回 true
     * @throws {Error} 如果品牌不存在或品牌名称已存在，抛出异常
     */
    async updateBrand(params) {
      const { brand_id, brand_name, brand_name_en, logo_url, description, sort_order } = params;

      // 1. 检查品牌是否存在
      const brand = await app.database('t_product_brand')
        .where('brand_id', brand_id)
        .first();

      if (!brand) {
        throw new Error('品牌不存在');
      }

      // 2. 检查是否重名
      if (brand_name && brand_name !== brand.brand_name) {
        const existing = await app.database('t_product_brand')
          .where('brand_name', brand_name)
          .where('brand_id', '!=', brand_id)
          .where('status', 1)
          .first();

        if (existing) {
          throw new Error('品牌名称已存在');
        }
      }

      // 3. 构建更新对象
      const updateData = {
        update_time: new Date()
      };

      if (brand_name) {
        updateData.brand_name = brand_name;
        // 品牌名称修改时，自动重新计算首字母
        updateData.first_letter = this.getFirstLetter(brand_name);
      }
      if (brand_name_en !== undefined) updateData.brand_name_en = brand_name_en;
      if (logo_url !== undefined) updateData.logo_url = logo_url;
      if (description !== undefined) updateData.description = description;
      if (sort_order !== undefined) updateData.sort_order = parseInt(sort_order);

      // 4. 更新品牌
      await app.database('t_product_brand')
        .where('brand_id', brand_id)
        .update(updateData);

      return true;
    }

    /**
     * 删除品牌（软删除）
     *
     * 业务规则：
     * - 删除前检查是否有商品使用该品牌
     * - 如果有商品，抛出异常，禁止删除
     *
     * @param {string} brandId - 品牌ID
     * @returns {Promise<boolean>} 返回 true
     * @throws {Error} 如果该品牌下存在商品，抛出异常
     */
    async deleteBrand(brandId) {
      // 1. 检查是否有商品使用该品牌
      const products = await app.database('t_product')
        .where('brand_id', brandId)
        .where('status', 1)
        .count('* as count')
        .first();

      if (products.count > 0) {
        throw new Error('该品牌下存在商品，无法删除');
      }

      // 2. 软删除
      await app.database('t_product_brand')
        .where('brand_id', brandId)
        .update({ status: 0, update_time: new Date() });

      return true;
    }

    /**
     * 获取品牌首字母
     *
     * 算法说明：
     * - 英文字母：直接取首字母大写
     * - 中文：使用 pinyin-pro 库获取拼音首字母大写
     * - 其他字符：返回 #
     *
     * @param {string} name - 品牌名称
     * @returns {string} 首字母（大写）
     * @example
     * getFirstLetter('苹果') // 返回 'P'
     * getFirstLetter('Apple') // 返回 'A'
     * getFirstLetter('123') // 返回 '#'
     */
    getFirstLetter(name) {
      if (!name) return '#';

      const firstChar = name.charAt(0);

      // 1. 判断是否为英文字母
      if (/[a-zA-Z]/.test(firstChar)) {
        return firstChar.toUpperCase();
      }

      // 2. 判断是否为中文
      if (/[\u4e00-\u9fa5]/.test(firstChar)) {
        try {
          // 使用 pinyin-pro 库获取首字母
          const result = pinyin(firstChar, { pattern: 'first' });

          if (result && typeof result === 'string' && result.length > 0) {
            return result.charAt(0).toUpperCase();
          }

          return '#';
        } catch (error) {
          console.error('[getFirstLetter] Pinyin error:', error);
          return '#';
        }
      }

      // 3. 其他字符返回 #
      return '#';
    }
  };
};

