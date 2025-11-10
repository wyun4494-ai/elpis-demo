# RBAC 权限管理系统 - 测试指南

## 📋 概述

本文档提供了完整的 RBAC（基于角色的访问控制）系统测试指南。

---

## 🔄 数据库脚本执行顺序

RBAC 系统的数据库脚本需要按以下顺序执行：

```bash
# 1. 初始化所有表结构（包含软删除唯一性约束修复）
mysql -u root -p elpis_beta < elpis-demo/database/00_init_all_tables.sql

# 2. 初始化测试数据
mysql -u root -p elpis_beta < elpis-demo/database/01_init_test_data.sql

# 3. 初始化角色和权限配置（包含角色表软删除约束修复）
mysql -u root -p elpis_beta < elpis-demo/database/03_init_role_permission.sql

# 4. 更新人员管理系统项目标识（从 business 改为 business-personnel）
mysql -u root -p elpis_beta < elpis-demo/database/04_update_personnel_project_key.sql
```

**关键变更**：
- 人员管理系统的项目标识从 `business` 改为 `business-personnel`
- 审核管理员（role_id=2）只能访问 `business` 项目
- 只有超级管理员（role_id=1）可以访问 `business-personnel` 项目
- **软删除唯一性约束修复**：所有有 status 字段的表都使用复合唯一索引（包含 status 字段），支持软删除后重用相同字段值

---

## 👥 测试用户和角色

### 用户列表

| 用户名 | 密码 | 角色ID | 角色名称 | 权限范围 |
|--------|------|--------|---------|---------|
| admin | 12345 | 1 | 超级管理员 | 所有项目和菜单 |
| admin999 | 12345 | 2 | 审核管理员 | 仅电商系统的商品审核 |
| user1 | 12345 | 3 | 商品管理员 | 仅电商系统的商品管理 |
| user2 | 12345 | 4 | 订单管理员 | 预留（暂无权限） |

### 角色权限配置

#### 1. 超级管理员（role_id=1）
- **电商系统（business）**：所有菜单
  - product（商品管理）
  - product-list（商品列表）
  - product-audit（商品审核）
  - product-category（商品分类）
  - product-brand（品牌管理）
  - product-type（商品类型）
  - param-library（参数库）
  - stock-alert（库存预警）
  - recycle-bin（回收站）
- **电商人员管理系统（business-personnel）**：所有菜单
  - user（用户管理）
  - role（角色管理）

#### 2. 审核管理员（role_id=2）
- **电商系统（business）**：仅商品审核相关
  - product（商品管理）
  - product-list（商品列表）
  - product-audit（商品审核）
- **电商人员管理系统（business-personnel）**：无权限

#### 3. 商品管理员（role_id=3）
- **电商系统（business）**：商品管理（不含审核）
  - product（商品管理）
  - product-list（商品列表）
  - product-category（商品分类）
  - product-brand（品牌管理）
  - product-type（商品类型）
  - param-library（参数库）
  - stock-alert（库存预警）
- **电商人员管理系统（business-personnel）**：无权限

#### 4. 订单管理员（role_id=4）
- **电商系统（business）**：无权限（预留）
- **电商人员管理系统（business-personnel）**：无权限

---

## 🧪 测试场景

### 场景 1：项目列表权限控制

**测试步骤**：
1. 访问 `http://localhost:8083/view/project-list`
2. 使用不同用户登录

**预期结果**：

| 用户 | 可见项目 | 不可见项目 | 进入时提示 |
|------|---------|-----------|----------|
| admin | 所有项目 | 无 | 无 |
| admin999 | 电商系统 | 人员系统、课程系统 | 无 |
| user1 | 电商系统 | 人员系统、课程系统 | 无 |
| user2 | 无 | 所有项目 | 无权限访问 |

### 场景 2：菜单权限控制

**测试步骤**：
1. 登录为 admin999（审核管理员）
2. 进入电商系统
3. 检查左侧菜单

**预期结果**：
- ✅ 可见菜单：商品管理、商品列表、商品审核
- ❌ 不可见菜单：商品分类、品牌管理、商品类型、参数库、库存预警、回收站

### 场景 3：电商人员管理系统权限控制

**测试步骤**：
1. 使用 admin999（审核管理员）登录
2. 访问项目列表 `http://localhost:8083/view/project-list`
3. 尝试进入"电商人员管理系统"项目

**预期结果**：
- ❌ 项目列表中显示"电商人员管理系统"但无法进入
- 点击进入时提示"您没有权限访问此项目"

### 场景 4：超级管理员完全访问

**测试步骤**：
1. 使用 admin（超级管理员）登录
2. 访问项目列表 `http://localhost:8083/view/project-list`
3. 进入"电商系统"项目
4. 检查所有菜单
5. 返回项目列表，进入"电商人员管理系统"项目
6. 检查所有菜单

**预期结果**：
- ✅ 电商系统：所有菜单可见
- ✅ 电商人员管理系统：所有菜单可见
- ✅ 可以访问角色管理和用户管理

### 场景 5：角色管理功能

**测试步骤**：
1. 使用 admin（超级管理员）登录
2. 进入"电商人员管理系统"项目
3. 点击"角色管理"菜单
4. 测试角色的 CRUD 操作

**预期结果**：
- ✅ 可以查看所有角色
- ✅ 可以创建新角色
- ✅ 可以编辑角色信息
- ✅ 可以删除角色

### 场景 6：用户管理功能

**测试步骤**：
1. 使用 admin（超级管理员）登录
2. 进入"电商人员管理系统"项目
3. 点击"用户管理"菜单
4. 测试用户的 CRUD 操作
5. 特别测试修改用户的角色

**预期结果**：
- ✅ 可以查看所有用户
- ✅ 可以创建新用户
- ✅ 可以编辑用户信息（包括角色）
- ✅ 可以删除用户
- ✅ 修改用户角色后，用户的权限立即生效

---

## 🔍 API 测试

### 获取用户有权限访问的项目列表

```bash
curl -X GET "http://localhost:8083/api/proj/user/project-list" \
  -H "Authorization: Bearer <token>"
```

**响应示例**（admin999）：
```json
{
  "success": true,
  "data": ["business"]
}
```

### 检查用户是否有权限访问项目

```bash
curl -X GET "http://localhost:8083/api/proj/user/check-project-permission?project_key=business" \
  -H "Authorization: Bearer <token>"
```

**响应示例**：
```json
{
  "success": true,
  "data": {
    "has_permission": true
  }
}
```

### 获取用户的菜单权限列表

```bash
curl -X GET "http://localhost:8083/api/proj/user/menu" \
  -H "Authorization: Bearer <token>"
```

**响应示例**（admin999）：
```json
{
  "success": true,
  "data": [
    { "menu_key": "product", "project_key": "business" },
    { "menu_key": "product-list", "project_key": "business" },
    { "menu_key": "product-audit", "project_key": "business" }
  ]
}
```

---

## ✅ 测试检查清单

- [ ] 项目列表权限控制正常
- [ ] 菜单权限过滤正常
- [ ] 人员管理系统只有超级管理员可访问
- [ ] 审核管理员只能访问电商系统
- [ ] 角色管理页面可以正常显示和操作
- [ ] 用户管理页面可以正常显示和操作
- [ ] 修改用户角色后权限立即生效
- [ ] API 权限检查正常工作

---

## 🐛 常见问题排查

### 问题 1：权限配置未生效

**原因**：SQL 脚本未重新执行

**解决方案**：
```bash
# 重新执行 SQL 脚本
mysql -u root -p elpis_beta < elpis-demo/database/03_init_role_permission.sql
```

### 问题 2：用户仍然可以访问无权限的项目

**原因**：前端缓存或后端权限检查未生效

**解决方案**：
1. 清除浏览器缓存
2. 重启后端服务
3. 检查 `/api/proj/user/project-list` API 是否返回正确的项目列表

### 问题 3：菜单仍然显示无权限的菜单项

**原因**：菜单过滤逻辑未正确执行

**解决方案**：
1. 打开浏览器开发者工具
2. 检查 `/api/proj/user/menu` API 的响应
3. 检查 `dashboard.vue` 中的 `filterMenuByPermission()` 函数是否正确执行

---

## 📝 修改记录

- **2025-11-10**：
  - 修复软删除唯一性约束冲突问题（7个表）
  - 所有唯一性约束都包含 status 字段，支持软删除后重用相同字段值
  - 整合所有修复脚本到主脚本（00_init_all_tables.sql 和 03_init_role_permission.sql）
  - 删除临时修复脚本（05-10），保留 4 个核心脚本
  - 删除调试代码和冗余日志
  - 更新测试指南文档

- **2025-11-09**：
  - 修复 MySQL 8.0+ 认证协议问题（改为 mysql_native_password）
  - 修改人员管理系统项目标识从 `business` 改为 `business-personnel`
  - 完善权限检查逻辑，确保不同项目的权限隔离
  - 整理数据库脚本，删除临时文件
  - 更新测试指南文档

- **2025-11-08**：初始版本，完成 RBAC 系统实现和测试指南

