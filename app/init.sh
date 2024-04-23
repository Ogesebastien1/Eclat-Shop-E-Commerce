#!/bin/bash

# Navigate to the project directory
cd /var/www/my_project

# Install composer dependencies
composer install

# Update the database schema
php bin/console doctrine:schema:update --force

# Start Symfony server
symfony server:start