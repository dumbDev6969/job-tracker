FROM php:8.3-cli

RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libpq-dev \
    && docker-php-ext-install pdo_pgsql \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY . .

RUN composer install --no-dev --optimize-autoloader

# Ensure storage & cache dirs exist and are writable
RUN mkdir -p storage/framework/{sessions,views,cache/data} \
    storage/logs \
    bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# Cache routes & views for production (NOT config — env vars aren't available at build time)
RUN php artisan config:clear \
    && php artisan route:cache \
    && php artisan view:cache

ENV PHP_CLI_SERVER_WORKERS=4

# exec replaces the shell so PHP receives SIGTERM from Render on shutdown
CMD exec php artisan serve --host=0.0.0.0 --port=$PORT