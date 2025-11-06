/**
 * 认证服务
 * 处理用户注册、登录验证等业务逻辑
 *
 * 业务说明：
 * - 注册时密码使用 bcrypt 加密存储
 * - 默认注册用户角色为普通用户（role_id = 2）
 * - 性别默认为 3（其他）
 * - 用户名唯一性检查
 *
 * @class AuthService
 * @extends BaseService
 */
module.exports = (app) => {
  const BaseService = require('@lesheng/elpis').Service.Base(app);
  const bcrypt = require('bcrypt');
  const jwt = require('jsonwebtoken');
  const moment = require('moment');

  return class AuthService extends BaseService {

    /**
     * 用户注册
     *
     * 业务规则：
     * - 检查用户名是否已存在
     * - 密码使用 bcrypt 加密（加盐轮数：10）
     * - 自动生成 user_id（USER + 时间戳 + 随机字符串）
     * - 默认角色为普通用户（role_id = 2）
     * - 默认性别为 3（其他）
     *
     * @param {Object} params - 注册参数
     * @param {string} params.nickname - 昵称
     * @param {string} params.username - 用户名
     * @param {string} params.password - 密码（明文）
     * @returns {Promise<Object>} 返回新用户信息（不含密码）
     * @throws {Error} 如果用户名已存在，抛出异常
     */
    async register(params) {
      const { nickname, username, password } = params;

      // 1. 检查用户名是否已存在
      const existingUser = await app.database('t_user')
        .where('username', username)
        .where('status', 1)
        .first();

      if (existingUser) {
        throw new Error('用户名已存在');
      }

      // 2. 密码加密（bcrypt，加盐轮数 10）
      const hashedPassword = await bcrypt.hash(password, 10);

      // 3. 生成用户ID（USER + 时间戳 + 随机字符串）
      const userId = `USER${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

      // 4. 插入新用户
      await app.database('t_user').insert({
        user_id: userId,
        username,
        password: hashedPassword,
        nickname,
        role_id: 2, // 默认普通用户
        sex: 3, // 默认性别为"其他"
        status: 1,
        create_time: new Date()
      });

      // 5. 查询新用户信息（不返回密码）
      const newUser = await app.database('t_user')
        .where('user_id', userId)
        .select('user_id', 'username', 'nickname', 'role_id', 'sex', 'create_time')
        .first();

      return newUser;
    }

    /**
     * 用户登录验证
     *
     * 业务规则：
     * - 验证用户名是否存在
     * - 使用 bcrypt 验证密码
     * - 生成 JWT Token（根据 remember 参数设置过期时间）
     * - 返回用户信息和 Token
     *
     * @param {Object} params - 登录参数
     * @param {string} params.username - 用户名
     * @param {string} params.password - 密码（明文）
     * @param {boolean} [params.remember=false] - 是否记住我
     * @returns {Promise<Object>} 返回 { token, user }
     * @throws {Error} 如果用户名或密码错误，抛出异常
     */
    async login(params) {
      const { username, password, remember = false } = params;

      // 1. 查询用户（包含密码）
      const user = await app.database('t_user')
        .where('username', username)
        .where('status', 1)
        .first();

      if (!user) {
        throw new Error('用户名或密码错误');
      }

      // 2. 验证密码
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new Error('用户名或密码错误');
      }

      // 3. 生成 JWT Token
      const jwtSecret = app.config.jwtSecretKey;
      const expiresIn = remember ? '7d' : '1d'; // 记住我：7天，否则1天

      const token = jwt.sign(
        {
          user_id: user.user_id,
          username: user.username,
          role_id: user.role_id
        },
        jwtSecret,
        { expiresIn }
      );

      // 4. 返回用户信息（不含密码）
      const userInfo = {
        user_id: user.user_id,
        username: user.username,
        nickname: user.nickname,
        role_id: user.role_id,
        sex: user.sex,
        desc: user.desc
      };

      return {
        token,
        user: userInfo
      };
    }

    /**
     * 根据用户名查询用户信息
     *
     * @param {string} username - 用户名
     * @returns {Promise<Object|undefined>} 返回用户信息（不含密码），不存在则返回 undefined
     */
    async getUserByUsername(username) {
      const user = await app.database('t_user')
        .where('username', username)
        .where('status', 1)
        .select('user_id', 'username', 'nickname', 'role_id', 'sex', 'desc', 'create_time')
        .first();

      if (user) {
        user.create_time = moment(user.create_time).format('YYYY-MM-DD HH:mm:ss');
      }

      return user;
    }

    /**
     * 根据 user_id 查询用户信息
     *
     * @param {string} userId - 用户ID
     * @returns {Promise<Object|undefined>} 返回用户信息（不含密码），不存在则返回 undefined
     */
    async getUserById(userId) {
      const user = await app.database('t_user')
        .where('user_id', userId)
        .where('status', 1)
        .select('user_id', 'username', 'nickname', 'role_id', 'sex', 'desc', 'create_time')
        .first();

      if (user) {
        user.create_time = moment(user.create_time).format('YYYY-MM-DD HH:mm:ss');
      }

      return user;
    }
  };
};

