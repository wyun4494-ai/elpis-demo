# 配置环境基础镜像
FROM node:18

# 创建工作目录
RUN mkdir -p /app/elpis-demo

# 进入工作目录
WORKDIR /app/elpis-demo

# 先复制 package.json 文件，利用 Docker 缓存
COPY package*.json /app/elpis-demo/

# 安装依赖（利用缓存，只有 package.json 变化时才重新安装）
RUN npm config set registry https://registry.npmmirror.com && \
    npm install --production=false

# 再复制其他代码文件
COPY . /app/elpis-demo

# 构建前端资源（测试环境使用生产构建）
RUN echo "========== 开始构建前端资源 ==========" && \
    _ENV=production node ./build.js && \
    echo "========== 构建完成 =========="

# 调试：检查构建产物位置
RUN echo "========== 检查构建产物 ==========" && \
    echo "检查 dist 目录结构:" && \
    ls -la ./app/public/dist/ || echo "dist 目录不存在" && \
    echo "" && \
    echo "检查 dist/prod 目录:" && \
    ls -la ./app/public/dist/prod/ || echo "dist/prod 目录不存在" && \
    echo "" && \
    echo "查找所有 .tpl 文件:" && \
    find ./app/public -name "*.tpl" || echo "未找到任何 .tpl 文件"

# 将构建产物从 dist/prod/ 复制到 dist/（如果存在）
RUN if [ -d "./app/public/dist/prod" ]; then \
      echo "========== 复制构建产物 ==========" && \
      cp -rv ./app/public/dist/prod/* ./app/public/dist/ && \
      echo "✅ 前端资源已复制到 dist/ 目录"; \
    else \
      echo "⚠️ dist/prod 目录不存在，跳过复制"; \
    fi

# 最终验证
RUN echo "========== 最终验证 ==========" && \
    echo "dist 目录内容:" && \
    ls -la ./app/public/dist/ && \
    echo "" && \
    echo "检查模板文件:" && \
    ls -la ./app/public/dist/*.tpl || echo "❌ 错误: 未找到模板文件！"

# 设置运行时环境变量
ENV TimeZone=Asia/Shanghai
ENV _ENV=beta
ENV PORT=8083

# 暴露端口
EXPOSE 8083

# 使用 node 直接启动，避免 Windows 的 set 命令问题
CMD ["node", "server.js"]