-- ================================================================
-- Elpis 电商系统 - 数据库初始化脚本
-- 版本：3.0.0
-- 创建时间：2025-01-05
-- 说明：执行此脚本可创建所有业务表（共30个表）
-- 根据本地数据库 DDL 重新整理
-- ================================================================

USE elpis_beta;

-- ================================================================
-- 1. 广告位置表
-- ================================================================
CREATE TABLE IF NOT EXISTS `t_ad_position` (
  `position_id` VARCHAR(64) NOT NULL COMMENT '位置ID' PRIMARY KEY,
  `position_key` VARCHAR(50) NOT NULL COMMENT '位置标识（唯一）',
  `position_name` VARCHAR(100) NOT NULL COMMENT '位置名称',
  `position_desc` VARCHAR(500) NULL COMMENT '位置描述',
  `width` INT NULL COMMENT '建议宽度（像素）',
  `height` INT NULL COMMENT '建议高度（像素）',
  `max_count` INT DEFAULT 1 NULL COMMENT '最大广告数量',
  `is_enabled` TINYINT(1) DEFAULT 1 NULL COMMENT '是否启用：1-启用，0-禁用',
  `sort_order` INT DEFAULT 0 NULL COMMENT '排序（数字越小越靠前）',
  `status` TINYINT(1) DEFAULT 1 NULL COMMENT '状态：1-正常，0-已删除',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP NULL COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NULL COMMENT '更新时间',
  `created_by` VARCHAR(64) DEFAULT 'system' NULL COMMENT '创建人',
  
  CONSTRAINT `uk_position_key` UNIQUE (`position_key`, `status`),
  KEY `idx_is_enabled` (`is_enabled`),
  KEY `idx_sort_order` (`sort_order`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='广告位置表';

-- ================================================================
-- 2. 广告推荐表
-- ================================================================
CREATE TABLE IF NOT EXISTS `t_advertisement` (
  `ad_id` VARCHAR(64) NOT NULL COMMENT '广告ID' PRIMARY KEY,
  `ad_name` VARCHAR(200) NOT NULL COMMENT '广告名称',
  `ad_position` VARCHAR(50) NOT NULL COMMENT '广告位置（如home_banner、home_sidebar）',
  `ad_type` TINYINT NOT NULL COMMENT '广告类型：1-图片，2-视频，3-HTML',
  `ad_image` VARCHAR(500) NULL COMMENT '广告图片',
  `ad_video` VARCHAR(500) NULL COMMENT '广告视频',
  `ad_html` TEXT NULL COMMENT '广告HTML',
  `link_url` VARCHAR(500) NULL COMMENT '跳转链接',
  `link_type` TINYINT NULL COMMENT '链接类型：1-商品，2-分类，3-品牌，4-专题，5-外部链接',
  `link_target` VARCHAR(64) NULL COMMENT '链接目标（商品ID/分类ID/品牌ID/专题ID）',
  `sort_order` INT DEFAULT 0 NULL COMMENT '排序（数字越小越靠前）',
  `is_enabled` TINYINT(1) DEFAULT 1 NULL COMMENT '是否启用：0-否，1-是',
  `ad_status` TINYINT(1) DEFAULT 1 NULL COMMENT '广告状态：0-未开始，1-进行中，2-已结束',
  `manual_control` TINYINT(1) DEFAULT 0 NULL COMMENT '是否手动控制状态：0-自动计算，1-手动控制',
  `start_time` DATETIME NULL COMMENT '开始时间',
  `end_time` DATETIME NULL COMMENT '结束时间',
  `click_count` INT DEFAULT 0 NULL COMMENT '点击次数',
  `status` TINYINT(1) DEFAULT 1 NULL COMMENT '数据状态：0-已删除，1-正常',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP NULL COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NULL COMMENT '更新时间',
  `created_by` VARCHAR(64) NULL COMMENT '创建人',
  
  KEY `idx_ad_position` (`ad_position`),
  KEY `idx_ad_status` (`ad_status`),
  KEY `idx_ad_type` (`ad_type`),
  KEY `idx_is_enabled` (`is_enabled`),
  KEY `idx_sort_order` (`sort_order`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='广告推荐表';

-- ================================================================
-- 3. 品牌推荐表
-- ================================================================
CREATE TABLE IF NOT EXISTS `t_brand_recommend` (
  `recommend_id` VARCHAR(64) NOT NULL COMMENT '推荐ID' PRIMARY KEY,
  `brand_id` VARCHAR(64) NOT NULL COMMENT '品牌ID',
  `recommend_title` VARCHAR(200) NULL COMMENT '推荐标题',
  `recommend_desc` TEXT NULL COMMENT '推荐描述',
  `banner_image` VARCHAR(500) NULL COMMENT '推荐图片（覆盖品牌Logo）',
  `link_url` VARCHAR(500) NULL COMMENT '跳转链接（默认跳转品牌页）',
  `sort_order` INT DEFAULT 0 NULL COMMENT '排序（数字越小越靠前）',
  `is_enabled` TINYINT DEFAULT 1 NULL COMMENT '是否启用：1-启用，0-禁用',
  `recommend_status` TINYINT DEFAULT 1 NULL COMMENT '推荐状态：0-未开始，1-进行中，2-已结束',
  `start_time` DATETIME NULL COMMENT '开始时间（可选，定时上架）',
  `end_time` DATETIME NULL COMMENT '结束时间（可选，定时下架）',
  `view_count` INT DEFAULT 0 NULL COMMENT '点击量',
  `status` TINYINT DEFAULT 1 NULL COMMENT '软删除标记：1-正常，0-已删除',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP NULL COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NULL COMMENT '更新时间',
  `created_by` VARCHAR(64) NULL COMMENT '创建人（管理员ID）',
  
  CONSTRAINT `uk_brand_recommend_status` UNIQUE (`brand_id`, `status`),
  KEY `idx_brand_id` (`brand_id`),
  KEY `idx_create_time` (`create_time`),
  KEY `idx_is_enabled` (`is_enabled`),
  KEY `idx_recommend_status` (`recommend_status`),
  KEY `idx_sort_order` (`sort_order`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='品牌推荐表';

-- ================================================================
-- 4. 分类属性表（SKU规格）
-- ================================================================
CREATE TABLE IF NOT EXISTS `t_category_attribute` (
  `attr_id` VARCHAR(64) NOT NULL COMMENT '属性ID' PRIMARY KEY,
  `category_id` VARCHAR(64) NOT NULL COMMENT '分类ID（末级）',
  `attr_name` VARCHAR(50) NOT NULL COMMENT '属性名称（颜色、尺寸）',
  `predefined_values` TEXT NULL COMMENT '预定义属性值（JSON数组，如["金色","白色"]）',
  `allow_custom` TINYINT DEFAULT 1 NULL COMMENT '是否允许用户自定义：1-允许，0-不允许',
  `is_required` TINYINT DEFAULT 1 NULL COMMENT '是否必填',
  `sort_order` INT DEFAULT 0 NULL COMMENT '排序',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP NULL,
  
  KEY `idx_category` (`category_id`),
  KEY `idx_sort` (`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='分类属性表（SKU规格）';

-- ================================================================
-- 5. 分类参数关联表
-- ================================================================
CREATE TABLE IF NOT EXISTS `t_category_param` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `category_id` VARCHAR(64) NOT NULL COMMENT '分类ID（末级）',
  `param_id` VARCHAR(64) NOT NULL COMMENT '参数库ID',
  `custom_values` TEXT NULL COMMENT '自定义参数值（JSON数组，扩展预定义值）',
  `allow_custom` TINYINT DEFAULT 1 NULL COMMENT '是否允许用户自定义',
  `is_required` TINYINT DEFAULT 0 NULL COMMENT '是否必填',
  `sort_order` INT DEFAULT 0 NULL COMMENT '排序',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP NULL,
  
  CONSTRAINT `uk_category_param` UNIQUE (`category_id`, `param_id`),
  KEY `idx_category` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='分类参数关联表';

-- ================================================================
-- 6. 优惠券表
-- ================================================================
CREATE TABLE IF NOT EXISTS `t_coupon` (
  `id` BIGINT AUTO_INCREMENT COMMENT '自增主键' PRIMARY KEY,
  `coupon_id` VARCHAR(64) NOT NULL COMMENT '优惠券ID（UUID）',
  `coupon_name` VARCHAR(200) NOT NULL COMMENT '优惠券名称',
  `coupon_type` TINYINT NOT NULL COMMENT '优惠券类型：1-满减券，2-折扣券，3-无门槛券',
  `discount_amount` DECIMAL(10, 2) DEFAULT 0.00 NULL COMMENT '优惠金额（满减券/无门槛券使用）',
  `discount_rate` DECIMAL(5, 2) DEFAULT 0.00 NULL COMMENT '折扣率（折扣券使用，如0.8表示8折）',
  `min_amount` DECIMAL(10, 2) DEFAULT 0.00 NULL COMMENT '最低消费金额（满减券使用，0表示无门槛）',
  `max_discount` DECIMAL(10, 2) DEFAULT 0.00 NULL COMMENT '最高优惠金额（折扣券使用，0表示不限制）',
  `total_count` INT DEFAULT 0 NULL COMMENT '发行总量（0表示不限制）',
  `received_count` INT DEFAULT 0 NULL COMMENT '已领取数量',
  `used_count` INT DEFAULT 0 NULL COMMENT '已使用数量',
  `limit_per_user` INT DEFAULT 1 NULL COMMENT '每人限领数量（默认1，0表示不限制）',
  `valid_days` INT DEFAULT 0 NULL COMMENT '有效天数（领取后N天内有效，0表示固定时间）',
  `start_time` DATETIME NULL COMMENT '开始时间（固定时间模式使用）',
  `end_time` DATETIME NULL COMMENT '结束时间（固定时间模式使用）',
  `coupon_status` TINYINT DEFAULT 0 NULL COMMENT '优惠券状态：0-未开始，1-进行中，2-已结束',
  `manual_control` TINYINT DEFAULT 0 NULL COMMENT '是否手动控制状态：0-自动计算，1-手动控制',
  `applicable_products` TEXT NULL COMMENT '适用商品（JSON数组，空表示全部商品）',
  `applicable_categories` TEXT NULL COMMENT '适用分类（JSON数组，空表示全部分类）',
  `description` TEXT NULL COMMENT '使用说明',
  `sort_order` INT DEFAULT 0 NULL COMMENT '排序（数字越小越靠前）',
  `status` TINYINT DEFAULT 1 NULL COMMENT '软删除标记：1-正常，-1-已删除',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP NULL COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NULL COMMENT '更新时间',
  `created_by` VARCHAR(64) NULL COMMENT '创建人（管理员ID）',
  
  CONSTRAINT `uk_coupon_id_status` UNIQUE (`coupon_id`, `status`),
  KEY `idx_coupon_status` (`coupon_status`),
  KEY `idx_coupon_type` (`coupon_type`),
  KEY `idx_end_time` (`end_time`),
  KEY `idx_start_time` (`start_time`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='优惠券表';

-- ================================================================
-- 7. 普通用户表（商城用户）
-- ================================================================
CREATE TABLE IF NOT EXISTS `t_customer` (
  `id` BIGINT AUTO_INCREMENT COMMENT '自增ID' PRIMARY KEY,
  `customer_id` VARCHAR(64) NOT NULL COMMENT '用户ID',
  `username` VARCHAR(100) NOT NULL COMMENT '用户名',
  `password` VARCHAR(255) NOT NULL COMMENT '密码（加密）',
  `nickname` VARCHAR(100) NULL COMMENT '昵称',
  `email` VARCHAR(100) NULL COMMENT '邮箱',
  `phone` VARCHAR(20) NULL COMMENT '手机号',
  `avatar` VARCHAR(500) NULL COMMENT '头像URL',
  `gender` TINYINT DEFAULT 0 NULL COMMENT '性别：0-未知，1-男，2-女',
  `birthday` DATE NULL COMMENT '生日',
  `address` VARCHAR(500) NULL COMMENT '地址',
  `status` TINYINT DEFAULT 1 NULL COMMENT '状态：1-正常，0-禁用，-1-删除',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP NULL COMMENT '注册时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NULL COMMENT '更新时间',
  `last_login_time` DATETIME NULL COMMENT '最后登录时间',
  
  CONSTRAINT `uk_customer_id` UNIQUE (`customer_id`),
  CONSTRAINT `uk_email_status` UNIQUE (`email`, `status`),
  CONSTRAINT `uk_phone_status` UNIQUE (`phone`, `status`),
  CONSTRAINT `uk_username_status` UNIQUE (`username`, `status`),
  KEY `idx_create_time` (`create_time`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='普通用户表（商城用户）';

-- ================================================================
-- 8. 秒杀活动表
-- ================================================================
CREATE TABLE IF NOT EXISTS `t_flash_sale` (
  `flash_sale_id` VARCHAR(64) NOT NULL COMMENT '秒杀活动ID' PRIMARY KEY,
  `activity_name` VARCHAR(200) NOT NULL COMMENT '活动名称',
  `activity_desc` TEXT NULL COMMENT '活动描述',
  `activity_image` VARCHAR(500) NULL COMMENT '活动图片',
  `start_time` DATETIME NOT NULL COMMENT '开始时间',
  `end_time` DATETIME NOT NULL COMMENT '结束时间',
  `activity_status` TINYINT DEFAULT 0 NULL COMMENT '活动状态：0-未开始，1-进行中，2-已结束',
  `manual_control` TINYINT DEFAULT 0 NULL COMMENT '是否手动控制：0-自动，1-手动',
  `sort_order` INT DEFAULT 0 NULL COMMENT '排序',
  `status` TINYINT DEFAULT 1 NULL COMMENT '状态：1-正常，0-已删除',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP NULL COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NULL COMMENT '更新时间',
  `created_by` VARCHAR(64) NULL COMMENT '创建人',
  
  KEY `idx_activity_status` (`activity_status`),
  KEY `idx_end_time` (`end_time`),
  KEY `idx_start_time` (`start_time`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='秒杀活动表';

-- ================================================================
-- 9. 秒杀商品表
-- ================================================================
CREATE TABLE IF NOT EXISTS `t_flash_sale_product` (
  `id` BIGINT AUTO_INCREMENT COMMENT '自增ID' PRIMARY KEY,
  `flash_sale_product_id` VARCHAR(64) NOT NULL COMMENT '秒杀商品ID',
  `flash_sale_id` VARCHAR(64) NOT NULL COMMENT '秒杀活动ID',
  `product_id` VARCHAR(64) NOT NULL COMMENT '商品ID',
  `sku_id` VARCHAR(64) NULL COMMENT 'SKU ID',
  `flash_sale_price` DECIMAL(10, 2) NOT NULL COMMENT '秒杀价格',
  `original_price` DECIMAL(10, 2) NOT NULL COMMENT '原价',
  `flash_sale_stock` INT NOT NULL COMMENT '秒杀库存',
  `sold_count` INT DEFAULT 0 NULL COMMENT '已售数量',
  `limit_per_user` INT DEFAULT 1 NULL COMMENT '每人限购数量',
  `sort_order` INT DEFAULT 0 NULL COMMENT '排序',
  `status` TINYINT DEFAULT 1 NULL COMMENT '状态：1-正常，0-已删除',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP NULL COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NULL COMMENT '更新时间',
  
  CONSTRAINT `uk_flash_sale_product_id` UNIQUE (`flash_sale_product_id`),
  KEY `idx_flash_sale_id` (`flash_sale_id`),
  KEY `idx_product_id` (`product_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='秒杀商品表';

-- ================================================================
-- 10. 秒杀库存预警表
-- ================================================================
CREATE TABLE IF NOT EXISTS `t_flash_sale_stock_alert` (
  `alert_id` VARCHAR(64) NOT NULL COMMENT '预警ID' PRIMARY KEY,
  `flash_sale_product_id` VARCHAR(64) NOT NULL COMMENT '秒杀商品ID',
  `flash_sale_id` VARCHAR(64) NOT NULL COMMENT '秒杀活动ID',
  `product_id` VARCHAR(64) NOT NULL COMMENT '商品ID',
  `current_stock` INT NOT NULL COMMENT '当前库存',
  `alert_threshold` INT NOT NULL COMMENT '预警阈值',
  `alert_level` TINYINT NOT NULL COMMENT '预警级别：1-一般，2-严重，3-缺货',
  `is_handled` TINYINT DEFAULT 0 NULL COMMENT '是否已处理：0-未处理，1-已处理',
  `alert_time` DATETIME DEFAULT CURRENT_TIMESTAMP NULL COMMENT '预警时间',
  `handle_time` DATETIME NULL COMMENT '处理时间',
  `handler` VARCHAR(64) NULL COMMENT '处理人',
  
  KEY `idx_alert_level` (`alert_level`),
  KEY `idx_flash_sale_id` (`flash_sale_id`),
  KEY `idx_flash_sale_product_id` (`flash_sale_product_id`),
  KEY `idx_is_handled` (`is_handled`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='秒杀库存预警表';

-- ================================================================
-- 11. 秒杀时间段表
-- ================================================================
CREATE TABLE IF NOT EXISTS `t_flash_sale_time_slot` (
  `time_slot_id` VARCHAR(64) NOT NULL COMMENT '时间段ID' PRIMARY KEY,
  `flash_sale_id` VARCHAR(64) NOT NULL COMMENT '秒杀活动ID',
  `slot_name` VARCHAR(100) NOT NULL COMMENT '时间段名称（如：10:00场）',
  `start_time` TIME NOT NULL COMMENT '开始时间',
  `end_time` TIME NOT NULL COMMENT '结束时间',
  `slot_status` TINYINT DEFAULT 0 NULL COMMENT '时间段状态：0-未开始，1-进行中，2-已结束',
  `sort_order` INT DEFAULT 0 NULL COMMENT '排序',
  `status` TINYINT DEFAULT 1 NULL COMMENT '状态：1-正常，0-已删除',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP NULL COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NULL COMMENT '更新时间',
  
  KEY `idx_flash_sale_id` (`flash_sale_id`),
  KEY `idx_slot_status` (`slot_status`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='秒杀时间段表';

-- ================================================================
-- 12. 新品推荐表
-- ================================================================
CREATE TABLE IF NOT EXISTS `t_new_product_recommend` (
  `recommend_id` VARCHAR(64) NOT NULL COMMENT '推荐ID（主键）' PRIMARY KEY,
  `product_id` VARCHAR(64) NOT NULL COMMENT '商品ID',
  `recommend_title` VARCHAR(200) NULL COMMENT '推荐标题',
  `recommend_desc` TEXT NULL COMMENT '推荐描述',
  `recommend_image` VARCHAR(500) NULL COMMENT '推荐图片',
  `sort_order` INT DEFAULT 0 NULL COMMENT '排序（数字越小越靠前）',
  `is_enabled` TINYINT(1) DEFAULT 1 NULL COMMENT '是否启用：1-启用，0-禁用',
  `recommend_status` TINYINT(1) DEFAULT 1 NULL COMMENT '推荐状态：0-未开始，1-进行中，2-已结束',
  `manual_control` TINYINT(1) DEFAULT 0 NULL COMMENT '是否手动控制状态：0-自动计算，1-手动控制',
  `start_time` DATETIME NULL COMMENT '开始时间',
  `end_time` DATETIME NULL COMMENT '结束时间',
  `view_count` INT DEFAULT 0 NULL COMMENT '点击量',
  `status` TINYINT(1) DEFAULT 1 NULL COMMENT '软删除标记：1-正常，0-已删除',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP NULL COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NULL COMMENT '更新时间',
  `created_by` VARCHAR(64) NULL COMMENT '创建人',
  
  CONSTRAINT `uk_new_product_recommend` UNIQUE (`product_id`, `status`),
  KEY `idx_is_enabled` (`is_enabled`),
  KEY `idx_product_id` (`product_id`),
  KEY `idx_sort_order` (`sort_order`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='新品推荐表';

-- ================================================================
-- 13. 参数分类表
-- ================================================================
CREATE TABLE IF NOT EXISTS `t_param_category` (
  `category_id` VARCHAR(64) NOT NULL COMMENT '分类ID' PRIMARY KEY,
  `category_name` VARCHAR(50) NOT NULL COMMENT '分类名称',
  `sort_order` INT DEFAULT 0 NOT NULL COMMENT '排序',
  `status` TINYINT DEFAULT 1 NOT NULL COMMENT '状态：1-启用，-1-删除',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  
  CONSTRAINT `uk_category_name_status` UNIQUE (`category_name`, `status`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='参数分类表';

-- ================================================================
-- 14. 人气推荐表
-- ================================================================
CREATE TABLE IF NOT EXISTS `t_popular_product_recommend` (
  `recommend_id` VARCHAR(64) NOT NULL COMMENT '推荐ID' PRIMARY KEY,
  `product_id` VARCHAR(64) NOT NULL COMMENT '商品ID',
  `recommend_title` VARCHAR(200) NULL COMMENT '推荐标题（可选，覆盖商品名称）',
  `recommend_desc` TEXT NULL COMMENT '推荐描述',
  `recommend_image` VARCHAR(500) NULL COMMENT '推荐图片（可选，覆盖商品图片）',
  `sort_order` INT DEFAULT 0 NULL COMMENT '排序（数字越小越靠前）',
  `is_enabled` TINYINT(1) DEFAULT 1 NULL COMMENT '是否启用：0-否，1-是',
  `recommend_status` TINYINT(1) DEFAULT 1 NULL COMMENT '推荐状态：0-未开始，1-进行中，2-已结束',
  `manual_control` TINYINT(1) DEFAULT 0 NULL COMMENT '是否手动控制状态：0-自动计算，1-手动控制',
  `start_time` DATETIME NULL COMMENT '开始时间',
  `end_time` DATETIME NULL COMMENT '结束时间',
  `view_count` INT DEFAULT 0 NULL COMMENT '点击量',
  `status` TINYINT(1) DEFAULT 1 NULL COMMENT '数据状态：0-已删除，1-正常',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP NULL COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NULL COMMENT '更新时间',
  `created_by` VARCHAR(64) NULL COMMENT '创建人',
  
  KEY `idx_create_time` (`create_time`),
  KEY `idx_is_enabled` (`is_enabled`),
  KEY `idx_product_id` (`product_id`),
  KEY `idx_recommend_status` (`recommend_status`),
  KEY `idx_sort_order` (`sort_order`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='人气推荐表';

-- ================================================================
-- 15. 商品表（SPU）
-- ================================================================
CREATE TABLE IF NOT EXISTS `t_product` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `product_id` VARCHAR(64) NOT NULL COMMENT '商品ID',
  `product_name` VARCHAR(200) NOT NULL COMMENT '商品名称',
  `product_images` JSON NULL COMMENT '商品图片（JSON数组）',
  `product_detail` LONGTEXT NULL COMMENT '商品详情（富文本HTML内容）',
  `category_id` VARCHAR(64) NULL COMMENT '所属分类ID（末级）',
  `type_id` VARCHAR(64) NULL COMMENT '商品类型ID',
  `category_l1_id` VARCHAR(64) NULL COMMENT '一级分类ID',
  `category_l2_id` VARCHAR(64) NULL COMMENT '二级分类ID',
  `category_l3_id` VARCHAR(64) NULL COMMENT '三级分类ID',
  `category_l4_id` VARCHAR(64) NULL COMMENT '四级分类ID',
  `brand_id` VARCHAR(64) NULL COMMENT '品牌ID',
  `price` DECIMAL(10, 2) DEFAULT 0.00 NULL COMMENT '价格',
  `item_number` VARCHAR(100) NULL COMMENT '货号',
  `inventory` INT DEFAULT 0 NULL COMMENT '库存',
  `status` TINYINT(1) DEFAULT 1 NULL COMMENT '状态：1-正常，0-已删除',
  `shelf_status` TINYINT(1) DEFAULT 0 NULL COMMENT '上架状态：1-上架，0-下架',
  `sort_order` INT DEFAULT 0 NULL COMMENT '排序（数字越小越靠前）',
  `audit_status` TINYINT(1) DEFAULT 0 NULL COMMENT '审核状态：0-未审核，1-已审核，2-审核不通过',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP NULL COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NULL COMMENT '更新时间',
  `delete_time` DATETIME NULL COMMENT '删除时间',
  `delete_reason` VARCHAR(500) NULL COMMENT '删除原因',
  `deleted_by` VARCHAR(64) NULL COMMENT '删除人',
  
  CONSTRAINT `uk_product_id_status` UNIQUE (`product_id`, `status`),
  KEY `idx_audit_status` (`audit_status`),
  KEY `idx_brand_id` (`brand_id`),
  KEY `idx_category_id` (`category_id`),
  KEY `idx_category_l1` (`category_l1_id`),
  KEY `idx_category_l2` (`category_l2_id`),
  KEY `idx_category_l3` (`category_l3_id`),
  KEY `idx_create_time` (`create_time`),
  KEY `idx_delete_time` (`delete_time`),
  KEY `idx_item_number` (`item_number`),
  KEY `idx_product_name` (`product_name`),
  KEY `idx_sort_order` (`sort_order`),
  KEY `idx_status` (`status`),
  KEY `idx_status_shelf` (`status`, `shelf_status`),
  KEY `idx_type` (`type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='商品表';

-- ================================================================
-- 16. 商品审核表
-- ================================================================
CREATE TABLE IF NOT EXISTS `t_product_audit` (
  `audit_id` BIGINT AUTO_INCREMENT COMMENT '审核记录ID' PRIMARY KEY,
  `product_id` VARCHAR(64) NOT NULL COMMENT '关联的商品ID',
  `audit_type` TINYINT(1) NOT NULL COMMENT '审核类型：1-新建审核，2-编辑审核',
  `audit_status` TINYINT(1) NOT NULL COMMENT '审核结果：1-审核通过，2-审核不通过',
  `audit_reason` VARCHAR(500) NULL COMMENT '审核意见/不通过原因',
  `auditor_id` VARCHAR(64) NULL COMMENT '审核人ID',
  `auditor_name` VARCHAR(50) NULL COMMENT '审核人姓名',
  `audit_time` DATETIME NOT NULL COMMENT '审核时间',
  `old_data` JSON NULL COMMENT '编辑前的商品数据（仅审核类型为"编辑审核"时记录）',
  `new_data` JSON NULL COMMENT '编辑后的商品数据（仅审核类型为"编辑审核"时记录）',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP NULL COMMENT '记录创建时间',
  
  KEY `idx_audit_status_time` (`audit_status`, `audit_time`),
  KEY `idx_audit_type` (`audit_type`),
  KEY `idx_auditor` (`auditor_id`),
  KEY `idx_product_id` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='商品审核表';

-- ================================================================
-- 17. 商品品牌表
-- ================================================================
CREATE TABLE IF NOT EXISTS `t_product_brand` (
  `brand_id` VARCHAR(64) NOT NULL COMMENT '品牌ID' PRIMARY KEY,
  `brand_name` VARCHAR(100) NOT NULL COMMENT '品牌名称',
  `brand_name_en` VARCHAR(100) NULL COMMENT '品牌英文名',
  `first_letter` VARCHAR(1) NULL COMMENT '品牌首字母',
  `logo_url` VARCHAR(500) NULL COMMENT '品牌Logo URL',
  `description` TEXT NULL COMMENT '品牌描述',
  `sort_order` INT DEFAULT 0 NULL COMMENT '排序',
  `status` TINYINT DEFAULT 1 NULL COMMENT '状态：1-启用，0-禁用',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP NULL COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NULL COMMENT '更新时间',
  
  CONSTRAINT `uk_brand_name_status` UNIQUE (`brand_name`, `status`),
  KEY `idx_first_letter` (`first_letter`),
  KEY `idx_sort` (`sort_order`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='商品品牌表';

-- ================================================================
-- 18. 商品分类表
-- ================================================================
CREATE TABLE IF NOT EXISTS `t_product_category` (
  `category_id` VARCHAR(64) NOT NULL COMMENT '分类ID' PRIMARY KEY,
  `category_name` VARCHAR(100) NOT NULL COMMENT '分类名称',
  `parent_id` VARCHAR(64) NULL COMMENT '父级分类ID',
  `level` TINYINT DEFAULT 1 NULL COMMENT '层级：1-4',
  `category_path` VARCHAR(500) NULL COMMENT '分类路径：/父ID/父父ID/..',
  `full_name` VARCHAR(500) NULL COMMENT '完整名称：一级/二级/三级',
  `has_children` TINYINT DEFAULT 0 NULL COMMENT '是否有子分类：1-是，0-否',
  `sort_order` INT DEFAULT 0 NULL COMMENT '排序',
  `icon` VARCHAR(200) NULL COMMENT '分类图标URL',
  `banner_img` VARCHAR(500) NULL COMMENT '分类Banner图',
  `status` TINYINT DEFAULT 1 NULL COMMENT '状态：1-启用，0-禁用',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP NULL COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NULL COMMENT '更新时间',
  
  CONSTRAINT `uk_category_name_status` UNIQUE (`category_name`, `status`),
  KEY `idx_has_children` (`has_children`),
  KEY `idx_level` (`level`),
  KEY `idx_parent_id` (`parent_id`),
  KEY `idx_sort` (`sort_order`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='商品分类表';

-- ================================================================
-- 19. 商品删除日志表
-- ================================================================
CREATE TABLE IF NOT EXISTS `t_product_delete_log` (
  `id` INT AUTO_INCREMENT COMMENT '自增主键' PRIMARY KEY,
  `product_id` VARCHAR(64) NOT NULL COMMENT '商品ID',
  `operation_type` TINYINT(1) NOT NULL COMMENT '操作类型：1-删除，2-恢复',
  `operation_time` DATETIME DEFAULT CURRENT_TIMESTAMP NULL COMMENT '操作时间',
  `operation_by` VARCHAR(64) NULL COMMENT '操作人ID',
  `delete_reason` VARCHAR(500) NULL COMMENT '删除原因（仅删除操作有值）',
  
  KEY `idx_operation_by` (`operation_by`),
  KEY `idx_operation_time` (`operation_time`),
  KEY `idx_product_id` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='商品删除日志表';

-- ================================================================
-- 20. 商品参数库表
-- ================================================================
CREATE TABLE IF NOT EXISTS `t_product_param_library` (
  `param_id` VARCHAR(64) NOT NULL COMMENT '参数ID' PRIMARY KEY,
  `param_name` VARCHAR(50) NOT NULL COMMENT '参数名称',
  `param_type` VARCHAR(20) DEFAULT 'input' NULL COMMENT '参数类型：input、select、checkbox',
  `param_values` TEXT NULL COMMENT '预定义参数值（JSON数组）',
  `param_category` VARCHAR(50) DEFAULT '基本参数' NULL COMMENT '参数分类（关联 t_param_category.category_id）',
  `sort_order` INT DEFAULT 0 NULL COMMENT '排序',
  `status` TINYINT DEFAULT 1 NULL COMMENT '状态',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP NULL,
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NULL COMMENT '更新时间',
  
  CONSTRAINT `uk_name_category_status` UNIQUE (`param_name`, `param_category`, `status`),
  KEY `idx_category` (`param_category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='商品参数库';

-- ================================================================
-- 21. 商品参数值表
-- ================================================================
CREATE TABLE IF NOT EXISTS `t_product_param_value` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `product_id` VARCHAR(64) NOT NULL COMMENT '商品ID',
  `param_id` VARCHAR(64) NOT NULL COMMENT '参数ID',
  `param_value` TEXT NULL COMMENT '参数值',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP NULL,
  
  CONSTRAINT `uk_product_param` UNIQUE (`product_id`, `param_id`),
  KEY `idx_product` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='商品参数值表';

-- ================================================================
-- 22. 商品SKU表
-- ================================================================
CREATE TABLE IF NOT EXISTS `t_product_sku` (
  `sku_id` VARCHAR(64) NOT NULL COMMENT 'SKU ID' PRIMARY KEY,
  `product_id` VARCHAR(64) NOT NULL COMMENT 'SPU商品ID',
  `sku_name` VARCHAR(200) NULL COMMENT 'SKU名称（如：红色-M码）',
  `sku_code` VARCHAR(100) NULL COMMENT 'SKU编码',
  `sku_attributes` TEXT NOT NULL COMMENT 'SKU属性值（JSON）',
  `price` DECIMAL(10, 2) DEFAULT 0.00 NULL COMMENT 'SKU价格',
  `promotion_price` DECIMAL(10, 2) NULL COMMENT '促销价格',
  `inventory` INT DEFAULT 0 NULL COMMENT 'SKU库存',
  `stock_alert` INT DEFAULT 50 NULL COMMENT '库存预警值',
  `image_url` VARCHAR(500) NULL COMMENT 'SKU图片',
  `status` TINYINT DEFAULT 1 NULL COMMENT '状态：1-正常，0-禁用',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP NULL,
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NULL,
  
  KEY `idx_inventory` (`inventory`),
  KEY `idx_product` (`product_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='商品SKU表';

-- ================================================================
-- 23. 角色表
-- ================================================================
CREATE TABLE IF NOT EXISTS `t_role` (
  `id` BIGINT AUTO_INCREMENT COMMENT '自增ID' PRIMARY KEY,
  `role_id` VARCHAR(64) NOT NULL COMMENT '角色ID',
  `role_name` VARCHAR(100) NOT NULL COMMENT '角色名称',
  `role_code` VARCHAR(50) NOT NULL COMMENT '角色编码',
  `role_desc` VARCHAR(500) NULL COMMENT '角色描述',
  `status` TINYINT DEFAULT 1 NULL COMMENT '状态：1-正常，0-禁用，-1-删除',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP NULL COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NULL COMMENT '更新时间',
  `created_by` VARCHAR(64) NULL COMMENT '创建人',
  
  CONSTRAINT `uk_role_code_status` UNIQUE (`role_code`, `status`),
  CONSTRAINT `uk_role_id` UNIQUE (`role_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='角色表';

-- ================================================================
-- 24. 角色菜单权限表
-- ================================================================
CREATE TABLE IF NOT EXISTS `t_role_menu` (
  `id` BIGINT AUTO_INCREMENT COMMENT '自增ID' PRIMARY KEY,
  `role_id` VARCHAR(64) NOT NULL COMMENT '角色ID',
  `menu_key` VARCHAR(100) NOT NULL COMMENT '菜单标识',
  `project_key` VARCHAR(50) NOT NULL COMMENT '项目标识',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP NULL COMMENT '创建时间',
  
  CONSTRAINT `uk_role_menu` UNIQUE (`role_id`, `menu_key`, `project_key`),
  KEY `idx_menu_key` (`menu_key`),
  KEY `idx_role_id` (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='角色菜单权限表';

-- ================================================================
-- 25. 库存预警日志表
-- ================================================================
CREATE TABLE IF NOT EXISTS `t_stock_alert_log` (
  `log_id` VARCHAR(64) NOT NULL COMMENT '日志ID' PRIMARY KEY,
  `product_id` VARCHAR(64) NOT NULL COMMENT '商品ID',
  `sku_id` VARCHAR(64) NOT NULL COMMENT 'SKU ID',
  `sku_name` VARCHAR(200) NULL COMMENT 'SKU名称',
  `current_stock` INT NULL COMMENT '当前库存',
  `alert_threshold` INT NULL COMMENT '预警阈值',
  `alert_level` TINYINT NULL COMMENT '预警级别：1-一般，2-严重，3-缺货',
  `is_handled` TINYINT DEFAULT 0 NULL COMMENT '是否已处理',
  `alert_time` DATETIME DEFAULT CURRENT_TIMESTAMP NULL COMMENT '预警时间',
  `handle_time` DATETIME NULL COMMENT '处理时间',
  `handler` VARCHAR(64) NULL COMMENT '处理人',
  
  KEY `idx_alert_time` (`alert_time`),
  KEY `idx_handled` (`is_handled`),
  KEY `idx_level` (`alert_level`),
  KEY `idx_product` (`product_id`),
  KEY `idx_sku` (`sku_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='库存预警日志表';

-- ================================================================
-- 26. 专题推荐表
-- ================================================================
CREATE TABLE IF NOT EXISTS `t_topic_recommend` (
  `topic_id` VARCHAR(64) NOT NULL COMMENT '专题ID' PRIMARY KEY,
  `topic_name` VARCHAR(200) NOT NULL COMMENT '专题名称',
  `topic_desc` TEXT NULL COMMENT '专题描述',
  `cover_image` VARCHAR(500) NOT NULL COMMENT '封面图片',
  `banner_image` VARCHAR(500) NULL COMMENT 'Banner图片',
  `topic_type` TINYINT NOT NULL COMMENT '专题类型：1-商品专题，2-品牌专题，3-分类专题',
  `related_products` TEXT NULL COMMENT '关联商品（JSON数组，商品ID列表）',
  `related_brands` TEXT NULL COMMENT '关联品牌（JSON数组，品牌ID列表）',
  `related_categories` TEXT NULL COMMENT '关联分类（JSON数组，分类ID列表）',
  `link_url` VARCHAR(500) NULL COMMENT '跳转链接',
  `sort_order` INT DEFAULT 0 NULL COMMENT '排序（数字越小越靠前）',
  `is_enabled` TINYINT(1) DEFAULT 1 NULL COMMENT '是否启用：0-否，1-是',
  `topic_status` TINYINT(1) DEFAULT 1 NULL COMMENT '专题状态：0-未开始，1-进行中，2-已结束',
  `manual_control` TINYINT(1) DEFAULT 0 NULL COMMENT '是否手动控制状态：0-自动计算，1-手动控制',
  `start_time` DATETIME NULL COMMENT '开始时间',
  `end_time` DATETIME NULL COMMENT '结束时间',
  `view_count` INT DEFAULT 0 NULL COMMENT '浏览次数',
  `status` TINYINT(1) DEFAULT 1 NULL COMMENT '数据状态：0-已删除，1-正常',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP NULL COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NULL COMMENT '更新时间',
  `created_by` VARCHAR(64) NULL COMMENT '创建人',
  
  KEY `idx_end_time` (`end_time`),
  KEY `idx_is_enabled` (`is_enabled`),
  KEY `idx_sort_order` (`sort_order`),
  KEY `idx_start_time` (`start_time`),
  KEY `idx_status` (`status`),
  KEY `idx_topic_status` (`topic_status`),
  KEY `idx_topic_type` (`topic_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='专题推荐表';

-- ================================================================
-- 27. 用户表（管理员）
-- ================================================================
CREATE TABLE IF NOT EXISTS `t_user` (
  `id` BIGINT AUTO_INCREMENT COMMENT '自增ID' PRIMARY KEY,
  `user_id` VARCHAR(255) NOT NULL COMMENT '用户唯一标识',
  `username` VARCHAR(255) NOT NULL COMMENT '账号',
  `password` VARCHAR(255) NOT NULL COMMENT '密码（存储加密后的值）',
  `nickname` VARCHAR(255) NOT NULL COMMENT '昵称',
  `email` VARCHAR(255) NULL COMMENT '邮箱地址',
  `sex` INT NOT NULL COMMENT '性别：1-男，2-女，3-其他',
  `desc` VARCHAR(255) NULL COMMENT '用户描述（简介/备注）',
  `status` INT DEFAULT 1 NOT NULL COMMENT '状态：1-正常，-1-删除',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '创建时间',
  `update_time` DATETIME NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `last_login_time` DATETIME NULL COMMENT '最后登录时间',
  
  CONSTRAINT `uk_t_user_email_status` UNIQUE (`email`, `status`),
  CONSTRAINT `uk_t_user_user_id` UNIQUE (`user_id`),
  CONSTRAINT `uk_t_user_username_status` UNIQUE (`username`, `status`),
  KEY `idx_t_user_email` (`email`),
  KEY `idx_t_user_id` (`id`),
  KEY `idx_t_user_last_login_time` (`last_login_time`),
  KEY `idx_t_user_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户信息表';

-- ================================================================
-- 28. 用户优惠券表
-- ================================================================
CREATE TABLE IF NOT EXISTS `t_user_coupon` (
  `id` BIGINT AUTO_INCREMENT COMMENT '自增主键' PRIMARY KEY,
  `user_coupon_id` VARCHAR(64) NOT NULL COMMENT '用户优惠券ID（UUID）',
  `coupon_id` VARCHAR(64) NOT NULL COMMENT '优惠券ID',
  `customer_id` VARCHAR(64) NOT NULL COMMENT '用户ID',
  `receive_time` DATETIME DEFAULT CURRENT_TIMESTAMP NULL COMMENT '领取时间',
  `use_status` TINYINT DEFAULT 0 NULL COMMENT '使用状态：0-未使用，1-已使用，2-已过期',
  `use_time` DATETIME NULL COMMENT '使用时间',
  `order_id` VARCHAR(64) NULL COMMENT '订单ID',
  `valid_start_time` DATETIME NOT NULL COMMENT '有效开始时间',
  `valid_end_time` DATETIME NOT NULL COMMENT '有效结束时间',
  
  CONSTRAINT `uk_user_coupon_id` UNIQUE (`user_coupon_id`),
  KEY `idx_coupon_id` (`coupon_id`),
  KEY `idx_customer_id` (`customer_id`),
  KEY `idx_use_status` (`use_status`),
  KEY `idx_valid_end_time` (`valid_end_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户优惠券表';

-- ================================================================
-- 29. 订单主表
-- ================================================================
CREATE TABLE IF NOT EXISTS `t_order` (
  `order_id` VARCHAR(64) NOT NULL COMMENT '订单ID（雪花ID）' PRIMARY KEY,
  `order_no` VARCHAR(32) NOT NULL COMMENT '订单号（唯一，用于展示）',
  
  -- 用户信息
  `customer_id` VARCHAR(64) NOT NULL COMMENT '用户ID',
  `customer_name` VARCHAR(100) NOT NULL COMMENT '用户姓名',
  
  -- 收货信息
  `receiver_name` VARCHAR(100) NOT NULL COMMENT '收货人姓名',
  `receiver_phone` VARCHAR(20) NOT NULL COMMENT '收货人手机',
  `receiver_province` VARCHAR(50) NOT NULL COMMENT '省份',
  `receiver_city` VARCHAR(50) NOT NULL COMMENT '城市',
  `receiver_district` VARCHAR(50) NOT NULL COMMENT '区/县',
  `receiver_address` VARCHAR(500) NOT NULL COMMENT '详细地址',
  `receiver_postcode` VARCHAR(10) NULL COMMENT '邮编',
  
  -- 金额信息
  `total_amount` DECIMAL(10,2) NOT NULL COMMENT '商品总金额',
  `freight_amount` DECIMAL(10,2) DEFAULT 0.00 COMMENT '运费',
  `discount_amount` DECIMAL(10,2) DEFAULT 0.00 COMMENT '优惠金额',
  `coupon_amount` DECIMAL(10,2) DEFAULT 0.00 COMMENT '优惠券抵扣',
  `pay_amount` DECIMAL(10,2) NOT NULL COMMENT '实付金额',
  
  -- 优惠券信息
  `coupon_id` VARCHAR(64) NULL COMMENT '使用的优惠券ID',
  `coupon_name` VARCHAR(200) NULL COMMENT '优惠券名称',
  
  -- 订单状态
  `order_status` TINYINT NOT NULL DEFAULT 0 COMMENT '订单状态：0-待支付，1-待发货，2-待收货，3-已完成，4-已取消，5-退款中，6-已退款',
  `pay_status` TINYINT NOT NULL DEFAULT 0 COMMENT '支付状态：0-未支付，1-已支付，2-已退款',
  `delivery_status` TINYINT NOT NULL DEFAULT 0 COMMENT '发货状态：0-未发货，1-已发货，2-已收货',
  
  -- 支付信息
  `pay_type` TINYINT NULL COMMENT '支付方式：1-微信，2-支付宝，3-银行卡',
  `pay_time` DATETIME NULL COMMENT '支付时间',
  `pay_no` VARCHAR(64) NULL COMMENT '支付流水号',
  
  -- 时间信息
  `order_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '下单时间',
  `delivery_time` DATETIME NULL COMMENT '发货时间',
  `receive_time` DATETIME NULL COMMENT '收货时间',
  `finish_time` DATETIME NULL COMMENT '完成时间',
  `cancel_time` DATETIME NULL COMMENT '取消时间',
  
  -- 备注信息
  `buyer_message` VARCHAR(500) NULL COMMENT '买家留言',
  `seller_remark` VARCHAR(500) NULL COMMENT '卖家备注',
  `cancel_reason` VARCHAR(500) NULL COMMENT '取消原因',
  
  -- 系统字段
  `deleted` TINYINT(1) DEFAULT 0 COMMENT '软删除：0-否，1-是',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  
  CONSTRAINT `uk_order_no` UNIQUE (`order_no`),
  KEY `idx_customer_id` (`customer_id`),
  KEY `idx_order_status` (`order_status`),
  KEY `idx_pay_status` (`pay_status`),
  KEY `idx_order_time` (`order_time`),
  KEY `idx_deleted` (`deleted`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='订单主表';

-- ================================================================
-- 30. 订单商品表
-- ================================================================
CREATE TABLE IF NOT EXISTS `t_order_item` (
  `item_id` VARCHAR(64) NOT NULL COMMENT '订单商品ID' PRIMARY KEY,
  `order_id` VARCHAR(64) NOT NULL COMMENT '订单ID',
  `order_no` VARCHAR(32) NOT NULL COMMENT '订单号',
  
  -- 商品信息
  `product_id` VARCHAR(64) NOT NULL COMMENT '商品ID（SPU）',
  `product_name` VARCHAR(200) NOT NULL COMMENT '商品名称',
  `product_image` VARCHAR(500) NULL COMMENT '商品图片',
  
  -- SKU信息
  `sku_id` VARCHAR(64) NOT NULL COMMENT 'SKU ID',
  `sku_name` VARCHAR(200) NOT NULL COMMENT 'SKU名称',
  `sku_code` VARCHAR(100) NULL COMMENT 'SKU编码',
  `sku_attributes` JSON NULL COMMENT 'SKU属性（JSON格式）',
  
  -- 价格信息
  `product_price` DECIMAL(10,2) NOT NULL COMMENT '商品单价',
  `product_quantity` INT NOT NULL COMMENT '购买数量',
  `total_amount` DECIMAL(10,2) NOT NULL COMMENT '商品总价',
  `discount_amount` DECIMAL(10,2) DEFAULT 0.00 COMMENT '优惠金额',
  `pay_amount` DECIMAL(10,2) NOT NULL COMMENT '实付金额',
  
  -- 退款信息
  `refund_status` TINYINT DEFAULT 0 COMMENT '退款状态：0-无退款，1-退款中，2-已退款',
  `refund_amount` DECIMAL(10,2) DEFAULT 0.00 COMMENT '退款金额',
  
  -- 系统字段
  `deleted` TINYINT(1) DEFAULT 0 COMMENT '软删除：0-否，1-是',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  
  KEY `idx_order_id` (`order_id`),
  KEY `idx_order_no` (`order_no`),
  KEY `idx_product_id` (`product_id`),
  KEY `idx_sku_id` (`sku_id`),
  KEY `idx_deleted` (`deleted`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='订单商品表';

-- ================================================================
-- 31. 订单状态流转表
-- ================================================================
CREATE TABLE IF NOT EXISTS `t_order_status_log` (
  `log_id` VARCHAR(64) NOT NULL COMMENT '日志ID' PRIMARY KEY,
  `order_id` VARCHAR(64) NOT NULL COMMENT '订单ID',
  `order_no` VARCHAR(32) NOT NULL COMMENT '订单号',
  
  -- 状态信息
  `status_from` TINYINT NOT NULL COMMENT '原状态',
  `status_to` TINYINT NOT NULL COMMENT '新状态',
  `status_name` VARCHAR(50) NOT NULL COMMENT '状态名称',
  
  -- 操作信息
  `operator_type` TINYINT NOT NULL COMMENT '操作人类型：1-用户，2-管理员，3-系统',
  `operator_id` VARCHAR(64) NULL COMMENT '操作人ID',
  `operator_name` VARCHAR(100) NULL COMMENT '操作人姓名',
  `remark` VARCHAR(500) NULL COMMENT '备注',
  
  -- 系统字段
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  
  KEY `idx_order_id` (`order_id`),
  KEY `idx_order_no` (`order_no`),
  KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='订单状态流转表';

-- ================================================================
-- 32. 订单物流表
-- ================================================================
CREATE TABLE IF NOT EXISTS `t_order_logistics` (
  `logistics_id` VARCHAR(64) NOT NULL COMMENT '物流ID' PRIMARY KEY,
  `order_id` VARCHAR(64) NOT NULL COMMENT '订单ID',
  `order_no` VARCHAR(32) NOT NULL COMMENT '订单号',
  
  -- 物流信息
  `logistics_company` VARCHAR(100) NOT NULL COMMENT '物流公司',
  `logistics_no` VARCHAR(100) NOT NULL COMMENT '物流单号',
  `logistics_status` TINYINT DEFAULT 0 COMMENT '物流状态：0-未发货，1-运输中，2-派送中，3-已签收，4-异常',
  
  -- 物流轨迹（JSON格式）
  `logistics_trace` JSON NULL COMMENT '物流轨迹',
  
  -- 发货信息
  `sender_name` VARCHAR(100) NULL COMMENT '发货人',
  `sender_phone` VARCHAR(20) NULL COMMENT '发货人电话',
  `sender_address` VARCHAR(500) NULL COMMENT '发货地址',
  
  -- 时间信息
  `send_time` DATETIME NULL COMMENT '发货时间',
  `receive_time` DATETIME NULL COMMENT '签收时间',
  `last_update_time` DATETIME NULL COMMENT '最后更新时间',
  
  -- 系统字段
  `deleted` TINYINT(1) DEFAULT 0 COMMENT '软删除：0-否，1-是',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  
  KEY `idx_order_id` (`order_id`),
  KEY `idx_order_no` (`order_no`),
  KEY `idx_logistics_no` (`logistics_no`),
  KEY `idx_deleted` (`deleted`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='订单物流表';

-- ================================================================
-- 33. 订单退款表
-- ================================================================
CREATE TABLE IF NOT EXISTS `t_order_refund` (
  `refund_id` VARCHAR(64) NOT NULL COMMENT '退款ID' PRIMARY KEY,
  `refund_no` VARCHAR(32) NOT NULL COMMENT '退款单号',
  `order_id` VARCHAR(64) NOT NULL COMMENT '订单ID',
  `order_no` VARCHAR(32) NOT NULL COMMENT '订单号',
  
  -- 退款类型
  `refund_type` TINYINT NOT NULL COMMENT '退款类型：1-仅退款，2-退货退款',
  
  -- 退款商品
  `item_id` VARCHAR(64) NULL COMMENT '订单商品ID（整单退款时为空）',
  `product_name` VARCHAR(200) NULL COMMENT '商品名称',
  `sku_name` VARCHAR(200) NULL COMMENT 'SKU名称',
  
  -- 退款金额
  `refund_amount` DECIMAL(10,2) NOT NULL COMMENT '退款金额',
  `refund_freight` DECIMAL(10,2) DEFAULT 0.00 COMMENT '退运费',
  
  -- 退款原因
  `refund_reason` VARCHAR(500) NOT NULL COMMENT '退款原因',
  `refund_desc` TEXT NULL COMMENT '退款说明',
  `refund_images` JSON NULL COMMENT '退款凭证图片（JSON数组）',
  
  -- 退款状态
  `refund_status` TINYINT DEFAULT 0 COMMENT '退款状态：0-待审核，1-审核通过，2-审核拒绝，3-退款中，4-退款成功，5-退款失败',
  
  -- 审核信息
  `audit_time` DATETIME NULL COMMENT '审核时间',
  `auditor_id` VARCHAR(64) NULL COMMENT '审核人ID',
  `auditor_name` VARCHAR(100) NULL COMMENT '审核人姓名',
  `audit_remark` VARCHAR(500) NULL COMMENT '审核备注',
  `reject_reason` VARCHAR(500) NULL COMMENT '拒绝原因',
  
  -- 退货物流（退货退款时填写）
  `return_logistics_company` VARCHAR(100) NULL COMMENT '退货物流公司',
  `return_logistics_no` VARCHAR(100) NULL COMMENT '退货物流单号',
  
  -- 退款完成信息
  `refund_time` DATETIME NULL COMMENT '退款完成时间',
  `refund_pay_no` VARCHAR(64) NULL COMMENT '退款流水号',
  
  -- 系统字段
  `deleted` TINYINT(1) DEFAULT 0 COMMENT '软删除：0-否，1-是',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `created_by` VARCHAR(64) NOT NULL COMMENT '申请人ID（用户ID）',
  
  CONSTRAINT `uk_refund_no` UNIQUE (`refund_no`),
  KEY `idx_order_id` (`order_id`),
  KEY `idx_order_no` (`order_no`),
  KEY `idx_refund_status` (`refund_status`),
  KEY `idx_created_by` (`created_by`),
  KEY `idx_deleted` (`deleted`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='订单退款表';

-- ================================================================
-- 34. 订单评价表
-- ================================================================
CREATE TABLE IF NOT EXISTS `t_order_review` (
  `review_id` VARCHAR(64) NOT NULL COMMENT '评价ID' PRIMARY KEY,
  `order_id` VARCHAR(64) NOT NULL COMMENT '订单ID',
  `order_no` VARCHAR(32) NOT NULL COMMENT '订单号',
  `item_id` VARCHAR(64) NOT NULL COMMENT '订单商品ID',
  
  -- 商品信息
  `product_id` VARCHAR(64) NOT NULL COMMENT '商品ID',
  `product_name` VARCHAR(200) NOT NULL COMMENT '商品名称',
  `sku_id` VARCHAR(64) NOT NULL COMMENT 'SKU ID',
  `sku_name` VARCHAR(200) NOT NULL COMMENT 'SKU名称',
  
  -- 用户信息
  `customer_id` VARCHAR(64) NOT NULL COMMENT '用户ID',
  `customer_name` VARCHAR(100) NOT NULL COMMENT '用户姓名（脱敏）',
  
  -- 评价内容
  `rating` TINYINT NOT NULL COMMENT '评分：1-5星',
  `review_content` TEXT NULL COMMENT '评价内容',
  `review_images` JSON NULL COMMENT '评价图片（JSON数组）',
  
  -- 评价标签
  `review_tags` JSON NULL COMMENT '评价标签（JSON数组）',
  
  -- 商家回复
  `reply_content` TEXT NULL COMMENT '商家回复',
  `reply_time` DATETIME NULL COMMENT '回复时间',
  `reply_by` VARCHAR(64) NULL COMMENT '回复人ID',
  
  -- 评价状态
  `is_anonymous` TINYINT(1) DEFAULT 0 COMMENT '是否匿名：0-否，1-是',
  `is_show` TINYINT(1) DEFAULT 1 COMMENT '是否显示：0-隐藏，1-显示',
  `audit_status` TINYINT DEFAULT 1 COMMENT '审核状态：0-待审核，1-审核通过，2-审核拒绝',
  
  -- 系统字段
  `deleted` TINYINT(1) DEFAULT 0 COMMENT '软删除：0-否，1-是',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  
  KEY `idx_order_id` (`order_id`),
  KEY `idx_product_id` (`product_id`),
  KEY `idx_customer_id` (`customer_id`),
  KEY `idx_rating` (`rating`),
  KEY `idx_audit_status` (`audit_status`),
  KEY `idx_deleted` (`deleted`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='订单评价表';

-- ================================================================
-- 数据库初始化完成
-- ================================================================
SELECT '数据库初始化完成！共创建 36 个表（含订单管理模块6个表）。' AS '状态';
