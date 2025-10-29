-- 为商品表添加商品图片字段
-- 执行时间：2025-01-xx

USE elpis_beta;

-- 添加商品图片字段（JSON数组格式）
ALTER TABLE t_product 
ADD COLUMN product_images JSON COMMENT '商品图片（JSON数组）' AFTER product_name;

-- 更新说明
-- product_images 存储格式示例: ["http://xxx/1.jpg", "http://xxx/2.jpg"]
-- 第一张图片作为商品主图显示在列表中

