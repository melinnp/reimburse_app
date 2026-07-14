# ============================================================
# Stage 1: Composer — install PHP dependencies (production only)
# ============================================================
FROM php:8.2-cli AS composer-stage

# Bring in the Composer binary from the official image (runs under php:8.2-cli)
COPY --from=composer:2.8 /usr/bin/composer /usr/bin/composer

# Install system tools Composer needs to download packages:
#   - unzip / git  : used as fallback download strategies
#   - libzip-dev   : needed to compile the PHP zip extension
RUN apt-get update && apt-get install -y --no-install-recommends \
        git \
        unzip \
        libzip-dev \
    && docker-php-ext-install zip \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy dependency manifest first to leverage Docker layer cache
COPY composer.json composer.lock ./

# Install production dependencies only, no scripts that need the full app
RUN composer install \
    --no-dev \
    --no-interaction \
    --no-autoloader \
    --no-scripts \
    --prefer-dist

# Copy the full application source
COPY . .

# Generate optimized autoloader now that all source is present
RUN composer dump-autoload --optimize --no-dev

# ============================================================
# Stage 2: Node — compile frontend assets (Vite / Tailwind)
# ============================================================
FROM node:20-alpine AS node-stage

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --ignore-scripts

COPY vite.config.js tailwind.config.js postcss.config.js ./
COPY resources/ resources/

RUN npm run build

# ============================================================
# Stage 3: Final runtime image
# ============================================================
FROM php:8.2-apache

# ---------- system dependencies & PHP extensions ----------
RUN apt-get update && apt-get install -y --no-install-recommends \
        libpng-dev \
        libjpeg-dev \
        libwebp-dev \
        libzip-dev \
        zip \
        unzip \
        curl \
    && docker-php-ext-configure gd --with-jpeg --with-webp \
    && docker-php-ext-install -j"$(nproc)" \
        pdo \
        pdo_mysql \
        gd \
        zip \
        pcntl \
        bcmath \
        opcache \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# ---------- Apache: enable mod_rewrite, point to /public ----------
RUN a2enmod rewrite headers

# Replace the default VirtualHost with one that serves Laravel's /public dir
RUN sed -i 's|/var/www/html|/var/www/html/public|g' \
        /etc/apache2/sites-available/000-default.conf \
    && sed -i 's|/var/www/html|/var/www/html/public|g' \
        /etc/apache2/apache2.conf

# Allow .htaccess overrides so Laravel routing works
RUN sed -i '/<Directory \/var\/www\/>/,/<\/Directory>/ s/AllowOverride None/AllowOverride All/' \
        /etc/apache2/apache2.conf

# ---------- OPcache tuning for production ----------
RUN { \
    echo 'opcache.memory_consumption=128'; \
    echo 'opcache.interned_strings_buffer=8'; \
    echo 'opcache.max_accelerated_files=10000'; \
    echo 'opcache.revalidate_freq=0'; \
    echo 'opcache.validate_timestamps=0'; \
    echo 'opcache.fast_shutdown=1'; \
    } > /usr/local/etc/php/conf.d/opcache.ini

# ---------- PHP upload / memory limits ----------
RUN { \
    echo 'upload_max_filesize=10M'; \
    echo 'post_max_size=12M'; \
    echo 'memory_limit=256M'; \
    echo 'max_execution_time=60'; \
    } > /usr/local/etc/php/conf.d/limits.ini

WORKDIR /var/www/html

# Copy application from previous stages
COPY --from=composer-stage /app .
COPY --from=node-stage  /app/public/build ./public/build

# Storage bootstrap — Laravel needs these directories writable at runtime
# They will be mounted as a named volume; we set up symlinks via entrypoint.
RUN mkdir -p storage/app/public \
             storage/app/nota \
             storage/app/profile \
             storage/framework/cache/data \
             storage/framework/sessions \
             storage/framework/views \
             bootstrap/cache \
    && chown -R www-data:www-data /var/www/html \
    && chmod -R 775 storage bootstrap/cache

# Copy entrypoint last so a change here doesn't bust the big layers above
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost/api/health 2>/dev/null || curl -f http://localhost/ 2>/dev/null || exit 1

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["apache2-foreground"]
