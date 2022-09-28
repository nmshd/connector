#!/usr/bin/env zsh

set -e

curl -H "X-API-KEY: xxx" -X POST http://localhost:3000/api/v2/Account/Sync
