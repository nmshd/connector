## Setup

1. download and install [Docker Desktop](https://www.docker.com/products/docker-desktop)
2. download and install [Node JS](https://nodejs.org/en/download/)
3. install the npm packages `typescript` and `cpx` **globally**
4. Optional: install the VS Code extension [Tasks](https://marketplace.visualstudio.com/items?itemName=actboy168.tasks)
5. run `npm i`

## How to run

> To configure the Connector for development you have to create an `.env` file in the `.dev` folder.
>
> You can use the `.env.example` file as a template. The file can be named anything you want (it should be prefixed with `.env`), but we recommend to use `.env` as the name. If you want to use multiple `.env` files for different environments, you can postfix the file name with the environment name (e.g. `.env.stage`).

To run a single Connector instance, execute the following command:

```shell
docker compose -f .dev/docker-compose.yml --env-file [path_to_your_env_file] up --build connector-1
```

To run two Connector instances, execute the following command:

```shell
docker compose -f .dev/docker-compose.yml --env-file [path_to_your_env_file] up --build connector-1 connector-2
```

> ⚠️ Replace `[path_to_your_env_file]` with e.g. `.dev/.env`, depending on where your env file is located.

> ℹ️ You can also use the VS Code task `Run 1` or `Run 2` and configure the appropriate env file to start your connector instances.

After a few seconds you should see the following output:

```console
connector-1  | [2021-01-25T11:27:40.788] [INFO] Transport.Transport - Transportinitialized
...
connector-1  | [2021-01-25T11:27:41.241] [INFO] HttpServerModule - Listening on port 80
...
connector-1  | [2021-01-25T11:27:41.241] [INFO] Runtime - Started all modules.
```

You can access the Swagger UI of the Connector under http://localhost:3000/docs.

## How to debug

1. Execute the VS Code task `Compile`. This task executes `tsc -w` (watches the code and compiles on change).
2. Run the Connector as described in the previous chapter.
3. To attach the debugger, switch to the VS Code "Run" view, select the Run configuration `Attach to Connector 1` or `Attach to Connector 2` and click the Run button.

If you're running on Linux (or wsl), every time you save a file, the server is restarted, as long as you don't cancel the `Compile` task.

If you're running on Windows you have to execute the `Restart` task after you saved a file. This is because when mounting a folder from the Windows file system into a Linux Docker container, the file system events are not being mapped properly.

## How to test

To configure the Connector for testing you have to fill the following environment variables:

-   NMSHD_TEST_BASEURL (the backbone baseUrl to test against)
-   NMSHD_TEST_CLIENTID (the backbone clientId for the configured baseUrl)
-   NMSHD_TEST_CLIENTSECRET (the backbone clientSecret for the configured baseUrl)

> We recommend to persist these variables for example in your `.bashrc` / `.zshrc` or in the Windows environment variables.

After you have configured the environment variables, you can run the tests with the following command:

```shell
npm run test:local
```

If you only want to run a single test suite you can use the following command:

```shell
npm run test:local -- testSuiteName
```

# Connector SDK development

## Build

-   run `npm ci` (this will symlink the SDK in the node_modules of the Connector)
-   run `npm run build --workspaces` to build the changes for the Connector and its packages

## Publish

The SDK is published, when you merge the project to main while having changed the package version.
