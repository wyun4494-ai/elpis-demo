/**
 * 用户密码修改功能测试
 * 测试编辑用户时修改密码的功能
 */

const assert = require('assert');
const bcrypt = require('bcrypt');

// 模拟 app 对象
const mockApp = {
  database: (table) => {
    return {
      update: function(data) {
        this.updateData = data;
        return this;
      },
      where: function(conditions) {
        this.conditions = conditions;
        return this;
      }
    };
  },
  status: {
    NORMAL: 1,
    DELETE: -1
  }
};

// 模拟 Service 类
class MockUserService {
  constructor(app) {
    this.app = app;
  }

  async updateUser(userId, { nickname, desc, sex, role_id: roleId, new_password: newPassword, confirm_password: confirmPassword }) {
    // 验证密码字段
    if (newPassword !== undefined && newPassword !== null && newPassword !== '') {
      if (newPassword.trim() === '') {
        throw new Error('新密码不能为空');
      }
      if (newPassword.length < 6) {
        throw new Error('新密码长度至少 6 位');
      }
      if (newPassword !== confirmPassword) {
        throw new Error('新密码和确认密码不一致');
      }
    }

    const updateObj = {};
    if (nickname) updateObj.nickname = nickname;
    if (sex && sex !== -999) updateObj.sex = sex;
    if (desc) updateObj.desc = desc;
    if (roleId !== undefined) updateObj.role_id = roleId;

    if (newPassword !== undefined && newPassword !== null && newPassword !== '') {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      updateObj.password = hashedPassword;
    }

    // 模拟数据库更新
    const db = this.app.database('t_user');
    db.update(updateObj);
    db.where({ user_id: userId, status: this.app.status.NORMAL });

    return userId;
  }
}

// 测试用例
async function runTests() {
  const service = new MockUserService(mockApp);
  let testsPassed = 0;
  let testsFailed = 0;

  console.log('🧪 开始测试用户密码修改功能...\n');

  // 测试 1: 成功修改密码
  try {
    console.log('测试 1: 成功修改密码');
    const result = await service.updateUser('user123', {
      nickname: 'John',
      new_password: 'newPassword123',
      confirm_password: 'newPassword123'
    });
    assert.strictEqual(result, 'user123');
    console.log('✅ 通过\n');
    testsPassed++;
  } catch (error) {
    console.log(`❌ 失败: ${error.message}\n`);
    testsFailed++;
  }

  // 测试 2: 密码长度不足 6 位
  try {
    console.log('测试 2: 密码长度不足 6 位');
    await service.updateUser('user123', {
      new_password: '12345',
      confirm_password: '12345'
    });
    console.log('❌ 失败: 应该抛出错误\n');
    testsFailed++;
  } catch (error) {
    assert.strictEqual(error.message, '新密码长度至少 6 位');
    console.log('✅ 通过\n');
    testsPassed++;
  }

  // 测试 3: 新密码和确认密码不一致
  try {
    console.log('测试 3: 新密码和确认密码不一致');
    await service.updateUser('user123', {
      new_password: 'password123',
      confirm_password: 'password456'
    });
    console.log('❌ 失败: 应该抛出错误\n');
    testsFailed++;
  } catch (error) {
    assert.strictEqual(error.message, '新密码和确认密码不一致');
    console.log('✅ 通过\n');
    testsPassed++;
  }

  // 测试 4: 不修改密码（只修改其他字段）
  try {
    console.log('测试 4: 不修改密码（只修改其他字段）');
    const result = await service.updateUser('user123', {
      nickname: 'Jane',
      sex: 2
    });
    assert.strictEqual(result, 'user123');
    console.log('✅ 通过\n');
    testsPassed++;
  } catch (error) {
    console.log(`❌ 失败: ${error.message}\n`);
    testsFailed++;
  }

  // 测试 5: 新密码为空字符串
  try {
    console.log('测试 5: 新密码为空字符串');
    await service.updateUser('user123', {
      new_password: '   ',
      confirm_password: '   '
    });
    console.log('❌ 失败: 应该抛出错误\n');
    testsFailed++;
  } catch (error) {
    assert.strictEqual(error.message, '新密码不能为空');
    console.log('✅ 通过\n');
    testsPassed++;
  }

  // 测试 6: bcrypt 密码加密验证
  try {
    console.log('测试 6: bcrypt 密码加密验证');
    const password = 'testPassword123';
    const hashedPassword = await bcrypt.hash(password, 10);
    const isMatch = await bcrypt.compare(password, hashedPassword);
    assert.strictEqual(isMatch, true);
    console.log('✅ 通过\n');
    testsPassed++;
  } catch (error) {
    console.log(`❌ 失败: ${error.message}\n`);
    testsFailed++;
  }

  // 输出测试结果
  console.log('═'.repeat(50));
  console.log(`📊 测试结果: ${testsPassed} 通过, ${testsFailed} 失败`);
  console.log('═'.repeat(50));

  if (testsFailed === 0) {
    console.log('🎉 所有测试通过！');
    process.exit(0);
  } else {
    console.log('⚠️  有测试失败');
    process.exit(1);
  }
}

// 运行测试
runTests().catch(error => {
  console.error('测试执行出错:', error);
  process.exit(1);
});

