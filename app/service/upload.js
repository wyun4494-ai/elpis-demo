/**
 * 图片上传服务
 * 处理图片上传相关的业务逻辑和文件存储
 *
 * 存储规范：
 * - 路径格式：app/public/uploads/{uploadType}/YYYY-MM/
 * - 文件命名：{uuid}.{ext}
 * - 文件大小限制：5MB
 * - 支持格式：jpg/jpeg/png/gif/webp
 *
 * @class UploadService
 * @extends BaseService
 */
module.exports = (app) => {
  const BaseService = require('@lesheng/elpis').Service.Base(app);
  const path = require('path');
  const fs = require('fs');
  const { v4: uuidv4 } = require('uuid');

  return class UploadService extends BaseService {

    /**
     * 上传图片
     *
     * 业务流程：
     * 1. 验证文件类型和大小
     * 2. 生成唯一文件名（UUID + 原扩展名）
     * 3. 构建存储路径（按类型和日期分目录）
     * 4. 保存文件到磁盘
     * 5. 返回访问 URL
     *
     * @param {Object} file - multer 处理后的文件对象
     * @param {Buffer} file.buffer - 文件内容（Buffer）
     * @param {string} file.originalname - 原始文件名
     * @param {string} file.mimetype - 文件MIME类型
     * @param {number} file.size - 文件大小（字节）
     * @param {string} [uploadType='common'] - 上传类型（common/brand/product）
     * @returns {Promise<Object>} 返回上传结果
     * @returns {string} returns.filename - 生成的文件名
     * @returns {string} returns.originalname - 原始文件名
     * @returns {string} returns.filepath - 文件存储路径
     * @returns {string} returns.url - 访问URL
     * @returns {number} returns.size - 文件大小
     * @returns {string} returns.mimetype - 文件MIME类型
     */
    async uploadImage(file, uploadType = 'common') {
      if (!file) {
        throw new Error('未接收到文件');
      }

      // 1. 验证文件类型
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.mimetype)) {
        throw new Error('只支持上传 jpg/jpeg/png/gif/webp 格式的图片');
      }

      // 2. 验证文件大小（默认最大5MB）
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new Error('图片大小不能超过 5MB');
      }

      // 3. 生成文件名：uuid + 原扩展名
      const ext = path.extname(file.originalname);
      const filename = `${uuidv4()}${ext}`;

      // 4. 构建存储路径
      const uploadDir = this.getUploadDir(uploadType);
      const filepath = path.join(uploadDir, filename);

      // 5. 确保目录存在
      this.ensureDir(uploadDir);

      // 6. 保存文件到磁盘
      if (file.path) {
        // multer 保存的临时文件（磁盘存储模式）
        fs.renameSync(file.path, filepath);
      } else if (file.buffer) {
        // 内存中的文件（内存存储模式）
        fs.writeFileSync(filepath, file.buffer);
      } else {
        throw new Error('文件数据格式不正确');
      }

      // 7. 返回访问URL
      const fileUrl = this.getFileUrl(uploadType, filename);

      return {
        filename: filename,
        originalname: file.originalname,
        filepath: filepath,
        url: fileUrl,
        size: file.size,
        mimetype: file.mimetype
      };
    }

    /**
     * 获取上传目录
     *
     * 目录结构：
     * - app/public/uploads/{uploadType}/YYYY-MM/
     * - 例如：app/public/uploads/brand/2025-10/
     *
     * @param {string} uploadType - 上传类型（common/brand/product）
     * @returns {string} 返回上传目录路径
     */
    getUploadDir(uploadType) {
      // 1. 上传根目录
      const baseDir = path.join(process.cwd(), 'app', 'public', 'uploads');

      // 2. 按类型分目录
      const typeDir = path.join(baseDir, uploadType);

      // 3. 按日期分目录（年-月）
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const dateDir = path.join(typeDir, `${year}-${month}`);

      return dateDir;
    }

    /**
     * 确保目录存在
     */
    ensureDir(dir) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    }


    /**
     * 获取文件访问URL
     */
    getFileUrl(uploadType, filename) {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      
      // 返回相对路径URL
      return `/uploads/${uploadType}/${year}-${month}/${filename}`;
    }

    /**
     * 删除文件
     */
    async deleteFile(filepath) {
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
        return true;
      }
      return false;
    }
  };
};

