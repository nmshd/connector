# Connector Helm Chart

## Documentation

You can find a more detailed documentation [in the enmeshed docs](https://enmeshed.eu/operate/setup-with-helm-charts).

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
                authentication:
                    apiKey:
                        keys:
                            <an-api-key-name>:
                                key: "<api-key>"
    ```

### Install the chart

> you can list available versions [here](https://github.com/nmshd/connector/pkgs/container/connector-helm-chart)

```sh
helm install connector oci://ghcr.io/nmshd/connector-helm-chart --version <version> -f <your-config-file>.yaml
```

## OpenTelemetry

Configure the OpenTelemetry SDK through environment variables to export logs, traces and metrics:

```yaml
pod:
    connector:
        environment:
            - name: OTEL_EXPORTER_OTLP_ENDPOINT
              value: "http://otel-collector:4318"
            - name: OTEL_EXPORTER_OTLP_PROTOCOL
              value: "http/protobuf"
            - name: OTEL_SERVICE_NAME
              value: "enmeshed.connector"
            - name: NMSHD_OTEL_LOG_LEVEL
              value: "INFO"
```

The service name defaults to `enmeshed.connector`. Existing log appenders remain active, and application logs accepted by the configured log4js category levels are exported directly through the OpenTelemetry Logs SDK. `NMSHD_OTEL_LOG_LEVEL` controls the minimum level exported through OpenTelemetry and defaults to `INFO`; accepted values are `ALL`, `TRACE`, `DEBUG`, `INFO`, `WARN`, `ERROR`, `FATAL` and `OFF`. This setting does not affect other log appenders. Other standard `OTEL_*` variables can configure authentication headers, sampling, resource attributes and signal-specific endpoints.

Only the instrumentations used by the Connector are included: `amqplib`, `express`, `grpc`, `host-metrics`, `http`, `mongodb`, `redis`, `runtime-node` and `undici`. `OTEL_NODE_ENABLED_INSTRUMENTATIONS` and `OTEL_NODE_DISABLED_INSTRUMENTATIONS` can select a subset of this list. Set `OTEL_SDK_DISABLED=true` to disable telemetry entirely.

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
            authentication:
                apiKey:
                    keys:
                        <an-api-key-name>:
                            key: "<api-key>"

pod:
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
