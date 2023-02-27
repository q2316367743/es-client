FROM node:16.15.1

LABEL author="esion" version="2.6.1"

# 拷贝文件
COPY dist /app/es-client

# 工作目录
WORKDIR /app

# 安装yarn
RUN ["npm", "install", "yarn", "-g"]

# 安装依赖
RUN ["yarn", "install"]

# 设置时区
RUN rm -rf /etc/localtime && ln -s /usr/share/zoneinfo/Asia/Shanghai /etc/localtime

# 暴露端口
EXPOSE 3000

# 执行
ENTRYPOINT [ "yanr", "start" ]
