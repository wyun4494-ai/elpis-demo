-- ================================================================
-- Elpis 电商系统 - 数据库初始化脚本
-- 版本：1.0.0
-- 创建时间：2025-10-26
-- 说明：执行此脚本可创建所有业务表
-- ================================================================

-- 使用数据库
USE elpis_beta;

-- ================================================================
-- 1. 商品分类表
-- ================================================================
CREATE TABLE IF NOT EXISTS `t_product_category` (
  `category_id` VARCHAR(64) NOT NULL PRIMARY KEY COMMENT '分类ID',
  `category_name` VARCHAR(100) NOT NULL COMMENT '分类名称',
  `parent_id` VARCHAR(64) DEFAULT NULL COMMENT '父级分类ID',
  `level` TINYINT DEFAULT 1 COMMENT '层级：1-4',
  `category_path` VARCHAR(500) DEFAULT NULL COMMENT '分类路径：/父ID/父父ID/..',
  `full_name` VARCHAR(500) DEFAULT NULL COMMENT '完整名称：一级/二级/三级',
  `has_children` TINYINT DEFAULT 0 COMMENT '是否有子分类：1-是，0-否',
  `sort_order` INT DEFAULT 0 COMMENT '排序',
  `icon` VARCHAR(200) DEFAULT NULL COMMENT '分类图标URL',
  `banner_img` VARCHAR(500) DEFAULT NULL COMMENT '分类Banner图',
  `status` TINYINT DEFAULT 1 COMMENT '状态：1-启用，0-禁用',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  
  KEY `idx_parent_id` (`parent_id`),
  KEY `idx_status` (`status`),
  KEY `idx_level` (`level`),
  KEY `idx_sort` (`sort_order`),
  KEY `idx_has_children` (`has_children`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品分类表';

-- ================================================================
-- 2. 商品品牌表
-- ================================================================
CREATE TABLE IF NOT EXISTS `t_product_brand` (
  `brand_id` VARCHAR(64) NOT NULL PRIMARY KEY COMMENT '品牌ID',
  `brand_name` VARCHAR(100) NOT NULL COMMENT '品牌名称',
  `brand_name_en` VARCHAR(100) DEFAULT NULL COMMENT '品牌英文名',
  `first_letter` VARCHAR(1) DEFAULT NULL COMMENT '品牌首字母',
  `logo_url` VARCHAR(500) DEFAULT NULL COMMENT '品牌Logo URL',
  `description` TEXT COMMENT '品牌描述',
  `sort_order` INT DEFAULT 0 COMMENT '排序',
  `status` TINYINT DEFAULT 1 COMMENT '状态：1-启用，0-禁用',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  
  UNIQUE KEY `uk_brand_name` (`brand_name`),
  KEY `idx_status` (`status`),
  KEY `idx_first_letter` (`first_letter`),
  KEY `idx_sort` (`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品品牌表';

-- ================================================================
-- 3. 参数分类表
-- ================================================================
CREATE TABLE IF NOT EXISTS `t_param_category` (
  `category_id` VARCHAR(64) NOT NULL PRIMARY KEY COMMENT '分类ID',
  `category_name` VARCHAR(50) NOT NULL COMMENT '分类名称',
  `sort_order` INT DEFAULT 0 NOT NULL COMMENT '排序',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

  UNIQUE KEY `uk_category_name` (`category_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='参数分类表';

-- ================================================================
-- 4. 商品参数库表（预定义参数）
-- ================================================================
CREATE TABLE IF NOT EXISTS `t_product_param_library` (
  `param_id` VARCHAR(64) NOT NULL PRIMARY KEY COMMENT '参数ID',
  `param_name` VARCHAR(50) NOT NULL COMMENT '参数名称',
  `param_type` VARCHAR(20) DEFAULT 'input' COMMENT '参数类型：input、select、checkbox',
  `param_values` TEXT COMMENT '预定义参数值（JSON数组）',
  `param_category` VARCHAR(50) DEFAULT '基本参数' COMMENT '参数分类（关联 t_param_category.category_id）',
  `sort_order` INT DEFAULT 0 COMMENT '排序',
  `status` TINYINT DEFAULT 1 COMMENT '状态',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  UNIQUE KEY `uk_name_category` (`param_name`, `param_category`),
  KEY `idx_category` (`param_category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品参数库';

-- ================================================================
-- 5. 分类属性表（SKU规格配置）
-- ================================================================
CREATE TABLE IF NOT EXISTS `t_category_attribute` (
  `attr_id` VARCHAR(64) NOT NULL PRIMARY KEY COMMENT '属性ID',
  `category_id` VARCHAR(64) NOT NULL COMMENT '分类ID（末级）',
  `attr_name` VARCHAR(50) NOT NULL COMMENT '属性名称（颜色、尺寸）',
  `predefined_values` TEXT COMMENT '预定义属性值（JSON数组，如["金色","白色"]）',
  `allow_custom` TINYINT DEFAULT 1 COMMENT '是否允许用户自定义：1-允许，0-不允许',
  `is_required` TINYINT DEFAULT 1 COMMENT '是否必填',
  `sort_order` INT DEFAULT 0 COMMENT '排序',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
  KEY `idx_category` (`category_id`),
  KEY `idx_sort` (`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='分类属性表（SKU规格）';

-- ================================================================
-- 6. 分类参数关联表
-- ================================================================
CREATE TABLE IF NOT EXISTS `t_category_param` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `category_id` VARCHAR(64) NOT NULL COMMENT '分类ID（末级）',
  `param_id` VARCHAR(64) NOT NULL COMMENT '参数库ID',
  `custom_values` TEXT COMMENT '自定义参数值（JSON数组，扩展预定义值）',
  `allow_custom` TINYINT DEFAULT 1 COMMENT '是否允许用户自定义',
  `is_required` TINYINT DEFAULT 0 COMMENT '是否必填',
  `sort_order` INT DEFAULT 0 COMMENT '排序',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
  KEY `idx_category` (`category_id`),
  UNIQUE KEY `uk_category_param` (`category_id`, `param_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='分类参数关联表';

-- ================================================================
-- 7. 商品表（SPU）
-- ================================================================
CREATE TABLE IF NOT EXISTS `t_product` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `product_id` VARCHAR(64) NOT NULL COMMENT '商品ID',
  `product_name` VARCHAR(200) NOT NULL COMMENT '商品名称',
  `product_images` JSON COMMENT '商品图片（JSON数组）',
  `category_id` VARCHAR(64) DEFAULT NULL COMMENT '所属分类ID（末级）',
  `type_id` VARCHAR(64) DEFAULT NULL COMMENT '商品类型ID',
  `category_l1_id` VARCHAR(64) DEFAULT NULL COMMENT '一级分类ID',
  `category_l2_id` VARCHAR(64) DEFAULT NULL COMMENT '二级分类ID',
  `category_l3_id` VARCHAR(64) DEFAULT NULL COMMENT '三级分类ID',
  `category_l4_id` VARCHAR(64) DEFAULT NULL COMMENT '四级分类ID',
  `brand_id` VARCHAR(64) DEFAULT NULL COMMENT '品牌ID',
  `price` DECIMAL(10,2) DEFAULT 0.00 COMMENT '价格',
  `item_number` VARCHAR(100) DEFAULT NULL COMMENT '货号',
  `inventory` INT DEFAULT 0 COMMENT '库存',
  `status` TINYINT(1) DEFAULT 1 COMMENT '状态：1-正常，0-已删除',
  `shelf_status` TINYINT(1) DEFAULT 0 COMMENT '上架状态：1-上架，0-下架',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `delete_time` DATETIME DEFAULT NULL COMMENT '删除时间',
  `delete_reason` VARCHAR(500) DEFAULT NULL COMMENT '删除原因',
  `deleted_by` VARCHAR(64) DEFAULT NULL COMMENT '删除人',
  
  UNIQUE KEY `uk_product_id` (`product_id`),
  KEY `idx_product_name` (`product_name`),
  KEY `idx_status` (`status`),
  KEY `idx_create_time` (`create_time`),
  KEY `idx_item_number` (`item_number`),
  KEY `idx_category_id` (`category_id`),
  KEY `idx_category_l1` (`category_l1_id`),
  KEY `idx_category_l2` (`category_l2_id`),
  KEY `idx_category_l3` (`category_l3_id`),
  KEY `idx_brand_id` (`brand_id`),
  KEY `idx_status_shelf` (`status`, `shelf_status`),
  KEY `idx_type` (`type_id`),
  KEY `idx_delete_time` (`delete_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品表';

-- ================================================================
-- 8. 商品SKU表
-- ================================================================
CREATE TABLE IF NOT EXISTS `t_product_sku` (
  `sku_id` VARCHAR(64) NOT NULL PRIMARY KEY COMMENT 'SKU ID',
  `product_id` VARCHAR(64) NOT NULL COMMENT 'SPU商品ID',
  `sku_name` VARCHAR(200) COMMENT 'SKU名称（如：红色-M码）',
  `sku_code` VARCHAR(100) COMMENT 'SKU编码',
  `sku_attributes` TEXT NOT NULL COMMENT 'SKU属性值（JSON）',
  `price` DECIMAL(10,2) DEFAULT 0.00 COMMENT 'SKU价格',
  `promotion_price` DECIMAL(10,2) COMMENT '促销价格',
  `inventory` INT DEFAULT 0 COMMENT 'SKU库存',
  `stock_alert` INT DEFAULT 50 COMMENT '库存预警值',
  `image_url` VARCHAR(500) COMMENT 'SKU图片',
  `status` TINYINT DEFAULT 1 COMMENT '状态：1-正常，0-禁用',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  KEY `idx_product` (`product_id`),
  KEY `idx_status` (`status`),
  KEY `idx_inventory` (`inventory`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品SKU表';

-- ================================================================
-- 9. 商品参数值表
-- ================================================================
CREATE TABLE IF NOT EXISTS `t_product_param_value` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `product_id` VARCHAR(64) NOT NULL COMMENT '商品ID',
  `param_id` VARCHAR(64) NOT NULL COMMENT '参数ID',
  `param_value` TEXT COMMENT '参数值',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,

  KEY `idx_product` (`product_id`),
  UNIQUE KEY `uk_product_param` (`product_id`, `param_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品参数值表';

-- ================================================================
-- 10. 库存预警日志表
-- ================================================================
CREATE TABLE IF NOT EXISTS `t_stock_alert_log` (
  `log_id` VARCHAR(64) NOT NULL PRIMARY KEY COMMENT '日志ID',
  `product_id` VARCHAR(64) NOT NULL COMMENT '商品ID',
  `sku_id` VARCHAR(64) NOT NULL COMMENT 'SKU ID',
  `sku_name` VARCHAR(200) COMMENT 'SKU名称',
  `current_stock` INT COMMENT '当前库存',
  `alert_threshold` INT COMMENT '预警阈值',
  `alert_level` TINYINT COMMENT '预警级别：1-一般，2-严重，3-缺货',
  `is_handled` TINYINT DEFAULT 0 COMMENT '是否已处理',
  `alert_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '预警时间',
  `handle_time` DATETIME COMMENT '处理时间',
  `handler` VARCHAR(64) COMMENT '处理人',

  KEY `idx_product` (`product_id`),
  KEY `idx_sku` (`sku_id`),
  KEY `idx_handled` (`is_handled`),
  KEY `idx_alert_time` (`alert_time`),
  KEY `idx_level` (`alert_level`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='库存预警日志表';

-- ================================================================
-- 11. 商品删除日志表
-- ================================================================
CREATE TABLE IF NOT EXISTS `t_product_delete_log` (
  `id` INT AUTO_INCREMENT PRIMARY KEY COMMENT '自增主键',
  `product_id` VARCHAR(64) NOT NULL COMMENT '商品ID',
  `operation_type` TINYINT(1) NOT NULL COMMENT '操作类型：1-删除，2-恢复',
  `operation_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '操作时间',
  `operation_by` VARCHAR(64) COMMENT '操作人ID',
  `delete_reason` VARCHAR(500) COMMENT '删除原因（仅删除操作有值）',

  KEY `idx_product_id` (`product_id`),
  KEY `idx_operation_time` (`operation_time`),
  KEY `idx_operation_by` (`operation_by`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品删除日志表';

-- ================================================================
-- 12. 用户表
-- ================================================================
CREATE TABLE IF NOT EXISTS `t_user` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '自增ID',
  `user_id` VARCHAR(255) NOT NULL COMMENT '用户唯一标识',
  `username` VARCHAR(255) NOT NULL COMMENT '账号',
  `password` VARCHAR(255) NOT NULL COMMENT '密码（存储加密后的值）',
  `nickname` VARCHAR(255) NOT NULL COMMENT '昵称',
  `sex` INT NOT NULL COMMENT '性别：1-男，2-女，3-其他',
  `desc` VARCHAR(255) COMMENT '用户描述（简介/备注）',
  `status` INT DEFAULT 1 NOT NULL COMMENT '状态：1-正常，-1-删除',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '创建时间',
  `update_time` DATETIME ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  
  UNIQUE KEY `uk_t_user_user_id` (`user_id`),
  UNIQUE KEY `uk_t_user_username` (`username`),
  KEY `idx_t_user_id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户信息表';

-- ================================================================
-- 脚本执行完成
-- ================================================================
SELECT '数据库表创建完成！' AS message;

-- 查看创建的表
SHOW TABLES;

