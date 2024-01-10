if ! type "socat" >/dev/null; then
  if type "apt-get" >/dev/null; then
    sudo apt-get install socat
  fi

  if type "brew" >/dev/null; then
    brew install socat
  fi
fi

if ! type "docker" >/dev/null; then
  echo "docker not found"
  exit 1
fi

if ! type "tsc" >/dev/null; then
  npm i -g typescript cpx
fi

code --install-extension actboy168.tasks
