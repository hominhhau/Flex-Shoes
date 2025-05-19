#!/bin/sh

# Chờ service api-gateway sẵn sàng
until nslookup api-gateway.flexshoes.svc.cluster.local; do
  echo "Waiting for api-gateway service to be ready..."
  sleep 2
done

echo "Service api-gateway is ready. Starting Nginx..."
exec nginx -g "daemon off;"