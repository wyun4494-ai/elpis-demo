-- ================================================================
-- 为 t_product_param_library 表添加 update_time 字段
-- ================================================================

-- 检查字段是否存在，如果不存在则添加
ALTER TABLE `t_product_param_library`
ADD COLUMN IF NOT EXISTS `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
AFTER `create_time`;

