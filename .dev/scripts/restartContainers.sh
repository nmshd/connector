#!/usr/bin/env zsh

set -e

docker ps --no-trunc --format '{{.ID}};{{.Names}};{{.Command}}' | while read container; do
    cid="$(echo "$container" | cut -d ';' -f 1)"
    name="$(echo "$container" | cut -d ';' -f 2)"
    cmd="$(echo "$container" | cut -d ';' -f 3)"

    if [[ "$name" =~ '^connector-' ]] && [[ "$cmd" =~ '^"nodemon' ]]; then
        echo "Restarting container \033[1;32m$name\033[0m."
        echo "rs" | socat EXEC:"docker attach $cid",pty STDIN
    fi
done
