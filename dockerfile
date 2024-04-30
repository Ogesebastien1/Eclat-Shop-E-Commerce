# Dockerfile
FROM php:8.2-fpm

ENV CORS_ALLOW_ORIGIN="*"

# Install necessary packages and pdo_pgsql extension
RUN apt-get update && apt-get install -y \
    libpq-dev \
    && docker-php-ext-install pdo_pgsql \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Install Symfony CLI and move the binary to a directory in the PATH
RUN curl -sS https://get.symfony.com/cli/installer | bash \
    && mv /root/.symfony5/bin/symfony /usr/local/bin/symfony

COPY ./app /var/www/my_project

RUN chmod +x /var/www/my_project/init.sh

# Add the watch script
COPY ./watch.sh /var/www/my_project/watch.sh
RUN chmod +x /var/www/my_project/watch.sh

# Run the watch script in the background
CMD /var/www/my_project/watch.sh &

# Set init.sh as the entry point
ENTRYPOINT ["/var/www/my_project/init.sh"]