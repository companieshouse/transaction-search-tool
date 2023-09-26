#!/bin/bash
#
# Start script for overseas entities web

PORT=18580

exec node /opt/app/app.js -- ${PORT}