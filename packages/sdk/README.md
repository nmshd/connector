# Installation

```
npm i @nmshd/connector-sdk
```

# Usage

1. Initialize the `ConnectorClient`

    ```typescript
    const connectorClient = ConnectorClient.create({
        baseUrl: "https://<INSERT_YOUR_CONNECTOR_DOMAIN_HERE>",
        apiKey: "<INSERT_YOUR_API_KEY_HERE>"
    });
    ```

2. Start using the client

    ```typescript
    const FILE_PATH = "path-to-file";
    const uploadOwnFileResponse = await client.files.uploadOwnFile({
        title: "My awesome file",
        description: "Test file",
        expiresAt: "2023-01-01T00:00:00Z",
        file: await fs.promises.readFile(FILE_PATH),
        filename: "my-awesome-file.txt"
    });

    if (uploadOwnFileResponse.isSuccess) {
        console.log(uploadOwnFileResponse.result);
    } else {
        console.log(uploadOwnFileResponse.error);
    }
    ```

# Documentation

For a description of the different methods you can look at one of the OpenAPI UIs, which are hosted on your Connector:

-   SwaggerUI: https://<INSERT_YOUR_CONNECTOR_DOMAIN_HERE>/docs/swagger
-   SwaggerUI: https://<INSERT_YOUR_CONNECTOR_DOMAIN_HERE>/docs/rapidoc
