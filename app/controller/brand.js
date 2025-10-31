/**
 * 品牌管理控制器
 * 处理品牌相关的 HTTP 请求（CRUD、搜索等）
 *
 * @class BrandController
 * @extends BaseController
 */
module.exports = (app) => {
  const BaseController = require('@lesheng/elpis').Controller.Base(app);

  return class BrandController extends BaseController {

    /**
     * 获取品牌列表（分页）
     *
     * @param {Object} ctx - Koa 上下文对象
     * @param {Object} ctx.query - 查询参数
     * @param {string} [ctx.query.brand_name] - 品牌名称（模糊查询，支持中英文）
     * @param {string} [ctx.query.first_letter] - 首字母筛选
     * @param {number} [ctx.query.page=1] - 页码
     * @param {number} [ctx.query.pageSize=10] - 每页数量
     * @returns {Promise<void>}
     */
    async getBrandList(ctx) {
      const params = ctx.query;
      const { brand: brandService } = app.service;

      try {
        const result = await brandService.getBrandList(params);
        this.success(ctx, result.list, {
          total: result.total,
          page: result.page,
          pageSize: result.pageSize
        });
      } catch (error) {
        this.fail(ctx, error.message, 500);
      }
    }

    /**
     * 远程搜索品牌（用于下拉选择）
     *
     * @param {Object} ctx - Koa 上下文对象
     * @param {Object} ctx.query - 查询参数
     * @param {string} ctx.query.keyword - 搜索关键词（支持中英文名称、首字母）
     * @returns {Promise<void>}
     */
    async searchBrand(ctx) {
      const { keyword } = ctx.query;
      const { brand: brandService } = app.service;

      try {
        const brands = await brandService.searchBrand(keyword);
        this.success(ctx, brands);
      } catch (error) {
        this.fail(ctx, error.message, 500);
      }
    }

    /**
     * 获取品牌详情
     *
     * @param {Object} ctx - Koa 上下文对象
     * @param {Object} ctx.query - 查询参数
     * @param {string} ctx.query.brand_id - 品牌ID
     * @returns {Promise<void>}
     */
    async getBrand(ctx) {
      const { brand_id } = ctx.query;
      const { brand: brandService } = app.service;

      try {
        const brand = await brandService.getBrand(brand_id);
        if (!brand) {
          this.fail(ctx, '品牌不存在', 404);
          return;
        }
        this.success(ctx, brand);
      } catch (error) {
        this.fail(ctx, error.message, 500);
      }
    }

    /**
     * 创建品牌
     *
     * @param {Object} ctx - Koa 上下文对象
     * @param {Object} ctx.request.body - 请求体参数
     * @param {string} ctx.request.body.brand_name - 品牌名称（中文）
     * @param {string} [ctx.request.body.brand_name_en] - 品牌名称（英文）
     * @param {string} [ctx.request.body.logo_url] - 品牌Logo URL
     * @param {string} [ctx.request.body.description] - 品牌描述
     * @param {number} [ctx.request.body.sort_order=0] - 排序值
     * @returns {Promise<void>}
     */
    async create(ctx) {
      const params = ctx.request.body;
      const { brand: brandService } = app.service;

      try {
        const brandId = await brandService.createBrand(params);
        this.success(ctx, { brand_id: brandId });
      } catch (error) {
        this.fail(ctx, error.message, 500);
      }
    }

    /**
     * 更新品牌
     *
     * @param {Object} ctx - Koa 上下文对象
     * @param {Object} ctx.request.body - 请求体参数
     * @param {string} ctx.request.body.brand_id - 品牌ID
     * @param {string} [ctx.request.body.brand_name] - 品牌名称（中文）
     * @param {string} [ctx.request.body.brand_name_en] - 品牌名称（英文）
     * @param {string} [ctx.request.body.logo_url] - 品牌Logo URL
     * @param {string} [ctx.request.body.description] - 品牌描述
     * @param {number} [ctx.request.body.sort_order] - 排序值
     * @returns {Promise<void>}
     */
    async update(ctx) {
      const params = ctx.request.body;
      const { brand: brandService } = app.service;
      
      try {
        await brandService.updateBrand(params);
        this.success(ctx, { success: true });
      } catch (error) {
        this.fail(ctx, error.message, 500);
      }
    }

    /**
     * 删除品牌
     */
    async remove(ctx) {
      const { brand_id } = ctx.request.body;
      const { brand: brandService } = app.service;
      
      try {
        await brandService.deleteBrand(brand_id);
        this.success(ctx, { success: true });
      } catch (error) {
        this.fail(ctx, error.message, 500);
      }
    }
  };
};

