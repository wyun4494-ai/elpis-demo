/**
 * 性能测试脚本
 * 测试系统各个模块的性能，找出优化点
 */

const bcrypt = require('bcrypt');
const assert = require('assert');

// 性能测试工具类
class PerformanceTester {
  constructor() {
    this.results = [];
  }

  /**
   * 测试函数执行时间
   * @param {string} name - 测试名称
   * @param {Function} fn - 测试函数
   * @param {number} iterations - 迭代次数
   */
  async measure(name, fn, iterations = 1000) {
    const startTime = process.hrtime.bigint();
    
    for (let i = 0; i < iterations; i++) {
      await fn();
    }
    
    const endTime = process.hrtime.bigint();
    const duration = Number(endTime - startTime) / 1_000_000; // 转换为毫秒
    const avgTime = duration / iterations;
    
    this.results.push({
      name,
      iterations,
      totalTime: duration.toFixed(2),
      avgTime: avgTime.toFixed(4),
      opsPerSec: (1000 / avgTime).toFixed(0)
    });
    
    return { duration, avgTime };
  }

  /**
   * 打印测试结果
   */
  printResults() {
    console.log('\n' + '═'.repeat(80));
    console.log('📊 性能测试结果');
    console.log('═'.repeat(80));
    
    console.log('\n┌─ 测试项目 ─────────────────────────────────────────────────────────────────┐');
    console.log('│ 测试名称                    │ 迭代次数 │ 总耗时(ms) │ 平均(ms) │ 吞吐量(ops/s) │');
    console.log('├─────────────────────────────┼──────────┼────────────┼──────────┼───────────────┤');
    
    this.results.forEach(result => {
      const name = result.name.padEnd(27);
      const iterations = String(result.iterations).padStart(8);
      const totalTime = String(result.totalTime).padStart(10);
      const avgTime = String(result.avgTime).padStart(8);
      const opsPerSec = String(result.opsPerSec).padStart(13);
      
      console.log(`│ ${name} │ ${iterations} │ ${totalTime} │ ${avgTime} │ ${opsPerSec} │`);
    });
    
    console.log('└─────────────────────────────┴──────────┴────────────┴──────────┴───────────────┘');
  }

  /**
   * 分析结果并给出优化建议
   */
  analyzeAndSuggest() {
    console.log('\n' + '═'.repeat(80));
    console.log('💡 优化建议');
    console.log('═'.repeat(80));
    
    // 找出最慢的操作
    const slowest = this.results.reduce((prev, current) => 
      parseFloat(current.avgTime) > parseFloat(prev.avgTime) ? current : prev
    );
    
    console.log(`\n⚠️  最慢的操作: ${slowest.name}`);
    console.log(`   平均耗时: ${slowest.avgTime}ms`);
    console.log(`   吞吐量: ${slowest.opsPerSec} ops/s`);
    
    // 根据不同操作给出建议
    if (slowest.name.includes('bcrypt')) {
      console.log('\n📌 bcrypt 密码加密优化建议:');
      console.log('   1. ✅ 当前使用 salt rounds = 10，这是安全和性能的平衡点');
      console.log('   2. 💡 可以考虑使用缓存来存储已加密的密码（如果有重复密码）');
      console.log('   3. 💡 在高并发场景下，可以使用 Worker Threads 进行并行加密');
      console.log('   4. 💡 避免在请求处理中同步执行 bcrypt，改为异步处理');
    }
    
    if (slowest.name.includes('JSON')) {
      console.log('\n📌 JSON 序列化优化建议:');
      console.log('   1. 💡 避免序列化大型对象，只序列化必要字段');
      console.log('   2. 💡 使用流式处理大型 JSON 数据');
      console.log('   3. 💡 考虑使用 MessagePack 或 Protocol Buffers 替代 JSON');
    }
    
    if (slowest.name.includes('正则')) {
      console.log('\n📌 正则表达式优化建议:');
      console.log('   1. 💡 预编译正则表达式，避免重复编译');
      console.log('   2. 💡 使用更具体的正则模式，减少回溯');
      console.log('   3. 💡 对于简单的字符串匹配，使用 indexOf 替代正则');
    }
    
    console.log('\n📌 通用优化建议:');
    console.log('   1. ✅ 使用缓存减少重复计算');
    console.log('   2. ✅ 批量操作而不是逐个处理');
    console.log('   3. ✅ 使用数据库索引加速查询');
    console.log('   4. ✅ 使用 Redis 缓存热数据');
    console.log('   5. ✅ 使用连接池管理数据库连接');
    console.log('   6. ✅ 启用 Node.js 的 V8 代码缓存');
  }
}

// 运行性能测试
async function runPerformanceTests() {
  const tester = new PerformanceTester();
  
  console.log('🚀 开始性能测试...\n');
  
  // 测试 1: bcrypt 密码加密（不同 salt rounds）
  console.log('测试 1: bcrypt 密码加密性能');
  
  await tester.measure('bcrypt (salt=10)', async () => {
    await bcrypt.hash('testPassword123', 10);
  }, 10);
  
  await tester.measure('bcrypt (salt=8)', async () => {
    await bcrypt.hash('testPassword123', 8);
  }, 10);
  
  await tester.measure('bcrypt (salt=12)', async () => {
    await bcrypt.hash('testPassword123', 12);
  }, 10);
  
  // 测试 2: bcrypt 密码比对
  console.log('\n测试 2: bcrypt 密码比对性能');
  
  const hashedPassword = await bcrypt.hash('testPassword123', 10);
  
  await tester.measure('bcrypt.compare()', async () => {
    await bcrypt.compare('testPassword123', hashedPassword);
  }, 100);
  
  // 测试 3: JSON 序列化和反序列化
  console.log('\n测试 3: JSON 序列化性能');
  
  const testObject = {
    user_id: 'USER123456789',
    username: 'testuser',
    nickname: 'Test User',
    email: 'test@example.com',
    role_id: 1,
    permissions: ['read', 'write', 'delete'],
    metadata: {
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_login: new Date().toISOString()
    }
  };
  
  await tester.measure('JSON.stringify()', () => {
    JSON.stringify(testObject);
  }, 10000);
  
  const jsonString = JSON.stringify(testObject);
  
  await tester.measure('JSON.parse()', () => {
    JSON.parse(jsonString);
  }, 10000);
  
  // 测试 4: 字符串操作
  console.log('\n测试 4: 字符串操作性能');
  
  const testString = 'user_id_123456789_test_string_for_performance_testing';
  
  await tester.measure('String.includes()', () => {
    testString.includes('_test_');
  }, 100000);
  
  await tester.measure('String.indexOf()', () => {
    testString.indexOf('_test_');
  }, 100000);
  
  await tester.measure('正则表达式匹配', () => {
    /_test_/.test(testString);
  }, 100000);
  
  // 测试 5: 数组操作
  console.log('\n测试 5: 数组操作性能');
  
  const testArray = Array.from({ length: 1000 }, (_, i) => ({
    id: i,
    name: `item_${i}`,
    value: Math.random()
  }));
  
  await tester.measure('Array.find()', () => {
    testArray.find(item => item.id === 500);
  }, 1000);
  
  await tester.measure('Array.filter()', () => {
    testArray.filter(item => item.value > 0.5);
  }, 1000);
  
  await tester.measure('Array.map()', () => {
    testArray.map(item => ({ ...item, value: item.value * 2 }));
  }, 1000);
  
  // 测试 6: 对象操作
  console.log('\n测试 6: 对象操作性能');
  
  const testObj = { a: 1, b: 2, c: 3, d: 4, e: 5 };
  
  await tester.measure('Object.keys()', () => {
    Object.keys(testObj);
  }, 100000);
  
  await tester.measure('Object.entries()', () => {
    Object.entries(testObj);
  }, 100000);
  
  await tester.measure('Object.assign()', () => {
    Object.assign({}, testObj);
  }, 100000);
  
  // 打印结果
  tester.printResults();
  
  // 分析和建议
  tester.analyzeAndSuggest();
  
  console.log('\n' + '═'.repeat(80));
  console.log('✅ 性能测试完成！');
  console.log('═'.repeat(80) + '\n');
}

// 运行测试
runPerformanceTests().catch(error => {
  console.error('性能测试执行出错:', error);
  process.exit(1);
});

