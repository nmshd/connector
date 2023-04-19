# Connector Helm Chart

## Documentation

You can find a more detailed documentation [in the enmeshed docs](https://enmeshed.eu/integrate/helm-chart).

## Usage

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

## FerretDB Sidecar

The chart can be configured to deploy a sidecar container with FerretDB. This is useful if you want to connect the Connector to a PostgreSQL database.

```yaml
config:
    database:
        connectionString: "mongodb://localhost:27017"
    transportLibrary:
        platformClientId: "<client-id>"
        platformClientSecret: "<client-secret>"
    infrastructure:
        httpServer:
            apiKey: "<api-key>"
            port: 80

pod:
    connector:
        containerPort: 80

    ferretdb:
        enabled: true
        tag: 0.8.1
        environment:
            - name: FERRETDB_POSTGRESQL_URL
            value: "postgres://user:pass@host:5432/db?pool_max_conns=20"
            - name: FERRETDB_TELEMETRY
            value: disable
            - name: FERRETDB_LOG_LEVEL
            value: debug
```
