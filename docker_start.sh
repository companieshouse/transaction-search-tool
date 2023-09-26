#!/bin/bash
# Start script for transaction-search-tool
npm i
PORT=18580

exec node /opt/app/app.js -- ${PORT}