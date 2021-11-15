if ! type "socat" > /dev/null; then
  sudo apt-get install socat
fi

nmrs() {
    container="$1"; shift
    echo "rs" | socat EXEC:"docker attach $container",pty STDIN
}

complete_nmrs() {
    COMPREPLY=("$(docker ps --format '{{.Names}}')")
}

complete -F complete_nmrs nmrs