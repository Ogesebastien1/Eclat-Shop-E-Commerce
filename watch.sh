#!/bin/sh

# Define the directory to watch
WATCH_DIR="/var/www/my_project/src/Entity"

# Store the initial checksum of the directory
CHECKSUM=$(find $WATCH_DIR -type f | sort | xargs md5sum)

while true
do
    # Get the current checksum of the directory
    CURRENT_CHECKSUM=$(find $WATCH_DIR -type f | sort | xargs md5sum)

    # If the checksum has changed, run the doctrine:schema:update command
    if [ "$CHECKSUM" != "$CURRENT_CHECKSUM" ]
    then
        cd /var/www/my_project && php bin/console doctrine:schema:update --force
        CHECKSUM=$CURRENT_CHECKSUM
    fi

    # Wait for a minute before checking again
    sleep 60
done