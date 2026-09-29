# ==============================================================================
# Gujarat Police CCTV Intelligence Platform — Frontend Dockerfile
# Multi-stage build: Vite compilation + Nginx production server
# ==============================================================================

# Stage 1: Build React/Vite SPA
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency specifications
COPY package.json package-lock.json* ./

# Install npm dependencies
RUN npm ci || npm install

# Copy application source tree
COPY . .

# Optional build-time argument for API base URL (empty defaults to same-origin /api proxy)
ARG VITE_API_URL=""
ENV VITE_API_URL=${VITE_API_URL}

# Build production bundle
RUN npm run build

# Stage 2: Production Nginx Server
FROM nginx:alpine

# Remove default nginx static page and configuration
RUN rm -rf /usr/share/nginx/html/* /etc/nginx/conf.d/default.conf

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled static assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD wget -qO- http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
