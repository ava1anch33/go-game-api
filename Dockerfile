FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

# 复制源代码
COPY . .


# 第二阶段：运行阶段（更小的镜像）
FROM node:20-alpine

WORKDIR /app

# 从 builder 复制 node_modules 和源代码
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/src ./src
COPY --from=builder /app/.env* ./

EXPOSE 4000

USER node

CMD ["npm", "start"]