# Serve static files with nginx (smallest footprint available)
FROM nginx:1.27-alpine

# Remove default nginx content
RUN rm -rf /usr/share/nginx/html/*

# Copy our static frontend files
COPY public/ /usr/share/nginx/html/

# Custom nginx config: SPA fallback + correct MIME types
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
    CMD wget -qO- http://localhost/ || exit 1
