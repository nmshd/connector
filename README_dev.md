## Setup

1. download and install [Docker Desktop](https://www.docker.com/products/docker-desktop)
2. download and install [Node JS](https://nodejs.org/en/download/)
3. Optional: install the npm package `typescript` **globally** to use the `tsc` command without the `npx` prefix
4. Optional: install the VS Code extension [Tasks](https://marketplace.visualstudio.com/items?itemName=actboy168.tasks)
5. Optional: restarting the Connector using the VSCode task `More Tasks > Restart` requires the tool socat. Make sure to install it on your system. This can be done for example using `apt-get install socat` on Ubuntu and `brew install socat` using Homebrew.
6. run `npm i`

## How to run

> To configure the Connector for development you have to create an `.env` file in the `.dev` folder.
>
> You can use the `.env.example` file as a template. The file can be named anything you want (it should be prefixed with `.env`), but we recommend to use `.env` as the name. If you want to use multiple `.env` files for different environments, you can postfix the file name with the environment name (e.g. `.env.stage`).

To run a single Connector instance, execute the following command:

```shell
docker compose -f .dev/compose.yml --env-file [path_to_your_env_file] up --build connector-1
```

To run two Connector instances, execute the following command:

```shell
docker compose -f .dev/compose.yml --env-file [path_to_your_env_file] up --build connector-1 connector-2
```

> ⚠️ Replace `[path_to_your_env_file]` with e.g. `.dev/.env`, depending on where your env file is located.

> ℹ️ You can also use the VS Code task `Run 1` or `Run 2` and configure the appropriate env file to start your Connector instances.

After a few seconds you should see the following output:

```console
connector-1  | [2021-01-25T11:27:40.788] [INFO] Transport.Transport - Transport initialized
...
connector-1  | [2021-01-25T11:27:41.241] [INFO] HttpServerModule - Listening on port 80
...
connector-1  | [2021-01-25T11:27:41.241] [INFO] Runtime - Started all modules.
```

You can access the Swagger UI of the Connector under http://localhost:3000/docs.

To use an local Backbone, that can be started with `npm run start:backbone`, you can use the `.env.local` in the `.dev` folder

```shell
docker compose -f .dev/compose.yml --env-file .env.local up --build connector-1
```

```shell
docker compose -f .dev/compose.yml --env-file .env.local up --build connector-1 connector-2
```

## How to debug

1. Execute the VS Code task `Compile`. This task executes `tsc -w` (watches the code and compiles on change).
2. Run the Connector as described in the previous chapter.
3. To attach the debugger, switch to the VS Code "Run" view, select the Run configuration `Attach to Connector 1` or `Attach to Connector 2` and click the Run button.

If you're running on Linux (or wsl), every time you save a file, the server is restarted, as long as you don't cancel the `Compile` task.

If you're running on Windows you have to execute the `Restart` task after you saved a file. This is because when mounting a folder from the Windows file system into a Linux Docker container, the file system events are not being mapped properly.

## How to test

### Local Runtime

To use a local runtime you need to set the envvar $RUNTIME_PATH (e.g. inside a local `.env` file in the root folder of the project). The $RUNTIME_PATH needs to contain the path to the runtime mono-repository root folder, either relative or absolute.

```bash
export RUNTIME_PATH=.../path/to/local/runtime
```

Afterwards you can run `npm run link-runtime`. This will copy the build result and sources from you local runtime in you node_modules folder.

To use the npm version of the runtime again you need to run `npm run unlink-runtime` this will restore the version in the package.json

### Remote Backbone

Set the following environment variables:

- NMSHD_TEST_BASEURL (the Backbone baseUrl to test against)
- NMSHD_TEST_CLIENTID (the Backbone clientId for the configured baseUrl)
- NMSHD_TEST_CLIENTSECRET (the Backbone clientSecret for the configured baseUrl)

> We recommend to persist these variables for example in your `.bashrc` / `.zshrc` or in the Windows environment variables.

### Local Backbone

To start a local Backbone, execute the following command:

```shell
npm run start:backbone
```

Set the following environment variables:

- NMSHD_TEST_BASEURL to `http://localhost:8090`
- NMSHD_TEST_CLIENTID to `test`
- NMSHD_TEST_CLIENTSECRET to `test`

> We recommend to persist these variables for example in your `.bashrc` / `.zshrc` or in the Windows environment variables.

### Local Backbone Prod Docker image testing

To test the productive image you can use `docker compose -f .dev/compose.prodtest.yml --env-file .dev/compose.backbone.env`.

For example to start the compose you can run it like
`docker compose -f .dev/compose.prodtest.yml --env-file .dev/compose.backbone.env up --build -d`

or to take it down again
`docker compose -f .dev/compose.prodtest.yml --env-file .dev/compose.backbone.env down`

to check if the prod image still works you can run.

`docker logs -f connector`

to see the logs of the Connector.

Afterward you can use the connector-tui or an REST client to test the Connector.

### Run the tests

```shell
npm run test:local
```

If you only want to run a single test suite you can use the following command:

```shell
npm run test:local -- testSuiteName
```

## Run the Connector without Docker, MongoDB or other Dependencies

1. clone this repository `git clone https://github.com/nmshd/connector.git`
2. change into the directory `cd connector`
3. install the npm dependencies `npm i`
4. build the Connector `npm run build`
5. create a config file (for example `local.config.json`)

    ```
    {
      "debug": true,
      "transportLibrary": {
          "baseUrl": "<base-url>",
          "platformClientId": "<client-id>",
          "platformClientSecret": "<client-secret>"
      },
      "database": { "driver": "lokijs", "folder": "./" },
      "logging": { "categories": { "default": { "appenders": ["console"] } } },
      "infrastructure": { "httpServer": { "apiKey": "<api-key-or-empty-string>", "port": 8080 } },
      "modules": { "coreHttpApi": { "docs": { "enabled": true } } }
    }
    ```

6. replace the placeholders in the config with real values
7. start the Connector using `CUSTOM_CONFIG_LOCATION=./local.config.json node dist/index.js start`

It's now possible to access the Connector on port 8080. Validating this is possible by accessing `http://localhost:8080/docs/swagger` in the browser.

# Connector SDK development

## Build

- run `npm ci` (this will symlink the SDK in the node_modules of the Connector)
- run `npm run build --workspaces` to build the changes for the Connector and its packages

## Publish

The SDK is published, when you merge the project to main while having changed the package version.
