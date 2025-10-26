module.exports = (app) => {
  const BaseService = require('@lesheng/elpis').Service.Base(app);
  const { v4: uuidv4 } = require('uuid');
  const moment = require('moment');
  const { pinyin } = require('pinyin-pro');

  return class BrandService extends BaseService {

    /**
     * 获取品牌列表（分页）
     */
    async getBrandList(params) {
      const { 
        brand_name: brandName,
        first_letter: firstLetter,
        page = 1, 
        pageSize = 10 
      } = params;

      const offset = (parseInt(page) - 1) * parseInt(pageSize);

      // 构建查询条件
      let query = app.database('t_product_brand').where('status', 1);

      // 品牌名称筛选（模糊查询）
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

      // 查询总数
      const totalResult = await query.clone().count('* as count').first();
      const total = totalResult ? totalResult.count : 0;

      // 查询列表数据
      const list = await query
        .select('*')
        .orderBy('sort_order', 'asc')
        .orderBy('brand_name', 'asc')
        .limit(parseInt(pageSize))
        .offset(offset);

      // 格式化数据
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
     */
    async searchBrand(keyword) {
      if (!keyword) {
        return [];
      }

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

      // 格式化为下拉选项
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
     */
    async createBrand(params) {
      const { brand_name, brand_name_en, logo_url, description, sort_order = 0 } = params;

      // 检查品牌名称是否重复
      const existing = await app.database('t_product_brand')
        .where('brand_name', brand_name)
        .where('status', 1)
        .first();

      if (existing) {
        throw new Error('品牌名称已存在');
      }

      // 自动计算首字母
      const firstLetter = this.getFirstLetter(brand_name);

      // 生成品牌ID
      const brandId = `BRAND${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

      // 插入新品牌
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
     */
    async updateBrand(params) {
      const { brand_id, brand_name, brand_name_en, logo_url, description, sort_order } = params;

      // 检查品牌是否存在
      const brand = await app.database('t_product_brand')
        .where('brand_id', brand_id)
        .first();

      if (!brand) {
        throw new Error('品牌不存在');
      }

      // 检查是否重名
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

      // 更新品牌
      const updateData = {
        update_time: new Date()
      };

      if (brand_name) {
        updateData.brand_name = brand_name;
        updateData.first_letter = this.getFirstLetter(brand_name);
      }
      if (brand_name_en !== undefined) updateData.brand_name_en = brand_name_en;
      if (logo_url !== undefined) updateData.logo_url = logo_url;
      if (description !== undefined) updateData.description = description;
      if (sort_order !== undefined) updateData.sort_order = parseInt(sort_order);

      await app.database('t_product_brand')
        .where('brand_id', brand_id)
        .update(updateData);

      return true;
    }

    /**
     * 删除品牌（软删除）
     */
    async deleteBrand(brandId) {
      // 检查是否有商品使用该品牌
      const products = await app.database('t_product')
        .where('brand_id', brandId)
        .where('status', 1)
        .count('* as count')
        .first();

      if (products.count > 0) {
        throw new Error('该品牌下存在商品，无法删除');
      }

      // 软删除
      await app.database('t_product_brand')
        .where('brand_id', brandId)
        .update({ status: 0, update_time: new Date() });

      return true;
    }

    /**
     * 获取品牌首字母
     * @param {String} name 品牌名称
     * @returns {String} 首字母（大写）
     */
    getFirstLetter(name) {
      if (!name) return '#';
      
      const firstChar = name.charAt(0);
      
      // 判断是否为英文字母
      if (/[a-zA-Z]/.test(firstChar)) {
        return firstChar.toUpperCase();
      }
      
      // 判断是否为中文
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
      
      // 其他字符返回 #
      return '#';
    }
  };
};

