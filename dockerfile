# Dockerfile
FROM php:8.2-apache

# Install necessary packages and pdo_pgsql extension
RUN apt-get update && apt-get install -y \
    libpq-dev \
    && docker-php-ext-install pdo_pgsql

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Configure Apache to serve the Symfony application
RUN rm -rf /var/www/html && ln -s /var/www/my_project/public /var/www/html

# Install Symfony CLI and move the binary to a directory in the PATH
RUN curl -sS https://get.symfony.com/cli/installer | bash \
    && mv /root/.symfony5/bin/symfony /usr/local/bin/symfony

# Set ServerName to suppress the Apache warning
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

# Start Symfony
CMD ["symfony", "server:start"]