-- ================================================================
-- 更新人员管理系统项目标识脚本
-- 版本：1.0.0
-- 创建时间：2025-11
-- 说明：将人员管理系统的项目标识从 people 改为 business-personnel
-- ================================================================

USE elpis_beta;

-- ================================================================
-- 1. 删除旧的人员管理系统权限配置
-- ================================================================

DELETE FROM `t_role_menu` WHERE `menu_key` IN ('user', 'role') AND `project_key` IN ('c1', 'people', 'business');

-- ================================================================
-- 2. 为超级管理员添加新的人员管理系统权限（使用 business-personnel 项目标识）
-- ================================================================

INSERT INTO `t_role_menu` (`role_id`, `menu_key`, `project_key`) VALUES
(1, 'user', 'business-personnel'),
(1, 'role', 'business-personnel');

-- ================================================================
-- 3. 验证权限配置
-- ================================================================

SELECT '=== 更新后：所有角色的权限配置 ===' AS info;
SELECT r.role_id, r.role_name, rm.menu_key, rm.project_key 
FROM `t_role` r
LEFT JOIN `t_role_menu` rm ON r.role_id = rm.role_id
ORDER BY r.role_id, rm.project_key, rm.menu_key;

SELECT '=== 更新完成 ===' AS message;

