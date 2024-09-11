FROM node:16.20.2

LABEL org.opencontainers.image.authors="esion"
LABEL version="1.0"
LABEL description="elasticsearch客户端"

WORKDIR /app
EXPOSE 8888

COPY dist /app/dist
COPY dist-static /app/dist-static
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json

RUN npm install

CMD ["node","dist/index.js"]