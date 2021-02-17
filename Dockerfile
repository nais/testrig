FROM node:13.8.0-alpine3.11 as builder
WORKDIR /test
COPY package.json package-lock.json ./
RUN npm install

COPY --from=redboxoss/scuttle:latest /scuttle /bin/scuttle
ENV ENVOY_ADMIN_API=http://127.0.0.1:15000
ENV ISTIO_QUIT_API=http://127.0.0.1:15020

COPY ./src ./

ENTRYPOINT ["scuttle", "node", "index.js"]
