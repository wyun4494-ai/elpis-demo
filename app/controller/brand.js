module.exports = (app) => {
  const BaseController = require('@lesheng/elpis').Controller.Base(app);

  return class BrandController extends BaseController {

    /**
     * 获取品牌列表
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

