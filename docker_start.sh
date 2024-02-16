#!/bin/bash
# Start script for transaction-search-tool
PORT=18580

exec node /opt/dist/app/app.js -- ${PORT}
