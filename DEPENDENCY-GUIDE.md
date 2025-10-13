# Elpis 依赖管理指南

## 改进后的脚本特性 ✨

### 智能版本管理
脚本会自动保存和恢复 npm 包版本，**不会写死版本号**！

## 使用方法

### 1. 开发模式（使用本地 elpis）
```bash
npm run setup:dev
npm run dev
```

**发生了什么：**
- 自动将 package.json 中的依赖改为 `"file:../elpis"`
- 保存当前的生产版本号到 `.elpis-version.json`
- 修改 elpis 核心代码后重启即可生效

### 2. 生产模式（使用 npm 包）
```bash
# 使用保存的版本（推荐）
npm run setup:prod
npm run prod

# 或指定新版本
npm run setup:prod -- ^1.0.8
npm install
npm run prod
```

**发生了什么：**
- 自动将 package.json 恢复为保存的版本（如 `^1.0.7`）
- 如果指定了版本参数，会使用新版本并保存

### 3. 更新 elpis 版本

#### 场景：elpis 发布了新版本 1.0.8

**方式1：直接更新版本**
```bash
npm run update-elpis -- ^1.0.8
npm install
```

**方式2：在切换生产模式时指定**
```bash
npm run setup:prod -- ^1.0.8
npm install
```

**方式3：手动修改 `.elpis-version.json`**
```json
{
  "prodVersion": "^1.0.8"
}
```
然后运行 `npm run setup:prod`

## 完整工作流程示例

### 日常开发
```bash
# 1. 首次设置或从生产切换到开发
npm run setup:dev
# 输出：💾 已保存生产版本配置: ^1.0.7
#      ✅ 切换到开发模式：使用本地 elpis

# 2. 启动开发服务器
npm run dev

# 3. 修改 elpis 核心代码
# 编辑 d:\Elpis\elpis\app\extend\database.js

# 4. 重启服务器查看效果
# Ctrl+C 停止，然后再次 npm run dev
```

### elpis 版本更新
```bash
# 1. 发布新版本到 npm
cd ../elpis
npm version patch  # 1.0.7 → 1.0.8
npm publish

# 2. 在 elpis-demo 中更新版本
cd ../elpis-demo
npm run update-elpis -- ^1.0.8
npm install

# 3. 测试新版本
npm run prod
```

### 准备部署
```bash
# 1. 确保使用的是 npm 包版本
npm run setup:prod

# 2. 检查 package.json
cat package.json | grep "@lesheng/elpis"
# 应该显示: "@lesheng/elpis": "^1.0.8"

# 3. 提交代码
git add package.json .elpis-version.json
git commit -m "Update elpis to 1.0.8"
git push

# 4. 部署到服务器
```

## 文件说明

### `.elpis-version.json`（自动生成）
```json
{
  "prodVersion": "^1.0.8"
}
```
- 存储生产环境的 npm 包版本配置
- 开发模式 → 生产模式时自动恢复此版本
- **建议提交到 git**，方便团队协作

### `scripts/switch-dependency.js`
智能切换脚本，支持：
- 自动保存/恢复版本号
- 通过参数指定新版本
- 避免版本号写死问题

## 常见场景

### Q: 如何查看当前使用的是什么版本？
```bash
# 查看 package.json
cat package.json | grep "@lesheng/elpis"

# 查看保存的生产版本
cat .elpis-version.json
```

### Q: 我在开发模式，想临时测试 npm 包版本怎么办？
```bash
npm run setup:prod
npm run prod
# 测试完成后
npm run setup:dev
```

### Q: 多人协作时，其他人需要做什么？
```bash
# 拉取代码后
git pull

# 如果 .elpis-version.json 有更新
npm run setup:prod  # 或 setup:dev
npm install
```

### Q: 如何切换到特定版本（如 1.0.5）？
```bash
npm run setup:prod -- ^1.0.5
npm install
```

## 注意事项

✅ **推荐做法**
- 开发时保持 `npm run setup:dev`
- 提交代码前运行 `npm run setup:prod`
- `.elpis-version.json` 提交到 git
- 更新 elpis 版本时使用 `npm run update-elpis -- ^x.x.x`

❌ **避免**
- 不要手动修改 package.json 中的 elpis 依赖（让脚本管理）
- 不要将 `"file:../elpis"` 提交到生产环境
- 不要忽略 `.elpis-version.json` 文件

## 技术原理

### 版本保存机制
```javascript
// 切换到开发模式时
const currentVersion = packageJson.dependencies['@lesheng/elpis']; // "^1.0.7"
if (!currentVersion.startsWith('file:')) {
  // 保存到配置文件
  saveVersion(currentVersion);
}

// 切换到生产模式时
const savedVersion = loadVersion(); // "^1.0.7"
packageJson.dependencies['@lesheng/elpis'] = savedVersion;
```

这样就实现了**动态版本管理**，不会写死版本号！

