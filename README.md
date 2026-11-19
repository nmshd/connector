# Connector

[![GitHub Actions CI](https://github.com/nmshd/connector/workflows/Publish/badge.svg)](https://github.com/nmshd/connector/actions?query=workflow%3APublish)

This monorepo consolidates the following packages / applications:

| Component                                     | Version(s)                                                                                                                                                                                                                                                                  |
| --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [The Connector docker images](./)             | [see ghcr.io](https://github.com/nmshd/connector/pkgs/container/connector)                                                                                                                                                                                                  |
| [The Connector helm charts](./helmChart)      | [see ghcr.io](https://github.com/nmshd/connector/pkgs/container/connector-helm-chart) and [![Artifact Hub](https://img.shields.io/endpoint?url=https://artifacthub.io/badge/repository/enmeshed-connector)](https://artifacthub.io/packages/search?repo=enmeshed-connector) |
| [TypeScript Connector SDK](packages/sdk/)     | [![npm version](https://badge.fury.io/js/@nmshd%2fconnector-sdk.svg)](https://www.npmjs.com/package/@nmshd/connector-sdk)                                                                                                                                                   |
| [TypeScript Connector Types](packages/types/) | [![npm version](https://badge.fury.io/js/@nmshd%2fconnector-types.svg)](https://www.npmjs.com/package/@nmshd/connector-types)                                                                                                                                               |

## Documentation

The documentation for this project is available at https://enmeshed.eu/integrate.

To get started developing in this repository, see the [developer's guide](README_dev.md).

## OpenTelemetry

The Connector exports logs, traces and metrics through OpenTelemetry. Configure the SDK with standard `OTEL_*` environment variables:

```sh
OTEL_EXPORTER_OTLP_ENDPOINT=http://otel-collector:4318
OTEL_EXPORTER_OTLP_PROTOCOL=http/protobuf
OTEL_SERVICE_NAME=enmeshed.connector
NMSHD_OTEL_LOG_LEVEL=INFO
```

The service name defaults to `enmeshed.connector`. Existing log appenders remain active, and application logs accepted by the configured log4js category levels are exported directly through the OpenTelemetry Logs SDK. `NMSHD_OTEL_LOG_LEVEL` controls the minimum level exported through OpenTelemetry and defaults to `INFO`; accepted values are `ALL`, `TRACE`, `DEBUG`, `INFO`, `WARN`, `ERROR`, `FATAL` and `OFF`. This setting does not affect other log appenders. Exporters, endpoints, protocols, authentication headers, sampling and resource attributes can be configured with their standard OpenTelemetry environment variables.

Only the instrumentations used by the Connector are included: `amqplib`, `express`, `grpc`, `host-metrics`, `http`, `mongodb`, `redis`, `runtime-node` and `undici`. `OTEL_NODE_ENABLED_INSTRUMENTATIONS` and `OTEL_NODE_DISABLED_INSTRUMENTATIONS` can select a subset of this list. Set `OTEL_SDK_DISABLED=true` to disable telemetry entirely.

## Feedback

Please file any bugs or feature requests by creating an [issue](https://github.com/nmshd/feedback/issues).

Share your feedback with the enmeshed team by contributing to the [discussions](https://github.com/nmshd/feedback/discussions).

## Contribute

Contribution to this project is highly appreciated. Head over to our [contribution guide](https://github.com/nmshd/.github/blob/main/CONTRIBUTING.md) to learn more.

## License

[AGPL-3.0-or-later](LICENSE)
