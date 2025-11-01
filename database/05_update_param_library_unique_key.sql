-- ================================================================
-- 修改 t_product_param_library 表的唯一索引
-- 从全局唯一改为分类内唯一
-- ================================================================

USE elpis_beta;

-- 1. 删除旧的唯一索引
ALTER TABLE `t_product_param_library`
DROP INDEX `uk_name`;

-- 2. 添加新的复合唯一索引（参数名称 + 参数分类）
ALTER TABLE `t_product_param_library`
ADD UNIQUE KEY `uk_name_category` (`param_name`, `param_category`);

