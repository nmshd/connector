# Connector SDK

[![npm version](https://badge.fury.io/js/%40nmshd%2fconnector-sdk.svg)](https://www.npmjs.com/package/@nmshd/connector-sdk)

The Connector SDK is a TypeScript library that provides an easy way to interact with the Connector API.

## Documentation

The documentation for this project is available at https://enmeshed.eu/integrate.

To get started developing in this repository, see the [developer's guide](README_dev.md).

## Feedback

Please file any bugs or feature requests by creating an [issue](https://github.com/nmshd/feedback/issues).

Share your feedback with the enmeshed team by contributing to the [discussions](https://github.com/nmshd/feedback/discussions).

## Contribute

Contribution to this project is highly appreciated. Head over to our [contribution guide](https://github.com/nmshd/.github/blob/main/CONTRIBUTING.md) to learn more.

## License

[AGPL-3.0-or-later](LICENSE)

## SDK Docs

### Installation

```
npm i @nmshd/connector-sdk
```

### Usage

1. Initialize the `ConnectorClient`

    ```typescript
    const connectorClient = ConnectorClient.create({ baseUrl: "https://<INSERT_YOUR_CONNECTOR_DOMAIN_HERE>", apiKey: "<INSERT_YOUR_API_KEY_HERE>" });
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

### Further Documentation

For a description of the different methods you can look at one of the OpenAPI UIs, which are hosted on your Connector:

- SwaggerUI: https://<INSERT_YOUR_CONNECTOR_DOMAIN_HERE>/docs/swagger
- SwaggerUI: https://<INSERT_YOUR_CONNECTOR_DOMAIN_HERE>/docs/rapidoc
