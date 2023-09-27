#!/bin/bash
#
# Start script for transaction search tool

PORT=3000

exec node /opt/dist/app/app.js -- ${PORT}
