# -------- Build stage --------
FROM node:20-alpine AS builder
WORKDIR /app

# Install deps first for better caching
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
# Choose one installer; npm ci used here
RUN npm ci || npm install

# Copy source and install required libs
COPY . .
# Install requested libs (one time; normally put these in package.json)
# RUN npm install -D vite \
#     && npm install react react-dom react-router-dom \
#     && npm install -D tailwindcss postcss autoprefixer \
#     && npm install framer-motion \
#     && npm install firebase 

# # Tailwind init if not present (harmless if already done)
# RUN [ -f tailwind.config.js ] || npx tailwindcss init -p

# Build for production (Vite outputs to dist/)
RUN npm run build

# -------- Runtime stage --------
# -------- Runtime stage --------
FROM nginx:1.27-alpine
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/dist /usr/share/nginx/html

# Write SPA-friendly Nginx config using heredoc (no escaping issues)
RUN cat > /etc/nginx/conf.d/default.conf << 'EOF'
server {
  listen 80;
  server_name _;
  root /usr/share/nginx/html;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }

  location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico|woff2?)$ {
    expires 7d;
    add_header Cache-Control "public, max-age=604800, immutable";
  }
}
EOF

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
