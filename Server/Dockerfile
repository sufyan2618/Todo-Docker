#stage 1 :dependency stage
FROM node:22-alpine AS deps

WORKDIR /app

COPY package.json ./

RUN npm install

# stage 2 : runner stage

FROM node:22-alpine AS runner

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY package.json ./

COPY src ./src

EXPOSE 5000

CMD ["node", "src/server.js"]
