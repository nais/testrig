FROM node:lts-alpine3.13

RUN apk --no-cache add bash curl

COPY ./src ./
COPY package.json package-lock.json ./
RUN npm install

ENTRYPOINT ["node", "index.js"]
