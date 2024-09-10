FROM node:16.20.2

WORKDIR /app

COPY dist /app

COPY dist-static /app/server

RUN npm install

CMD ["node","index.js"]