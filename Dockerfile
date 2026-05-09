FROM docker.m.daocloud.io/node:20-alpine

WORKDIR /app

COPY learning-management-stie/package.json ./

RUN npm config set registry https://registry.npmmirror.com && \
    npm install

COPY learning-management-stie/ ./

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "3000"]
