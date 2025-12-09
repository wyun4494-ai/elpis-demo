/**
 * 数据库性能测试脚本
 * 测试数据库查询、插入、更新等操作的性能
 *
 * 使用方法:
 * 1. 确保 MySQL 数据库已启动
 * 2. 在 schema-hub 目录运行: node test/database-performance.test.js
 */

const mysql = require('mysql2/promise');

// 数据库连接池配置
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'elpis_beta',
  charset: 'utf8mb4',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 性能测试工具
class DatabasePerformanceTester {
  constructor() {
    this.results = [];
  }

  async measure(name, fn, iterations = 1) {
    try {
      const startTime = process.hrtime.bigint();
      
      for (let i = 0; i < iterations; i++) {
        await fn();
      }
      
      const endTime = process.hrtime.bigint();
      const duration = Number(endTime - startTime) / 1_000_000; // 毫秒
      const avgTime = duration / iterations;
      
      this.results.push({
        name,
        iterations,
        totalTime: duration.toFixed(2),
        avgTime: avgTime.toFixed(4),
        status: '✅'
      });
      
      console.log(`✅ ${name}: ${avgTime.toFixed(2)}ms (${iterations} 次)`);
    } catch (error) {
      this.results.push({
        name,
        iterations,
        totalTime: 'ERROR',
        avgTime: 'ERROR',
        status: '❌',
        error: error.message
      });
      console.log(`❌ ${name}: ${error.message}`);
    }
  }

  printResults() {
    console.log('\n' + '═'.repeat(80));
    console.log('📊 数据库性能测试结果');
    console.log('═'.repeat(80));
    
    console.log('\n┌─ 测试项目 ────────────────────────────────────────────────────────────┐');
    console.log('│ 测试名称                    │ 迭代次数 │ 平均耗时(ms) │ 状态 │');
    console.log('├─────────────────────────────┼──────────┼──────────────┼──────┤');
    
    this.results.forEach(result => {
      const name = result.name.padEnd(27);
      const iterations = String(result.iterations).padStart(8);
      const avgTime = String(result.avgTime).padStart(12);
      const status = result.status;
      
      console.log(`│ ${name} │ ${iterations} │ ${avgTime} │ ${status}  │`);
    });
    
    console.log('└─────────────────────────────┴──────────┴──────────────┴──────┘');
  }

  analyzeAndSuggest() {
    console.log('\n' + '═'.repeat(80));
    console.log('💡 数据库优化建议');
    console.log('═'.repeat(80));
    
    const slowQueries = this.results.filter(r => 
      r.status === '✅' && parseFloat(r.avgTime) > 10
    );
    
    if (slowQueries.length > 0) {
      console.log('\n⚠️  发现慢查询:');
      slowQueries.forEach(q => {
        console.log(`   - ${q.name}: ${q.avgTime}ms`);
      });
    }
    
    console.log('\n📌 优化建议:');
    console.log('   1. ✅ 为常用查询字段添加索引（如 user_id, status, create_time）');
    console.log('   2. ✅ 使用 EXPLAIN 分析查询执行计划');
    console.log('   3. ✅ 避免 SELECT * 查询，只查询需要的字段');
    console.log('   4. ✅ 使用连接池管理数据库连接（当前已配置）');
    console.log('   5. ✅ 对于大数据量查询，使用分页而不是一次性加载');
    console.log('   6. ✅ 使用 Redis 缓存热数据（如用户信息、权限等）');
    console.log('   7. ✅ 定期分析和优化慢查询日志');
    console.log('   8. ✅ 使用批量插入而不是逐条插入');
    console.log('   9. ✅ 对于复杂查询，考虑使用物化视图或预计算');
    console.log('   10. ✅ 定期执行 ANALYZE TABLE 更新表统计信息');
  }
}

// 运行数据库性能测试
async function runDatabasePerformanceTests() {
  const tester = new DatabasePerformanceTester();

  console.log('🚀 开始数据库性能测试...\n');

  try {
    // 测试 1: 简单查询
    console.log('测试 1: 简单查询性能');

    await tester.measure('SELECT 单条记录 (by user_id)', async () => {
      const conn = await pool.getConnection();
      try {
        await conn.query('SELECT * FROM t_user WHERE user_id = ? AND status = ? LIMIT 1',
          ['USER176268783437156O8P', 1]);
      } finally {
        conn.release();
      }
    }, 50);

    await tester.measure('SELECT 列表 (LIMIT 10)', async () => {
      const conn = await pool.getConnection();
      try {
        await conn.query('SELECT * FROM t_user WHERE status = ? LIMIT 10', [1]);
      } finally {
        conn.release();
      }
    }, 50);

    // 测试 2: 复杂查询
    console.log('\n测试 2: 复杂查询性能');

    await tester.measure('SELECT 带 JOIN 查询', async () => {
      const conn = await pool.getConnection();
      try {
        await conn.query(
          'SELECT u.*, r.role_name FROM t_user u LEFT JOIN t_role r ON u.role_id = r.id WHERE u.status = ? LIMIT 10',
          [1]
        );
      } finally {
        conn.release();
      }
    }, 30);

    await tester.measure('SELECT 带聚合函数', async () => {
      const conn = await pool.getConnection();
      try {
        await conn.query('SELECT COUNT(*) as total FROM t_user WHERE status = ?', [1]);
      } finally {
        conn.release();
      }
    }, 50);

    // 测试 3: 插入操作
    console.log('\n测试 3: 插入操作性能');

    const testUserId = `TEST_USER_${Date.now()}`;

    await tester.measure('INSERT 单条记录', async () => {
      const conn = await pool.getConnection();
      try {
        await conn.query(
          'INSERT INTO t_user (user_id, username, password, nickname, sex, status, create_time) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [`${testUserId}_${Math.random()}`, `testuser_${Math.random()}`, 'hashed_password', 'Test User', 1, 1, new Date()]
        );
      } finally {
        conn.release();
      }
    }, 3);

    // 测试 4: 更新操作
    console.log('\n测试 4: 更新操作性能');

    await tester.measure('UPDATE 单条记录', async () => {
      const conn = await pool.getConnection();
      try {
        await conn.query(
          'UPDATE t_user SET nickname = ?, update_time = ? WHERE user_id = ?',
          [`Updated_${Date.now()}`, new Date(), 'USER176268783437156O8P']
        );
      } finally {
        conn.release();
      }
    }, 10);

    // 测试 5: 删除操作（软删除）
    console.log('\n测试 5: 删除操作性能');

    await tester.measure('DELETE 软删除', async () => {
      const conn = await pool.getConnection();
      try {
        await conn.query(
          'UPDATE t_user SET status = 0, delete_time = ? WHERE user_id = ?',
          [new Date(), `${testUserId}_${Math.random()}`]
        );
      } finally {
        conn.release();
      }
    }, 3);

    // 打印结果
    tester.printResults();

    // 分析和建议
    tester.analyzeAndSuggest();

    console.log('\n' + '═'.repeat(80));
    console.log('✅ 数据库性能测试完成！');
    console.log('═'.repeat(80) + '\n');

  } catch (error) {
    console.error('❌ 测试执行出错:', error.message);
  } finally {
    await pool.end();
  }
}

// 运行测试
runDatabasePerformanceTests().catch(error => {
  console.error('测试执行失败:', error);
  process.exit(1);
});

