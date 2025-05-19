FROM node:18-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Thêm script để chờ DNS
COPY wait-for-service.sh /wait-for-service.sh
RUN chmod +x /wait-for-service.sh
CMD ["/wait-for-service.sh"]