# Changelog

## 3.0.0-beta.13

-   upgrade nodejs to 18.10.0
-   upgrade the runtime to version 2.0.0-beta.31

## 3.0.0-beta.12

-> SDK 2.0.0-beta.12

-   upgrade the runtime to version 2.0.0-beta-29
-   the deprecated webhooks module has been removed

## 3.0.0-beta.11

-> SDK 2.0.0-beta.11

-   change API version to v2 (-> route prefix changes from /api/v1 to /api/v2)

## 3.0.0-beta.10

-> SDK 2.0.0-beta.10

-   remove support for revoke of Relationship Changes

## 3.0.0-beta.9

-> SDK 2.0.0-beta.9

-   upgrade the runtime to version 2.0.0-beta-26
-   enable the new Runtime-builtin Module AttributeListenerModule

## 3.0.0-beta.8

-> SDK 2.0.0-beta.8

-   upgrade the runtime to version 2.0.0-beta-23
-   new `POST /api/v1/Attributes/ExecuteThirdPartyRelationshipAttributeQuery` route for executing ThirdPartyRelationshipAttribute queries

## 3.0.0-beta.7

-   bugfix(webhooksV2): events are now correctly triggered for triggers with wildcards

## 3.0.0-beta.6

-> SDK 2.0.0-beta.7

-   update AttributeQuery requests (`POST /api/v1/Attributes/ExecuteIdentityAttributeQuery` & `POST /api/v1/Attributes/ExecuteRelationshipAttributeQuery`) to match the Runtime API

## 3.0.0-beta.5

-> SDK 2.0.0-beta.4

-   upgrade nodejs to 16.17.0
-   upgrade the runtime to version 2.0.0-beta.22

## 3.0.0-beta.4

-> SDK 2.0.0-beta.3

-   upgrade the runtime to version 2.0.0-beta.20
-   `peer` is now optional for validating outgoing requests using the `/api/v1/Requests/Outgoing/Validate` route

## 3.0.0-beta.3

-> SDK 2.0.0-beta.2

-   upgrade the runtime to version 2.0.0-beta.15
-   enable GET of Files via truncated reference

## 3.0.0-beta.2

-   upgrade the runtime to version 2.0.0-beta.12

## 3.0.0-beta.1

-   upgrade the runtime to version 2.0.0-beta.1

## 3.0.0-alpha.14

-   upgrade the runtime to version 2.0.0-alpha.32
-   remove unused properties from the DTOs

## 3.0.0-alpha.13

-   upgrade the runtime to version 2.0.0-alpha.31
-   remove Message.relationshipIds
-   add Message.recipients.relationshipId

## 3.0.0-alpha.12

-   upgrade nodejs to 16.16.0
-   upgrade the runtime to version 2.0.0-alpha.30

## 3.0.0-alpha.11

-   the Connector now validates the Accept header correctly on every route

## 3.0.0-alpha.10

-   upgrade the runtime to version 2.0.0-alpha.26
-   routes for generating QrCodes for Files and RelationshipTemplates without Tokens

## 3.0.0-alpha.9

## 3.0.0-alpha.8

-   bugfix: update misspelled Health in openapidoc to ConnectorHealth

## 3.0.0-alpha.7

-   add documentation and update SDK for `maxNumberOfAllocations`

## 3.0.0-alpha.6

-   upgrade the runtime to version 2.0.0-alpha.19
-   upgrade NodeJS to version 16.15.1 (LTS)
-   add routes for executing `IdentityAttributeQuery` and `RelationshipAttributeQuery`

## 3.0.0-alpha.5

-   upgrade the runtime to version 2.0.0-alpha.16
-   add attribute routes

## 3.0.0-alpha.4

-   upgrade the runtime to version 2.0.0-alpha.10

## 3.0.0-alpha.3

-   two mandatory new modules: `RequestModule` and `DeciderModule`
-   upgrade the runtime to version 2.0.0-alpha.9

## 3.0.0-alpha.2

-   amqpPublisher module

## 3.0.0-alpha.1

-   `/api/v1/Requests/Incoming(/...)` and `/api/v1/Requests/Outgoing(/...)` routes.
-   upgrade the runtime to version 2.0.0-alpha.4

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
