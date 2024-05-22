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
@nmshd/connector-admin-cli/0.0.0 linux-x64 node-v20.10.0
$ connector-admin --help [COMMAND]
USAGE
  $ connector-admin COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`connector-admin autocomplete [SHELL]`](#connector-admin-autocomplete-shell)
* [`connector-admin hello PERSON`](#connector-admin-hello-person)
* [`connector-admin hello world`](#connector-admin-hello-world)
* [`connector-admin help [COMMAND]`](#connector-admin-help-command)
* [`connector-admin init [NAME]`](#connector-admin-init-name)

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

## `connector-admin hello PERSON`

Say hello

```
USAGE
  $ connector-admin hello PERSON -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Who is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ connector-admin hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [src/commands/hello/index.ts](https://github.com/packages/connector-admin-cli/blob/v0.0.0/src/commands/hello/index.ts)_

## `connector-admin hello world`

Say hello world

```
USAGE
  $ connector-admin hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ connector-admin hello world
  hello world! (./src/commands/hello/world.ts)
```

_See code: [src/commands/hello/world.ts](https://github.com/packages/connector-admin-cli/blob/v0.0.0/src/commands/hello/world.ts)_

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

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.0.21/src/commands/help.ts)_

## `connector-admin init [NAME]`

describe the command here

```
USAGE
  $ connector-admin init [NAME]

ARGUMENTS
  NAME  (a|b) dir to read

DESCRIPTION
  describe the command here

EXAMPLES
  $ connector-admin init
```

_See code: [src/commands/init.ts](https://github.com/packages/connector-admin-cli/blob/v0.0.0/src/commands/init.ts)_
<!-- commandsstop -->
