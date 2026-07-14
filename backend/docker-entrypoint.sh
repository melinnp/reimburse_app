#!/bin/sh
set -e

# ─────────────────────────────────────────────
# Laravel Docker Entrypoint
# Runs once at container start before Apache.
# ─────────────────────────────────────────────

echo "[entrypoint] Fixing storage permissions..."
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

echo "[entrypoint] Caching config, routes, and views..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "[entrypoint] Running database migrations..."
# --force is required in non-interactive (production) environments
php artisan migrate --force

echo "[entrypoint] Starting Apache..."
exec "$@"
