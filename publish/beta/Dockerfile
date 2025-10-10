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

# 构建前端资源
RUN npm run build:prod

# 设置环境变量
ENV TimeZone=Asia/Shanghai

# 暴露端口
EXPOSE 8083

ENTRYPOINT npm run beta