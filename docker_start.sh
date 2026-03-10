#!/bin/bash
# Start script for transaction-search-tool
PORT=18580

exec node --no-opt -r /proc/.reset --inspect=0.0.0.0:9229 -r ts-node/register dist/app/bin/nodemon-entry.js
