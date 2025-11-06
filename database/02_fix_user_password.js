/**
 * 生成 bcrypt 加密密码的工具脚本
 * 用于修复数据库中的明文密码问题
 * 
 * 使用方法：
 * node elpis-demo/database/02_fix_user_password.js
 */

const bcrypt = require('bcrypt');

async function generatePasswordHash() {
  const plainPassword = '12345';
  const saltRounds = 10;

  try {
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
    
    console.log('='.repeat(80));
    console.log('Bcrypt 密码加密工具');
    console.log('='.repeat(80));
    console.log('');
    console.log('原始密码:', plainPassword);
    console.log('加密后的密码:', hashedPassword);
    console.log('');
    console.log('='.repeat(80));
    console.log('SQL 更新语句：');
    console.log('='.repeat(80));
    console.log('');
    console.log(`UPDATE t_user SET password = '${hashedPassword}' WHERE username = 'admin';`);
    console.log('');
    console.log('='.repeat(80));
    console.log('验证测试：');
    console.log('='.repeat(80));
    
    // 验证密码是否正确
    const isValid = await bcrypt.compare(plainPassword, hashedPassword);
    console.log('密码验证结果:', isValid ? '✓ 成功' : '✗ 失败');
    console.log('');
    
  } catch (error) {
    console.error('生成密码失败:', error);
  }
}

generatePasswordHash();

