# Changelog

## 3.5.0

-> SDK 2.2.1

-   upgrade the runtime version to 2.6.1
    -   support for the new [FreeTextRequestItem](https://enmeshed.eu/integrate/data-model-request-items#freetextrequestitem)
    -   support for the AttributeValue [Statement](https://enmeshed.eu/integrate/data-model-attribute-values#statement)

## 3.4.0

-> SDK 2.2.0

-   expose new IQL query type via the Connector API
    -   `POST /api/v2/Attributes/ValidateIQLQuery` to validate an IQL query
    -   `POST /api/v2/Attributes/ExecuteIQLQuery` to execute an IQL query
-   upgrade the runtime version to 2.5.2

## 3.3.10

-   (helm chart) set defaults for the liveness and readiness probes
-   make health check more robust and performant

## 3.3.9

-   Docker images are now provided for the following architectures:
    -   `linux/amd64`
    -   `linux/arm64`
    -   `linux/arm64/v8`
    -   `linux/arm/v7`

## 3.3.8

-> SDK 2.1.8

-   upgrade libraries
-   upgrade the runtime to version 2.4.7

## 3.3.7

-   use fully qualified app name in the helm chart

## 3.3.6

-   bump npm packages

## 3.3.5

-   upgrade nodejs to 18.16.0

## 3.3.4

-   the helm chart now allows to configure the image of the `ferretdb` sidecar (use `ferretdb.image` in the config file)

## 3.3.3

-   set the `CAP_NET_BIND_SERVICE` capability for the node executable in the docker image (required for the Connector to bind to ports < 1024 when running as non-root)

## 3.3.2

-   the helm chart now deploys a Deployment instead of a Pod (some configuration options have changed significantly)

## 3.3.1

-> SDK 2.1.7

-   upgrade the runtime to version 2.4.4
-   upgrade nodejs to 18.15.0

## 3.3.0

-   do not send stack traces over http by default
-   add a debug mode for the connector (use `{ "debug": true }` in the config file) where stack traces are sent over http
-   `coreHttpApi` docs arent allowed to enable in the production mode
-   the `httpServer` infrastructure now allows to configure helmet fine grained over the `helmetOptions` option

## 3.2.8

-   better error handling in the `amqpPublisher` module

## 3.2.7

-> SDK 2.1.6

-   upgrade nodejs to 18.14.2
-   upgrade the runtime to version 2.4.4

## 3.2.6

-> SDK 2.1.5

-   upgrade the runtime to version 2.3.6 (fixes a bug that forbids querying for Requests by their Request item's `@type`)

## 3.2.5

-> SDK 2.1.4

-   upgrade the runtime to version 2.3.4

## 3.2.4

-> SDK 2.1.3

-   \[helm-chart\] add a `ferretdb` sidecar container to the helm chart to connect to PostgreSQL databases
-   upgrade the runtime to version 2.3.3
-   upgrade nodejs to 18.13.0

## 3.2.3

-   update the favicon used in the openapi docs

## 3.2.2

-> SDK 2.1.2

-   upgrade the runtime to version 2.3.1

## 3.2.1

-   add a helm chart for the connector

## 3.2.0

-   upgrade the runtime to version 2.3.0 (RequestModule full onExistingRelationship support)

## 3.1.2

-   upgrade the runtime to version 2.2.1

## 3.1.1

-> SDK 2.1.1

-   upgrade the runtime to version 2.1.1 (additional validations for Request Items)

## 3.1.0

-> SDK 2.1.0

-   upgrade the runtime to version 2.1.0 (possibility to send `ThirdPartyRelationshipAttributeQuery`s with more than one `thirdParty` by passing an array of strings instead of a single string)

## 3.0.4

-   upgrade the runtime to version 2.0.1 ([`ProprietaryJSON`](https://enmeshed.eu/integrate/data-model-attribute-values#proprietaryjson) AttributeValueType)

## 3.0.3

-> SDK 2.0.3

-   remove `@context` and `@version` from documentations

## 3.0.2

-> SDK 2.0.2

-   remove RelationshipStatus `Revoked`

## 3.0.1

-> SDK 2.0.1

-   add RelationshipStatus `Revoked`

## 3.0.0

-> SDK 2.0.0

-   upgrade the runtime to version 2.0.0
-   switch from `root` user to the `node` user in the Docker image
-   upgrade nodejs to 18.11.0
-   the deprecated webhooks module has been removed
-   change API version to v2 (-> route prefix changes from /api/v1 to /api/v2)
-   remove support for revoke of Relationship Changes
-   enable the new Runtime-builtin Module AttributeListenerModule
-   new `POST /api/v1/Attributes/ExecuteThirdPartyRelationshipAttributeQuery` route for executing ThirdPartyRelationshipAttribute queries
-   bugfix(webhooksV2): events are now correctly triggered for triggers with wildcards
-   update AttributeQuery requests (`POST /api/v2/Attributes/ExecuteIdentityAttributeQuery` & `POST /api/v2/Attributes/ExecuteRelationshipAttributeQuery`) to match the Runtime API
-   `peer` is now optional for validating outgoing requests using the `/api/v2/Requests/Outgoing/Validate` route
-   enable GET of Files via truncated reference
-   remove unused properties from the DTOs
-   remove Message.relationshipIds
-   add Message.recipients.relationshipId
-   the Connector now validates the Accept header correctly on every route
-   routes for generating QrCodes for Files and RelationshipTemplates without Tokens
-   bugfix: update misspelled Health in openapidoc to ConnectorHealth
-   add documentation and update SDK for `maxNumberOfAllocations`
-   add routes for executing `IdentityAttributeQuery` and `RelationshipAttributeQuery`
-   add attribute routes
-   two mandatory new modules: `RequestModule` and `DeciderModule`
-   amqpPublisher module
-   add `/api/v2/Requests/Incoming(/...)` and `/api/v2/Requests/Outgoing(/...)` routes.

## 2.3.5

-   upgrade nodejs to 16.16.0

## 2.3.4

-   bugfix: add missing axios dependency

## 2.3.3

-   upgrade the runtime to version 1.4.2

## 2.3.2

-   upgrade the runtime to version 1.4.1

## 2.3.1

-> SDK 1.2.2

-   upgrade the runtime to version 1.4.0

## 2.3.0

-   new module: 'webhooksV2' (see https://enmeshed.eu/integrate/connector-configuration#webhooksV2 for more details on how to configure it)
-   the 'webhooks' module is now deprecated

## 2.2.1

-   format number strings (e.g. "1.9" and "1") to their number representations in the environment variable parsing

## 2.2.0

-> SDK 1.2.0

-   upgrade the runtime to version 1.3.4
-   add routes to create and validate challenges
-   upgrade NodeJS to version 16.14.0 (LTS)
-   add a possibility to configure the Connector using environment variables

    nested fields can now be separated by a colon (`:`) or a double underscore (`__`), casing in the property names will not be changed (no more conversion to UPPER_CASE neccessary)

    e.g. `INFRASTRUCTURE__HTTP_SERVER__API_KEY` (the old representation of `{ "infrastructure": { "httpServer": { "apiKey": "y" } } }`) will now be configured as `infrastructure:httpServer:apiKey`

## 2.1.10

-   upgrade the runtime to version 1.2.20
    > this fixes the validation of `expiresAt` fields

## 2.1.9

-   upgrade the runtime to version 1.2.19

## 2.1.8

-   upgrade the runtime to version 1.2.18

## 2.1.7

-   upgrade the runtime to version 1.2.17
-   add configuration option for the coreHttpApi to persist the authentication in rapidoc using the browsers `localStorage`
    > **Note**: this feature is disabled by default and not recommended for production use.

## 2.1.6

-   upgrade the runtime to version 1.2.16
-   rendered QR-Codes now include the prefix `nmshd://qr#` that opens the Enmeshed App when the Code is scanned using a QR-Code Reader

## 2.1.5

-   remove `upgrade-insecure-requests` from the CSP to allow accessing the swagger and rapidoc UIs using http

## 2.1.4

-> SDK 1.1.7

-   run `tini` together with the Connector to ensure kernel events will be propagated to the Connector

## 2.1.3

-> SDK 1.1.6

-   upgrade the runtime to version 1.2.11
-   check for creation change status in the AutoAcceptRelationshipCreationChanges module to avoid and error that results in accepting an already accepted change

## 2.1.2

-   upgrade the runtime to version 1.2.4

## 2.1.1

-   upgrade the runtime to version 1.0.8

## 2.1.0

-   the `httpServer` configuration moved from `modules` to `infrastructure`
-   the `apiKey` in the `httpServer` infrastructure is now mandatory

## 2.0.8

-> SDK 1.1.5

-   open source release

## 2.0.7

-> SDK 1.1.4

-   preparations for open source release

## 2.0.6

-   update OpenAPI docs

## 2.0.5

-   use DATABASE\_\_DB_NAME (aliased to DATABASE_NAME) instead of ACCOUNT for configuring the MongoDB database
    > for backwards compatibilitiy you can still use ACCOUNT
-   the `httpEndpointEventPublisher` module was renamed to `webhooks`

## 2.0.4

-   upgrade NodeJS to version 16.13.0 (LTS)
-   send CORS header for invalidJsonInPayload error

## 2.0.3

-   simplify CORS policy and disable it by default (allow everthing by setting env var `MODULES__HTTP_SERVER__CORS__ORIGIN` to `true`)
-   upgrade the runtime to version 1.0.4

## 2.0.2

-> SDK 1.1.3

-   upgrade the runtime to version 1.0.2

## 2.0.1

-> SDK 1.1.2

-   the `Monitoring/Support` endpoint now additionally returns the runtime version as part of its `version` property
-   the `Monitoring/Version` endpoint now additionally returns the runtime version

## 2.0.0

-   upgrade the runtime to open source version 1.0.1
-   upgrade Node.js to 16.10.0

**breaking changes**

-   the structure of some data has changed significantly => the connector has to be deleted and recreated from scratch
-   renamed coreSync module to sync
-   the coreLibrary part of the configuration was renamed to transportLibrary (only affected when using a custom config file)

## 1.3.2

-   upgrade the runtime version to 2.0.6

## 1.3.1

-> SDK 1.1.1

-   upgrade the runtime version to 2.0.5

## 1.3.0

-> SDK 1.1.0

-   upgrade the runtime version to 2.0.1
-   tokens can now be ephemeral (not saved in DB)

## 1.2.12

-   upgrade the runtime version to 1.8.4
-   exceptions in modules will not crash the connector anymore

## 1.2.11

-   upgrade the runtime version to 1.7.13
-   errors in the CoreSync module will not crash the connector anymore

## 1.2.10

-   upgrade the runtime version to 1.7.11

## 1.2.9

-   upgrade the runtime version to 1.7.10
-   upgrade the mongodb library to 1.0.4. Authentication without username an password fails if you pass an `authSource` in the database connection string

## 1.2.8

-> SDK 1.0.5

-   return status-code 201 for the routes `/api/v1/RelationshipTemplates/:id/Token` and `/api/v1/Files/:id/Token` with accept set to `image/png` and `application/json`

## 1.2.7

-   upgrade the runtime version to 1.7.1

## 1.2.6

-   added the possibility to provide a custom config file
    -   mount the file inside the container and specify the file location in the `CUSTOM_CONFIG_LOCATION` environment variable

## 1.2.5

-> SDK 1.0.4

-   upgrade runtime version to 1.7.0
-   `/api/v1/Files/:id/Token` supports an expiresAt query parameter to override the default behaviour
-   `/api/v1/RelationshipTemplates/:id/Token` supports an expiresAt query parameter to override the default behaviour

## 1.2.4

-> SDK 1.0.3

-   `/Monitoring/Support` is now showing the identityInfo of the connector

## 1.2.3

-   `/Monitoring/Support` is not showing the platformClientSecret anymore

## 1.2.2

-   `/health` checks if the Connector is authorized on the Enmeshed backend

## 1.2.1

-> SDK 1.0.2

-   upgrade the runtime to version 1.6.4
-   clientId and clientId are checked on connector startup
-   `/api/v1/Account/LastCompletedSyncRun` renamed to `/api/v1/Account/SyncInfo`

## 1.2.0

-   provided `Auto Accept Relationship Creation Changes` module.
    -   enable by setting `MODULES__AUTO_ACCEPT_RELATIONSHIP_CREATION_CHANGES__ENABLED` to "true"

## 1.1.0

-   upgrade the runtime to version 1.5.6
-   required setting the PLATFORM_CLIENT_ID and PLATFORM_CLIENT_SECRET

## 1.0.7

-   upgrade the runtime to version 1.5.5

## 1.0.6

-   upgrade the runtime to version 1.5.4

## 1.0.5

-   provided openapi docs for the `/api/v1/Account/LastCompletedSyncRun` Route

## 1.0.4

-   upgrade the runtime to version 1.2.0

## 1.0.3

-> SDK 1.0.1

-   Added /api/v1/Account/LastCompletedSyncRun Route
-   upgrade nodejs to 16.5.0

## 1.0.2

-   tested on the new backend

## 1.0.1

-   fix concurrent requests on the `/api/v1/Account/Sync` route
