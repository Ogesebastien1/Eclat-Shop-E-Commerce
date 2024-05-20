#!/bin/bash

# Install necessary system utilities and PHP extensions
if ! dpkg -s unzip &> /dev/null; then
    echo "Installing unzip..."
    apt-get update && apt-get install -y unzip
fi

if ! dpkg -s zip &> /dev/null; then
    echo "Installing zip..."
    apt-get install -y zip
fi

if ! dpkg -s git &> /dev/null; then
    echo "Installing Git..."
    apt-get install -y git
fi

# Check if Composer is installed, if not install it
if [ ! -f /usr/local/bin/composer ]; then
    echo "Installing Composer..."
    curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
fi

# Navigate to the project directory
cd /var/www/my_project

# update php comfiguration
cp /usr/local/etc/php/php.ini-development /usr/local/etc/php/php.ini
echo "Updating php.ini settings..."
sed -i 's/upload_max_filesize = .*/upload_max_filesize = 100M/' /usr/local/etc/php/php.ini
sed -i 's/post_max_size = .*/post_max_size = 100M/' /usr/local/etc/php/php.ini

# Install composer dependencies
composer install || { echo 'Composer install failed'; exit 1; }

# Install the Symfony Runtime component
composer require symfony/runtime || { echo 'Composer require failed'; exit 1; }

# Optimize Composer autoloader
composer dump-autoload || { echo 'Composer dump-autoload failed'; exit 1; }

# Update the database schema
php bin/console doctrine:schema:drop --force || { echo 'Database schema update failed'; exit 1; }
php bin/console doctrine:schema:update --force || { echo 'Database schema update failed'; exit 1; }

# Check if the test database exists and create it if it doesn't
php bin/console doctrine:database:create --if-not-exists --env=test || { echo 'Test database creation failed'; exit 1; }

php bin/console doctrine:schema:update --env=test --force || { echo 'Database schema create failed'; exit 1; }

# Start Symfony server
symfony server:start || { echo 'Symfony server start failed'; exit 1; }