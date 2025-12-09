# CI/CD 部署配置分析和修改建议

## 问题 1：依赖配置兼容性检查

### 当前配置
```json
"@lesheng/elpis": "file:../elpis"
```

### 分析结果

**❌ 问题**：本地文件路径依赖在 Docker 构建环境中**无法正常工作**

**原因**：
1. Docker 构建时，只复制 `schema-hub` 目录到容器
2. 相对路径 `../elpis` 指向的父目录不存在
3. `npm install` 会失败，报错：`ENOENT: no such file or directory`

### 解决方案

**推荐方案**：使用 `switch-dependency.js` 脚本在 CI/CD 前自动切换依赖

#### 步骤 1：在本地切换到生产模式
```bash
# 在 schema-hub 目录执行
npm run setup:prod -- ^1.2.0
```

这会：
- 将 `@lesheng/elpis` 改为 `^1.2.0`（npm registry 版本）
- 保存版本到 `.elpis-version.json`
- 执行 `npm install`

#### 步骤 2：提交更新后的 package.json
```bash
git add package.json .elpis-version.json
git commit -m "chore: switch to production elpis v1.2.0"
git push
```

#### 步骤 3：Docker 构建时自动使用 npm registry 版本
- Dockerfile 中的 `npm install` 会从 npm registry 安装 `@lesheng/elpis@^1.2.0`
- 无需修改 Dockerfile

### 验证方法
```bash
# 查看当前配置
cat package.json | grep "@lesheng/elpis"

# 应该显示：
# "@lesheng/elpis": "^1.2.0"
```

---

## 问题 2：部署配置文件检查

### 2.1 Dockerfile 检查结果

**文件**：`schema-hub/publish/prod/Dockerfile` 和 `schema-hub/publish/beta/Dockerfile`

**✅ 当前配置正确**，无需修改

**原因**：
- 已正确配置 npm registry 镜像
- 已正确执行 `npm install --production=false`
- 已正确执行 `_ENV=production node ./build.js`
- 已正确处理构建产物复制

**建议**：添加 Node.js 版本检查（可选）

### 2.2 Kubernetes 部署配置

**文件**：`schema-hub/publish/prod/deployment.yaml` 和 `schema-hub/publish/beta/deployment.yaml`

需要查看这些文件的内容

### 2.3 关键修改清单

| 项目 | 当前状态 | 需要修改 | 优先级 |
|------|--------|--------|--------|
| package.json | `file:../elpis` | 改为 `^1.2.0` | 🔴 关键 |
| Dockerfile | ✅ 正确 | 无需修改 | ✅ 完成 |
| Node.js 版本 | node:18 | 建议升级到 node:20 | 🟡 可选 |
| npm registry | npmmirror.com | ✅ 正确 | ✅ 完成 |

---

## 立即行动

### 第 1 步：切换依赖配置
```bash
cd d:\Elpis\schema-hub
npm run setup:prod -- ^1.2.0
```

### 第 2 步：验证配置
```bash
cat package.json | grep "@lesheng/elpis"
npm install
npm run build:prod
```

### 第 3 步：提交代码
```bash
git add package.json .elpis-version.json
git commit -m "chore: switch to production elpis v1.2.0"
git push
```

### 第 4 步：重新部署 CI/CD
- 在 CNB 平台触发新的构建
- Docker 镜像会自动从 npm registry 安装依赖

