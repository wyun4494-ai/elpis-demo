# 配置环境基础镜像
FROM node:18

# 创建工作目录
RUN mkdir -p /app/elpis-demo

# 进入工作目录
WORKDIR /app/elpis-demo

# 复制代码内容到工作目录
COPY . /app/elpis-demo

# 安装依赖
RUN npm install --production=false

# 构建前端资源（直接使用 Linux 环境变量语法）
RUN _ENV=production node ./build.js

# 将构建产物从 dist/prod/ 移动到 dist/（生产环境构建输出在 dist/prod/）
RUN if [ -d "./app/public/dist/prod" ]; then \
      cp -r ./app/public/dist/prod/* ./app/public/dist/ && \
      echo "✅ 前端资源已复制到 dist/ 目录"; \
    fi

# 验证构建产物
RUN ls -la ./app/public/dist/*.tpl || echo "⚠️ 警告: 未找到模板文件"

# 设置运行时环境变量
ENV TimeZone=Asia/Shanghai
ENV _ENV=beta
ENV PORT=8083

# 暴露端口
EXPOSE 8083

# 使用 node 直接启动，避免 Windows 的 set 命令问题
CMD ["node", "server.js"]