#!/usr/bin/env zsh

set -e

curl -H "X-API-KEY: xxx" -X POST http://localhost:3001/api/v1/Account/Sync
