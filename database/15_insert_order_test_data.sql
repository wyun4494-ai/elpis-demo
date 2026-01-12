-- ================================================================
-- 订单管理模块 - 测试数据插入脚本
-- 版本：1.0.0
-- 创建时间：2025-01-08
-- 说明：为订单管理相关的6个表插入测试数据
-- ================================================================

USE elpis_beta;

-- ================================================================
-- 清空现有测试数据（可选）
-- ================================================================
-- DELETE FROM t_order_review WHERE deleted = 0;
-- DELETE FROM t_order_refund WHERE deleted = 0;
-- DELETE FROM t_order_logistics WHERE deleted = 0;
-- DELETE FROM t_order_status_log;
-- DELETE FROM t_order_item WHERE deleted = 0;
-- DELETE FROM t_order WHERE deleted = 0;

-- ================================================================
-- 1. 插入订单主表测试数据（10个订单）
-- ================================================================

-- 订单1：待支付
INSERT INTO t_order (
  order_id, order_no, customer_id, customer_name,
  receiver_name, receiver_phone, receiver_province, receiver_city, receiver_district, receiver_address,
  total_amount, freight_amount, discount_amount, coupon_amount, pay_amount,
  order_status, pay_status, delivery_status,
  order_time, buyer_message
) VALUES (
  '1736334000001', 'ORD20250108001', 'CUST001', '张三',
  '张三', '13800138001', '北京市', '北京市', '朝阳区', '建国路88号SOHO现代城',
  299.00, 10.00, 0.00, 0.00, 309.00,
  0, 0, 0,
  '2025-01-08 10:00:00', '请尽快发货'
);

-- 订单2：待发货
INSERT INTO t_order (
  order_id, order_no, customer_id, customer_name,
  receiver_name, receiver_phone, receiver_province, receiver_city, receiver_district, receiver_address,
  total_amount, freight_amount, discount_amount, coupon_amount, pay_amount,
  order_status, pay_status, delivery_status,
  pay_type, pay_time, pay_no,
  order_time
) VALUES (
  '1736334000002', 'ORD20250108002', 'CUST002', '李四',
  '李四', '13800138002', '上海市', '上海市', '浦东新区', '陆家嘴环路1000号',
  599.00, 0.00, 50.00, 20.00, 529.00,
  1, 1, 0,
  1, '2025-01-08 10:30:00', 'PAY20250108001',
  '2025-01-08 10:25:00'
);

-- 订单3：待收货
INSERT INTO t_order (
  order_id, order_no, customer_id, customer_name,
  receiver_name, receiver_phone, receiver_province, receiver_city, receiver_district, receiver_address,
  total_amount, freight_amount, discount_amount, coupon_amount, pay_amount,
  order_status, pay_status, delivery_status,
  pay_type, pay_time, pay_no, delivery_time,
  order_time
) VALUES (
  '1736334000003', 'ORD20250108003', 'CUST003', '王五',
  '王五', '13800138003', '广东省', '深圳市', '南山区', '科技园南区深南大道9988号',
  1299.00, 15.00, 100.00, 0.00, 1214.00,
  2, 1, 1,
  2, '2025-01-07 14:00:00', 'PAY20250107001', '2025-01-07 16:00:00',
  '2025-01-07 13:55:00'
);

-- 订单4：已完成
INSERT INTO t_order (
  order_id, order_no, customer_id, customer_name,
  receiver_name, receiver_phone, receiver_province, receiver_city, receiver_district, receiver_address,
  total_amount, freight_amount, discount_amount, coupon_amount, pay_amount,
  order_status, pay_status, delivery_status,
  pay_type, pay_time, pay_no, delivery_time, receive_time, finish_time,
  order_time
) VALUES (
  '1736334000004', 'ORD20250107001', 'CUST004', '赵六',
  '赵六', '13800138004', '浙江省', '杭州市', '西湖区', '文三路90号',
  899.00, 10.00, 0.00, 50.00, 859.00,
  3, 1, 2,
  1, '2025-01-06 09:00:00', 'PAY20250106001', '2025-01-06 11:00:00', '2025-01-07 10:00:00', '2025-01-07 10:00:00',
  '2025-01-06 08:55:00'
);

-- 订单5：已取消
INSERT INTO t_order (
  order_id, order_no, customer_id, customer_name,
  receiver_name, receiver_phone, receiver_province, receiver_city, receiver_district, receiver_address,
  total_amount, freight_amount, discount_amount, coupon_amount, pay_amount,
  order_status, pay_status, delivery_status,
  cancel_time, cancel_reason,
  order_time
) VALUES (
  '1736334000005', 'ORD20250108004', 'CUST005', '孙七',
  '孙七', '13800138005', '江苏省', '南京市', '鼓楼区', '中山路1号',
  399.00, 10.00, 0.00, 0.00, 409.00,
  4, 0, 0,
  '2025-01-08 11:00:00', '不想要了',
  '2025-01-08 10:50:00'
);

-- 订单6：待发货（使用优惠券）
INSERT INTO t_order (
  order_id, order_no, customer_id, customer_name,
  receiver_name, receiver_phone, receiver_province, receiver_city, receiver_district, receiver_address,
  total_amount, freight_amount, discount_amount, coupon_amount, pay_amount,
  coupon_id, coupon_name,
  order_status, pay_status, delivery_status,
  pay_type, pay_time, pay_no,
  order_time
) VALUES (
  '1736334000006', 'ORD20250107002', 'CUST001', '张三',
  '张三', '13800138001', '北京市', '北京市', '朝阳区', '建国路88号SOHO现代城',
  1999.00, 0.00, 0.00, 200.00, 1799.00,
  'COUPON001', '满1000减200优惠券',
  1, 1, 0,
  1, '2025-01-07 15:00:00', 'PAY20250107002',
  '2025-01-07 14:55:00'
);

-- 订单7：已完成（多商品）
INSERT INTO t_order (
  order_id, order_no, customer_id, customer_name,
  receiver_name, receiver_phone, receiver_province, receiver_city, receiver_district, receiver_address,
  total_amount, freight_amount, discount_amount, coupon_amount, pay_amount,
  order_status, pay_status, delivery_status,
  pay_type, pay_time, pay_no, delivery_time, receive_time, finish_time,
  order_time, seller_remark
) VALUES (
  '1736334000007', 'ORD20250106001', 'CUST002', '李四',
  '李四', '13800138002', '上海市', '上海市', '浦东新区', '陆家嘴环路1000号',
  2599.00, 20.00, 100.00, 0.00, 2519.00,
  3, 1, 2,
  2, '2025-01-05 10:00:00', 'PAY20250105001', '2025-01-05 14:00:00', '2025-01-06 09:00:00', '2025-01-06 09:00:00',
  '2025-01-05 09:55:00', 'VIP客户，优先发货'
);

-- 订单8：待收货
INSERT INTO t_order (
  order_id, order_no, customer_id, customer_name,
  receiver_name, receiver_phone, receiver_province, receiver_city, receiver_district, receiver_address,
  total_amount, freight_amount, discount_amount, coupon_amount, pay_amount,
  order_status, pay_status, delivery_status,
  pay_type, pay_time, pay_no, delivery_time,
  order_time
) VALUES (
  '1736334000008', 'ORD20250107003', 'CUST006', '周八',
  '周八', '13800138006', '四川省', '成都市', '武侯区', '天府大道中段666号',
  799.00, 10.00, 0.00, 0.00, 809.00,
  2, 1, 1,
  1, '2025-01-07 11:00:00', 'PAY20250107003', '2025-01-07 15:00:00',
  '2025-01-07 10:55:00'
);

-- 订单9：待支付
INSERT INTO t_order (
  order_id, order_no, customer_id, customer_name,
  receiver_name, receiver_phone, receiver_province, receiver_city, receiver_district, receiver_address,
  total_amount, freight_amount, discount_amount, coupon_amount, pay_amount,
  order_status, pay_status, delivery_status,
  order_time
) VALUES (
  '1736334000009', 'ORD20250108005', 'CUST007', '吴九',
  '吴九', '13800138007', '湖北省', '武汉市', '江汉区', '解放大道688号',
  499.00, 10.00, 0.00, 0.00, 509.00,
  0, 0, 0,
  '2025-01-08 12:00:00'
);

-- 订单10：已完成
INSERT INTO t_order (
  order_id, order_no, customer_id, customer_name,
  receiver_name, receiver_phone, receiver_province, receiver_city, receiver_district, receiver_address,
  total_amount, freight_amount, discount_amount, coupon_amount, pay_amount,
  order_status, pay_status, delivery_status,
  pay_type, pay_time, pay_no, delivery_time, receive_time, finish_time,
  order_time
) VALUES (
  '1736334000010', 'ORD20250105001', 'CUST003', '王五',
  '王五', '13800138003', '广东省', '深圳市', '南山区', '科技园南区深南大道9988号',
  1599.00, 15.00, 0.00, 100.00, 1514.00,
  3, 1, 2,
  1, '2025-01-04 10:00:00', 'PAY20250104001', '2025-01-04 14:00:00', '2025-01-05 10:00:00', '2025-01-05 10:00:00',
  '2025-01-04 09:55:00'
);

-- ================================================================
-- 2. 插入订单商品表测试数据
-- ================================================================

-- 订单1的商品
INSERT INTO t_order_item (
  item_id, order_id, order_no,
  product_id, product_name, product_image,
  sku_id, sku_name, sku_code, sku_attributes,
  product_price, product_quantity, total_amount, discount_amount, pay_amount
) VALUES (
  '1736334100001', '1736334000001', 'ORD20250108001',
  'PROD001', 'iPhone 15 Pro', '/uploads/product/iphone15pro.jpg',
  'SKU001', 'iPhone 15 Pro 256GB 深空黑色', 'IP15P-256-BLK', '{"颜色": "深空黑色", "容量": "256GB"}',
  299.00, 1, 299.00, 0.00, 299.00
);

-- 订单2的商品
INSERT INTO t_order_item (
  item_id, order_id, order_no,
  product_id, product_name, product_image,
  sku_id, sku_name, sku_code, sku_attributes,
  product_price, product_quantity, total_amount, discount_amount, pay_amount
) VALUES (
  '1736334100002', '1736334000002', 'ORD20250108002',
  'PROD002', 'MacBook Pro 14英寸', '/uploads/product/macbookpro14.jpg',
  'SKU002', 'MacBook Pro 14英寸 M3 16GB 512GB 深空灰色', 'MBP14-M3-16-512-GRY', '{"芯片": "M3", "内存": "16GB", "存储": "512GB", "颜色": "深空灰色"}',
  599.00, 1, 599.00, 50.00, 549.00
);

-- 订单3的商品
INSERT INTO t_order_item (
  item_id, order_id, order_no,
  product_id, product_name, product_image,
  sku_id, sku_name, sku_code, sku_attributes,
  product_price, product_quantity, total_amount, discount_amount, pay_amount
) VALUES (
  '1736334100003', '1736334000003', 'ORD20250108003',
  'PROD003', 'iPad Air 11英寸', '/uploads/product/ipadair11.jpg',
  'SKU003', 'iPad Air 11英寸 256GB WiFi 星光色', 'IPA11-256-WIFI-STR', '{"容量": "256GB", "网络": "WiFi", "颜色": "星光色"}',
  1299.00, 1, 1299.00, 100.00, 1199.00
);

-- 订单4的商品
INSERT INTO t_order_item (
  item_id, order_id, order_no,
  product_id, product_name, product_image,
  sku_id, sku_name, sku_code, sku_attributes,
  product_price, product_quantity, total_amount, discount_amount, pay_amount
) VALUES (
  '1736334100004', '1736334000004', 'ORD20250107001',
  'PROD004', 'AirPods Pro 2', '/uploads/product/airpodspro2.jpg',
  'SKU004', 'AirPods Pro 2 USB-C', 'APP2-USBC', '{"接口": "USB-C"}',
  899.00, 1, 899.00, 0.00, 849.00
);

-- 订单5的商品
INSERT INTO t_order_item (
  item_id, order_id, order_no,
  product_id, product_name, product_image,
  sku_id, sku_name, sku_code, sku_attributes,
  product_price, product_quantity, total_amount, discount_amount, pay_amount
) VALUES (
  '1736334100005', '1736334000005', 'ORD20250108004',
  'PROD005', 'Apple Watch Series 9', '/uploads/product/applewatch9.jpg',
  'SKU005', 'Apple Watch Series 9 45mm GPS 午夜色', 'AWS9-45-GPS-MID', '{"尺寸": "45mm", "网络": "GPS", "颜色": "午夜色"}',
  399.00, 1, 399.00, 0.00, 399.00
);

-- 订单6的商品（2件）
INSERT INTO t_order_item (
  item_id, order_id, order_no,
  product_id, product_name, product_image,
  sku_id, sku_name, sku_code, sku_attributes,
  product_price, product_quantity, total_amount, discount_amount, pay_amount
) VALUES (
  '1736334100006', '1736334000006', 'ORD20250107002',
  'PROD001', 'iPhone 15 Pro', '/uploads/product/iphone15pro.jpg',
  'SKU006', 'iPhone 15 Pro 512GB 原色钛金属', 'IP15P-512-TIT', '{"颜色": "原色钛金属", "容量": "512GB"}',
  999.00, 2, 1998.00, 0.00, 1798.00
),
  ('1736334100007', '1736334000006', 'ORD20250107002',
  'PROD006', 'Magic Keyboard', '/uploads/product/magickeyboard.jpg',
  'SKU007', 'Magic Keyboard 中文', 'MK-CN', '{"语言": "中文"}',
  1.00, 1, 1.00, 0.00, 1.00
);

-- 订单7的商品（3件）
INSERT INTO t_order_item (
  item_id, order_id, order_no,
  product_id, product_name, product_image,
  sku_id, sku_name, sku_code, sku_attributes,
  product_price, product_quantity, total_amount, discount_amount, pay_amount
) VALUES (
  '1736334100008', '1736334000007', 'ORD20250106001',
  'PROD002', 'MacBook Pro 14英寸', '/uploads/product/macbookpro14.jpg',
  'SKU002', 'MacBook Pro 14英寸 M3 16GB 512GB 深空灰色', 'MBP14-M3-16-512-GRY', '{"芯片": "M3", "内存": "16GB", "存储": "512GB", "颜色": "深空灰色"}',
  1999.00, 1, 1999.00, 100.00, 1899.00
),
  ('1736334100009', '1736334000007', 'ORD20250106001',
  'PROD003', 'iPad Air 11英寸', '/uploads/product/ipadair11.jpg',
  'SKU003', 'iPad Air 11英寸 256GB WiFi 星光色', 'IPA11-256-WIFI-STR', '{"容量": "256GB", "网络": "WiFi", "颜色": "星光色"}',
  499.00, 1, 499.00, 0.00, 499.00
),
  ('1736334100010', '1736334000007', 'ORD20250106001',
  'PROD007', 'Apple Pencil 2', '/uploads/product/applepencil2.jpg',
  'SKU008', 'Apple Pencil 第二代', 'AP2', '{}',
  101.00, 1, 101.00, 0.00, 101.00
);

-- 订单8的商品
INSERT INTO t_order_item (
  item_id, order_id, order_no,
  product_id, product_name, product_image,
  sku_id, sku_name, sku_code, sku_attributes,
  product_price, product_quantity, total_amount, discount_amount, pay_amount
) VALUES (
  '1736334100011', '1736334000008', 'ORD20250107003',
  'PROD004', 'AirPods Pro 2', '/uploads/product/airpodspro2.jpg',
  'SKU004', 'AirPods Pro 2 USB-C', 'APP2-USBC', '{"接口": "USB-C"}',
  799.00, 1, 799.00, 0.00, 799.00
);

-- 订单9的商品
INSERT INTO t_order_item (
  item_id, order_id, order_no,
  product_id, product_name, product_image,
  sku_id, sku_name, sku_code, sku_attributes,
  product_price, product_quantity, total_amount, discount_amount, pay_amount
) VALUES (
  '1736334100012', '1736334000009', 'ORD20250108005',
  'PROD005', 'Apple Watch Series 9', '/uploads/product/applewatch9.jpg',
  'SKU005', 'Apple Watch Series 9 45mm GPS 午夜色', 'AWS9-45-GPS-MID', '{"尺寸": "45mm", "网络": "GPS", "颜色": "午夜色"}',
  499.00, 1, 499.00, 0.00, 499.00
);

-- 订单10的商品
INSERT INTO t_order_item (
  item_id, order_id, order_no,
  product_id, product_name, product_image,
  sku_id, sku_name, sku_code, sku_attributes,
  product_price, product_quantity, total_amount, discount_amount, pay_amount
) VALUES (
  '1736334100013', '1736334000010', 'ORD20250105001',
  'PROD001', 'iPhone 15 Pro', '/uploads/product/iphone15pro.jpg',
  'SKU001', 'iPhone 15 Pro 256GB 深空黑色', 'IP15P-256-BLK', '{"颜色": "深空黑色", "容量": "256GB"}',
  1599.00, 1, 1599.00, 0.00, 1499.00
);

-- ================================================================
-- 3. 插入订单状态流转表测试数据
-- ================================================================

-- 订单2的状态流转（待支付 → 待发货）
INSERT INTO t_order_status_log (
  log_id, order_id, order_no,
  status_from, status_to, status_name,
  operator_type, operator_id, operator_name, remark
) VALUES (
  '1736334200001', '1736334000002', 'ORD20250108002',
  0, 1, '待发货',
  1, 'CUST002', '李四', '用户已支付'
);

-- 订单3的状态流转（待支付 → 待发货 → 待收货）
INSERT INTO t_order_status_log (
  log_id, order_id, order_no,
  status_from, status_to, status_name,
  operator_type, operator_id, operator_name, remark
) VALUES (
  '1736334200002', '1736334000003', 'ORD20250108003',
  0, 1, '待发货',
  1, 'CUST003', '王五', '用户已支付'
),
  ('1736334200003', '1736334000003', 'ORD20250108003',
  1, 2, '待收货',
  2, 'admin', '管理员', '已发货，物流公司：顺丰速运，运单号：SF1234567890'
);

-- 订单4的状态流转（完整流程）
INSERT INTO t_order_status_log (
  log_id, order_id, order_no,
  status_from, status_to, status_name,
  operator_type, operator_id, operator_name, remark
) VALUES (
  '1736334200004', '1736334000004', 'ORD20250107001',
  0, 1, '待发货',
  1, 'CUST004', '赵六', '用户已支付'
),
  ('1736334200005', '1736334000004', 'ORD20250107001',
  1, 2, '待收货',
  2, 'admin', '管理员', '已发货，物流公司：中通快递，运单号：ZT9876543210'
),
  ('1736334200006', '1736334000004', 'ORD20250107001',
  2, 3, '已完成',
  1, 'CUST004', '赵六', '用户已确认收货'
);

-- 订单5的状态流转（取消）
INSERT INTO t_order_status_log (
  log_id, order_id, order_no,
  status_from, status_to, status_name,
  operator_type, operator_id, operator_name, remark
) VALUES (
  '1736334200007', '1736334000005', 'ORD20250108004',
  0, 4, '已取消',
  2, 'admin', '管理员', '不想要了'
);

-- ================================================================
-- 4. 插入订单物流表测试数据
-- ================================================================

-- 订单3的物流信息
INSERT INTO t_order_logistics (
  logistics_id, order_id, order_no,
  logistics_company, logistics_no, logistics_status,
  sender_name, sender_phone, sender_address,
  send_time, last_update_time
) VALUES (
  '1736334300001', '1736334000003', 'ORD20250108003',
  '顺丰速运', 'SF1234567890', 1,
  '仓库管理员', '400-111-1111', '广东省深圳市宝安区物流园区1号仓',
  '2025-01-07 16:00:00', '2025-01-08 10:00:00'
);

-- 订单4的物流信息
INSERT INTO t_order_logistics (
  logistics_id, order_id, order_no,
  logistics_company, logistics_no, logistics_status,
  sender_name, sender_phone, sender_address,
  send_time, receive_time, last_update_time
) VALUES (
  '1736334300002', '1736334000004', 'ORD20250107001',
  '中通快递', 'ZT9876543210', 3,
  '仓库管理员', '400-222-2222', '浙江省杭州市余杭区物流中心',
  '2025-01-06 11:00:00', '2025-01-07 10:00:00', '2025-01-07 10:00:00'
);

-- 订单7的物流信息
INSERT INTO t_order_logistics (
  logistics_id, order_id, order_no,
  logistics_company, logistics_no, logistics_status,
  sender_name, sender_phone, sender_address,
  send_time, receive_time, last_update_time
) VALUES (
  '1736334300003', '1736334000007', 'ORD20250106001',
  '圆通速递', 'YT5555666677', 3,
  '仓库管理员', '400-333-3333', '上海市青浦区物流基地',
  '2025-01-05 14:00:00', '2025-01-06 09:00:00', '2025-01-06 09:00:00'
);

-- 订单8的物流信息
INSERT INTO t_order_logistics (
  logistics_id, order_id, order_no,
  logistics_company, logistics_no, logistics_status,
  sender_name, sender_phone, sender_address,
  send_time, last_update_time
) VALUES (
  '1736334300004', '1736334000008', 'ORD20250107003',
  '韵达快递', 'YD8888999900', 1,
  '仓库管理员', '400-444-4444', '四川省成都市双流区物流园',
  '2025-01-07 15:00:00', '2025-01-08 08:00:00'
);

-- 订单10的物流信息
INSERT INTO t_order_logistics (
  logistics_id, order_id, order_no,
  logistics_company, logistics_no, logistics_status,
  sender_name, sender_phone, sender_address,
  send_time, receive_time, last_update_time
) VALUES (
  '1736334300005', '1736334000010', 'ORD20250105001',
  '顺丰速运', 'SF0000111122', 3,
  '仓库管理员', '400-111-1111', '广东省深圳市宝安区物流园区1号仓',
  '2025-01-04 14:00:00', '2025-01-05 10:00:00', '2025-01-05 10:00:00'
);

-- ================================================================
-- 5. 插入订单退款表测试数据（2条）
-- ================================================================

-- 退款1：待审核
INSERT INTO t_order_refund (
  refund_id, refund_no, order_id, order_no,
  refund_type, item_id, product_name, sku_name,
  refund_amount, refund_freight,
  refund_reason, refund_desc,
  refund_status, created_by
) VALUES (
  '1736334400001', 'REF20250108001', '1736334000004', 'ORD20250107001',
  1, '1736334100004', 'AirPods Pro 2', 'AirPods Pro 2 USB-C',
  849.00, 0.00,
  '不喜欢', '收到后发现不适合自己使用',
  0, 'CUST004'
);

-- 退款2：审核通过
INSERT INTO t_order_refund (
  refund_id, refund_no, order_id, order_no,
  refund_type, item_id, product_name, sku_name,
  refund_amount, refund_freight,
  refund_reason, refund_desc,
  refund_status,
  audit_time, auditor_id, auditor_name, audit_remark,
  created_by
) VALUES (
  '1736334400002', 'REF20250107001', '1736334000007', 'ORD20250106001',
  2, '1736334100010', 'Apple Pencil 2', 'Apple Pencil 第二代',
  101.00, 10.00,
  '商品损坏', '收到时发现笔尖有损坏',
  1,
  '2025-01-07 10:00:00', 'admin', '管理员', '同意退款，请寄回商品',
  'CUST002'
);

-- ================================================================
-- 6. 插入订单评价表测试数据（3条）
-- ================================================================

-- 评价1：5星好评
INSERT INTO t_order_review (
  review_id, order_id, order_no, item_id,
  product_id, product_name, sku_id, sku_name,
  customer_id, customer_name,
  rating, review_content, review_tags,
  is_anonymous, is_show, audit_status
) VALUES (
  '1736334500001', '1736334000004', 'ORD20250107001', '1736334100004',
  'PROD004', 'AirPods Pro 2', 'SKU004', 'AirPods Pro 2 USB-C',
  'CUST004', '赵**',
  5, '音质非常好，降噪效果出色，非常满意！', '["音质好", "降噪强", "佩戴舒适"]',
  0, 1, 1
);

-- 评价2：4星好评（带商家回复）
INSERT INTO t_order_review (
  review_id, order_id, order_no, item_id,
  product_id, product_name, sku_id, sku_name,
  customer_id, customer_name,
  rating, review_content, review_tags,
  reply_content, reply_time, reply_by,
  is_anonymous, is_show, audit_status
) VALUES (
  '1736334500002', '1736334000007', 'ORD20250106001', '1736334100008',
  'PROD002', 'MacBook Pro 14英寸', 'SKU002', 'MacBook Pro 14英寸 M3 16GB 512GB 深空灰色',
  'CUST002', '李**',
  4, '性能很强，屏幕显示效果好，就是价格有点贵', '["性能强", "屏幕好", "价格贵"]',
  '感谢您的评价，我们会继续努力提供更好的产品和服务！', '2025-01-07 10:00:00', 'admin',
  0, 1, 1
);

-- 评价3：5星好评（匿名）
INSERT INTO t_order_review (
  review_id, order_id, order_no, item_id,
  product_id, product_name, sku_id, sku_name,
  customer_id, customer_name,
  rating, review_content, review_tags,
  is_anonymous, is_show, audit_status
) VALUES (
  '1736334500003', '1736334000010', 'ORD20250105001', '1736334100013',
  'PROD001', 'iPhone 15 Pro', 'SKU001', 'iPhone 15 Pro 256GB 深空黑色',
  'CUST003', '匿名用户',
  5, '手机很好用，拍照效果非常棒，推荐购买！', '["拍照好", "流畅", "推荐"]',
  1, 1, 1
);

-- ================================================================
-- 执行完成
-- ================================================================
SELECT '订单管理模块测试数据插入完成！' AS '状态';
SELECT '已插入数据：' AS '';
SELECT '- 10个订单（t_order）' AS '';
SELECT '- 14个订单商品（t_order_item）' AS '';
SELECT '- 7条状态流转记录（t_order_status_log）' AS '';
SELECT '- 5条物流信息（t_order_logistics）' AS '';
SELECT '- 2条退款记录（t_order_refund）' AS '';
SELECT '- 3条评价记录（t_order_review）' AS '';

