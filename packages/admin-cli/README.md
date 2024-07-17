@nmshd/connector-admin-cli
=================

Admin cli for the enmeshed connector


[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@nmshd/connector-admin-cli.svg)](https://npmjs.org/package/@nmshd/connector-admin-cli)
[![Downloads/week](https://img.shields.io/npm/dw/@nmshd/connector-admin-cli.svg)](https://npmjs.org/package/@nmshd/connector-admin-cli)


<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @nmshd/connector-admin-cli
$ connector-admin COMMAND
running command...
$ connector-admin (--version)
@nmshd/connector-admin-cli/1.0.0 linux-x64 node-v22.2.0
$ connector-admin --help [COMMAND]
USAGE
  $ connector-admin COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`connector-admin autocomplete [SHELL]`](#connector-admin-autocomplete-shell)
* [`connector-admin help [COMMAND]`](#connector-admin-help-command)
* [`connector-admin identity init`](#connector-admin-identity-init)

## `connector-admin autocomplete [SHELL]`

Display autocomplete installation instructions.

```
USAGE
  $ connector-admin autocomplete [SHELL] [-r]

ARGUMENTS
  SHELL  (zsh|bash|powershell) Shell type

FLAGS
  -r, --refresh-cache  Refresh cache (ignores displaying instructions)

DESCRIPTION
  Display autocomplete installation instructions.

EXAMPLES
  $ connector-admin autocomplete

  $ connector-admin autocomplete bash

  $ connector-admin autocomplete zsh

  $ connector-admin autocomplete powershell

  $ connector-admin autocomplete --refresh-cache
```

_See code: [@oclif/plugin-autocomplete](https://github.com/oclif/plugin-autocomplete/blob/v3.0.17/src/commands/autocomplete/index.ts)_

## `connector-admin help [COMMAND]`

Display help for connector-admin.

```
USAGE
  $ connector-admin help [COMMAND...] [-n]

ARGUMENTS
  COMMAND...  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for connector-admin.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.2.5/src/commands/help.ts)_

## `connector-admin identity init`

Initialize an identity

```
USAGE
  $ connector-admin identity init [-c <value>]

FLAGS
  -c, --config=<value>  [default: ./config.json] config file

DESCRIPTION
  Initialize an identity

EXAMPLES
  $ connector-admin identity init
```

_See code: [dist/commands/identity/init.js](https://github.com/packages/connector-admin-cli/blob/v1.0.0/dist/commands/identity/init.js)_
<!-- commandsstop -->
