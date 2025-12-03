const fs = require('fs');
const path = require('path');

const packageJsonPath = path.join(__dirname, '../package.json');
const versionConfigPath = path.join(__dirname, '../.elpis-version.json');
const packageJson = require(packageJsonPath);

const mode = process.argv[2]; // 'dev' 或 'prod'
// npm run setup:prod -- ^1.2.0 时，参数会在 process.argv[3] 之后
// 需要找到第一个不是 'prod' 或 'dev' 的参数
let specifiedVersion = null;
for (let i = 3; i < process.argv.length; i++) {
  if (process.argv[i] && !process.argv[i].startsWith('-')) {
    specifiedVersion = process.argv[i];
    break;
  }
}

// 读取或初始化版本配置
let versionConfig = { prodVersion: '^1.0.7' };
if (fs.existsSync(versionConfigPath)) {
  versionConfig = JSON.parse(fs.readFileSync(versionConfigPath, 'utf8'));
}

const currentDep = packageJson.dependencies['@lesheng/elpis'];

if (mode === 'dev') {
  // 切换到开发模式前，先保存当前的生产版本（如果不是本地路径）
  if (currentDep && !currentDep.startsWith('file:')) {
    versionConfig.prodVersion = currentDep;
    fs.writeFileSync(versionConfigPath, JSON.stringify(versionConfig, null, 2) + '\n');
    console.log(`💾 已保存生产版本配置: ${currentDep}`);
  }
  
  // 开发模式：使用本地路径
  packageJson.dependencies['@lesheng/elpis'] = 'file:../elpis';
  console.log('✅ 切换到开发模式：使用本地 elpis');
  
} else if (mode === 'prod') {
  // 生产模式：使用指定版本或配置文件中的版本
  const targetVersion = specifiedVersion || versionConfig.prodVersion;
  
  packageJson.dependencies['@lesheng/elpis'] = targetVersion;
  
  // 保存到配置文件
  versionConfig.prodVersion = targetVersion;
  fs.writeFileSync(versionConfigPath, JSON.stringify(versionConfig, null, 2) + '\n');
  
  console.log('✅ 切换到生产模式：使用 npm 包版本');
  console.log(`📦 版本: ${targetVersion}`);
  
} else {
  console.error('❌ 请指定模式：dev 或 prod');
  console.error('用法: node scripts/switch-dependency.js [dev|prod] [version]');
  console.error('示例:');
  console.error('  npm run setup:dev              # 切换到开发模式');
  console.error('  npm run setup:prod             # 切换到生产模式（使用保存的版本）');
  console.error('  npm run setup:prod -- ^1.0.8   # 切换到生产模式并指定版本');
  process.exit(1);
}

// 写回 package.json
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
console.log('📝 package.json 已更新');
console.log('💡 运行 npm install 来应用更改');

