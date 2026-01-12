-- ================================================================
-- Elpis 电商系统 - 完整测试数据插入脚本
-- 版本：3.0.0
-- 创建时间：2025-01-05
-- 说明：包含所有30个表的测试数据
-- ================================================================

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

USE elpis_beta;

-- ================================================================
-- 清空现有测试数据（按依赖关系倒序删除）
-- ================================================================
SET FOREIGN_KEY_CHECKS = 0;

DELETE FROM `t_product_param_value`;
DELETE FROM `t_category_param`;
DELETE FROM `t_flash_sale_stock_alert`;
DELETE FROM `t_flash_sale_time_slot`;
DELETE FROM `t_flash_sale_product`;
DELETE FROM `t_flash_sale`;
DELETE FROM `t_advertisement`;
DELETE FROM `t_topic_recommend`;
DELETE FROM `t_popular_product_recommend`;
DELETE FROM `t_new_product_recommend`;
DELETE FROM `t_brand_recommend`;
DELETE FROM `t_user_coupon`;
DELETE FROM `t_coupon`;
DELETE FROM `t_customer`;
DELETE FROM `t_role_menu`;
DELETE FROM `t_role`;
DELETE FROM `t_user` WHERE user_id != 'admin';
DELETE FROM `t_product_delete_log`;
DELETE FROM `t_product_audit`;
DELETE FROM `t_stock_alert_log`;
DELETE FROM `t_product_sku`;
DELETE FROM `t_product`;
DELETE FROM `t_category_attribute`;
DELETE FROM `t_product_param_library`;
DELETE FROM `t_param_category`;
DELETE FROM `t_product_brand`;
DELETE FROM `t_product_category`;
DELETE FROM `t_ad_position`;

SET FOREIGN_KEY_CHECKS = 1;

SELECT '已清空现有测试数据' AS '状态';

-- ================================================================
-- 1. 商品分类表测试数据
-- ================================================================
INSERT INTO `t_product_category` (`category_id`, `category_name`, `parent_id`, `level`, `category_path`, `full_name`, `has_children`, `sort_order`, `icon`, `banner_img`, `status`) VALUES
('CAT001', '数码产品', NULL, 1, '/CAT001/', '数码产品', 1, 1, '/icon/digital.png', '/banner/digital.jpg', 1),
('CAT001001', '手机', 'CAT001', 2, '/CAT001/CAT001001/', '数码产品/手机', 1, 1, '/icon/phone.png', '/banner/phone.jpg', 1),
('CAT001001001', '苹果手机', 'CAT001001', 3, '/CAT001/CAT001001/CAT001001001/', '数码产品/手机/苹果手机', 0, 1, NULL, NULL, 1),
('CAT001001002', '华为手机', 'CAT001001', 3, '/CAT001/CAT001001/CAT001001002/', '数码产品/手机/华为手机', 0, 2, NULL, NULL, 1),
('CAT001001003', '小米手机', 'CAT001001', 3, '/CAT001/CAT001001/CAT001001003/', '数码产品/手机/小米手机', 0, 3, NULL, NULL, 1),
('CAT001002', '平板电脑', 'CAT001', 2, '/CAT001/CAT001002/', '数码产品/平板电脑', 0, 2, '/icon/tablet.png', '/banner/tablet.jpg', 1),
('CAT001003', '笔记本电脑', 'CAT001', 2, '/CAT001/CAT001003/', '数码产品/笔记本电脑', 0, 3, '/icon/laptop.png', '/banner/laptop.jpg', 1),
('CAT001004', '智能穿戴', 'CAT001', 2, '/CAT001/CAT001004/', '数码产品/智能穿戴', 1, 4, '/icon/wearable.png', '/banner/wearable.jpg', 1),
('CAT001004001', '智能手表', 'CAT001004', 3, '/CAT001/CAT001004/CAT001004001/', '数码产品/智能穿戴/智能手表', 0, 1, NULL, NULL, 1),
('CAT001004002', '智能手环', 'CAT001004', 3, '/CAT001/CAT001004/CAT001004002/', '数码产品/智能穿戴/智能手环', 0, 2, NULL, NULL, 1),
('CAT002', '家用电器', NULL, 1, '/CAT002/', '家用电器', 1, 2, '/icon/appliance.png', '/banner/appliance.jpg', 1),
('CAT002001', '电视', 'CAT002', 2, '/CAT002/CAT002001/', '家用电器/电视', 0, 1, '/icon/tv.png', '/banner/tv.jpg', 1),
('CAT002002', '冰箱', 'CAT002', 2, '/CAT002/CAT002002/', '家用电器/冰箱', 0, 2, '/icon/fridge.png', '/banner/fridge.jpg', 1),
('CAT003', '智能家居', NULL, 1, '/CAT003/', '智能家居', 1, 3, '/icon/smarthome.png', '/banner/smarthome.jpg', 1),
('CAT003001', '智能音箱', 'CAT003', 2, '/CAT003/CAT003001/', '智能家居/智能音箱', 0, 1, '/icon/speaker.png', '/banner/speaker.jpg', 1);

-- ================================================================
-- 2. 商品品牌表测试数据
-- ================================================================
INSERT INTO `t_product_brand` (`brand_id`, `brand_name`, `brand_name_en`, `first_letter`, `logo_url`, `description`, `sort_order`, `status`) VALUES
('BRAND001', '苹果', 'Apple', 'A', '/uploads/brand/apple-logo.jpg', '全球领先的科技公司，专注于创新产品', 1, 1),
('BRAND002', '华为', 'HUAWEI', 'H', '/uploads/brand/huawei-logo.jpg', '中国领先的通信设备制造商', 2, 1),
('BRAND003', '小米', 'Xiaomi', 'X', '/uploads/brand/xiaomi-logo.jpg', '专注于智能硬件和电子产品', 3, 1),
('BRAND004', '三星', 'Samsung', 'S', '/uploads/brand/samsung-logo.jpg', '全球知名电子品牌', 4, 1),
('BRAND005', 'OPPO', 'OPPO', 'O', '/uploads/brand/oppo-logo.jpg', '专注于拍照手机', 5, 1),
('BRAND006', 'vivo', 'vivo', 'V', '/uploads/brand/vivo-logo.jpg', '年轻时尚的手机品牌', 6, 1),
('BRAND007', '联想', 'Lenovo', 'L', '/uploads/brand/lenovo-logo.jpg', '全球PC领导品牌', 7, 1),
('BRAND008', '戴尔', 'Dell', 'D', '/uploads/brand/dell-logo.jpg', '企业级电脑品牌', 8, 1),
('BRAND009', '海尔', 'Haier', 'H', '/uploads/brand/haier-logo.jpg', '中国家电领导品牌', 9, 1),
('BRAND010', '美的', 'Midea', 'M', '/uploads/brand/midea-logo.jpg', '全球家电制造商', 10, 1);

-- ================================================================
-- 3. 参数分类表测试数据
-- ================================================================
INSERT INTO `t_param_category` (`category_id`, `category_name`, `sort_order`, `status`) VALUES
(REPLACE(UUID(), '-', ''), '基本参数', 1, 1),
(REPLACE(UUID(), '-', ''), '主体参数', 2, 1),
(REPLACE(UUID(), '-', ''), '屏幕参数', 3, 1),
(REPLACE(UUID(), '-', ''), '性能参数', 4, 1),
(REPLACE(UUID(), '-', ''), '电池参数', 5, 1);

-- ================================================================
-- 1. 商品分类表测试数据
-- ================================================================
INSERT INTO `t_product_category` (`category_id`, `category_name`, `parent_id`, `level`, `category_path`, `full_name`, `has_children`, `sort_order`, `icon`, `banner_img`, `status`) VALUES
('CAT001', '数码产品', NULL, 1, '/CAT001/', '数码产品', 1, 1, '/icon/digital.png', '/banner/digital.jpg', 1),
('CAT001001', '手机', 'CAT001', 2, '/CAT001/CAT001001/', '数码产品/手机', 1, 1, '/icon/phone.png', '/banner/phone.jpg', 1),
('CAT001001001', '苹果手机', 'CAT001001', 3, '/CAT001/CAT001001/CAT001001001/', '数码产品/手机/苹果手机', 0, 1, NULL, NULL, 1),
('CAT001001002', '华为手机', 'CAT001001', 3, '/CAT001/CAT001001/CAT001001002/', '数码产品/手机/华为手机', 0, 2, NULL, NULL, 1),
('CAT001001003', '小米手机', 'CAT001001', 3, '/CAT001/CAT001001/CAT001001003/', '数码产品/手机/小米手机', 0, 3, NULL, NULL, 1),
('CAT001002', '平板电脑', 'CAT001', 2, '/CAT001/CAT001002/', '数码产品/平板电脑', 0, 2, '/icon/tablet.png', '/banner/tablet.jpg', 1),
('CAT001003', '笔记本电脑', 'CAT001', 2, '/CAT001/CAT001003/', '数码产品/笔记本电脑', 0, 3, '/icon/laptop.png', '/banner/laptop.jpg', 1),
('CAT001004', '智能穿戴', 'CAT001', 2, '/CAT001/CAT001004/', '数码产品/智能穿戴', 1, 4, '/icon/wearable.png', '/banner/wearable.jpg', 1),
('CAT001004001', '智能手表', 'CAT001004', 3, '/CAT001/CAT001004/CAT001004001/', '数码产品/智能穿戴/智能手表', 0, 1, NULL, NULL, 1),
('CAT001004002', '智能手环', 'CAT001004', 3, '/CAT001/CAT001004/CAT001004002/', '数码产品/智能穿戴/智能手环', 0, 2, NULL, NULL, 1),
('CAT002', '家用电器', NULL, 1, '/CAT002/', '家用电器', 1, 2, '/icon/appliance.png', '/banner/appliance.jpg', 1),
('CAT002001', '电视', 'CAT002', 2, '/CAT002/CAT002001/', '家用电器/电视', 0, 1, '/icon/tv.png', '/banner/tv.jpg', 1),
('CAT002002', '冰箱', 'CAT002', 2, '/CAT002/CAT002002/', '家用电器/冰箱', 0, 2, '/icon/fridge.png', '/banner/fridge.jpg', 1),
('CAT003', '智能家居', NULL, 1, '/CAT003/', '智能家居', 1, 3, '/icon/smarthome.png', '/banner/smarthome.jpg', 1),
('CAT003001', '智能音箱', 'CAT003', 2, '/CAT003/CAT003001/', '智能家居/智能音箱', 0, 1, '/icon/speaker.png', '/banner/speaker.jpg', 1);

-- ================================================================
-- 2. 商品品牌表测试数据
-- ================================================================
INSERT INTO `t_product_brand` (`brand_id`, `brand_name`, `brand_name_en`, `first_letter`, `logo_url`, `description`, `sort_order`, `status`) VALUES
('BRAND001', '苹果', 'Apple', 'A', '/uploads/brand/apple-logo.jpg', '全球领先的科技公司，专注于创新产品', 1, 1),
('BRAND002', '华为', 'HUAWEI', 'H', '/uploads/brand/huawei-logo.jpg', '中国领先的通信设备制造商', 2, 1),
('BRAND003', '小米', 'Xiaomi', 'X', '/uploads/brand/xiaomi-logo.jpg', '专注于智能硬件和电子产品', 3, 1),
('BRAND004', '三星', 'Samsung', 'S', '/uploads/brand/samsung-logo.jpg', '全球知名电子品牌', 4, 1),
('BRAND005', 'OPPO', 'OPPO', 'O', '/uploads/brand/oppo-logo.jpg', '专注于拍照手机', 5, 1),
('BRAND006', 'vivo', 'vivo', 'V', '/uploads/brand/vivo-logo.jpg', '年轻时尚的手机品牌', 6, 1),
('BRAND007', '联想', 'Lenovo', 'L', '/uploads/brand/lenovo-logo.jpg', '全球PC领导品牌', 7, 1),
('BRAND008', '戴尔', 'Dell', 'D', '/uploads/brand/dell-logo.jpg', '企业级电脑品牌', 8, 1),
('BRAND009', '海尔', 'Haier', 'H', '/uploads/brand/haier-logo.jpg', '中国家电领导品牌', 9, 1),
('BRAND010', '美的', 'Midea', 'M', '/uploads/brand/midea-logo.jpg', '全球家电制造商', 10, 1);

-- ================================================================
-- 3. 参数分类表测试数据
-- ================================================================
INSERT INTO `t_param_category` (`category_id`, `category_name`, `sort_order`, `status`) VALUES
(REPLACE(UUID(), '-', ''), '基本参数', 1, 1),
(REPLACE(UUID(), '-', ''), '主体参数', 2, 1),
(REPLACE(UUID(), '-', ''), '屏幕参数', 3, 1),
(REPLACE(UUID(), '-', ''), '性能参数', 4, 1),
(REPLACE(UUID(), '-', ''), '电池参数', 5, 1);

-- ================================================================
-- 4. 商品参数库表测试数据
-- ================================================================
INSERT INTO `t_product_param_library` (`param_id`, `param_name`, `param_type`, `param_values`, `param_category`, `sort_order`, `status`) VALUES
(REPLACE(UUID(), '-', ''), '品牌', 'input', NULL, '基本参数', 1, 1),
(REPLACE(UUID(), '-', ''), '型号', 'input', NULL, '基本参数', 2, 1),
(REPLACE(UUID(), '-', ''), '颜色', 'select', '["黑色","白色","金色","银色","蓝色","红色"]', '基本参数', 3, 1),
(REPLACE(UUID(), '-', ''), '上市时间', 'input', NULL, '主体参数', 1, 1),
(REPLACE(UUID(), '-', ''), '操作系统', 'select', '["iOS","Android","HarmonyOS","Windows","macOS"]', '主体参数', 2, 1),
(REPLACE(UUID(), '-', ''), '屏幕尺寸', 'input', NULL, '屏幕参数', 1, 1),
(REPLACE(UUID(), '-', ''), '分辨率', 'select', '["1920x1080","2560x1440","3840x2160"]', '屏幕参数', 2, 1),
(REPLACE(UUID(), '-', ''), '刷新率', 'select', '["60Hz","90Hz","120Hz","144Hz"]', '屏幕参数', 3, 1),
(REPLACE(UUID(), '-', ''), 'CPU型号', 'input', NULL, '性能参数', 1, 1),
(REPLACE(UUID(), '-', ''), '内存', 'select', '["4GB","6GB","8GB","12GB","16GB","32GB"]', '性能参数', 2, 1),
(REPLACE(UUID(), '-', ''), '存储', 'select', '["64GB","128GB","256GB","512GB","1TB"]', '性能参数', 3, 1),
(REPLACE(UUID(), '-', ''), '电池容量', 'input', NULL, '电池参数', 1, 1),
(REPLACE(UUID(), '-', ''), '充电功率', 'input', NULL, '电池参数', 2, 1);

-- ================================================================
-- 5. 分类属性表测试数据（SKU规格配置）
-- ================================================================
INSERT INTO `t_category_attribute` (`attr_id`, `category_id`, `attr_name`, `predefined_values`, `allow_custom`, `is_required`, `sort_order`) VALUES
(REPLACE(UUID(), '-', ''), 'CAT001001001', '颜色', '["深空黑","银色","金色","天蓝色"]', 1, 1, 1),
(REPLACE(UUID(), '-', ''), 'CAT001001001', '存储容量', '["128GB","256GB","512GB","1TB"]', 0, 1, 2),
(REPLACE(UUID(), '-', ''), 'CAT001001002', '颜色', '["曜金黑","雅川青","雪域白"]', 1, 1, 1),
(REPLACE(UUID(), '-', ''), 'CAT001001002', '存储容量', '["256GB","512GB","1TB"]', 0, 1, 2),
(REPLACE(UUID(), '-', ''), 'CAT001001003', '颜色', '["黑色","白色","蓝色"]', 1, 1, 1),
(REPLACE(UUID(), '-', ''), 'CAT001001003', '存储容量', '["128GB","256GB","512GB"]', 0, 1, 2),
(REPLACE(UUID(), '-', ''), 'CAT001002', '颜色', '["深空灰","银色","玫瑰金"]', 1, 1, 1),
(REPLACE(UUID(), '-', ''), 'CAT001002', '存储容量', '["64GB","256GB","512GB"]', 0, 1, 2),
(REPLACE(UUID(), '-', ''), 'CAT001004001', '表带颜色', '["黑色","白色","蓝色","红色"]', 1, 1, 1),
(REPLACE(UUID(), '-', ''), 'CAT001004002', '表带颜色', '["黑色","橙色","绿色"]', 1, 1, 1);

-- ================================================================
-- 6. 商品表测试数据（SPU）
-- ================================================================
INSERT INTO `t_product` (`product_id`, `product_name`, `product_images`, `product_detail`, `category_id`, `category_l1_id`, `category_l2_id`, `category_l3_id`, `brand_id`, `price`, `item_number`, `inventory`, `status`, `shelf_status`, `sort_order`, `audit_status`) VALUES
('PROD001', 'iPhone 15 Pro Max', '["https://example.com/iphone15-1.jpg","https://example.com/iphone15-2.jpg"]', '<p>全新A17 Pro芯片，钛金属边框设计</p>', 'CAT001001001', 'CAT001', 'CAT001001', 'CAT001001001', 'BRAND001', 9999.00, 'IP15PM001', 500, 1, 1, 1, 1),
('PROD002', '华为Mate 60 Pro', '["https://example.com/mate60-1.jpg","https://example.com/mate60-2.jpg"]', '<p>卫星通信，麒麟芯片回归</p>', 'CAT001001002', 'CAT001', 'CAT001001', 'CAT001001002', 'BRAND002', 6999.00, 'HWM60P001', 300, 1, 1, 2, 1),
('PROD003', '小米14 Ultra', '["https://example.com/mi14-1.jpg","https://example.com/mi14-2.jpg"]', '<p>徕卡光学镜头，骁龙8 Gen3</p>', 'CAT001001003', 'CAT001', 'CAT001001', 'CAT001001003', 'BRAND003', 5999.00, 'MI14U001', 400, 1, 1, 3, 1),
('PROD004', 'MacBook Pro M3', '["https://example.com/macbook-1.jpg"]', '<p>M3芯片，性能提升40%</p>', 'CAT001003', 'CAT001', 'CAT001003', NULL, 'BRAND001', 14999.00, 'MBPM3001', 200, 1, 1, 4, 1),
('PROD005', 'iPad Air 6', '["https://example.com/ipad-1.jpg"]', '<p>M2芯片，支持Apple Pencil</p>', 'CAT001002', 'CAT001', 'CAT001002', NULL, 'BRAND001', 4999.00, 'IPA6001', 350, 1, 1, 5, 1),
('PROD006', 'AirPods Pro 2', '["https://example.com/airpods-1.jpg"]', '<p>主动降噪，空间音频</p>', 'CAT001', 'CAT001', NULL, NULL, 'BRAND001', 1999.00, 'APP2001', 800, 1, 1, 6, 1),
('PROD007', '小米手环8', '["https://example.com/miband-1.jpg"]', '<p>健康监测，超长续航</p>', 'CAT001004002', 'CAT001', 'CAT001004', 'CAT001004002', 'BRAND003', 299.00, 'MIB8001', 1000, 1, 1, 7, 1),
('PROD008', '华为Watch GT 4', '["https://example.com/watch-1.jpg"]', '<p>专业运动监测</p>', 'CAT001004001', 'CAT001', 'CAT001004', 'CAT001004001', 'BRAND002', 1499.00, 'HWWGT4001', 600, 1, 1, 8, 1),
('PROD009', 'iPad 10', '["https://example.com/ipad10-1.jpg"]', '<p>性价比之选</p>', 'CAT001002', 'CAT001', 'CAT001002', NULL, 'BRAND001', 3499.00, 'IP10001', 450, 1, 1, 9, 1),
('PROD010', '小米电视65寸', '["https://example.com/tv-1.jpg"]', '<p>4K超清，120Hz刷新率</p>', 'CAT002001', 'CAT002', 'CAT002001', NULL, 'BRAND003', 2999.00, 'MITV65001', 250, 1, 1, 10, 1),
('PROD011', 'Samsung Galaxy S24', '["https://example.com/s24-1.jpg"]', '<p>AI手机新标杆</p>', 'CAT001001', 'CAT001', 'CAT001001', NULL, 'BRAND004', 5499.00, 'SGS24001', 350, 1, 1, 11, 1),
('PROD012', 'OPPO Find X7', '["https://example.com/findx7-1.jpg"]', '<p>哈苏影像系统</p>', 'CAT001001', 'CAT001', 'CAT001001', NULL, 'BRAND005', 4999.00, 'OPFX7001', 280, 1, 1, 12, 1),
('PROD013', '联想ThinkPad X1', '["https://example.com/thinkpad-1.jpg"]', '<p>商务笔记本首选</p>', 'CAT001003', 'CAT001', 'CAT001003', NULL, 'BRAND007', 8999.00, 'LVTPX1001', 150, 1, 1, 13, 1),
('PROD014', '戴尔XPS 15', '["https://example.com/xps-1.jpg"]', '<p>创作者笔记本</p>', 'CAT001003', 'CAT001', 'CAT001003', NULL, 'BRAND008', 12999.00, 'DLXPS15001', 120, 1, 1, 14, 1),
('PROD015', '海尔冰箱', '["https://example.com/fridge-1.jpg"]', '<p>智能保鲜</p>', 'CAT002002', 'CAT002', 'CAT002002', NULL, 'BRAND009', 3999.00, 'HRFG001', 80, 1, 1, 15, 1);

-- ================================================================
-- 7. 商品SKU表测试数据
-- ================================================================
INSERT INTO `t_product_sku` (`sku_id`, `product_id`, `sku_name`, `sku_code`, `sku_attributes`, `price`, `promotion_price`, `inventory`, `stock_alert`, `image_url`, `status`) VALUES
(REPLACE(UUID(), '-', ''), 'PROD001', 'iPhone 15 Pro Max 深空黑 256GB', 'IP15PM-BLACK-256', '{"颜色":"深空黑","存储容量":"256GB"}', 9999.00, 9499.00, 150, 50, 'https://example.com/iphone15-black.jpg', 1),
(REPLACE(UUID(), '-', ''), 'PROD001', 'iPhone 15 Pro Max 深空黑 512GB', 'IP15PM-BLACK-512', '{"颜色":"深空黑","存储容量":"512GB"}', 11999.00, 11499.00, 120, 50, 'https://example.com/iphone15-black.jpg', 1),
(REPLACE(UUID(), '-', ''), 'PROD001', 'iPhone 15 Pro Max 银色 256GB', 'IP15PM-SILVER-256', '{"颜色":"银色","存储容量":"256GB"}', 9999.00, 9499.00, 130, 50, 'https://example.com/iphone15-silver.jpg', 1),
(REPLACE(UUID(), '-', ''), 'PROD001', 'iPhone 15 Pro Max 银色 512GB', 'IP15PM-SILVER-512', '{"颜色":"银色","存储容量":"512GB"}', 11999.00, 11499.00, 100, 50, 'https://example.com/iphone15-silver.jpg', 1),
(REPLACE(UUID(), '-', ''), 'PROD002', '华为Mate 60 Pro 曜金黑 512GB', 'HWM60P-BLACK-512', '{"颜色":"曜金黑","存储容量":"512GB"}', 6999.00, NULL, 100, 30, 'https://example.com/mate60-black.jpg', 1),
(REPLACE(UUID(), '-', ''), 'PROD002', '华为Mate 60 Pro 雅川青 512GB', 'HWM60P-GREEN-512', '{"颜色":"雅川青","存储容量":"512GB"}', 6999.00, NULL, 80, 30, 'https://example.com/mate60-green.jpg', 1),
(REPLACE(UUID(), '-', ''), 'PROD002', '华为Mate 60 Pro 雪域白 512GB', 'HWM60P-WHITE-512', '{"颜色":"雪域白","存储容量":"512GB"}', 6999.00, NULL, 120, 30, 'https://example.com/mate60-white.jpg', 1),
(REPLACE(UUID(), '-', ''), 'PROD003', '小米14 Ultra 黑色 512GB', 'MI14U-BLACK-512', '{"颜色":"黑色","存储容量":"512GB"}', 5999.00, 5699.00, 150, 40, 'https://example.com/mi14-black.jpg', 1),
(REPLACE(UUID(), '-', ''), 'PROD003', '小米14 Ultra 白色 512GB', 'MI14U-WHITE-512', '{"颜色":"白色","存储容量":"512GB"}', 5999.00, 5699.00, 130, 40, 'https://example.com/mi14-white.jpg', 1),
(REPLACE(UUID(), '-', ''), 'PROD003', '小米14 Ultra 蓝色 512GB', 'MI14U-BLUE-512', '{"颜色":"蓝色","存储容量":"512GB"}', 5999.00, 5699.00, 120, 40, 'https://example.com/mi14-blue.jpg', 1);

-- ================================================================
-- 8. 角色表测试数据
-- ================================================================
INSERT INTO `t_role` (`role_id`, `role_name`, `role_code`, `role_desc`, `status`) VALUES
(REPLACE(UUID(), '-', ''), '超级管理员', 'super_admin', '拥有系统所有权限', 1),
(REPLACE(UUID(), '-', ''), '运营人员', 'operator', '负责商品管理、订单处理等运营工作', 1),
(REPLACE(UUID(), '-', ''), '客服人员', 'customer_service', '负责客户咨询、售后处理', 1),
(REPLACE(UUID(), '-', ''), '审核人员', 'auditor', '负责商品审核、内容审核', 1),
(REPLACE(UUID(), '-', ''), '财务人员', 'finance', '负责财务管理、对账结算', 1);

-- ================================================================
-- 9. 用户表测试数据（管理员）
-- ================================================================
INSERT IGNORE INTO `t_user` (`user_id`, `username`, `password`, `nickname`, `email`, `sex`, `desc`, `status`, `last_login_time`) VALUES
('admin', 'admin', '$2b$10$5TCJw4wl1IZBEF9nBzPIZODShHCSujXhJ0uRfLHcdR82DqAj7Aqo6', '系统管理员', 'admin@example.com', 1, '系统管理员账号', 1, NOW()),
('user001', 'zhangsan', '$2b$10$5TCJw4wl1IZBEF9nBzPIZODShHCSujXhJ0uRfLHcdR82DqAj7Aqo6', '张三', 'zhangsan@example.com', 1, '运营人员', 1, DATE_SUB(NOW(), INTERVAL 1 DAY)),
('user002', 'lisi', '$2b$10$5TCJw4wl1IZBEF9nBzPIZODShHCSujXhJ0uRfLHcdR82DqAj7Aqo6', '李四', 'lisi@example.com', 2, '客服人员', 1, DATE_SUB(NOW(), INTERVAL 2 DAY)),
('user003', 'wangwu', '$2b$10$5TCJw4wl1IZBEF9nBzPIZODShHCSujXhJ0uRfLHcdR82DqAj7Aqo6', '王五', 'wangwu@example.com', 1, '审核人员', 1, DATE_SUB(NOW(), INTERVAL 3 DAY));

-- ================================================================
-- 10. 角色菜单权限表测试数据
-- ================================================================
INSERT INTO `t_role_menu` (`role_id`, `menu_key`, `project_key`) VALUES
-- 超级管理员拥有所有权限
((SELECT role_id FROM t_role WHERE role_code='super_admin' LIMIT 1), 'product', 'business'),
((SELECT role_id FROM t_role WHERE role_code='super_admin' LIMIT 1), 'product-list', 'business'),
((SELECT role_id FROM t_role WHERE role_code='super_admin' LIMIT 1), 'product-config', 'business'),
((SELECT role_id FROM t_role WHERE role_code='super_admin' LIMIT 1), 'product-category', 'business'),
((SELECT role_id FROM t_role WHERE role_code='super_admin' LIMIT 1), 'product-brand', 'business'),
((SELECT role_id FROM t_role WHERE role_code='super_admin' LIMIT 1), 'marketing', 'business'),
((SELECT role_id FROM t_role WHERE role_code='super_admin' LIMIT 1), 'coupon-list', 'business'),
((SELECT role_id FROM t_role WHERE role_code='super_admin' LIMIT 1), 'product-audit', 'business'),
((SELECT role_id FROM t_role WHERE role_code='super_admin' LIMIT 1), 'user', 'business-personnel'),
((SELECT role_id FROM t_role WHERE role_code='super_admin' LIMIT 1), 'customer', 'business-personnel'),
((SELECT role_id FROM t_role WHERE role_code='super_admin' LIMIT 1), 'role', 'business-personnel');

-- ================================================================
-- 11. 优惠券表测试数据
-- ================================================================
INSERT INTO `t_coupon` (`coupon_id`, `coupon_name`, `coupon_type`, `discount_amount`, `discount_rate`, `min_amount`, `max_discount`, `total_count`, `received_count`, `used_count`, `limit_per_user`, `valid_days`, `start_time`, `end_time`, `coupon_status`, `manual_control`, `applicable_products`, `applicable_categories`, `description`, `sort_order`, `status`, `created_by`) VALUES
(REPLACE(UUID(), '-', ''), '新用户专享券', 3, 50.00, 0.00, 0.00, 0.00, 10000, 3200, 1800, 1, 7, NULL, NULL, 1, 0, NULL, NULL, '新用户注册即可领取，全场通用', 1, 1, 'admin'),
(REPLACE(UUID(), '-', ''), '满300减50', 1, 50.00, 0.00, 300.00, 0.00, 5000, 2100, 980, 2, 0, '2025-01-01 00:00:00', '2025-12-31 23:59:59', 1, 0, NULL, NULL, '全场通用，满300元减50元', 2, 1, 'admin'),
(REPLACE(UUID(), '-', ''), '数码产品8折券', 2, 0.00, 0.80, 500.00, 200.00, 3000, 1500, 680, 1, 0, '2025-01-01 00:00:00', '2025-06-30 23:59:59', 1, 0, NULL, '["CAT001"]', '数码产品专享8折，最高优惠200元', 3, 1, 'admin'),
(REPLACE(UUID(), '-', ''), '手机专享满1000减200', 1, 200.00, 0.00, 1000.00, 0.00, 2000, 850, 420, 1, 0, '2025-01-01 00:00:00', '2025-12-31 23:59:59', 1, 0, '["PROD001","PROD002","PROD003"]', NULL, '指定手机商品可用', 4, 1, 'admin');

-- ================================================================
-- 12. 普通用户表测试数据
-- ================================================================
INSERT INTO `t_customer` (`customer_id`, `username`, `password`, `nickname`, `email`, `phone`, `avatar`, `gender`, `birthday`, `address`, `status`) VALUES
('CUST001', 'customer001', '$2b$10$5TCJw4wl1IZBEF9nBzPIZODShHCSujXhJ0uRfLHcdR82DqAj7Aqo6', '张小明', 'zhangxiaoming@example.com', '13800138001', '/uploads/avatar/user1.jpg', 1, '1990-05-15', '北京市朝阳区xxx街道xxx号', 1),
('CUST002', 'customer002', '$2b$10$5TCJw4wl1IZBEF9nBzPIZODShHCSujXhJ0uRfLHcdR82DqAj7Aqo6', '李小红', 'lixiaohong@example.com', '13800138002', '/uploads/avatar/user2.jpg', 2, '1992-08-20', '上海市浦东新区xxx路xxx号', 1),
('CUST003', 'customer003', '$2b$10$5TCJw4wl1IZBEF9nBzPIZODShHCSujXhJ0uRfLHcdR82DqAj7Aqo6', '王小刚', 'wangxiaogang@example.com', '13800138003', '/uploads/avatar/user3.jpg', 1, '1988-03-10', '广州市天河区xxx大道xxx号', 1);

-- ================================================================
-- 数据插入完成
-- ================================================================
SELECT '测试数据插入完成！' AS '状态';

-- ================================================================
-- 13. 库存预警日志表测试数据
-- ================================================================
INSERT INTO `t_stock_alert_log` (`alert_id`, `sku_id`, `product_id`, `product_name`, `sku_name`, `current_inventory`, `alert_threshold`, `alert_level`, `alert_status`, `alert_time`, `handle_time`, `handler`, `handle_note`, `restock_quantity`) VALUES
(REPLACE(UUID(), '-', ''), (SELECT sku_id FROM t_product_sku WHERE sku_code='IP15PM-BLACK-256' LIMIT 1), 'PROD001', 'iPhone 15 Pro Max', 'iPhone 15 Pro Max 深空黑 256GB', 45, 50, 2, 1, DATE_SUB(NOW(), INTERVAL 5 DAY), NULL, NULL, NULL, NULL),
(REPLACE(UUID(), '-', ''), (SELECT sku_id FROM t_product_sku WHERE sku_code='IP15PM-SILVER-512' LIMIT 1), 'PROD001', 'iPhone 15 Pro Max', 'iPhone 15 Pro Max 银色 512GB', 48, 50, 2, 1, DATE_SUB(NOW(), INTERVAL 3 DAY), NULL, NULL, NULL, NULL),
(REPLACE(UUID(), '-', ''), (SELECT sku_id FROM t_product_sku WHERE sku_code='HWM60P-GREEN-512' LIMIT 1), 'PROD002', '华为Mate 60 Pro', '华为Mate 60 Pro 雅川青 512GB', 25, 30, 1, 2, DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_SUB(NOW(), INTERVAL 6 DAY), 'user001', '已补货200件', 200),
(REPLACE(UUID(), '-', ''), (SELECT sku_id FROM t_product_sku WHERE sku_code='MI14U-BLUE-512' LIMIT 1), 'PROD003', '小米14 Ultra', '小米14 Ultra 蓝色 512GB', 38, 40, 2, 1, DATE_SUB(NOW(), INTERVAL 2 DAY), NULL, NULL, NULL, NULL);

-- ================================================================
-- 14. 商品审核表测试数据
-- ================================================================
INSERT INTO `t_product_audit` (`audit_id`, `product_id`, `product_name`, `category_name`, `brand_name`, `price`, `submit_time`, `audit_status`, `auditor_id`, `auditor_name`, `audit_time`, `audit_opinion`, `reject_reason`) VALUES
(REPLACE(UUID(), '-', ''), 'PROD001', 'iPhone 15 Pro Max', '数码产品/手机/苹果手机', '苹果', 9999.00, DATE_SUB(NOW(), INTERVAL 10 DAY), 1, 'user003', '王五', DATE_SUB(NOW(), INTERVAL 9 DAY), '商品信息完整，图片清晰，审核通过', NULL),
(REPLACE(UUID(), '-', ''), 'PROD002', '华为Mate 60 Pro', '数码产品/手机/华为手机', '华为', 6999.00, DATE_SUB(NOW(), INTERVAL 8 DAY), 1, 'user003', '王五', DATE_SUB(NOW(), INTERVAL 7 DAY), '商品描述详细，审核通过', NULL),
(REPLACE(UUID(), '-', ''), 'PROD003', '小米14 Ultra', '数码产品/手机/小米手机', '小米', 5999.00, DATE_SUB(NOW(), INTERVAL 6 DAY), 1, 'user003', '王五', DATE_SUB(NOW(), INTERVAL 5 DAY), '商品参数齐全，审核通过', NULL),
(REPLACE(UUID(), '-', ''), 'PROD004', 'MacBook Pro M3', '数码产品/笔记本电脑', '苹果', 14999.00, DATE_SUB(NOW(), INTERVAL 4 DAY), 1, 'user003', '王五', DATE_SUB(NOW(), INTERVAL 3 DAY), '商品信息准确，审核通过', NULL);

-- ================================================================
-- 15. 商品删除日志表测试数据
-- ================================================================
INSERT INTO `t_product_delete_log` (`delete_id`, `product_id`, `product_name`, `category_name`, `brand_name`, `price`, `inventory`, `delete_reason`, `delete_time`, `operator_id`, `operator_name`, `restore_time`, `restore_operator_id`, `restore_operator_name`, `permanent_delete_time`, `permanent_delete_operator_id`, `permanent_delete_operator_name`) VALUES
(REPLACE(UUID(), '-', ''), 'PROD_DEL001', '测试商品1', '数码产品/手机', '测试品牌', 999.00, 0, '库存清零，商品下架', DATE_SUB(NOW(), INTERVAL 30 DAY), 'user001', '张三', NULL, NULL, NULL, NULL, NULL, NULL),
(REPLACE(UUID(), '-', ''), 'PROD_DEL002', '测试商品2', '数码产品/平板电脑', '测试品牌', 1999.00, 0, '商品停产', DATE_SUB(NOW(), INTERVAL 60 DAY), 'user001', '张三', DATE_SUB(NOW(), INTERVAL 50 DAY), 'user001', '张三', NULL, NULL, NULL);

-- ================================================================
-- 16. 品牌推荐表测试数据
-- ================================================================
INSERT INTO `t_brand_recommend` (`recommend_id`, `brand_id`, `brand_name`, `brand_logo`, `recommend_status`, `sort_order`, `start_time`, `end_time`, `created_by`, `created_name`) VALUES
(REPLACE(UUID(), '-', ''), 'BRAND001', '苹果', '/uploads/brand/apple-logo.jpg', 1, 1, '2025-01-01 00:00:00', '2025-12-31 23:59:59', 'admin', '系统管理员'),
(REPLACE(UUID(), '-', ''), 'BRAND002', '华为', '/uploads/brand/huawei-logo.jpg', 1, 2, '2025-01-01 00:00:00', '2025-12-31 23:59:59', 'admin', '系统管理员'),
(REPLACE(UUID(), '-', ''), 'BRAND003', '小米', '/uploads/brand/xiaomi-logo.jpg', 1, 3, '2025-01-01 00:00:00', '2025-12-31 23:59:59', 'admin', '系统管理员'),
(REPLACE(UUID(), '-', ''), 'BRAND004', '三星', '/uploads/brand/samsung-logo.jpg', 1, 4, '2025-01-01 00:00:00', '2025-12-31 23:59:59', 'admin', '系统管理员');

-- ================================================================
-- 17. 新品推荐表测试数据
-- ================================================================
INSERT INTO `t_new_product_recommend` (`recommend_id`, `product_id`, `product_name`, `product_image`, `price`, `recommend_status`, `sort_order`, `start_time`, `end_time`, `created_by`, `created_name`) VALUES
(REPLACE(UUID(), '-', ''), 'PROD001', 'iPhone 15 Pro Max', 'https://example.com/iphone15-1.jpg', 9999.00, 1, 1, '2025-01-01 00:00:00', '2025-03-31 23:59:59', 'admin', '系统管理员'),
(REPLACE(UUID(), '-', ''), 'PROD002', '华为Mate 60 Pro', 'https://example.com/mate60-1.jpg', 6999.00, 1, 2, '2025-01-01 00:00:00', '2025-03-31 23:59:59', 'admin', '系统管理员'),
(REPLACE(UUID(), '-', ''), 'PROD003', '小米14 Ultra', 'https://example.com/mi14-1.jpg', 5999.00, 1, 3, '2025-01-01 00:00:00', '2025-03-31 23:59:59', 'admin', '系统管理员');

-- ================================================================
-- 18. 人气推荐表测试数据
-- ================================================================
INSERT INTO `t_popular_product_recommend` (`recommend_id`, `product_id`, `product_name`, `product_image`, `price`, `sales_count`, `recommend_status`, `sort_order`, `start_time`, `end_time`, `created_by`, `created_name`) VALUES
(REPLACE(UUID(), '-', ''), 'PROD006', 'AirPods Pro 2', 'https://example.com/airpods-1.jpg', 1999.00, 5800, 1, 1, '2025-01-01 00:00:00', '2025-12-31 23:59:59', 'admin', '系统管理员'),
(REPLACE(UUID(), '-', ''), 'PROD007', '小米手环8', 'https://example.com/miband-1.jpg', 299.00, 12000, 1, 2, '2025-01-01 00:00:00', '2025-12-31 23:59:59', 'admin';
===' AS '=================================='===CT 
SELE AS '';3456'u / 12核人员：wangwT '审
SELECAS ''; 123456' si /'客服人员：liCT 
SELE';23456' AS 'n / 1hangsa营人员：zLECT '运S '';
SE / 123456' Aadmin '管理员账号：;
SELECT统：' AS '提示'用以下账号登录系ECT '可以使;
SEL' AS ''=============================='==========;
SELECT  deleted=0t WHERE_sale_producOM t_flash' FR杀商品数量 '秒COUNT(*) AS
SELECT ed=0;ERE deletsale WHflash_t_量' FROM  AS '秒杀活动数OUNT(*)LECT C;
SE=0etedWHERE delt_role OM FR色数量' AS '角*) T(T COUN
SELECdeleted=0;r WHERE tome_cusOM t '普通用户数量' FRUNT(*) AS
SELECT COted=0;le deer WHERE量' FROM t_us AS '管理员数T COUNT(*)
SELECeleted=0;E d WHEROM t_coupon优惠券数量' FRNT(*) AS '
SELECT COU0;deleted=sku WHERE product_ROM t_U数量' FSK) AS '(*ECT COUNT
SELleted=0;HERE de t_product WROM'商品数量' FT(*) AS LECT COUNSE;
RE deleted=0HE Wduct_brandM t_proFRO量' *) AS '商品品牌数ELECT COUNT(0;
SRE deleted= WHEategoryoduct_c t_pr FROM'商品分类数量'OUNT(*) AS T C';
SELEC===' AS '==============================T '=======
SELEC状态'; '试数据插入完成！' AS
SELECT '测'';=====' AS ===================================ELECT '=====
S=====================================================- ======完成统计
--- 数据插入=========
==================================================
-- =====000mAh');
 '5LIMIT 1),e='电池容量'  param_nam WHERElibraryuct_param_rodOM t_p FRam_id par, (SELECT02' ''), 'PROD0(), '-',UUIDLACE(
(REP),0S'麟900MIT 1), '麒CPU型号' LI='ameam_nparHERE ry Wram_libraoduct_paFROM t_prram_id CT pa', (SELEPROD002''), '', '-UUID(), EPLACE((R.82英寸'),
MIT 1), '6='屏幕尺寸' LIameam_nWHERE parm_library _paraoductid FROM t_prECT param_OD002', (SEL), 'PR'-', ''E(UUID(), PLAC
(REonyOS'),Harm), 'T 1='操作系统' LIMImem_naRE para WHEaram_libraryduct_p t_proid FROM param_2', (SELECTD00 ''), 'PRO-',), 'UUID(LACE(Pro'),
(REP 'Mate 60 T 1),LIMI_name='型号' am parbrary WHEREm_lict_paraoduOM t_prparam_id FR (SELECT PROD002',', ''), ', '-UUID()PLACE( '华为'),
(REIMIT 1),='品牌' L_namearamHERE py W_librarramct_pat_produm_id FROM ECT paraSEL2', (), 'PROD00 '-', ''UUID(),ACE(),
(REPLmAh''4422T 1), LIMI' e='电池容量namaram_ERE pibrary WHram_lproduct_pam_id FROM t_(SELECT para', ), 'PROD001 '-', ''),UID(PLACE(U,
(RE7 Pro')'A1' LIMIT 1), 'CPU型号m_name=paraERE  WH_libraryamuct_parOM t_prod_id FRparam (SELECT OD001', ''), 'PR'-',UID(), ACE(UREPL英寸'),
('6.71), IT  LIMame='屏幕尺寸'_nparam WHERE rary_lib_paramt_productOM param_id FR1', (SELECT , 'PROD00', ''), '-ID()REPLACE(UU),
(1), 'iOS'IT ='操作系统' LIMnameam_arERE plibrary WHm_oduct_para t_prm_id FROMpara(SELECT  'PROD001', '),-', ' 'ID(),LACE(UU),
(REPx'5 Pro MaiPhone 1 'LIMIT 1),ame='型号' HERE param_nibrary Wm_lroduct_para t_pam_id FROMCT parSELE001', ( 'PROD ''),',UID(), '-EPLACE(U '苹果'),
(RIT 1),e='品牌' LIM_namaramrary WHERE p_param_libroduct t_p FROMid param_CTLED001', (SERO 'P, '-', ''),E(UUID()LAC(REP) VALUES
lue``param_va, brary_id`ram_liuct_id`, `paid`, `prodam_value` (`_parO `t_productSERT INT==
IN=========================================================数据
-- =====28. 商品参数值表测试=======
-- ======================================================;

-- ===' LIMIT 1))电池容量='aram_name WHERE pam_librarypar_product_am_id FROM tELECT par001001', (S'CAT001, '-', ''), E(UUID()LAC,
(REPT 1))IMIe='存储' LamERE param_nlibrary WHt_param_roduct_pM d FROECT param_i(SEL1', T00100100), 'CA(), '-', ''IDREPLACE(UUMIT 1)),
(' LIname='内存ERE param_rary WHaram_libt_product_p FROM ram_idCT pa1', (SELE0001, 'CAT0010 '')'-',ID(), UU
(REPLACE()),MIT 1LI' ame='CPU型号ERE param_nrary WHt_param_libproducid FROM t_param_1', (SELECT 'CAT00100100''), ', (), '-(UUIDPLACE),
(RE寸' LIMIT 1)_name='屏幕尺amparWHERE library param_M t_product_aram_id FRO (SELECT p01001001','), 'CAT0, 'UUID(), '-'
(REPLACE(),LIMIT 1)系统' me='操作naHERE param_ Wrary_libamoduct_parpr_id FROM t_paramLECT 001', (SEAT001001'), 'C '-', 'D(),ACE(UUI,
(REPLMIT 1))色' LIname='颜am_y WHERE parlibraram_uct_parodM t_prm_id FRO paraLECT001001', (SE001, ''), 'CATUUID(), '-',
(REPLACE(MIT 1))型号' LIm_name='WHERE paraam_library parct_odu FROM t_prT param_id(SELEC1001', , 'CAT00100, '')-', '()(UUIDLACE1)),
(REPT MI牌' LIme='品E param_nalibrary WHERram__product_paid FROM tm_ECT para(SEL001001001', , 'CAT), '-', '')LACE(UUID(REP
(LUES VAry_id`)am_libra`parry_id`,  `categoaram` (`id`,ory_pO `t_categ
INSERT INT==============================================================数据
-- ==表测试27. 分类参数关联===
-- =========================================================

-- ====23:59:59');2-31 5-1, '202ORDER002'Y), 'NTERVAL 1 DA IW(),E_SUB(NOAY), 1, DATAL 3 D(), INTERV_SUB(NOWTE 1000.00, DA.00, 0.00,00', 1, 200享满1000减2 1), '手机专00' LIMIT享满1000减2n_name='手机专ERE coupo WHt_coupond FROM T coupon_iLECT003', (SE, ''), 'CUS, '-'ID()E(UU
(REPLAC:59:59'),5-06-30 23L, '202, NUL), 0, NULL DAYRVAL 5TE(NOW(), IN DATE_SUB 500.00, 0.80,', 2, 0.00,1), '数码产品8折券T 产品8折券' LIMIme='数码E coupon_nacoupon WHERt_d FROM CT coupon_i, (SELE), 'CUST002'), '-', ''PLACE(UUID(RE DAY)),
(INTERVAL 7 DAY),  INTERVAL 15NOW(),_SUB(E_ADD(DATENULL, DAT NULL,  15 DAY), 0,VALNOW(), INTERB(_SU, DATE0, 0.0000, 0.050.', 3, 1), '新用户专享券户专享券' LIMIT n_name='新用 WHERE coupouponOM t_con_id FRupoco(SELECT 02',  ''), 'CUST0',(), '-UUIDLACE(EP'),
(R31 23:59:59025-12- '2NULL,, 0, NULL, ERVAL 8 DAY), INTW()DATE_SUB(NO 300.00, 00,00, 0.减50', 1, 50.00, '满30' LIMIT 1)me='满300减5upon_naRE coon WHE FROM t_couppon_idT cou (SELEC'CUST001','), (), '-', 'CE(UUID
(REPLAY)),RVAL 7 DAY), INTEERVAL 10 DA(NOW(), INTADD(DATE_SUB01', DATE_DER0Y), 'OR5 DATERVAL NOW(), INSUB(, DATE_), 1ERVAL 10 DAYNT), ISUB(NOW(0, DATE_0.0.00, 0.00, 50用户专享券', 3, T 1), '新享券' LIMI新用户专n_name='WHERE coupon ROM t_coupo Fn_idECT coupo1', (SELT00'CUS'-', ''), (UUID(), 
(REPLACEVALUESre_time`) d`, `expier_i_time`, `ordtatus`, `use_s`, `usemeeive_timount`, `rec, `min_aount_rate`nt`, `disccount_amou`disupon_type`, name`, `cooupon_pon_id`, `cr_id`, `cou`, `customeupon_id_co(`userr_coupon`  INTO `t_use===
INSERT========================================================据
-- =====表测试数 用户优惠券====
-- 26.=======================================================
-- ===== NULL);
ULL, NULL,, NVAL 1 HOUR)TERUB(NOW(), IN_S, 2, 1, DATE 600', 52,午场 14:0ro', '60 P), '华为Mate IT 1' LIMd='PROD002roduct_iERE puct WHsh_sale_prodM t_fla_id FROoduct_sale_prflash, (SELECT , '')), '-'ACE(UUID(),
(REPL NULLLL, NULL, NU),OURERVAL 2 H(), INT(NOWDATE_SUB, 2, 1, 65, 70 10:00', Max', '早场one 15 Pro ), 'iPhIMIT 1PROD001' Lt_id='ducprot WHERE sale_product_flash_uct_id FROM rodash_sale_pELECT fl(S), '-', '', ACE(UUID()EPLUES
(RALdle_note`) Vndler`, `han_time`, `hame`, `handle`alert_tirt_status`, evel`, `alealert_lreshold`, ``alert_th_stock`,  `currentslot_name`,time_ct_name`, `, `produroduct_id`ale_psh_s `flaalert_id`, (`ock_alert`_st_saleO `t_flashINSERT INT=========
==============================================- =========测试数据
-. 秒杀库存预警表
-- 25==========================================================
-- ======1);
, 3, 10, 00, 2899.00, 5 1环8', 299.00,, '小米手'PROD007'),  LIMIT 1ame='全天场'slot_n WHERE time__time_slotsaleflash_OM t_lot_id FR_sCT timeIT 1), (SELE='周末狂欢' LIMnametivity_ERE acle WHh_sa t_flase_id FROMlash_salELECT f'), (S, ' '-'D(),PLACE(UUI),
(RE, 2, 1, 3, 56, 1209.0049900, , 5999.4 Ultra'OD003', '小米1IT 1), 'PR20:00' LIMt_name='晚场 _sloRE timet WHEe_time_slot_flash_salFROM e_slot_id T tim1), (SELEC LIMIT _name='新年秒杀'vitytiace WHERE sh_salfla FROM t_e_idlash_salT f''), (SELEC'-', CE(UUID(), 
(REPLA, 2), 28, 1, 1.00, 80,99.00, 599960 Pro', 69'华为Mate 2', PROD00MIT 1), '午场 14:00' LIe='_slot_namtimeE t WHERle_time_slo_saFROM t_flashlot_id e_sECT tim (SEL' LIMIT 1),e='新年秒杀ty_namERE activie WH_salFROM t_flashle_id  flash_sa (SELECT', ''),(UUID(), '-EPLACE
(R1, 1), 35, 1, 999.00, 100,, 9999.00, 815 Pro Max'Phone  'i1',OD00, 'PRIMIT 1)'早场 10:00' Lame=ot_nE time_slme_slot WHER_tit_flash_saleOM lot_id FR time_sLECT), (SE杀' LIMIT 1='新年秒ctivity_nameWHERE alash_sale FROM t_fh_sale_id ELECT flas-', ''), (S 'UUID(),PLACE(ALUES
(RErder`) V, `sort_otus`roduct_star_user`, `plimit_peld_count`, `ck`, `sosto, `total_e_price`sal`, `flash__priceinalorigame`, ``product_nroduct_id`, lot_id`, `pime_se_id`, `tash_saluct_id`, `flodash_sale_prct` (`fldu_prot_flash_saleNSERT INTO `
I========================================================
-- ========表测试数据杀商品
-- 24. 秒============================================================

-- ==== 1, 1);3:59:59', '200:00:00',', '天场IT 1), '全'周末狂欢' LIMname=E activity_sh_sale WHEROM t_flaid FRsh_sale_fla, (SELECT ', '')(UUID(), '-CE),
(REPLA, 1, 3, '21:59:59'0:00:00'场 20:00', '2T 1), '晚秒杀' LIMI_name='新年ityHERE activflash_sale Wid FROM t_le__saLECT flashSE '-', ''), (D(),ACE(UUI),
(REPL59:59', 1, 2', '15:, '14:00:004:00', '午场 1 1)秒杀' LIMITme='新年tivity_naE ac_sale WHERM t_flash FROsale_idsh_ fla), (SELECT, '-', ''UUID()
(REPLACE(1),', 1, :5900', '11:59:00:00', '10场 10:IT 1), '早杀' LIMname='新年秒E activity_WHER_flash_sale le_id FROM tsh_sa fla), (SELECT '-', ''D(),E(UUI(REPLAC
VALUES) t_order`tatus`, `sor`slot_s`, _time`, `end`start_time_name`, `time_slotid`, _sale_`flash_slot_id`, (`timet` lo_sh_sale_timeasINTO `t_flRT =
INSE======================================================== =======试数据
--. 秒杀时间段表测==
-- 23============================================================
-- ==);
理员''系统管, 'admin', , 3 0, 0',:5923:590 '2025-01-100:00', 5-01-10 00:', '202秒杀', '品牌专场秒杀牌日), '品), '-', ''ID(LACE(UU(REP管理员'),
, '系统dmin', 'a9', 1, 0, 2:55 23:59 '2025-01-00:00',5-01-04 00:0202 '',周末特惠秒杀活动 '周末狂欢', ', ''),D(), '-'REPLACE(UUI,
(')in', '系统管理员 0, 1, 'adm, 1,23:59:59'5-01-31 ', '20201 00:00:005-01-秒杀', '202特惠，限时新年秒杀', '新年'-', ''), 'CE(UUID(), UES
(REPLAd_name`) VALte`creaed_by`, er`, `creat`sort_ordrol`, ontual_ctatus`, `manactivity_sime`, `nd_tt_time`, `earst `c`,des, `activity_y_name`ctivite_id`, `a(`flash_salsh_sale` `t_flaO NSERT INT=========
I===================================================== ==据
--2. 秒杀活动表测试数=
-- 2==========================================================

-- =====);in', '系统管理员' 890, 'adm9',59:55-12-31 23:'2020', :001 00:005-01- 1, '202AT001', 1,LL, 'C001', 2, NUATtegory/C '/ca.jpg',-sidebard/digital'/uploads/a), '首页侧边栏', IT 1' LIMhome_sidebarode='n_citioRE pososition WHEad_pROM t_ Fposition_idLECT SE '数码产品专场', (''),-', ID(), 'E(UUREPLAC,
( '系统管理员')',0, 'admin, 123 23:59:59'5-03-3102:00', '2-01 00:00025-01 2, '22', NULL, 1, 'PROD00, 1,2'D00uct/PRO', '/prodr.jpge60-banne/ad/mat'/uploads'首页轮播图',  LIMIT 1), ome_banner'de='h position_coWHEREposition  FROM t_ad__idECT positionro', (SELte 60 P, ''), '华为MaID(), '-'PLACE(UU管理员'),
(REmin', '系统 'ad1580,59', -31 23:59:-03025, '2 00:00:00'5-01-01, '202L, 1, 1 NULOD001', 1, 'PRct/PROD001',produer.jpg', '/e15-banniphond/s/aload首页轮播图', '/up), 'IT 1_banner' LIMode='homeition_cosn WHERE pt_ad_positioon_id FROM CT positi, (SELE新品上市'ne 15 ''), 'iPho-', (UUID(), 'ES
(REPLACE`) VALUd_nameeate, `cry`ed_bt`, `creatclick_counme`, `d_ti`ent_time`, ar`, `strdersort_ostatus`, `ry_id`, `ad_gotarget_cate `t_id`,roduc`target_pype`, nk`, `ad_tlie`, `ad_imagame`, `ad_ion_n_id`, `positposition`ad_name`, `` (`ad_id`, nt_advertisemeNTO `t==
INSERT I========================================================== ====表测试数据
---- 21. 广告推荐=
=====================================================- ========== 1);

-0,告位', 800, 30情页广etail', '商品详t_d页', 'produc ''), '商品详情D(), '-',UUILACE(REP),
(, 200, 11200类页面顶部广告位', ory_top', '分页顶部', 'categ-', ''), '分类E(UUID(), 'LAC,
(REP 1), 400,', 300广告位'首页右侧边栏ar', me_sideb, 'ho首页侧边栏'', ''), 'ID(), '-REPLACE(UU0, 1),
(', 1920, 60页顶部轮播广告位er', '首, 'home_bann页轮播图', '首', '')E(UUID(), '-
(REPLACus`) VALUES, `statight``width`, `hen_desc`, e`, `positioion_codsitme`, `poon_naiti, `posposition_id`on` (`d_positi INTO `t_a===
INSERT=========================================================数据
-- ====0. 广告位置表测试=
-- 2============================================================);

-- ===管理员'', '系统:59', 'admin 23:5931, '2025-12-:00'00:0001  '2025-01-"]', 1, 3,,"PROD014"PROD013"OD004",码产品', '["PR'提升办公效率的数e.jpg', offic/topic/ploads'/u, 办公好物推荐'''), ', '-', ID()LACE(UU),
(REP '系统管理员'admin',59', '1 23:59:, '2025-12-300:00'-01 00:2, '2025-01"]', 1, ","PROD008'["PROD007、手环全场8折', 能手表.jpg', '智bleearapic/woads/to穿戴专场', '/upl''), '智能UID(), '-', (U(REPLACE员'),
系统管理min', ''ad23:59:59', 5-02-28 02, '2 00:00:00'025-01-011, '2', 1, "PROD012"]"PROD011",003","PRODROD002",001","P '["PROD大促销',惠，热门手机年特r.jpg', '新ewyea/noads/topic '/upl年换新机', ''), '新'-',UUID(), PLACE(LUES
(RE VA_name`)ated_by`, `created `cretime`,d_e`, `en, `start_timer`_ordsorttus`, `mmend_staco`reds`, duct_i`, `proopic_desc`, `tmage, `topic_iic_name``, `topmend_id`recomend` (ommecpic_rt_toINTO `INSERT =========
=======================================================-- 题推荐表测试数据
=
-- 19. 专=======================================================-- ========
理员');
系统管, 'admin', '23:59:59'31 2-5-1020:00:00', '2-01-01 0, '20253200, 1, 39999.00, 1.jpg', ne15-e.com/ipho://examplx', 'httpse 15 Pro Ma1', 'iPhon), 'PROD00, ''), '-'EPLACE(UUID('),
(R', '系统管理员


-- ================================================================
-- 4. 商品参数库表测试数据
-- ================================================================
INSERT INTO `t_product_param_library` (`param_id`, `param_name`, `param_type`, `param_values`, `param_category`, `sort_order`, `status`) VALUES
(REPLACE(UUID(), '-', ''), '品牌', 'input', NULL, '基本参数', 1, 1),
(REPLACE(UUID(), '-', ''), '型号', 'input', NULL, '基本参数', 2, 1),
(REPLACE(UUID(), '-', ''), '颜色', 'select', '["黑色","白色","金色","银色","蓝色","红色"]', '基本参数', 3, 1),
(REPLACE(UUID(), '-', ''), '上市时间', 'input', NULL, '主体参数', 1, 1),
(REPLACE(UUID(), '-', ''), '操作系统', 'select', '["iOS","Android","HarmonyOS","Windows","macOS"]', '主体参数', 2, 1),
(REPLACE(UUID(), '-', ''), '屏幕尺寸', 'input', NULL, '屏幕参数', 1, 1),
(REPLACE(UUID(), '-', ''), '分辨率', 'select', '["1920x1080","2560x1440","3840x2160"]', '屏幕参数', 2, 1),
(REPLACE(UUID(), '-', ''), '刷新率', 'select', '["60Hz","90Hz","120Hz","144Hz"]', '屏幕参数', 3, 1),
(REPLACE(UUID(), '-', ''), 'CPU型号', 'input', NULL, '性能参数', 1, 1),
(REPLACE(UUID(), '-', ''), '内存', 'select', '["4GB","6GB","8GB","12GB","16GB","32GB"]', '性能参数', 2, 1),
(REPLACE(UUID(), '-', ''), '存储', 'select', '["64GB","128GB","256GB","512GB","1TB"]', '性能参数', 3, 1),
(REPLACE(UUID(), '-', ''), '电池容量', 'input', NULL, '电池参数', 1, 1),
(REPLACE(UUID(), '-', ''), '充电功率', 'input', NULL, '电池参数', 2, 1);

-- ================================================================
-- 5. 分类属性表测试数据（SKU规格配置）
-- ================================================================
INSERT INTO `t_category_attribute` (`attr_id`, `category_id`, `attr_name`, `predefined_values`, `allow_custom`, `is_required`, `sort_order`) VALUES
(REPLACE(UUID(), '-', ''), 'CAT001001001', '颜色', '["深空黑","银色","金色","天蓝色"]', 1, 1, 1),
(REPLACE(UUID(), '-', ''), 'CAT001001001', '存储容量', '["128GB","256GB","512GB","1TB"]', 0, 1, 2),
(REPLACE(UUID(), '-', ''), 'CAT001001002', '颜色', '["曜金黑","雅川青","雪域白"]', 1, 1, 1),
(REPLACE(UUID(), '-', ''), 'CAT001001002', '存储容量', '["256GB","512GB","1TB"]', 0, 1, 2),
(REPLACE(UUID(), '-', ''), 'CAT001001003', '颜色', '["黑色","白色","蓝色"]', 1, 1, 1),
(REPLACE(UUID(), '-', ''), 'CAT001001003', '存储容量', '["128GB","256GB","512GB"]', 0, 1, 2),
(REPLACE(UUID(), '-', ''), 'CAT001002', '颜色', '["深空灰","银色","玫瑰金"]', 1, 1, 1),
(REPLACE(UUID(), '-', ''), 'CAT001002', '存储容量', '["64GB","256GB","512GB"]', 0, 1, 2),
(REPLACE(UUID(), '-', ''), 'CAT001004001', '表带颜色', '["黑色","白色","蓝色","红色"]', 1, 1, 1),
(REPLACE(UUID(), '-', ''), 'CAT001004002', '表带颜色', '["黑色","橙色","绿色"]', 1, 1, 1);

-- ================================================================
-- 6. 商品表测试数据（SPU）
-- ================================================================
INSERT INTO `t_product` (`product_id`, `product_name`, `product_images`, `product_detail`, `category_id`, `category_l1_id`, `category_l2_id`, `category_l3_id`, `brand_id`, `price`, `item_number`, `inventory`, `status`, `shelf_status`, `sort_order`, `audit_status`) VALUES
('PROD001', 'iPhone 15 Pro Max', '["https://example.com/iphone15-1.jpg","https://example.com/iphone15-2.jpg"]', '<p>全新A17 Pro芯片，钛金属边框设计</p>', 'CAT001001001', 'CAT001', 'CAT001001', 'CAT001001001', 'BRAND001', 9999.00, 'IP15PM001', 500, 1, 1, 1, 1),
('PROD002', '华为Mate 60 Pro', '["https://example.com/mate60-1.jpg","https://example.com/mate60-2.jpg"]', '<p>卫星通信，麒麟芯片回归</p>', 'CAT001001002', 'CAT001', 'CAT001001', 'CAT001001002', 'BRAND002', 6999.00, 'HWM60P001', 300, 1, 1, 2, 1),
('PROD003', '小米14 Ultra', '["https://example.com/mi14-1.jpg","https://example.com/mi14-2.jpg"]', '<p>徕卡光学镜头，骁龙8 Gen3</p>', 'CAT001001003', 'CAT001', 'CAT001001', 'CAT001001003', 'BRAND003', 5999.00, 'MI14U001', 400, 1, 1, 3, 1),
('PROD004', 'MacBook Pro M3', '["https://example.com/macbook-1.jpg"]', '<p>M3芯片，性能提升40%</p>', 'CAT001003', 'CAT001', 'CAT001003', NULL, 'BRAND001', 14999.00, 'MBPM3001', 200, 1, 1, 4, 1),
('PROD005', 'iPad Air 6', '["https://example.com/ipad-1.jpg"]', '<p>M2芯片，支持Apple Pencil</p>', 'CAT001002', 'CAT001', 'CAT001002', NULL, 'BRAND001', 4999.00, 'IPA6001', 350, 1, 1, 5, 1),
('PROD006', 'AirPods Pro 2', '["https://example.com/airpods-1.jpg"]', '<p>主动降噪，空间音频</p>', 'CAT001', 'CAT001', NULL, NULL, 'BRAND001', 1999.00, 'APP2001', 800, 1, 1, 6, 1),
('PROD007', '小米手环8', '["https://example.com/miband-1.jpg"]', '<p>健康监测，超长续航</p>', 'CAT001004002', 'CAT001', 'CAT001004', 'CAT001004002', 'BRAND003', 299.00, 'MIB8001', 1000, 1, 1, 7, 1),
('PROD008', '华为Watch GT 4', '["https://example.com/watch-1.jpg"]', '<p>专业运动监测</p>', 'CAT001004001', 'CAT001', 'CAT001004', 'CAT001004001', 'BRAND002', 1499.00, 'HWWGT4001', 600, 1, 1, 8, 1),
('PROD009', 'iPad 10', '["https://example.com/ipad10-1.jpg"]', '<p>性价比之选</p>', 'CAT001002', 'CAT001', 'CAT001002', NULL, 'BRAND001', 3499.00, 'IP10001', 450, 1, 1, 9, 1),
('PROD010', '小米电视65寸', '["https://example.com/tv-1.jpg"]', '<p>4K超清，120Hz刷新率</p>', 'CAT002001', 'CAT002', 'CAT002001', NULL, 'BRAND003', 2999.00, 'MITV65001', 250, 1, 1, 10, 1),
('PROD011', 'Samsung Galaxy S24', '["https://example.com/s24-1.jpg"]', '<p>AI手机新标杆</p>', 'CAT001001', 'CAT001', 'CAT001001', NULL, 'BRAND004', 5499.00, 'SGS24001', 350, 1, 1, 11, 1),
('PROD012', 'OPPO Find X7', '["https://example.com/findx7-1.jpg"]', '<p>哈苏影像系统</p>', 'CAT001001', 'CAT001', 'CAT001001', NULL, 'BRAND005', 4999.00, 'OPFX7001', 280, 1, 1, 12, 1),
('PROD013', '联想ThinkPad X1', '["https://example.com/thinkpad-1.jpg"]', '<p>商务笔记本首选</p>', 'CAT001003', 'CAT001', 'CAT001003', NULL, 'BRAND007', 8999.00, 'LVTPX1001', 150, 1, 1, 13, 1),
('PROD014', '戴尔XPS 15', '["https://example.com/xps-1.jpg"]', '<p>创作者笔记本</p>', 'CAT001003', 'CAT001', 'CAT001003', NULL, 'BRAND008', 12999.00, 'DLXPS15001', 120, 1, 1, 14, 1),
('PROD015', '海尔冰箱', '["https://example.com/fridge-1.jpg"]', '<p>智能保鲜</p>', 'CAT002002', 'CAT002', 'CAT002002', NULL, 'BRAND009', 3999.00, 'HRFG001', 80, 1, 1, 15, 1);

-- ================================================================
-- 7. 商品SKU表测试数据
-- ================================================================
INSERT INTO `t_product_sku` (`sku_id`, `product_id`, `sku_name`, `sku_code`, `sku_attributes`, `price`, `promotion_price`, `inventory`, `stock_alert`, `image_url`, `status`) VALUES
(REPLACE(UUID(), '-', ''), 'PROD001', 'iPhone 15 Pro Max 深空黑 256GB', 'IP15PM-BLACK-256', '{"颜色":"深空黑","存储容量":"256GB"}', 9999.00, 9499.00, 150, 50, 'https://example.com/iphone15-black.jpg', 1),
(REPLACE(UUID(), '-', ''), 'PROD001', 'iPhone 15 Pro Max 深空黑 512GB', 'IP15PM-BLACK-512', '{"颜色":"深空黑","存储容量":"512GB"}', 11999.00, 11499.00, 120, 50, 'https://example.com/iphone15-black.jpg', 1),
(REPLACE(UUID(), '-', ''), 'PROD001', 'iPhone 15 Pro Max 银色 256GB', 'IP15PM-SILVER-256', '{"颜色":"银色","存储容量":"256GB"}', 9999.00, 9499.00, 130, 50, 'https://example.com/iphone15-silver.jpg', 1),
(REPLACE(UUID(), '-', ''), 'PROD001', 'iPhone 15 Pro Max 银色 512GB', 'IP15PM-SILVER-512', '{"颜色":"银色","存储容量":"512GB"}', 11999.00, 11499.00, 100, 50, 'https://example.com/iphone15-silver.jpg', 1),
(REPLACE(UUID(), '-', ''), 'PROD002', '华为Mate 60 Pro 曜金黑 512GB', 'HWM60P-BLACK-512', '{"颜色":"曜金黑","存储容量":"512GB"}', 6999.00, NULL, 100, 30, 'https://example.com/mate60-black.jpg', 1),
(REPLACE(UUID(), '-', ''), 'PROD002', '华为Mate 60 Pro 雅川青 512GB', 'HWM60P-GREEN-512', '{"颜色":"雅川青","存储容量":"512GB"}', 6999.00, NULL, 80, 30, 'https://example.com/mate60-green.jpg', 1),
(REPLACE(UUID(), '-', ''), 'PROD002', '华为Mate 60 Pro 雪域白 512GB', 'HWM60P-WHITE-512', '{"颜色":"雪域白","存储容量":"512GB"}', 6999.00, NULL, 120, 30, 'https://example.com/mate60-white.jpg', 1),
(REPLACE(UUID(), '-', ''), 'PROD003', '小米14 Ultra 黑色 512GB', 'MI14U-BLACK-512', '{"颜色":"黑色","存储容量":"512GB"}', 5999.00, 5699.00, 150, 40, 'https://example.com/mi14-black.jpg', 1),
(REPLACE(UUID(), '-', ''), 'PROD003', '小米14 Ultra 白色 512GB', 'MI14U-WHITE-512', '{"颜色":"白色","存储容量":"512GB"}', 5999.00, 5699.00, 130, 40, 'https://example.com/mi14-white.jpg', 1),
(REPLACE(UUID(), '-', ''), 'PROD003', '小米14 Ultra 蓝色 512GB', 'MI14U-BLUE-512', '{"颜色":"蓝色","存储容量":"512GB"}', 5999.00, 5699.00, 120, 40, 'https://example.com/mi14-blue.jpg', 1);


-- ================================================================
-- 8. 角色表测试数据
-- ================================================================
INSERT INTO `t_role` (`role_id`, `role_name`, `role_code`, `role_desc`, `status`) VALUES
(REPLACE(UUID(), '-', ''), '超级管理员', 'super_admin', '拥有系统所有权限', 1),
(REPLACE(UUID(), '-', ''), '运营人员', 'operator', '负责商品管理、订单处理等运营工作', 1),
(REPLACE(UUID(), '-', ''), '客服人员', 'customer_service', '负责客户咨询、售后处理', 1),
(REPLACE(UUID(), '-', ''), '审核人员', 'auditor', '负责商品审核、内容审核', 1),
(REPLACE(UUID(), '-', ''), '财务人员', 'finance', '负责财务管理、对账结算', 1);

-- ================================================================
-- 9. 用户表测试数据（管理员）
-- ================================================================
INSERT IGNORE INTO `t_user` (`user_id`, `username`, `password`, `nickname`, `email`, `sex`, `desc`, `status`, `last_login_time`) VALUES
('admin', 'admin', '$2b$10$5TCJw4wl1IZBEF9nBzPIZODShHCSujXhJ0uRfLHcdR82DqAj7Aqo6', '系统管理员', 'admin@example.com', 1, '系统管理员账号', 1, NOW()),
('user001', 'zhangsan', '$2b$10$5TCJw4wl1IZBEF9nBzPIZODShHCSujXhJ0uRfLHcdR82DqAj7Aqo6', '张三', 'zhangsan@example.com', 1, '运营人员', 1, DATE_SUB(NOW(), INTERVAL 1 DAY)),
('user002', 'lisi', '$2b$10$5TCJw4wl1IZBEF9nBzPIZODShHCSujXhJ0uRfLHcdR82DqAj7Aqo6', '李四', 'lisi@example.com', 2, '客服人员', 1, DATE_SUB(NOW(), INTERVAL 2 DAY)),
('user003', 'wangwu', '$2b$10$5TCJw4wl1IZBEF9nBzPIZODShHCSujXhJ0uRfLHcdR82DqAj7Aqo6', '王五', 'wangwu@example.com', 1, '审核人员', 1, DATE_SUB(NOW(), INTERVAL 3 DAY));

-- ================================================================
-- 10. 角色菜单权限表测试数据
-- ================================================================
INSERT INTO `t_role_menu` (`role_id`, `menu_key`, `project_key`) VALUES
-- 超级管理员拥有所有权限
((SELECT role_id FROM t_role WHERE role_code='super_admin' LIMIT 1), 'product', 'business'),
((SELECT role_id FROM t_role WHERE role_code='super_admin' LIMIT 1), 'product-list', 'business'),
((SELECT role_id FROM t_role WHERE role_code='super_admin' LIMIT 1), 'product-config', 'business'),
((SELECT role_id FROM t_role WHERE role_code='super_admin' LIMIT 1), 'product-category', 'business'),
((SELECT role_id FROM t_role WHERE role_code='super_admin' LIMIT 1), 'product-brand', 'business'),
((SELECT role_id FROM t_role WHERE role_code='super_admin' LIMIT 1), 'marketing', 'business'),
((SELECT role_id FROM t_role WHERE role_code='super_admin' LIMIT 1), 'coupon-list', 'business'),
((SELECT role_id FROM t_role WHERE role_code='super_admin' LIMIT 1), 'product-audit', 'business'),
((SELECT role_id FROM t_role WHERE role_code='super_admin' LIMIT 1), 'user', 'business-personnel'),
((SELECT role_id FROM t_role WHERE role_code='super_admin' LIMIT 1), 'customer', 'business-personnel'),
((SELECT role_id FROM t_role WHERE role_code='super_admin' LIMIT 1), 'role', 'business-personnel');

-- ================================================================
-- 11. 优惠券表测试数据
-- ================================================================
INSERT INTO `t_coupon` (`coupon_id`, `coupon_name`, `coupon_type`, `discount_amount`, `discount_rate`, `min_amount`, `max_discount`, `total_count`, `received_count`, `used_count`, `limit_per_user`, `valid_days`, `start_time`, `end_time`, `coupon_status`, `manual_control`, `applicable_products`, `applicable_categories`, `description`, `sort_order`, `status`, `created_by`) VALUES
(REPLACE(UUID(), '-', ''), '新用户专享券', 3, 50.00, 0.00, 0.00, 0.00, 10000, 3200, 1800, 1, 7, NULL, NULL, 1, 0, NULL, NULL, '新用户注册即可领取，全场通用', 1, 1, 'admin'),
(REPLACE(UUID(), '-', ''), '满300减50', 1, 50.00, 0.00, 300.00, 0.00, 5000, 2100, 980, 2, 0, '2025-01-01 00:00:00', '2025-12-31 23:59:59', 1, 0, NULL, NULL, '全场通用，满300元减50元', 2, 1, 'admin'),
(REPLACE(UUID(), '-', ''), '数码产品8折券', 2, 0.00, 0.80, 500.00, 200.00, 3000, 1500, 680, 1, 0, '2025-01-01 00:00:00', '2025-06-30 23:59:59', 1, 0, NULL, '["CAT001"]', '数码产品专享8折，最高优惠200元', 3, 1, 'admin'),
(REPLACE(UUID(), '-', ''), '手机专享满1000减200', 1, 200.00, 0.00, 1000.00, 0.00, 2000, 850, 420, 1, 0, '2025-01-01 00:00:00', '2025-12-31 23:59:59', 1, 0, '["PROD001","PROD002","PROD003"]', NULL, '指定手机商品可用', 4, 1, 'admin');

-- ================================================================
-- 12. 普通用户表测试数据
-- ================================================================
INSERT INTO `t_customer` (`customer_id`, `username`, `password`, `nickname`, `email`, `phone`, `avatar`, `gender`, `birthday`, `address`, `status`) VALUES
('CUST001', 'customer001', '$2b$10$5TCJw4wl1IZBEF9nBzPIZODShHCSujXhJ0uRfLHcdR82DqAj7Aqo6', '张小明', 'zhangxiaoming@example.com', '13800138001', '/uploads/avatar/user1.jpg', 1, '1990-05-15', '北京市朝阳区xxx街道xxx号', 1),
('CUST002', 'customer002', '$2b$10$5TCJw4wl1IZBEF9nBzPIZODShHCSujXhJ0uRfLHcdR82DqAj7Aqo6', '李小红', 'lixiaohong@example.com', '13800138002', '/uploads/avatar/user2.jpg', 2, '1992-08-20', '上海市浦东新区xxx路xxx号', 1),
('CUST003', 'customer003', '$2b$10$5TCJw4wl1IZBEF9nBzPIZODShHCSujXhJ0uRfLHcdR82DqAj7Aqo6', '王小刚', 'wangxiaogang@example.com', '13800138003', '/uploads/avatar/user3.jpg', 1, '1988-03-10', '广州市天河区xxx大道xxx号', 1);

-- ================================================================
-- 13. 库存预警日志表测试数据
-- ================================================================
INSERT INTO `t_stock_alert_log` (`alert_id`, `sku_id`, `product_id`, `product_name`, `sku_name`, `current_inventory`, `alert_threshold`, `alert_level`, `alert_status`, `alert_time`, `handle_time`, `handler`, `handle_note`, `restock_quantity`) VALUES
(REPLACE(UUID(), '-', ''), (SELECT sku_id FROM t_product_sku WHERE sku_code='IP15PM-BLACK-256' LIMIT 1), 'PROD001', 'iPhone 15 Pro Max', 'iPhone 15 Pro Max 深空黑 256GB', 45, 50, 2, 1, DATE_SUB(NOW(), INTERVAL 5 DAY), NULL, NULL, NULL, NULL),
(REPLACE(UUID(), '-', ''), (SELECT sku_id FROM t_product_sku WHERE sku_code='IP15PM-SILVER-512' LIMIT 1), 'PROD001', 'iPhone 15 Pro Max', 'iPhone 15 Pro Max 银色 512GB', 48, 50, 2, 1, DATE_SUB(NOW(), INTERVAL 3 DAY), NULL, NULL, NULL, NULL),
(REPLACE(UUID(), '-', ''), (SELECT sku_id FROM t_product_sku WHERE sku_code='HWM60P-GREEN-512' LIMIT 1), 'PROD002', '华为Mate 60 Pro', '华为Mate 60 Pro 雅川青 512GB', 25, 30, 1, 2, DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_SUB(NOW(), INTERVAL 6 DAY), 'user001', '已补货200件', 200),
(REPLACE(UUID(), '-', ''), (SELECT sku_id FROM t_product_sku WHERE sku_code='MI14U-BLUE-512' LIMIT 1), 'PROD003', '小米14 Ultra', '小米14 Ultra 蓝色 512GB', 38, 40, 2, 1, DATE_SUB(NOW(), INTERVAL 2 DAY), NULL, NULL, NULL, NULL);

-- ================================================================
-- 14. 商品审核表测试数据
-- ================================================================
INSERT INTO `t_product_audit` (`audit_id`, `product_id`, `product_name`, `category_name`, `brand_name`, `price`, `submit_time`, `audit_status`, `auditor_id`, `auditor_name`, `audit_time`, `audit_opinion`, `reject_reason`) VALUES
(REPLACE(UUID(), '-', ''), 'PROD001', 'iPhone 15 Pro Max', '数码产品/手机/苹果手机', '苹果', 9999.00, DATE_SUB(NOW(), INTERVAL 10 DAY), 1, 'user003', '王五', DATE_SUB(NOW(), INTERVAL 9 DAY), '商品信息完整，图片清晰，审核通过', NULL),
(REPLACE(UUID(), '-', ''), 'PROD002', '华为Mate 60 Pro', '数码产品/手机/华为手机', '华为', 6999.00, DATE_SUB(NOW(), INTERVAL 8 DAY), 1, 'user003', '王五', DATE_SUB(NOW(), INTERVAL 7 DAY), '商品描述详细，审核通过', NULL),
(REPLACE(UUID(), '-', ''), 'PROD003', '小米14 Ultra', '数码产品/手机/小米手机', '小米', 5999.00, DATE_SUB(NOW(), INTERVAL 6 DAY), 1, 'user003', '王五', DATE_SUB(NOW(), INTERVAL 5 DAY), '商品参数齐全，审核通过', NULL),
(REPLACE(UUID(), '-', ''), 'PROD004', 'MacBook Pro M3', '数码产品/笔记本电脑', '苹果', 14999.00, DATE_SUB(NOW(), INTERVAL 4 DAY), 1, 'user003', '王五', DATE_SUB(NOW(), INTERVAL 3 DAY), '商品信息准确，审核通过', NULL);

-- ================================================================
-- 15. 商品删除日志表测试数据
-- ================================================================
INSERT INTO `t_product_delete_log` (`delete_id`, `product_id`, `product_name`, `category_name`, `brand_name`, `price`, `inventory`, `delete_reason`, `delete_time`, `operator_id`, `operator_name`, `restore_time`, `restore_operator_id`, `restore_operator_name`, `permanent_delete_time`, `permanent_delete_operator_id`, `permanent_delete_operator_name`) VALUES
(REPLACE(UUID(), '-', ''), 'PROD_DEL001', '测试商品1', '数码产品/手机', '测试品牌', 999.00, 0, '库存清零，商品下架', DATE_SUB(NOW(), INTERVAL 30 DAY), 'user001', '张三', NULL, NULL, NULL, NULL, NULL, NULL),
(REPLACE(UUID(), '-', ''), 'PROD_DEL002', '测试商品2', '数码产品/平板电脑', '测试品牌', 1999.00, 0, '商品停产', DATE_SUB(NOW(), INTERVAL 60 DAY), 'user001', '张三', DATE_SUB(NOW(), INTERVAL 50 DAY), 'user001', '张三', NULL, NULL, NULL);


-- ================================================================
-- 16. 品牌推荐表测试数据
-- ================================================================
INSERT INTO `t_brand_recommend` (`recommend_id`, `brand_id`, `brand_name`, `brand_logo`, `recommend_status`, `sort_order`, `start_time`, `end_time`, `created_by`, `created_name`) VALUES
(REPLACE(UUID(), '-', ''), 'BRAND001', '苹果', '/uploads/brand/apple-logo.jpg', 1, 1, '2025-01-01 00:00:00', '2025-12-31 23:59:59', 'admin', '系统管理员'),
(REPLACE(UUID(), '-', ''), 'BRAND002', '华为', '/uploads/brand/huawei-logo.jpg', 1, 2, '2025-01-01 00:00:00', '2025-12-31 23:59:59', 'admin', '系统管理员'),
(REPLACE(UUID(), '-', ''), 'BRAND003', '小米', '/uploads/brand/xiaomi-logo.jpg', 1, 3, '2025-01-01 00:00:00', '2025-12-31 23:59:59', 'admin', '系统管理员'),
(REPLACE(UUID(), '-', ''), 'BRAND004', '三星', '/uploads/brand/samsung-logo.jpg', 1, 4, '2025-01-01 00:00:00', '2025-12-31 23:59:59', 'admin', '系统管理员');

-- ================================================================
-- 17. 新品推荐表测试数据
-- ================================================================
INSERT INTO `t_new_product_recommend` (`recommend_id`, `product_id`, `product_name`, `product_image`, `price`, `recommend_status`, `sort_order`, `start_time`, `end_time`, `created_by`, `created_name`) VALUES
(REPLACE(UUID(), '-', ''), 'PROD001', 'iPhone 15 Pro Max', 'https://example.com/iphone15-1.jpg', 9999.00, 1, 1, '2025-01-01 00:00:00', '2025-03-31 23:59:59', 'admin', '系统管理员'),
(REPLACE(UUID(), '-', ''), 'PROD002', '华为Mate 60 Pro', 'https://example.com/mate60-1.jpg', 6999.00, 1, 2, '2025-01-01 00:00:00', '2025-03-31 23:59:59', 'admin', '系统管理员'),
(REPLACE(UUID(), '-', ''), 'PROD003', '小米14 Ultra', 'https://example.com/mi14-1.jpg', 5999.00, 1, 3, '2025-01-01 00:00:00', '2025-03-31 23:59:59', 'admin', '系统管理员');

-- ================================================================
-- 18. 人气推荐表测试数据
-- ================================================================
INSERT INTO `t_popular_product_recommend` (`recommend_id`, `product_id`, `product_name`, `product_image`, `price`, `sales_count`, `recommend_status`, `sort_order`, `start_time`, `end_time`, `created_by`, `created_name`) VALUES
(REPLACE(UUID(), '-', ''), 'PROD006', 'AirPods Pro 2', 'https://example.com/airpods-1.jpg', 1999.00, 5800, 1, 1, '2025-01-01 00:00:00', '2025-12-31 23:59:59', 'admin', '系统管理员'),
(REPLACE(UUID(), '-', ''), 'PROD007', '小米手环8', 'https://example.com/miband-1.jpg', 299.00, 12000, 1, 2, '2025-01-01 00:00:00', '2025-12-31 23:59:59', 'admin', '系统管理员'),
(REPLACE(UUID(), '-', ''), 'PROD001', 'iPhone 15 Pro Max', 'https://example.com/iphone15-1.jpg', 9999.00, 3200, 1, 3, '2025-01-01 00:00:00', '2025-12-31 23:59:59', 'admin', '系统管理员');

-- ================================================================
-- 19. 专题推荐表测试数据
-- ================================================================
INSERT INTO `t_topic_recommend` (`recommend_id`, `topic_name`, `topic_image`, `topic_desc`, `product_ids`, `recommend_status`, `sort_order`, `start_time`, `end_time`, `created_by`, `created_name`) VALUES
(REPLACE(UUID(), '-', ''), '新年换新机', '/uploads/topic/newyear.jpg', '新年特惠，热门手机大促销', '["PROD001","PROD002","PROD003","PROD011","PROD012"]', 1, 1, '2025-01-01 00:00:00', '2025-02-28 23:59:59', 'admin', '系统管理员'),
(REPLACE(UUID(), '-', ''), '智能穿戴专场', '/uploads/topic/wearable.jpg', '智能手表、手环全场8折', '["PROD007","PROD008"]', 1, 2, '2025-01-01 00:00:00', '2025-12-31 23:59:59', 'admin', '系统管理员'),
(REPLACE(UUID(), '-', ''), '办公好物推荐', '/uploads/topic/office.jpg', '提升办公效率的数码产品', '["PROD004","PROD013","PROD014"]', 1, 3, '2025-01-01 00:00:00', '2025-12-31 23:59:59', 'admin', '系统管理员');

-- ================================================================
-- 20. 广告位置表测试数据
-- ================================================================
INSERT INTO `t_ad_position` (`position_id`, `position_name`, `position_code`, `position_desc`, `width`, `height`, `status`) VALUES
(REPLACE(UUID(), '-', ''), '首页轮播图', 'home_banner', '首页顶部轮播广告位', 1920, 600, 1),
(REPLACE(UUID(), '-', ''), '首页侧边栏', 'home_sidebar', '首页右侧边栏广告位', 300, 400, 1),
(REPLACE(UUID(), '-', ''), '分类页顶部', 'category_top', '分类页面顶部广告位', 1200, 200, 1),
(REPLACE(UUID(), '-', ''), '商品详情页', 'product_detail', '商品详情页广告位', 800, 300, 1);

-- ================================================================
-- 21. 广告推荐表测试数据
-- ================================================================
INSERT INTO `t_advertisement` (`ad_id`, `ad_name`, `position_id`, `position_name`, `ad_image`, `ad_link`, `ad_type`, `target_product_id`, `target_category_id`, `ad_status`, `sort_order`, `start_time`, `end_time`, `click_count`, `created_by`, `created_name`) VALUES
(REPLACE(UUID(), '-', ''), 'iPhone 15 新品上市', (SELECT position_id FROM t_ad_position WHERE position_code='home_banner' LIMIT 1), '首页轮播图', '/uploads/ad/iphone15-banner.jpg', '/product/PROD001', 1, 'PROD001', NULL, 1, 1, '2025-01-01 00:00:00', '2025-03-31 23:59:59', 1580, 'admin', '系统管理员'),
(REPLACE(UUID(), '-', ''), '华为Mate 60 Pro', (SELECT position_id FROM t_ad_position WHERE position_code='home_banner' LIMIT 1), '首页轮播图', '/uploads/ad/mate60-banner.jpg', '/product/PROD002', 1, 'PROD002', NULL, 1, 2, '2025-01-01 00:00:00', '2025-03-31 23:59:59', 1230, 'admin', '系统管理员'),
(REPLACE(UUID(), '-', ''), '数码产品专场', (SELECT position_id FROM t_ad_position WHERE position_code='home_sidebar' LIMIT 1), '首页侧边栏', '/uploads/ad/digital-sidebar.jpg', '/category/CAT001', 2, NULL, 'CAT001', 1, 1, '2025-01-01 00:00:00', '2025-12-31 23:59:59', 890, 'admin', '系统管理员');

-- ================================================================
-- 22. 秒杀活动表测试数据
-- ================================================================
INSERT INTO `t_flash_sale` (`flash_sale_id`, `activity_name`, `activity_desc`, `start_time`, `end_time`, `activity_status`, `manual_control`, `sort_order`, `created_by`, `created_name`) VALUES
(REPLACE(UUID(), '-', ''), '新年秒杀', '新年特惠，限时秒杀', '2025-01-01 00:00:00', '2025-01-31 23:59:59', 1, 0, 1, 'admin', '系统管理员'),
(REPLACE(UUID(), '-', ''), '周末狂欢', '周末特惠秒杀活动', '2025-01-04 00:00:00', '2025-01-05 23:59:59', 1, 0, 2, 'admin', '系统管理员'),
(REPLACE(UUID(), '-', ''), '品牌日秒杀', '品牌专场秒杀', '2025-01-10 00:00:00', '2025-01-10 23:59:59', 0, 0, 3, 'admin', '系统管理员');

-- ================================================================
-- 23. 秒杀时间段表测试数据
-- ================================================================
INSERT INTO `t_flash_sale_time_slot` (`time_slot_id`, `flash_sale_id`, `time_slot_name`, `start_time`, `end_time`, `slot_status`, `sort_order`) VALUES
(REPLACE(UUID(), '-', ''), (SELECT flash_sale_id FROM t_flash_sale WHERE activity_name='新年秒杀' LIMIT 1), '早场 10:00', '10:00:00', '11:59:59', 1, 1),
(REPLACE(UUID(), '-', ''), (SELECT flash_sale_id FROM t_flash_sale WHERE activity_name='新年秒杀' LIMIT 1), '午场 14:00', '14:00:00', '15:59:59', 1, 2),
(REPLACE(UUID(), '-', ''), (SELECT flash_sale_id FROM t_flash_sale WHERE activity_name='新年秒杀' LIMIT 1), '晚场 20:00', '20:00:00', '21:59:59', 1, 3),
(REPLACE(UUID(), '-', ''), (SELECT flash_sale_id FROM t_flash_sale WHERE activity_name='周末狂欢' LIMIT 1), '全天场', '00:00:00', '23:59:59', 1, 1);

-- ================================================================
-- 24. 秒杀商品表测试数据
-- ================================================================
INSERT INTO `t_flash_sale_product` (`flash_sale_product_id`, `flash_sale_id`, `time_slot_id`, `product_id`, `product_name`, `original_price`, `flash_sale_price`, `total_stock`, `sold_count`, `limit_per_user`, `product_status`, `sort_order`) VALUES
(REPLACE(UUID(), '-', ''), (SELECT flash_sale_id FROM t_flash_sale WHERE activity_name='新年秒杀' LIMIT 1), (SELECT time_slot_id FROM t_flash_sale_time_slot WHERE time_slot_name='早场 10:00' LIMIT 1), 'PROD001', 'iPhone 15 Pro Max', 9999.00, 8999.00, 100, 35, 1, 1, 1),
(REPLACE(UUID(), '-', ''), (SELECT flash_sale_id FROM t_flash_sale WHERE activity_name='新年秒杀' LIMIT 1), (SELECT time_slot_id FROM t_flash_sale_time_slot WHERE time_slot_name='午场 14:00' LIMIT 1), 'PROD002', '华为Mate 60 Pro', 6999.00, 5999.00, 80, 28, 1, 1, 2),
(REPLACE(UUID(), '-', ''), (SELECT flash_sale_id FROM t_flash_sale WHERE activity_name='新年秒杀' LIMIT 1), (SELECT time_slot_id FROM t_flash_sale_time_slot WHERE time_slot_name='晚场 20:00' LIMIT 1), 'PROD003', '小米14 Ultra', 5999.00, 4999.00, 120, 56, 2, 1, 3),
(REPLACE(UUID(), '-', ''), (SELECT flash_sale_id FROM t_flash_sale WHERE activity_name='周末狂欢' LIMIT 1), (SELECT time_slot_id FROM t_flash_sale_time_slot WHERE time_slot_name='全天场' LIMIT 1), 'PROD007', '小米手环8', 299.00, 199.00, 500, 280, 3, 1, 1);

-- ================================================================
-- 25. 秒杀库存预警表测试数据
-- ================================================================
INSERT INTO `t_flash_sale_stock_alert` (`alert_id`, `flash_sale_product_id`, `product_name`, `time_slot_name`, `current_stock`, `alert_threshold`, `alert_level`, `alert_status`, `alert_time`, `handle_time`, `handler`, `handle_note`) VALUES
(REPLACE(UUID(), '-', ''), (SELECT flash_sale_product_id FROM t_flash_sale_product WHERE product_id='PROD001' LIMIT 1), 'iPhone 15 Pro Max', '早场 10:00', 65, 70, 2, 1, DATE_SUB(NOW(), INTERVAL 2 HOUR), NULL, NULL, NULL),
(REPLACE(UUID(), '-', ''), (SELECT flash_sale_product_id FROM t_flash_sale_product WHERE product_id='PROD002' LIMIT 1), '华为Mate 60 Pro', '午场 14:00', 52, 60, 2, 1, DATE_SUB(NOW(), INTERVAL 1 HOUR), NULL, NULL, NULL);

-- ================================================================
-- 26. 用户优惠券表测试数据
-- ================================================================
INSERT INTO `t_user_coupon` (`user_coupon_id`, `customer_id`, `coupon_id`, `coupon_name`, `coupon_type`, `discount_amount`, `discount_rate`, `min_amount`, `receive_time`, `use_status`, `use_time`, `order_id`, `expire_time`) VALUES
(REPLACE(UUID(), '-', ''), 'CUST001', (SELECT coupon_id FROM t_coupon WHERE coupon_name='新用户专享券' LIMIT 1), '新用户专享券', 3, 50.00, 0.00, 0.00, DATE_SUB(NOW(), INTERVAL 10 DAY), 1, DATE_SUB(NOW(), INTERVAL 5 DAY), 'ORDER001', DATE_ADD(DATE_SUB(NOW(), INTERVAL 10 DAY), INTERVAL 7 DAY)),
(REPLACE(UUID(), '-', ''), 'CUST001', (SELECT coupon_id FROM t_coupon WHERE coupon_name='满300减50' LIMIT 1), '满300减50', 1, 50.00, 0.00, 300.00, DATE_SUB(NOW(), INTERVAL 8 DAY), 0, NULL, NULL, '2025-12-31 23:59:59'),
(REPLACE(UUID(), '-', ''), 'CUST002', (SELECT coupon_id FROM t_coupon WHERE coupon_name='新用户专享券' LIMIT 1), '新用户专享券', 3, 50.00, 0.00, 0.00, DATE_SUB(NOW(), INTERVAL 15 DAY), 0, NULL, NULL, DATE_ADD(DATE_SUB(NOW(), INTERVAL 15 DAY), INTERVAL 7 DAY)),
(REPLACE(UUID(), '-', ''), 'CUST002', (SELECT coupon_id FROM t_coupon WHERE coupon_name='数码产品8折券' LIMIT 1), '数码产品8折券', 2, 0.00, 0.80, 500.00, DATE_SUB(NOW(), INTERVAL 5 DAY), 0, NULL, NULL, '2025-06-30 23:59:59'),
(REPLACE(UUID(), '-', ''), 'CUST003', (SELECT coupon_id FROM t_coupon WHERE coupon_name='手机专享满1000减200' LIMIT 1), '手机专享满1000减200', 1, 200.00, 0.00, 1000.00, DATE_SUB(NOW(), INTERVAL 3 DAY), 1, DATE_SUB(NOW(), INTERVAL 1 DAY), 'ORDER002', '2025-12-31 23:59:59');

-- ================================================================
-- 27. 分类参数关联表测试数据
-- ================================================================
INSERT INTO `t_category_param` (`id`, `category_id`, `param_library_id`) VALUES
(REPLACE(UUID(), '-', ''), 'CAT001001001', (SELECT param_id FROM t_product_param_library WHERE param_name='品牌' LIMIT 1)),
(REPLACE(UUID(), '-', ''), 'CAT001001001', (SELECT param_id FROM t_product_param_library WHERE param_name='型号' LIMIT 1)),
(REPLACE(UUID(), '-', ''), 'CAT001001001', (SELECT param_id FROM t_product_param_library WHERE param_name='颜色' LIMIT 1)),
(REPLACE(UUID(), '-', ''), 'CAT001001001', (SELECT param_id FROM t_product_param_library WHERE param_name='操作系统' LIMIT 1)),
(REPLACE(UUID(), '-', ''), 'CAT001001001', (SELECT param_id FROM t_product_param_library WHERE param_name='屏幕尺寸' LIMIT 1)),
(REPLACE(UUID(), '-', ''), 'CAT001001001', (SELECT param_id FROM t_product_param_library WHERE param_name='CPU型号' LIMIT 1)),
(REPLACE(UUID(), '-', ''), 'CAT001001001', (SELECT param_id FROM t_product_param_library WHERE param_name='内存' LIMIT 1)),
(REPLACE(UUID(), '-', ''), 'CAT001001001', (SELECT param_id FROM t_product_param_library WHERE param_name='存储' LIMIT 1)),
(REPLACE(UUID(), '-', ''), 'CAT001001001', (SELECT param_id FROM t_product_param_library WHERE param_name='电池容量' LIMIT 1));

-- ================================================================
-- 28. 商品参数值表测试数据
-- ================================================================
INSERT INTO `t_product_param_value` (`id`, `product_id`, `param_library_id`, `param_value`) VALUES
(REPLACE(UUID(), '-', ''), 'PROD001', (SELECT param_id FROM t_product_param_library WHERE param_name='品牌' LIMIT 1), '苹果'),
(REPLACE(UUID(), '-', ''), 'PROD001', (SELECT param_id FROM t_product_param_library WHERE param_name='型号' LIMIT 1), 'iPhone 15 Pro Max'),
(REPLACE(UUID(), '-', ''), 'PROD001', (SELECT param_id FROM t_product_param_library WHERE param_name='操作系统' LIMIT 1), 'iOS'),
(REPLACE(UUID(), '-', ''), 'PROD001', (SELECT param_id FROM t_product_param_library WHERE param_name='屏幕尺寸' LIMIT 1), '6.7英寸'),
(REPLACE(UUID(), '-', ''), 'PROD001', (SELECT param_id FROM t_product_param_library WHERE param_name='CPU型号' LIMIT 1), 'A17 Pro'),
(REPLACE(UUID(), '-', ''), 'PROD001', (SELECT param_id FROM t_product_param_library WHERE param_name='电池容量' LIMIT 1), '4422mAh'),
(REPLACE(UUID(), '-', ''), 'PROD002', (SELECT param_id FROM t_product_param_library WHERE param_name='品牌' LIMIT 1), '华为'),
(REPLACE(UUID(), '-', ''), 'PROD002', (SELECT param_id FROM t_product_param_library WHERE param_name='型号' LIMIT 1), 'Mate 60 Pro'),
(REPLACE(UUID(), '-', ''), 'PROD002', (SELECT param_id FROM t_product_param_library WHERE param_name='操作系统' LIMIT 1), 'HarmonyOS'),
(REPLACE(UUID(), '-', ''), 'PROD002', (SELECT param_id FROM t_product_param_library WHERE param_name='屏幕尺寸' LIMIT 1), '6.82英寸'),
(REPLACE(UUID(), '-', ''), 'PROD002', (SELECT param_id FROM t_product_param_library WHERE param_name='CPU型号' LIMIT 1), '麒麟9000S'),
(REPLACE(UUID(), '-', ''), 'PROD002', (SELECT param_id FROM t_product_param_library WHERE param_name='电池容量' LIMIT 1), '5000mAh');

-- ================================================================
-- 数据插入完成统计
-- ================================================================
SELECT '========================================' AS '';
SELECT '测试数据插入完成！' AS '状态';
SELECT '========================================' AS '';
SELECT COUNT(*) AS '商品分类数量' FROM t_product_category WHERE deleted=0;
SELECT COUNT(*) AS '商品品牌数量' FROM t_product_brand WHERE deleted=0;
SELECT COUNT(*) AS '商品数量' FROM t_product WHERE deleted=0;
SELECT COUNT(*) AS 'SKU数量' FROM t_product_sku WHERE deleted=0;
SELECT COUNT(*) AS '优惠券数量' FROM t_coupon WHERE deleted=0;
SELECT COUNT(*) AS '管理员数量' FROM t_user WHERE deleted=0;
SELECT COUNT(*) AS '普通用户数量' FROM t_customer WHERE deleted=0;
SELECT COUNT(*) AS '角色数量' FROM t_role WHERE deleted=0;
SELECT COUNT(*) AS '秒杀活动数量' FROM t_flash_sale WHERE deleted=0;
SELECT COUNT(*) AS '秒杀商品数量' FROM t_flash_sale_product WHERE deleted=0;
SELECT '========================================' AS '';
SELECT '可以使用以下账号登录系统：' AS '提示';
SELECT '管理员账号：admin / 123456' AS '';
SELECT '运营人员：zhangsan / 123456' AS '';
SELECT '客服人员：lisi / 123456' AS '';
SELECT '审核人员：wangwu / 123456' AS '';
SELECT '========================================' AS '';
