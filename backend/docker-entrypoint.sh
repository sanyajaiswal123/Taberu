#!/bin/bash
set -e

# Wait for MongoDB (optional, can be done via docker-compose)

# Run config and route cache for production
php artisan config:cache
php artisan route:cache || true
php artisan view:cache || true

exec "$@"
