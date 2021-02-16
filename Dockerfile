FROM node:13.8.0-alpine3.11 as builder
WORKDIR /test
COPY package.json package-lock.json ./
RUN npm install

COPY ./src ./

ENTRYPOINT ["node", "index.js"]
