# Setup on new machine

## Prerequisites:

1. Download and install [Docker Desktop](https://www.docker.com/products/docker-desktop)
2. Download and install [Node JS](https://nodejs.org/en/download/)
3. Download and install [Git](https://git-scm.com/downloads)
4. Clone the [cns-connector](https://github.com/nmshd/cns-connector) repository
5. Install the following npm packages **globally**:
    1. typescript
    2. cpx

Only for Developers:

1. Download and install [VS Code](https://code.visualstudio.com/)
2. Optional: install the VS Code extension [Tasks](https://marketplace.visualstudio.com/items?itemName=actboy168.tasks)
3. run `npm i`

## How to run

To run a single Business Connector instance, execute the following command:

```shell
docker compose -f .dev/docker-compose.debug.yml -f .dev/docker-compose.debug.[env].yml up --build
```

(replace `[env]` with `dev`, `stage` or `prod`, depending on which Backbone environment you want the Business Connector to run in)

After a few seconds you should see the following output:

```console
bc-api-1-stage             | [2021-01-25T11:27:40.788] [INFO] Transport.Transport - Transportinitialized
...
bc-api-1-stage             | [2021-01-25T11:27:41.241] [INFO] HttpServerModule - Listening on port 80
...
bc-api-1-stage             | [2021-01-25T11:27:41.241] [INFO] Runtime - Started all modules.
```

You can access the Swagger UI of the Business Connector under http://localhost:3000/docs.

## How to debug

Do NOT execute the steps from the previous chapter.

1. Execute the VS Code task `Compile`
2. Execute the VS Code task `Run 1` and select the appropriate Backbone environment and components to start.
3. Wait until you see the following output on the console:
    ```console
    bc-api-1-stage             | [2021-01-25T11:27:40.788] [INFO] Transport.Transport - Transport initialized
    ...
    bc-api-1-stage             | [2021-01-25T11:27:41.241] [INFO] HttpServerModule - Listening on port 80
    ...
    bc-api-1-stage             | [2021-01-25T11:27:41.241] [INFO] Runtime - Started all modules.
    ```
4. To attach the debugger, switch to the VS Code "Run" view, select the Run configuration "Attach to BC 1" and click the Run button.

If you're running on Linux (or wsl), every time you save a file, the server is restarted, as long as you don't cancel the `Compile` task.

If you're running on Windows you have to execute the `Restart` task after you saved a file. This is because when mounting a folder from the Windows file system into a Linux Docker container, the file system events are not being mapped properly.

# Connector SDK development

## Build

-   run `npm ci` (this will symlink the SDK in the node_modules of the BC)
-   run `npm run build --workspaces` to build the changes for the BC and it's packages

## Publish

The SDK is published, when you merge the project to main while having changed the package version.
