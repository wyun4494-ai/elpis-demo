-- ================================================================
-- 订单管理模块 - 数据库表创建脚本
-- 版本：1.0.0
-- 创建时间：2025-01-05
-- 说明：创建订单管理相关的6个表
-- ================================================================

USE elpis_beta;

-- ================================================================
-- 1. 订单主表  
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
-- 2. 订单商品表
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
-- 3. 订单状态流转表
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
-- 4. 订单物流表
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
-- 5. 订单退款表
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
-- 6. 订单评价表
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
-- 执行完成
-- ================================================================
SELECT '订单管理模块表创建完成！' AS '状态';
SELECT '已创建6个表：' AS '';
SELECT '1. t_order - 订单主表' AS '';
SELECT '2. t_order_item - 订单商品表' AS '';
SELECT '3. t_order_status_log - 订单状态流转表' AS '';
SELECT '4. t_order_logistics - 订单物流表' AS '';
SELECT '5. t_order_refund - 订单退款表' AS '';
SELECT '6. t_order_review - 订单评价表' AS '';
