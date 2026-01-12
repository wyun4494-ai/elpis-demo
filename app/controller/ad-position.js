/**
 * 广告位置控制器
 */
module.exports = (app) => {
  const BaseController = require('@lesheng/elpis').Controller.Base(app);

  return class AdPositionController extends BaseController {
    /**
     * 获取广告位置列表
     */
    async getList(ctx) {
      try {
        const params = ctx.query;
        const { adPosition: adPositionService } = app.service;
        const result = await adPositionService.getList(params);
        this.success(ctx, result.list, { 
          total: result.total, 
          page: result.page, 
          pageSize: result.pageSize 
        });
      } catch (error) {
        app.logger.error('获取广告位置列表失败:', error);
        this.error(ctx, error.message || '获取广告位置列表失败');
      }
    }

    /**
     * 获取所有启用的广告位置（用于下拉选择）
     */
    async getAllEnabled(ctx) {
      try {
        const { adPosition: adPositionService } = app.service;
        const list = await adPositionService.getAllEnabled();
        this.success(ctx, list);
      } catch (error) {
        app.logger.error('获取广告位置失败:', error);
        this.error(ctx, error.message || '获取广告位置失败');
      }
    }

    /**
     * 获取广告位置详情
     */
    async getDetail(ctx) {
      try {
        const { position_id } = ctx.query;
        if (!position_id) {
          return this.error(ctx, '缺少位置ID参数');
        }

        const { adPosition: adPositionService } = app.service;
        const detail = await adPositionService.getDetail(position_id);
        this.success(ctx, detail);
      } catch (error) {
        app.logger.error('获取广告位置详情失败:', error);
        this.error(ctx, error.message || '获取广告位置详情失败');
      }
    }

    /**
     * 创建广告位置
     */
    async create(ctx) {
      try {
        const data = ctx.request.body;
        const { adPosition: adPositionService } = app.service;
        const result = await adPositionService.create(data);
        this.success(ctx, result, '创建成功');
      } catch (error) {
        app.logger.error('创建广告位置失败:', error);
        this.error(ctx, error.message || '创建广告位置失败');
      }
    }

    /**
     * 更新广告位置
     */
    async update(ctx) {
      try {
        const data = ctx.request.body;
        const { adPosition: adPositionService } = app.service;
        const result = await adPositionService.update(data);
        this.success(ctx, result, '更新成功');
      } catch (error) {
        app.logger.error('更新广告位置失败:', error);
        this.error(ctx, error.message || '更新广告位置失败');
      }
    }

    /**
     * 删除广告位置
     */
    async remove(ctx) {
      try {
        const { position_id } = ctx.query;
        if (!position_id) {
          return this.error(ctx, '缺少位置ID参数');
        }

        const { adPosition: adPositionService } = app.service;
        const result = await adPositionService.delete(position_id);
        this.success(ctx, result, '删除成功');
      } catch (error) {
        app.logger.error('删除广告位置失败:', error);
        this.error(ctx, error.message || '删除广告位置失败');
      }
    }

    /**
     * 切换启用状态
     */
    async toggle(ctx) {
      try {
        const { position_id, is_enabled } = ctx.request.body;
        if (!position_id) {
          return this.error(ctx, '缺少位置ID参数');
        }

        const { adPosition: adPositionService } = app.service;
        const result = await adPositionService.toggle(position_id, is_enabled);
        this.success(ctx, result, '操作成功');
      } catch (error) {
        app.logger.error('切换状态失败:', error);
        this.error(ctx, error.message || '切换状态失败');
      }
    }

    /**
     * 批量启用
     */
    async batchEnable(ctx) {
      try {
        const { position_ids } = ctx.request.body;
        if (!position_ids || !Array.isArray(position_ids) || position_ids.length === 0) {
          return this.error(ctx, '请选择要启用的广告位置');
        }

        const { adPosition: adPositionService } = app.service;
        const result = await adPositionService.batchEnable(position_ids);
        this.success(ctx, result, `成功启用 ${result.count} 个广告位置`);
      } catch (error) {
        app.logger.error('批量启用失败:', error);
        this.error(ctx, error.message || '批量启用失败');
      }
    }

    /**
     * 批量禁用
     */
    async batchDisable(ctx) {
      try {
        const { position_ids } = ctx.request.body;
        if (!position_ids || !Array.isArray(position_ids) || position_ids.length === 0) {
          return this.error(ctx, '请选择要禁用的广告位置');
        }

        const { adPosition: adPositionService } = app.service;
        const result = await adPositionService.batchDisable(position_ids);
        this.success(ctx, result, `成功禁用 ${result.count} 个广告位置`);
      } catch (error) {
        app.logger.error('批量禁用失败:', error);
        this.error(ctx, error.message || '批量禁用失败');
      }
    }

    /**
     * 批量删除
     */
    async batchDelete(ctx) {
      try {
        const { position_ids } = ctx.request.body;
        if (!position_ids || !Array.isArray(position_ids) || position_ids.length === 0) {
          return this.error(ctx, '请选择要删除的广告位置');
        }

        const { adPosition: adPositionService } = app.service;
        const result = await adPositionService.batchDelete(position_ids);
        this.success(ctx, result, `成功删除 ${result.count} 个广告位置`);
      } catch (error) {
        app.logger.error('批量删除失败:', error);
        this.error(ctx, error.message || '批量删除失败');
      }
    }
  };
};
