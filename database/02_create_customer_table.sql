-- ================================================================
-- Elpis 电商系统 - 客户表初始化脚本
-- 版本：1.0.0
-- 创建时间：2025-12-10
-- 说明：创建 t_customer 表用于存储商城普通用户账号
-- 执行此脚本后可删除
-- ================================================================

USE elpis_beta;

-- ================================================================
-- 1. 客户表（普通用户/商城用户）
-- ================================================================
CREATE TABLE IF NOT EXISTS `t_customer` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '自增ID',
  `customer_id` VARCHAR(255) NOT NULL COMMENT '客户唯一标识',
  `username` VARCHAR(255) NOT NULL COMMENT '登录用户名',
  `password` VARCHAR(255) NOT NULL COMMENT '密码（存储加密后的值）',
  `nickname` VARCHAR(255) NOT NULL COMMENT '昵称',
  `email` VARCHAR(255) COMMENT '邮箱地址',
  `phone` VARCHAR(20) COMMENT '手机号',
  `sex` INT DEFAULT 3 COMMENT '性别：1-男，2-女，3-其他',
  `avatar` VARCHAR(500) COMMENT '头像URL',
  `address` VARCHAR(500) COMMENT '收货地址',
  `status` INT DEFAULT 1 NOT NULL COMMENT '状态：1-正常，-1-删除',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '创建时间',
  `update_time` DATETIME ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `last_login_time` DATETIME COMMENT '最后登录时间',

  UNIQUE KEY `uk_t_customer_customer_id` (`customer_id`),
  UNIQUE KEY `uk_t_customer_username_status` (`username`, `status`),
  UNIQUE KEY `uk_t_customer_email_status` (`email`, `status`),
  UNIQUE KEY `uk_t_customer_phone_status` (`phone`, `status`),
  KEY `idx_t_customer_id` (`id`),
  KEY `idx_t_customer_status` (`status`),
  KEY `idx_t_customer_email` (`email`),
  KEY `idx_t_customer_phone` (`phone`),
  KEY `idx_t_customer_create_time` (`create_time`),
  KEY `idx_t_customer_last_login_time` (`last_login_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='客户信息表（普通用户/商城用户）';

-- ================================================================
-- 2. 初始测试数据
-- ================================================================

INSERT INTO `t_customer` 
(`customer_id`, `username`, `password`, `nickname`, `email`, `phone`, `sex`, `avatar`, `address`, `status`) 
VALUES
-- 测试用户1
('CUST001', 'user001', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/KFm', '张三', 'user001@example.com', '13800138001', 1, NULL, '北京市朝阳区', 1),
-- 测试用户2
('CUST002', 'user002', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/KFm', '李四', 'user002@example.com', '13800138002', 2, NULL, '上海市浦东新区', 1),
-- 测试用户3
('CUST003', 'user003', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/KFm', '王五', 'user003@example.com', '13800138003', 1, NULL, '深圳市南山区', 1);

-- ================================================================
-- 脚本执行完成
-- ================================================================
SELECT '客户表创建完成！' AS message;

-- 查看表结构
DESCRIBE t_customer;

-- 查看数据统计
SELECT COUNT(*) AS 客户总数 FROM t_customer WHERE status = 1;
