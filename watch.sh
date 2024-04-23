#!/bin/sh

# Define the directory to watch
WATCH_DIR="/var/www/my_project/src/Entity"

# Store the initial checksum of the directory
CHECKSUM=$(find $WATCH_DIR -type f | sort | xargs md5sum)

while true
do
    # Wait for a minute before checking again
    sleep 30

    # Get the current checksum of the directory
    CURRENT_CHECKSUM=$(find $WATCH_DIR -type f | sort | xargs md5sum)

    # If the checksum has changed, wait for a few seconds to ensure the user has finished writing, then run the doctrine:schema:update command
    if [ "$CHECKSUM" != "$CURRENT_CHECKSUM" ]
    then
        # Wait for a few seconds to ensure the user has finished writing
        sleep 5

        cd /var/www/my_project && php bin/console doctrine:schema:update --force
        CHECKSUM=$CURRENT_CHECKSUM
    fi
done