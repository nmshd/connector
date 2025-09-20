#!/usr/bin/env zsh

set -e

curl -H "X-API-KEY: This_is_a_test_APIKEY_with_30_chars+" -X POST http://localhost:3001/api/core/v1/Account/Sync
