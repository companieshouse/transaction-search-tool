#!/bin/bash
# Start script for transaction-search-tool

exec node --no-opt -r /proc/.reset --inspect=0.0.0.0:9229 -r ts-node/register dist/bin/nodemon-entry.js
