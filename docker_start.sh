#!/bin/bash
# Start script for transaction-search-tool
PORT=18580

exec node --inspect=0.0.0.0:9229 /opt/dist/app/app.js -- ${PORT}
