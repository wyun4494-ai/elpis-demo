-- ================================================================
-- Elpis 电商系统 - 角色权限管理初始化脚本
-- 版本：1.0.0
-- 创建时间：2025-11
-- 说明：创建角色表、权限关联表，并初始化角色和权限数据
-- ================================================================

USE elpis_beta;

-- ================================================================
-- 1. 用户表已包含 role_id 字段（无需修改）
-- ================================================================
-- 注：t_user 表中已存在 role_id 字段，默认值为 2（审核管理员）

-- ================================================================
-- 2. 修改角色表（t_role）- 添加新字段
-- ================================================================

-- 首先删除 t_user 表中的外键约束
ALTER TABLE `t_user` DROP FOREIGN KEY `fk_user_role`;

-- 删除旧的 t_role 表
DROP TABLE IF EXISTS `t_role`;

-- 创建新的 t_role 表（包含 role_code 和 status 字段）
CREATE TABLE `t_role` (
  `role_id` INT AUTO_INCREMENT PRIMARY KEY COMMENT '角色ID',
  `role_name` VARCHAR(50) NOT NULL COMMENT '角色名称',
  `role_code` VARCHAR(50) NOT NULL COMMENT '角色代码（如 SUPER_ADMIN、PRODUCT_ADMIN）',
  `role_desc` VARCHAR(255) COMMENT '角色描述',
  `status` TINYINT DEFAULT 1 COMMENT '状态：1-正常，0-禁用',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

  UNIQUE KEY `uk_role_code_status` (`role_code`, `status`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='角色表';

-- ================================================================
-- 3. 创建角色菜单权限关联表（t_role_menu）
-- ================================================================

DROP TABLE IF EXISTS `t_role_menu`;

CREATE TABLE `t_role_menu` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '自增主键',
  `role_id` INT NOT NULL COMMENT '角色ID（关联 t_role.role_id）',
  `menu_key` VARCHAR(100) NOT NULL COMMENT '菜单标识（如 product-list、product-audit）',
  `project_key` VARCHAR(100) NOT NULL COMMENT '项目标识（如 jd、taobao、c1）',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',

  UNIQUE KEY `uk_role_menu` (`role_id`, `menu_key`, `project_key`),
  KEY `idx_role_id` (`role_id`),
  KEY `idx_menu_key` (`menu_key`),
  KEY `idx_project_key` (`project_key`),
  CONSTRAINT `fk_role_menu_role` FOREIGN KEY (`role_id`) REFERENCES `t_role` (`role_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='角色菜单权限关联表';

-- ================================================================
-- 4. 插入初始角色数据
-- ================================================================

INSERT INTO `t_role` (`role_id`, `role_name`, `role_code`, `role_desc`, `status`) VALUES
(1, '超级管理员', 'SUPER_ADMIN', '拥有所有权限', 1),
(2, '审核管理员', 'AUDIT_ADMIN', '商品审核权限', 1),
(3, '商品管理员', 'PRODUCT_ADMIN', '商品管理权限（不含审核）', 1),
(4, '订单管理员', 'ORDER_ADMIN', '订单管理权限', 1);

-- ================================================================
-- 5. 重新添加外键约束（必须在插入角色数据之后）
-- ================================================================

ALTER TABLE `t_user` ADD CONSTRAINT `fk_user_role` FOREIGN KEY (`role_id`) REFERENCES `t_role` (`role_id`);

-- ================================================================
-- 6. 插入角色菜单权限数据
-- ================================================================

-- 超级管理员：分配所有菜单（business 项目）
INSERT INTO `t_role_menu` (`role_id`, `menu_key`, `project_key`) VALUES
(1, 'product', 'business'),
(1, 'product-list', 'business'),
(1, 'product-audit', 'business'),
(1, 'product-category', 'business'),
(1, 'product-brand', 'business'),
(1, 'product-type', 'business'),
(1, 'param-library', 'business'),
(1, 'stock-alert', 'business'),
(1, 'recycle-bin', 'business');

-- 审核管理员：分配商品管理模块的所有菜单（包括 product-audit）
-- 注意：不分配人员管理系统的菜单，只有超级管理员可以访问
INSERT INTO `t_role_menu` (`role_id`, `menu_key`, `project_key`) VALUES
(2, 'product', 'business'),
(2, 'product-list', 'business'),
(2, 'product-audit', 'business');

-- 商品管理员：分配商品管理模块的菜单（不包括 product-audit）
INSERT INTO `t_role_menu` (`role_id`, `menu_key`, `project_key`) VALUES
(3, 'product', 'business'),
(3, 'product-list', 'business'),
(3, 'product-category', 'business'),
(3, 'product-brand', 'business'),
(3, 'product-type', 'business'),
(3, 'param-library', 'business'),
(3, 'stock-alert', 'business');

-- 订单管理员：分配订单管理模块的菜单（预留）
-- INSERT INTO `t_role_menu` (`role_id`, `menu_key`, `project_key`) VALUES
-- (4, 'order', 'business'),
-- (4, 'order-list', 'business'),
-- (4, 'order-detail', 'business');

-- 超级管理员：分配人员管理系统的所有菜单（business-personnel 项目）
-- 注意：只有超级管理员可以访问人员管理系统
INSERT INTO `t_role_menu` (`role_id`, `menu_key`, `project_key`) VALUES
(1, 'user', 'business-personnel'),
(1, 'role', 'business-personnel');

    -- ================================================================
    -- 7. 更新现有用户的角色
    -- ================================================================

    -- 将 admin 用户设置为超级管理员
    UPDATE `t_user` SET `role_id` = 1 WHERE `username` = 'admin';

    -- ================================================================
    -- 脚本执行完成
    -- ================================================================

    SELECT '角色权限管理初始化完成！' AS message;

    -- 查看角色表数据
    SELECT '=== 角色表数据 ===' AS info;
    SELECT * FROM `t_role`;

    -- 查看角色菜单权限数据
    SELECT '=== 角色菜单权限数据 ===' AS info;
    SELECT * FROM `t_role_menu` ORDER BY `role_id`, `menu_key`;

