#!/bin/bash
#
# Start script for transaction search tool

# Default port to 3000 for ECS environments.
PORT=${PORT:-3000}

exec node /opt/dist/app/app.js -- ${PORT}
