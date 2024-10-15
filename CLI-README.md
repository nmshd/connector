

<!-- toc -->

- [Installation](#installation)
- [Usage](#usage)
  * [Identity](#identity)
    + [Identity Init](#identity-init)
  * [Start](#start)

<!-- tocstop -->

# Installation

```
npm i -g @nmshd/connector-admin-cli
```

<!-- generated start -->

# Usage

```
connector <command>

Commands:
  connector identity [command]  identity related commands
  connector start               start the connector

Options:
      --version  Show version number                                   [boolean]
  -h, --help     Show help                                             [boolean]
```

## Identity

```
connector identity [command]

identity related commands

Commands:
  connector identity init  initialize the identity

Options:
      --version  Show version number                                   [boolean]
  -h, --help     Show help                                             [boolean]

```

### Identity Init

```
connector identity init

initialize the identity

Options:
      --version  Show version number                                   [boolean]
  -h, --help     Show help                                             [boolean]
  -c, --config   Path to the custom configuration file
                 Can also be set via the CUSTOM_CONFIG_LOCATION env variable
                                                                        [string]

```

## Start

```
connector start

start the connector

Options:
      --version  Show version number                                   [boolean]
  -h, --help     Show help                                             [boolean]
  -c, --config   Path to the custom configuration file
                 Can also be set via the CUSTOM_CONFIG_LOCATION env variable
                                                                        [string]

```

<!-- generated end -->
