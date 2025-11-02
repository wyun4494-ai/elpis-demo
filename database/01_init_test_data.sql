-- ================================================================
-- Elpis 电商系统 - 测试数据初始化脚本
-- 版本：1.0.0
-- 创建时间：2025-10-26
-- 说明：执行此脚本可初始化测试数据（分类、品牌、参数库）
-- ================================================================

USE elpis_beta;

-- ================================================================
-- 1. 商品分类测试数据
-- ================================================================

INSERT INTO `t_product_category` 
(`category_id`, `category_name`, `parent_id`, `level`, `category_path`, `full_name`, `has_children`, `sort_order`, `status`) 
VALUES
-- 一级分类
('CAT001', '手机数码', NULL, 1, '/CAT001', '手机数码', 1, 1, 1),
('CAT002', '服装鞋包', NULL, 1, '/CAT002', '服装鞋包', 1, 2, 1),
('CAT003', '家用电器', NULL, 1, '/CAT003', '家用电器', 1, 3, 1),

-- 二级分类（手机数码下）
('CAT001001', '手机', 'CAT001', 2, '/CAT001/CAT001001', '手机数码/手机', 1, 1, 1),
('CAT001002', '手机配件', 'CAT001', 2, '/CAT001/CAT001002', '手机数码/手机配件', 1, 2, 1),
('CAT001003', '摄影摄像', 'CAT001', 2, '/CAT001/CAT001003', '手机数码/摄影摄像', 0, 3, 1),

-- 三级分类（手机下）
('CAT001001001', '智能手机', 'CAT001001', 3, '/CAT001/CAT001001/CAT001001001', '手机数码/手机/智能手机', 0, 1, 1),
('CAT001001002', '功能手机', 'CAT001001', 3, '/CAT001/CAT001001/CAT001001002', '手机数码/手机/功能手机', 0, 2, 1),
('CAT001001003', '老人机', 'CAT001001', 3, '/CAT001/CAT001001/CAT001001003', '手机数码/手机/老人机', 0, 3, 1),

-- 三级分类（手机配件下）
('CAT001002001', '手机壳', 'CAT001002', 3, '/CAT001/CAT001002/CAT001002001', '手机数码/手机配件/手机壳', 0, 1, 1),
('CAT001002002', '手机贴膜', 'CAT001002', 3, '/CAT001/CAT001002/CAT001002002', '手机数码/手机配件/手机贴膜', 0, 2, 1),

-- 二级分类（服装鞋包下）
('CAT002001', '男装', 'CAT002', 2, '/CAT002/CAT002001', '服装鞋包/男装', 0, 1, 1),
('CAT002002', '女装', 'CAT002', 2, '/CAT002/CAT002002', '服装鞋包/女装', 0, 2, 1),
('CAT002003', '运动鞋', 'CAT002', 2, '/CAT002/CAT002003', '服装鞋包/运动鞋', 0, 3, 1);

-- ================================================================
-- 2. 商品品牌测试数据
-- ================================================================

INSERT INTO `t_product_brand` 
(`brand_id`, `brand_name`, `brand_name_en`, `first_letter`, `logo_url`, `description`, `sort_order`, `status`) 
VALUES
('BRAND001', 'Apple', 'Apple Inc.', 'A', NULL, 'Apple是一家美国跨国科技公司', 1, 1),
('BRAND002', '华为', 'HUAWEI', 'H', NULL, '华为技术有限公司', 2, 1),
('BRAND003', '小米', 'Xiaomi', 'X', NULL, '小米科技有限责任公司', 3, 1),
('BRAND004', 'OPPO', 'OPPO', 'O', NULL, 'OPPO广东移动通信有限公司', 4, 1),
('BRAND005', 'vivo', 'vivo', 'V', NULL, 'vivo移动通信有限公司', 5, 1),
('BRAND006', '联想', 'Lenovo', 'L', NULL, '联想集团有限公司', 6, 1),
('BRAND007', '三星', 'Samsung', 'S', NULL, '三星电子', 7, 1),
('BRAND008', '荣耀', 'HONOR', 'R', NULL, '荣耀终端有限公司', 8, 1);

-- ================================================================
-- 3. 参数分类测试数据
-- ================================================================

INSERT INTO `t_param_category`
(`category_id`, `category_name`, `sort_order`)
VALUES
('CAT_PARAM_001', '基本参数', 1),
('CAT_PARAM_002', '数码参数', 2),
('CAT_PARAM_003', '服装参数', 3),
('CAT_PARAM_004', '家电参数', 4),
('CAT_PARAM_005', '通用参数', 5);

-- ================================================================
-- 4. 参数库数据（30个预定义参数）
-- ================================================================

INSERT INTO `t_product_param_library`
(`param_id`, `param_name`, `param_type`, `param_values`, `param_category`, `sort_order`, `status`) 
VALUES

-- 基本参数（8个）
('PARAM001', '屏幕尺寸', 'input', NULL, 'CAT_PARAM_001', 1, 1),
('PARAM002', '网络类型', 'select', '["2G", "3G", "4G", "5G", "全网通"]', 'CAT_PARAM_001', 2, 1),
('PARAM003', '操作系统', 'select', '["Android", "iOS", "HarmonyOS", "Windows", "其他"]', 'CAT_PARAM_001', 3, 1),
('PARAM004', '电池容量', 'input', NULL, 'CAT_PARAM_001', 4, 1),
('PARAM005', '材质', 'input', NULL, 'CAT_PARAM_001', 5, 1),
('PARAM006', '产地', 'input', NULL, 'CAT_PARAM_001', 6, 1),
('PARAM007', '保修期', 'select', '["1年", "2年", "3年", "终身保修"]', 'CAT_PARAM_001', 7, 1),
('PARAM008', '重量', 'input', NULL, 'CAT_PARAM_001', 8, 1),

-- 服装参数（7个）
('PARAM101', '使用季节', 'checkbox', '["春", "夏", "秋", "冬"]', 'CAT_PARAM_003', 1, 1),
('PARAM102', '适用人群', 'select', '["男士", "女士", "儿童", "中性", "情侣"]', 'CAT_PARAM_003', 2, 1),
('PARAM103', '袖长', 'select', '["长袖", "短袖", "七分袖", "五分袖", "无袖"]', 'CAT_PARAM_003', 3, 1),
('PARAM104', '领型', 'select', '["圆领", "V领", "翻领", "立领", "一字领", "高领"]', 'CAT_PARAM_003', 4, 1),
('PARAM105', '版型', 'select', '["修身", "宽松", "标准", "oversize"]', 'CAT_PARAM_003', 5, 1),
('PARAM106', '厚度', 'select', '["薄款", "常规", "加厚", "羽绒"]', 'CAT_PARAM_003', 6, 1),
('PARAM107', '弹性', 'select', '["无弹", "微弹", "高弹"]', 'CAT_PARAM_003', 7, 1),

-- 数码参数（7个）
('PARAM201', '处理器', 'input', NULL, 'CAT_PARAM_002', 1, 1),
('PARAM202', '运行内存', 'select', '["2GB", "4GB", "6GB", "8GB", "12GB", "16GB", "18GB"]', 'CAT_PARAM_002', 2, 1),
('PARAM203', '存储容量', 'select', '["16GB", "32GB", "64GB", "128GB", "256GB", "512GB", "1TB"]', 'CAT_PARAM_002', 3, 1),
('PARAM204', '屏幕刷新率', 'select', '["60Hz", "90Hz", "120Hz", "144Hz", "165Hz"]', 'CAT_PARAM_002', 4, 1),
('PARAM205', '摄像头像素', 'input', NULL, 'CAT_PARAM_002', 5, 1),
('PARAM206', '充电功率', 'input', NULL, 'CAT_PARAM_002', 6, 1),
('PARAM207', '防水等级', 'select', '["IP54", "IP67", "IP68", "无"]', 'CAT_PARAM_002', 7, 1),

-- 家电参数（5个）
('PARAM301', '能效等级', 'select', '["一级", "二级", "三级", "四级", "五级"]', 'CAT_PARAM_004', 1, 1),
('PARAM302', '功率', 'input', NULL, 'CAT_PARAM_004', 2, 1),
('PARAM303', '容量', 'input', NULL, 'CAT_PARAM_004', 3, 1),
('PARAM304', '噪音', 'input', NULL, 'CAT_PARAM_004', 4, 1),
('PARAM305', '控制方式', 'checkbox', '["手动", "遥控", "APP控制", "语音控制"]', 'CAT_PARAM_004', 5, 1),

-- 通用参数（3个）
('PARAM401', '品牌认证', 'checkbox', '["3C认证", "CE认证", "FCC认证", "ROHS认证"]', 'CAT_PARAM_005', 1, 1),
('PARAM402', '包装清单', 'input', NULL, 'CAT_PARAM_005', 2, 1),
('PARAM403', '售后服务', 'input', NULL, 'CAT_PARAM_005', 3, 1);

-- ================================================================
-- 脚本执行完成
-- ================================================================
SELECT '测试数据初始化完成！' AS message;

-- 查看数据统计
SELECT '商品分类' AS 类型, COUNT(*) AS 数量 FROM t_product_category
UNION ALL
SELECT '商品品牌', COUNT(*) FROM t_product_brand
UNION ALL
SELECT '参数分类', COUNT(*) FROM t_param_category
UNION ALL
SELECT '参数库', COUNT(*) FROM t_product_param_library;

