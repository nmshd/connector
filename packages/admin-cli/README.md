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
* [`connector-admin identity status`](#connector-admin-identity-status)
* [`connector-admin identityDeletion approve`](#connector-admin-identitydeletion-approve)
* [`connector-admin identityDeletion cancel`](#connector-admin-identitydeletion-cancel)
* [`connector-admin identityDeletion init`](#connector-admin-identitydeletion-init)
* [`connector-admin identityDeletion reject`](#connector-admin-identitydeletion-reject)

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

_See code: [@oclif/plugin-autocomplete](https://github.com/oclif/plugin-autocomplete/blob/v3.1.7/src/commands/autocomplete/index.ts)_

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

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.2.6/src/commands/help.ts)_

## `connector-admin identity init`

Initialize an identity for a new connector

```
USAGE
  $ connector-admin identity init [--json] [-c <value>]

FLAGS
  -c, --config=<value>  [default: ./config.json] config file

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Initialize an identity for a new connector

EXAMPLES
  $ connector-admin identity init
```

_See code: [dist/commands/identity/init.js](https://github.com/packages/connector-admin-cli/blob/v1.0.0/dist/commands/identity/init.js)_

## `connector-admin identity status`

Get the current status of you identity

```
USAGE
  $ connector-admin identity status [--json] [-c <value>]

FLAGS
  -c, --config=<value>  [default: ./config.json] config file

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Get the current status of you identity

EXAMPLES
  $ connector-admin identity status
```

_See code: [dist/commands/identity/status.js](https://github.com/packages/connector-admin-cli/blob/v1.0.0/dist/commands/identity/status.js)_

## `connector-admin identityDeletion approve`

Initialize an identity deletion

```
USAGE
  $ connector-admin identityDeletion approve [--json] [-c <value>]

FLAGS
  -c, --config=<value>  [default: ./config.json] config file

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Initialize an identity deletion

EXAMPLES
  $ connector-admin identityDeletion approve
```

_See code: [dist/commands/identityDeletion/approve.js](https://github.com/packages/connector-admin-cli/blob/v1.0.0/dist/commands/identityDeletion/approve.js)_

## `connector-admin identityDeletion cancel`

Initialize an identity deletion

```
USAGE
  $ connector-admin identityDeletion cancel [--json] [-c <value>]

FLAGS
  -c, --config=<value>  [default: ./config.json] config file

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Initialize an identity deletion

EXAMPLES
  $ connector-admin identityDeletion cancel
```

_See code: [dist/commands/identityDeletion/cancel.js](https://github.com/packages/connector-admin-cli/blob/v1.0.0/dist/commands/identityDeletion/cancel.js)_

## `connector-admin identityDeletion init`

Initialize an identity deletion

```
USAGE
  $ connector-admin identityDeletion init [--json] [-c <value>]

FLAGS
  -c, --config=<value>  [default: ./config.json] config file

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Initialize an identity deletion

EXAMPLES
  $ connector-admin identityDeletion init
```

_See code: [dist/commands/identityDeletion/init.js](https://github.com/packages/connector-admin-cli/blob/v1.0.0/dist/commands/identityDeletion/init.js)_

## `connector-admin identityDeletion reject`

Initialize an identity deletion

```
USAGE
  $ connector-admin identityDeletion reject [--json] [-c <value>]

FLAGS
  -c, --config=<value>  [default: ./config.json] config file

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Initialize an identity deletion

EXAMPLES
  $ connector-admin identityDeletion reject
```

_See code: [dist/commands/identityDeletion/reject.js](https://github.com/packages/connector-admin-cli/blob/v1.0.0/dist/commands/identityDeletion/reject.js)_
<!-- commandsstop -->
