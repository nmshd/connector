# Connector Helm Chart

## Usage

### Login to the registry

```sh
helm registry login -u <username> https://ghcr.io
```

### Create a config file

1. create a config file, e.g. `config.yaml`
2. write the following config into the file and replace the placeholders with your values:

    ```yaml
    config:
        database:
            connectionString: "<connection-string>"
        transportLibrary:
            platformClientId: "<client-id>"
            platformClientSecret: "<client-secret>"
        infrastructure:
            httpServer:
                apiKey: "<api-key>"
    ```

### Install the chart

> you can list available versions [here](https://github.com/nmshd/cns-connector/pkgs/container/connector-helm-chart)

```sh
helm install connector oci://ghcr.io/nmshd/connector-helm-chart --version <version> -f <your-config-file>.yaml
```
