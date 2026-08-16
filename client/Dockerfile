FROM node:22-alpine as deps
 
WORKDIR /app

COPY package.json ./

RUN npm install 


# second stage 

FROM node:22-alpine as build

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY . .

ARG VITE_API_BASE_URL=http://localhost:5000/api
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build 


# third stage 

FROM nginx:alpine as runner 

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
