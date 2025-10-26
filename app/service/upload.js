module.exports = (app) => {
  const BaseService = require('@lesheng/elpis').Service.Base(app);
  const path = require('path');
  const fs = require('fs');
  const { v4: uuidv4 } = require('uuid');

  return class UploadService extends BaseService {

    /**
     * 上传图片
     */
    async uploadImage(file, uploadType = 'common') {
      if (!file) {
        throw new Error('未接收到文件');
      }

      // 验证文件类型
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.mimetype)) {
        throw new Error('只支持上传 jpg/jpeg/png/gif/webp 格式的图片');
      }

      // 验证文件大小（默认最大5MB）
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new Error('图片大小不能超过 5MB');
      }

      // 生成文件名：uuid + 原扩展名
      const ext = path.extname(file.originalname);
      const filename = `${uuidv4()}${ext}`;

      // 构建存储路径
      const uploadDir = this.getUploadDir(uploadType);
      const filepath = path.join(uploadDir, filename);

      // 确保目录存在
      this.ensureDir(uploadDir);

      // 移动文件（multer已经保存到临时目录）
      if (file.path) {
        // multer 保存的临时文件
        fs.renameSync(file.path, filepath);
      } else if (file.buffer) {
        // 内存中的文件
        fs.writeFileSync(filepath, file.buffer);
      } else {
        throw new Error('文件数据格式不正确');
      }

      // 返回访问URL
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
     */
    getUploadDir(uploadType) {
      // 上传根目录
      const baseDir = path.join(process.cwd(), 'app', 'public', 'uploads');
      
      // 按类型分目录
      const typeDir = path.join(baseDir, uploadType);
      
      // 按日期分目录（年-月）
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

