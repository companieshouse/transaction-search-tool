#!/bin/bash
# Start script for transaction-search-tool

# Default port to 18580 for the docker-chs-development environment.
export PORT=${PORT:-18580}

npm run chs-dev
