import type {
  OpenAPIClient,
  Parameters,
  UnknownParamsObject,
  OperationResponse,
  AxiosRequestConfig,
} from 'openapi-client-axios';

declare namespace Components {
    namespace Responses {
        export type BadRequest = Schemas.ErrorContent;
        export type Forbidden = Schemas.ErrorContent;
        export type NotFound = Schemas.ErrorContent;
        export type Unauthorized = Schemas.ErrorContent;
    }
    namespace Schemas {
        /**
         * example:
         * id_________________________________
         */
        export type Address = string; // Address
        export interface Attribute {
            /**
             * The ID of the attribute.
             * example:
             * ATT_________________
             */
            id: string; // AttributeID
            /**
             * The date and time when the attribute was created.
             */
            createdAt: string; // date-time
            shareInfo?: AttributeShareInfo;
            /**
             * The ID of the attribute that was used to succeed this attribute.
             * example:
             * ATT_________________
             */
            succeededBy?: string; // AttributeID
            /**
             * The ID of the attribute that this attribute succeeds.
             * example:
             * ATT_________________
             */
            succeeds?: string; // AttributeID
            content: IdentityAttribute | RelationshipAttribute;
        }
        /**
         * The date and time when the attribute becomes valid.
         */
        export type AttributeContentValidFrom = string; // date-time
        /**
         * The date and time when the attribute expires.
         */
        export type AttributeContentValidTo = string; // date-time
        /**
         * The ID of an attribute.
         * example:
         * ATT_________________
         */
        export type AttributeID = string; // AttributeID
        export interface AttributeShareInfo {
            /**
             * The address of the peer that received the attribute.
             * example:
             * id_________________________________
             */
            peer: string; // Address
            /**
             * The ID of the request that was used to share the attribute.
             * example:
             * REQ_________________
             */
            requestReference: string; // RequestID
            /**
             * The ID of the attribute that was copied for sharing.
             * example:
             * ATT_________________
             */
            sourceAttribute?: string; // AttributeID
        }
        export interface AttributeValue {
            [name: string]: any;
            "@type": string;
        }
        /**
         * <p>Filters for a boolean. <p>The following operators are supported:</p> <table>
         *   <tr>
         *     <th>Operation</th>
         *     <th>Example</th>
         *   </tr>
         *   <tr>
         *     <td>equal</td>
         *     <td>?foo=true</td>
         *   </tr>
         *   <tr>
         *     <td>not equal</td>
         *     <td>?foo=!true</td>
         *   </tr>
         * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
         *
         */
        export type BooleanFilter = string;
        export interface CanCreateOutgoingRequestRequest {
            content: {
                expiresAt?: string | null; // date-time
                items?: {
                    "@type": string;
                    /**
                     * Will be rendered as title of the request.
                     */
                    title?: string;
                    /**
                     * Will be rendered as description of the request.
                     */
                    description?: string;
                    items: {
                        "@type": string;
                        /**
                         * Will be rendered as title of the request.
                         */
                        title?: string;
                        /**
                         * Will be rendered as description of the request.
                         */
                        description?: string;
                        /**
                         * Whether the request must be accepted by the peer.
                         */
                        mustBeAccepted: boolean;
                        /**
                         * The metadata will be sent back in the response.
                         */
                        responseMetadata?: {
                            [key: string]: any;
                        };
                    }[];
                    /**
                     * Whether the request must be accepted by the peer.
                     */
                    mustBeAccepted: boolean;
                    /**
                     * The metadata will be sent back in the response.
                     */
                    responseMetadata?: {
                        [key: string]: any;
                    };
                }[];
            };
            /**
             * The address of the peer that will receive the request. This is optional because in case of a RelationshipTemplate you do not know the peer address yet. For better results you should specify `peer` whenever you know it.
             * example:
             * id_________________________________
             */
            peer?: string; // Address
        }
        /**
         * example:
         * CHL_________________
         */
        export type ChallengeID = string; // ChallengeID
        export type Confidentiality = "public" | "protected" | "private";
        export interface ConnectorHealth {
            isHealthy: boolean;
            services: {
                database: "healthy" | "unhealthy";
                backbone: "healthy" | "unhealthy";
            };
        }
        export interface ConnectorVersion {
            /**
             * The build number of the Connector Docker image.
             * example:
             * 50
             */
            build: string;
            /**
             * The commit that triggered the build of the Connector docker-image.
             * example:
             * c459aa1b74a6b51d1230869ec8b199d4c7506679
             */
            commit: string;
            /**
             * The Connector version.
             * example:
             * 1.0.0
             */
            version: string;
            /**
             * The time the Connector docker-image was built.
             */
            date: string; // date-time
        }
        export interface CreateDeviceChallengeRequest {
            challengeType: "Device";
        }
        export interface CreateIdentityChallengeRequest {
            challengeType: "Identity";
        }
        export interface CreateOutgoingRequestRequest {
            content: {
                expiresAt?: string | null; // date-time
                items?: {
                    "@type": string;
                    /**
                     * Will be rendered as title of the request.
                     */
                    title?: string;
                    /**
                     * Will be rendered as description of the request.
                     */
                    description?: string;
                    items: {
                        "@type": string;
                        /**
                         * Will be rendered as title of the request.
                         */
                        title?: string;
                        /**
                         * Will be rendered as description of the request.
                         */
                        description?: string;
                        /**
                         * Whether the request must be accepted by the peer.
                         */
                        mustBeAccepted: boolean;
                        /**
                         * The metadata will be sent back in the response.
                         */
                        responseMetadata?: {
                            [key: string]: any;
                        };
                    }[];
                    /**
                     * Whether the request must be accepted by the peer.
                     */
                    mustBeAccepted: boolean;
                    /**
                     * The metadata will be sent back in the response.
                     */
                    responseMetadata?: {
                        [key: string]: any;
                    };
                }[];
            };
            /**
             * example:
             * id_________________________________
             */
            peer: string; // Address
        }
        export interface CreateRelationshipChallengeRequest {
            challengeType: "Relationship";
            /**
             * The ID of the relationship to create a challenge for.
             * example:
             * REL_________________
             */
            relationship: string; // RelationshipID
        }
        export interface CreateRepositoryAttributeResponse {
            /**
             * The ID of the attribute.
             * example:
             * ATT_________________
             */
            id: string; // AttributeID
            parentId?: /**
             * The ID of an attribute.
             * example:
             * ATT_________________
             */
            AttributeID /* AttributeID */;
            /**
             * The date and time when the attribute was created.
             */
            createdAt: string; // date-time
            shareInfo?: AttributeShareInfo;
            /**
             * The ID of the attribute that was used to succeed this attribute.
             * example:
             * ATT_________________
             */
            succeededBy?: string; // AttributeID
            /**
             * The ID of the attribute that this attribute succeeds.
             * example:
             * ATT_________________
             */
            succeeds?: string; // AttributeID
            content: IdentityAttribute;
        }
        /**
         * <p>Filters for a date. In the background, a `DateFilter` compares dates based on their text value. Due to the order of ISO Date string characters though, this doesn't matter - as long as no timezones are used. We are looking for a better solution to this. For now you can convert your non-UTC dates to UTC before sending them in a query.</p> <p>The following operators are supported:</p> <table>
         *   <tr>
         *     <th>Operation</th>
         *     <th>Example</th>
         *   </tr>
         *   <tr>
         *     <td>equal</td>
         *     <td>?foo=2020-01-01T00:00:00.000Z</td>
         *   </tr>
         *   <tr>
         *     <td>not equal</td>
         *     <td>?foo=!2020-01-01T00:00:00.000Z</td>
         *   </tr>
         *   <tr>
         *     <td>
         *       exists (=> not undefined)*
         *       <br/>
         *     </td>
         *     <td>?foo=</td>
         *   </tr>
         *   <tr>
         *     <td>not exists (=> undefined)</td>
         *     <td>?foo=!</td>
         *   </tr>
         *   <tr>
         *     <td>greater than</td>
         *     <td>?foo=>2020</td>
         *   </tr>
         *   <tr>
         *     <td>less than</td>
         *     <td>?foo=<2020</td>
         *   </tr>
         *   <tr>
         *     <td>greater than or equal to</td>
         *     <td>?foo=>=2020-01-01T00:00:00.000Z</td>
         *   </tr>
         *   <tr>
         *     <td>less than or equal to</td>
         *     <td>?foo=<=2020-01-01T00:00:00.000Z</td>
         *   </tr>
         *   <tr>
         *     <td>matches regex</td>
         *     <td>?foo=~.+01-01T.+</td>
         *   </tr>
         *   <tr>
         *     <td>in*</td>
         *     <td>?foo=2020-01-01T00:00:00.000Z&foo=2021-01-01T00:00:00.000Z</td>
         *   </tr>
         *   <tr>
         *     <td>not in*</td>
         *     <td>?foo=!2020-01-01T00:00:00.000Z&foo=!2021-01-01T00:00:00.000Z</td>
         *   </tr>
         * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
         *
         */
        export type DateFilter = string;
        /**
         * example:
         * {
         *   "items": [
         *     {
         *       "accept": true
         *     },
         *     {
         *       "accept": false,
         *       "code": "an.error.code",
         *       "message": "Error Message"
         *     },
         *     {
         *       "items": [
         *         {
         *           "accept": "true"
         *         },
         *         {
         *           "accept": false,
         *           "code": "an.error.code",
         *           "message": "Error Message"
         *         }
         *       ]
         *     }
         *   ]
         * }
         */
        export interface DecideRequestRequest {
            items?: (/**
             * example:
             * {
             *   "accept": true
             * }
             */
            DecideRequestRequestItem | DecideRequestRequestItemGroup)[];
        }
        /**
         * example:
         * {
         *   "accept": true
         * }
         */
        export type DecideRequestRequestItem = /**
         * example:
         * {
         *   "accept": true
         * }
         */
        {
            accept: true;
        } | {
            accept: false;
            code?: string | null;
            message?: string | null;
        };
        export interface DecideRequestRequestItemGroup {
            items?: (/**
             * example:
             * {
             *   "accept": true
             * }
             */
            DecideRequestRequestItem)[];
        }
        /**
         * example:
         * DVC_________________
         */
        export type DeviceID = string; // DeviceID
        export interface ErrorContent {
            error: {
                /**
                 * A unique ID for the error instance.
                 */
                id: string;
                /**
                 * The error code.
                 * There are some generic error codes like:
                 *   - error.connector.recordNotFound
                 *   - error.connector.unauthorized
                 *   - error.connector.forbidden
                 *   - error.connector.validation.missingProperty
                 *   - error.connector.validation.invalidPropertyValueLength
                 *   - error.connector.validation.invalidPropertyValue
                 *
                 * Further there are route specific error codes.
                 *
                 */
                code: string;
                /**
                 * An error message having more details about what went wrong. This message is not localized.
                 */
                message: string;
                /**
                 * A link to additional documentation about the error.
                 */
                docs: string;
                /**
                 * A timestamp that describes when the error occured.
                 */
                time: string;
            };
        }
        /**
         * The ID of a file.
         * example:
         * FIL_________________
         */
        export type FileID = string; // FileID
        export interface FileMetadata {
            /**
             * The ID of the file.
             * example:
             * FIL_________________
             */
            id: string; // FileID
            /**
             * A user-friendly title for the file which is shown on the UI. If it is not passed, it will be set to the name of the file.
             * example:
             * Curriculum Vitae
             */
            title: string | null;
            /**
             * A description for the file which is shown on the UI.
             * example:
             * My curriculum vitae
             */
            description?: string | null;
            /**
             * The name of the file.
             * example:
             * CurriculumVitae.pdf
             */
            filename: string;
            /**
             * The size of the file in bytes.
             */
            filesize: number; // int64
            /**
             * A timestamp that describes when this file was created.
             * example:
             * 2020-05-25T11:05:02.924Z
             */
            createdAt: string; // date-time
            /**
             * example:
             * id_________________________________
             */
            createdBy: string; // Address
            /**
             * example:
             * DVC_________________
             */
            createdByDevice: string; // DeviceID
            /**
             * A timestamp that describes when this file will expire. Expired files cannot be accessed anymore. Notice that they will still be available for auditing purposes.
             * example:
             * 2022-05-25T11:05:02.924Z
             */
            expiresAt: string | null; // date-time
            /**
             * example:
             * application/pdf
             */
            mimetype: string;
            isOwn: boolean;
            /**
             * The base64 encoded truncated reference of the file, which actually consists of the FileId and the secretKey.
             */
            truncatedReference: string; // byte
        }
        export interface FileReference {
            /**
             * The ID of the `File` which should be fetched. This is usually shared within a Token.
             * example:
             * FIL_________________
             */
            id: string; // FileID
            /**
             * The secret key which was used to encrypt the `File`. This is usually shared within a Token.
             */
            secretKey: string; // byte
        }
        export interface FileReferenceTruncated {
            /**
             * The base64 encoded truncated reference of the File.
             */
            reference: string;
        }
        /**
         * The time in milliseconds the request took to be processed by the platform.
         */
        export type HeaderContentXResponseDurationMs = number;
        /**
         * A timestamp that describes when the response was sent to the client.
         */
        export type HeaderContentXResponseTime = string; // number
        /**
         * <p>Filters for an ID. Basically a `TextFilter`, but with less useful operators</p> <p>The following operators are supported:</p> <table>
         *   <tr>
         *     <th>Operation</th>
         *     <th>Example</th>
         *   </tr>
         *   <tr>
         *     <td>equal</td>
         *     <td>?foo=XXX_________________</td>
         *   </tr>
         *   <tr>
         *     <td>not equal</td>
         *     <td>?foo=!XXX_________________</td>
         *   </tr>
         *   <tr>
         *     <td>
         *       exists (=> not undefined)*
         *       <br/>
         *     </td>
         *     <td>?foo=</td>
         *   </tr>
         *   <tr>
         *     <td>not exists (=> undefined)</td>
         *     <td>?foo=!</td>
         *   </tr>
         *   <tr>
         *     <td>in*</td>
         *     <td>?foo=XXX_________________&foo=YYY_________________</td>
         *   </tr>
         *   <tr>
         *     <td>not in*</td>
         *     <td>?foo=!XXX_________________&foo=!YYY_________________</td>
         *   </tr>
         * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
         *
         */
        export type IdFilter = string;
        export interface IdentityAttribute {
            "@type": string;
            /**
             * The address of the identity that owns the attribute.
             * example:
             * id_________________________________
             */
            owner: string; // Address
            tags?: /**
             * The tags of the attribute.
             * example:
             * [
             *   "tag_1",
             *   "tag_2"
             * ]
             */
            IdentityAttributeContentTags;
            validFrom?: /* The date and time when the attribute becomes valid. */ AttributeContentValidFrom /* date-time */;
            validTo?: /* The date and time when the attribute expires. */ AttributeContentValidTo /* date-time */;
            value: AttributeValue;
        }
        /**
         * The tags of the attribute.
         * example:
         * [
         *   "tag_1",
         *   "tag_2"
         * ]
         */
        export type IdentityAttributeContentTags = string[];
        export interface IdentityInfo {
            /**
             * The enmeshed address of the Connector.
             * example:
             * id_________________________________
             */
            address: string; // Address
            /**
             * The public key of the Connector used to digitally sign data.
             */
            publicKey: string;
        }
        export interface Message {
            /**
             * The ID of a message.
             * example:
             * MSG_________________
             */
            id: string; // MessageID
            /**
             * The ID of the sender of this message.
             * example:
             * id_________________________________
             */
            createdBy: string; // Address
            /**
             * The ID of the device this message was sent with.
             * example:
             * DVC_________________
             */
            createdByDevice: string; // DeviceID
            /**
             * A timestamp that describes when this message was received by the platform.
             */
            createdAt: string; // date-time
            /**
             * Information about the recipients of this message.
             */
            recipients: /* Information about the recipient of a message. */ Recipient[];
            content: {
                [key: string]: any;
            };
            attachments?: /**
             * The ID of a file.
             * example:
             * FIL_________________
             */
            FileID /* FileID */[];
            /**
             * Indicates if the message was sent by the current user.
             */
            isOwn: boolean;
        }
        export interface MessageContent {
        }
        /**
         * The ID of a message.
         * example:
         * MSG_________________
         */
        export type MessageID = string; // MessageID
        export interface MessageWithAttachments {
            /**
             * The ID of a message.
             * example:
             * MSG_________________
             */
            id: string; // MessageID
            /**
             * The ID of the sender of this message.
             * example:
             * id_________________________________
             */
            createdBy: string; // Address
            /**
             * The ID of the device this message was sent with.
             * example:
             * DVC_________________
             */
            createdByDevice: string; // DeviceID
            /**
             * A timestamp that describes when this message was received by the platform.
             */
            createdAt: string; // date-time
            /**
             * Information about the recipients of this message.
             */
            recipients: /* Information about the recipient of a message. */ Recipient[];
            content: {
                [key: string]: any;
            };
            attachments?: FileMetadata[];
            /**
             * Indicates if the message was sent by the current user.
             */
            isOwn: boolean;
        }
        /**
         * The ID of a notification.
         * example:
         * NOT_________________
         */
        export type NotificationID = string; // NotificationID
        /**
         * <p>Filters for a number. <p>The following operators are supported:</p> <table>
         *   <tr>
         *     <th>Operation</th>
         *     <th>Example</th>
         *   </tr>
         *   <tr>
         *     <td>equal</td>
         *     <td>?foo=bar</td>
         *   </tr>
         *   <tr>
         *     <td>not equal</td>
         *     <td>?foo=!bar</td>
         *   </tr>
         *   <tr>
         *     <td>
         *       exists (=> not undefined)*
         *       <br/>
         *     </td>
         *     <td>?foo=</td>
         *   </tr>
         *   <tr>
         *     <td>not exists (=> undefined)</td>
         *     <td>?foo=!</td>
         *   </tr>
         *   <tr>
         *     <td>greater than</td>
         *     <td>?foo=>5</td>
         *   </tr>
         *   <tr>
         *     <td>less than</td>
         *     <td>?foo=<5</td>
         *   </tr>
         *   <tr>
         *     <td>greater than or equal to</td>
         *     <td>?foo=>=5</td>
         *   </tr>
         *   <tr>
         *     <td>less than or equal to</td>
         *     <td>?foo=5</td>
         *   </tr>
         *   <tr>
         *     <td>in*</td>
         *     <td>?foo=5&foo=6</td>
         *   </tr>
         *   <tr>
         *     <td>not in*</td>
         *     <td>?foo=!5&foo=!6</td>
         *   </tr>
         * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
         *
         */
        export type NumberFilter = string;
        /**
         * Information about the recipient of a message.
         */
        export interface Recipient {
            /**
             * The address of this recipient.
             * example:
             * id_________________________________
             */
            address: string; // Address
            /**
             * The id of the relationship to the recipient.
             * example:
             * REL_________________
             */
            relationshipId?: string; // RelationshipID
        }
        export interface Relationship {
            /**
             * The ID of the relationship.
             * example:
             * REL_________________
             */
            id: string; // RelationshipID
            template: {
                /**
                 * The ID of a relationship template.
                 * example:
                 * RLT_________________
                 */
                id: string; // RelationshipTemplateID
                /**
                 * The maximum number identities that can allocate this template. Omitting this property leads to an infinite number of possible allocations.
                 */
                maxNumberOfAllocations?: number | null; // int32
                /**
                 * Describes whether the template was created by the connector (true) or whether it was loaded from another identity (false).
                 */
                isOwn: boolean;
                /**
                 * The address of the identity who created this template.
                 * example:
                 * id_________________________________
                 */
                createdBy: string; // Address
                /**
                 * The address of the identity who created this template.
                 * example:
                 * DVC_________________
                 */
                createdByDevice: string; // DeviceID
                /**
                 * A timestamp that describes when this relationship template was created on the platform.
                 */
                createdAt: string; // date-time
                /**
                 * A timestamp that describes when this relationship template expires. Expired templates cannot be used to create relationship requests anymore.
                 */
                expiresAt: string; // date-time
                content: {
                    [key: string]: any;
                };
                /**
                 * The base64 encoded secret key which was used to encrypt the RelationshipTemplate.
                 */
                secretKey?: string;
                /**
                 * The base64 encoded truncated reference of the RelationshipTemplate, which actually consists of the RelationshipTemplateId and the secretKey.
                 */
                truncatedReference: string; // byte
            };
            /**
             * The status of the relationship
             */
            status: "Pending" | "Active" | "Rejected";
            /**
             * The address of the peer identity.
             * example:
             * id_________________________________
             */
            peer: string; // Address
            changes: RelationshipChange[];
        }
        export interface RelationshipAttribute {
            "@type": string;
            /**
             * The confidentiality of the attribute.
             */
            confidentiality: Confidentiality;
            /**
             * Whether the attribute is technical or not.
             */
            isTechnical?: boolean;
            /**
             * The key of the attribute.
             */
            key: string;
            /**
             * The address of the identity that owns the attribute.
             * example:
             * id_________________________________
             */
            owner: string; // Address
            validFrom?: /* The date and time when the attribute becomes valid. */ AttributeContentValidFrom /* date-time */;
            validTo?: /* The date and time when the attribute expires. */ AttributeContentValidTo /* date-time */;
            value: AttributeValue;
        }
        export interface RelationshipChange {
            /**
             * The ID of a relationship change.
             * example:
             * RCH_________________
             */
            id: string; // RelationshipChangeID
            type: "Creation";
            status: "Pending" | "Rejected" | "Accepted";
            request: RelationshipChangeRequest;
            response?: RelationshipChangeResponse;
        }
        /**
         * The ID of a relationship change.
         * example:
         * RCH_________________
         */
        export type RelationshipChangeID = string; // RelationshipChangeID
        export interface RelationshipChangeRequest {
            /**
             * example:
             * id_________________________________
             */
            createdBy: string; // Address
            /**
             * example:
             * DVC_________________
             */
            createdByDevice: string; // DeviceID
            /**
             * A timestamp that describes when this `RelationshipChange` was created on the platform.
             */
            createdAt: string; // date-time
            content: RelationshipChangeRequestContent;
        }
        export interface RelationshipChangeRequestContent {
        }
        export interface RelationshipChangeResponse {
            /**
             * example:
             * id_________________________________
             */
            createdBy: string; // Address
            /**
             * example:
             * DVC_________________
             */
            createdByDevice: string; // DeviceID
            /**
             * A timestamp that describes when this `RelationshipChange` was created on the platform.
             */
            createdAt: string; // date-time
            content: RelationshipChangeResponseContent;
        }
        export interface RelationshipChangeResponseContent {
        }
        /**
         * The ID of a relationship.
         * example:
         * REL_________________
         */
        export type RelationshipID = string; // RelationshipID
        export interface RelationshipTemplate {
            /**
             * The ID of a relationship template.
             * example:
             * RLT_________________
             */
            id: string; // RelationshipTemplateID
            /**
             * The maximum number identities that can allocate this template. Omitting this property leads to an infinite number of possible allocations.
             */
            maxNumberOfAllocations?: number | null; // int32
            /**
             * Describes whether the template was created by the connector (true) or whether it was loaded from another identity (false).
             */
            isOwn: boolean;
            /**
             * The address of the identity who created this template.
             * example:
             * id_________________________________
             */
            createdBy: string; // Address
            /**
             * The address of the identity who created this template.
             * example:
             * DVC_________________
             */
            createdByDevice: string; // DeviceID
            /**
             * A timestamp that describes when this relationship template was created on the platform.
             */
            createdAt: string; // date-time
            /**
             * A timestamp that describes when this relationship template expires. Expired templates cannot be used to create relationship requests anymore.
             */
            expiresAt: string; // date-time
            content: {
                [key: string]: any;
            };
            /**
             * The base64 encoded secret key which was used to encrypt the RelationshipTemplate.
             */
            secretKey?: string;
            /**
             * The base64 encoded truncated reference of the RelationshipTemplate, which actually consists of the RelationshipTemplateId and the secretKey.
             */
            truncatedReference: string; // byte
        }
        export interface RelationshipTemplateContent {
        }
        /**
         * The ID of a relationship template.
         * example:
         * RLT_________________
         */
        export type RelationshipTemplateID = string; // RelationshipTemplateID
        export interface RelationshipTemplateReference {
            /**
             * The ID of the received RelationshipTemplate which should be fetched. This is usually shared within a Token.
             * example:
             * RLT_________________
             */
            id: string; // RelationshipTemplateID
            /**
             * The secret key which was used to encrypt the RelationshipTemplate. This is usually shared within a Token.
             */
            secretKey: string; // byte
        }
        export interface RelationshipTemplateReferenceTruncated {
            /**
             * The base64 encoded truncated reference of the RelationshipTemplate.
             */
            reference: string;
        }
        export interface Request {
            /**
             * The ID of a message.
             * example:
             * REQ_________________
             */
            id: string; // RequestID
            /**
             * Whether this request is owned by the current identity (`OutgoingRequest`) or not (`IncomingRequest`).
             */
            isOwn: boolean;
            /**
             * The address of the peer that sent / received this request.
             * example:
             * id_________________________________
             */
            peer: string; // Address
            /**
             * A timestamp that describes when this request was created.
             */
            createdAt: string; // date-time
            /**
             * The status of this request.
             */
            status: "Draft" | "Open" | "DecisionRequired" | "ManualDecisionRequired" | "Decided" | "Completed";
            content: {
                "@type": "Request";
                expiresAt?: string;
                /**
                 * The ID of a message.
                 * example:
                 * REQ_________________
                 */
                id?: string; // RequestID
                items: (RequestItem | RequestItemGroup)[];
            };
            /**
             * The source of this request. Can be a `Message` or a `RelationshipTemplate`.
             */
            source?: {
                /**
                 * The type of the source of this request.
                 */
                type: "Message" | "RelationshipTemplate";
                /**
                 * The id of the `Message` or the `RelationshipTemplate`.
                 */
                reference: string;
            } | null;
            response?: {
                /**
                 * A timestamp that describes when this response was created.
                 */
                createdAt: string; // date-time
                content: {
                    "@type": "Response";
                    result: "Accepted" | "Rejected";
                    /**
                     * The ID of a message.
                     * example:
                     * REQ_________________
                     */
                    requestId: string; // RequestID
                    items: (RequestResponseContentItem | RequestResponseContentItemGroup)[];
                };
                /**
                 * The source of this response. Can be a `Message` or a `RelationshipChange`.
                 */
                source?: {
                    /**
                     * The type of the source of this response.
                     */
                    type: "Message" | "RelationshipChange";
                    /**
                     * The id of the `Message` or the `RelationshipChange`.
                     */
                    reference: string;
                } | null;
            } | null;
        }
        export interface RequestContent {
            "@type": "Request";
            expiresAt?: string;
            /**
             * The ID of a message.
             * example:
             * REQ_________________
             */
            id?: string; // RequestID
            items: (RequestItem | RequestItemGroup)[];
        }
        /**
         * The ID of a message.
         * example:
         * REQ_________________
         */
        export type RequestID = string; // RequestID
        export interface RequestItem {
            "@type": string;
            /**
             * Will be rendered as title of the request.
             */
            title?: string;
            /**
             * Will be rendered as description of the request.
             */
            description?: string;
            /**
             * Whether the request must be accepted by the peer.
             */
            mustBeAccepted: boolean;
            /**
             * The metadata will be sent back in the response.
             */
            responseMetadata?: {
                [key: string]: any;
            };
        }
        export interface RequestItemGroup {
            "@type": string;
            title?: string;
            description?: string;
            items: {
                "@type": string;
                /**
                 * Will be rendered as title of the request.
                 */
                title?: string;
                /**
                 * Will be rendered as description of the request.
                 */
                description?: string;
                /**
                 * Whether the request must be accepted by the peer.
                 */
                mustBeAccepted: boolean;
                /**
                 * The metadata will be sent back in the response.
                 */
                responseMetadata?: {
                    [key: string]: any;
                };
            }[];
            mustBeAccepted: boolean;
            responseMetadata?: {
                [key: string]: any;
            };
        }
        export interface RequestMetadata {
            title?: string;
            description?: string;
            metadata?: {
                [key: string]: any;
            };
            expiresAt?: string; // date-time
        }
        export interface RequestResponseContent {
            "@type": "Response";
            result: "Accepted" | "Rejected";
            /**
             * The ID of a message.
             * example:
             * REQ_________________
             */
            requestId: string; // RequestID
            items: (RequestResponseContentItem | RequestResponseContentItemGroup)[];
        }
        export interface RequestResponseContentItem {
            "@type": string;
            result: "Accepted" | "Rejected" | "Failed";
            /**
             * The metadata that was sent with the `RequestItem`.
             */
            metadata: {
                [key: string]: any;
            };
        }
        export interface RequestResponseContentItemGroup {
            "@type": string;
            items: RequestResponseContentItem[];
            /**
             * The metadata that was sent with the `RequestItemGroup`.
             */
            metadata: {
                [key: string]: any;
            };
        }
        export interface RequestValidationResult {
            isSuccess: boolean;
            code?: string | null;
            message?: string | null;
            /**
             * example:
             * [
             *   {
             *     "isSuccess": true,
             *     "code": "string",
             *     "message": "string",
             *     "items": []
             *   }
             * ]
             */
            items: {
                isSuccess: boolean;
                code?: string | null;
                message?: string | null;
                /**
                 * example:
                 * [
                 *   {
                 *     "isSuccess": true,
                 *     "code": "string",
                 *     "message": "string",
                 *     "items": []
                 *   }
                 * ]
                 */
                items: any[];
            }[];
        }
        export interface SignedChallenge {
            /**
             * The ID of the challenge.
             * example:
             * CHL_________________
             */
            id: string; // ChallengeID
            /**
             * The timestamp when the challenge expires.
             */
            expiresAt: string; // date-time
            /**
             * The Address of the identity who created the challenge.
             * example:
             * id_________________________________
             */
            createdBy: string; // Address
            /**
             * The DeviceID of the identity who created the challenge.
             * example:
             * DVC_________________
             */
            createdByDevice: string; // DeviceID
            /**
             * The type of the challenge.
             */
            type: "Challenge" | "Device" | "Relationship";
            /**
             * The signature of the challenge.
             */
            signature: string;
            /**
             * The challenge serialized as a string that was used to sign the challenge.
             */
            challengeString: string;
        }
        /**
         * <table class="query-examples">
         *   <tr>
         *     <th>Operation</th>
         *     <th>Example</th>
         *   </tr>
         *   <tr>
         *     <td>equal</td>
         *     <td>?foo=bar</td>
         *   </tr>
         *   <tr>
         *     <td>not equal</td>
         *     <td>?foo=!bar</td>
         *   </tr>
         *   <tr>
         *     <td>
         *       exists (=> not undefined)*
         *       <br/>
         *     </td>
         *     <td>?foo=</td>
         *   </tr>
         *   <tr>
         *     <td>not exists (=> undefined)</td>
         *     <td>?foo=!</td>
         *   </tr>
         *   <tr>
         *     <td>starts with</td>
         *     <td>?foo=^bar</td>
         *   </tr>
         *   <tr>
         *     <td>ends with</td>
         *     <td>?foo=$bar</td>
         *   </tr>
         *   <tr>
         *     <td>matches regex</td>
         *     <td>?foo=~.+bar.+</td>
         *   </tr>
         *   <tr>
         *     <td>in*</td>
         *     <td>?foo=bar&foo=baz</td>
         *   </tr>
         *   <tr>
         *     <td>not in*</td>
         *     <td>?foo=!bar&foo=!baz</td>
         *   </tr>
         * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
         *
         */
        export type TextFilter = string;
        export interface Token {
            /**
             * The ID of a message.
             * example:
             * TOK_________________
             */
            id: string; // TokenID
            /**
             * The ID of the identity who created this token.
             * example:
             * id_________________________________
             */
            createdBy: string; // Address
            /**
             * The ID of the device which created this token.
             * example:
             * DVC_________________
             */
            createdByDevice: string; // DeviceID
            /**
             * The arbitrary JSON object which should be shared between creator of the Token and the recipient.
             */
            content: {
                [key: string]: any;
            };
            /**
             * A timestamp that describes when this token was created on the platform.
             */
            createdAt: string; // date-time
            /**
             * A timestamp that describes when this token expires. An expired token cannot be fetched from the platform anymore. However it will still be available for auditing purposes.
             */
            expiresAt: string; // date-time
            /**
             * The base64 encoded secret key which was used to encrypt the Token. This is usually shared over the side channel (QR-Code, Link).
             */
            secretKey: string; // byte
            /**
             * The base64 encoded truncated reference of the token, which actually consists of the TokenId and the secretKey.
             */
            truncatedReference: string; // byte
        }
        /**
         * The arbitrary JSON object which should be shared between creator of the Token and the recipient.
         */
        export interface TokenContent {
        }
        /**
         * The ID of a message.
         * example:
         * TOK_________________
         */
        export type TokenID = string; // TokenID
        export interface TokenReference {
            /**
             * The ID of the received Token which should be fetched. This is usually shared over the side channel (QR-Code, Link).
             * example:
             * TOK_________________
             */
            id: string; // TokenID
            /**
             * The base64 encoded secret key which was used to encrypt the Token. This is usually shared over the side channel (QR-Code, Link).
             */
            secretKey: string; // byte
        }
        export interface TokenReferenceTruncated {
            /**
             * The base64 encoded truncated reference of the token, which actually consists of the TokenId and the secretKey.
             */
            reference: string; // byte
        }
    }
}
declare namespace Paths {
    namespace AcceptIncomingRequest {
        namespace Parameters {
            export type Id = /**
             * The ID of a message.
             * example:
             * REQ_________________
             */
            Components.Schemas.RequestID /* RequestID */;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        export type RequestBody = /**
         * example:
         * {
         *   "items": [
         *     {
         *       "accept": true
         *     },
         *     {
         *       "accept": false,
         *       "code": "an.error.code",
         *       "message": "Error Message"
         *     },
         *     {
         *       "items": [
         *         {
         *           "accept": "true"
         *         },
         *         {
         *           "accept": false,
         *           "code": "an.error.code",
         *           "message": "Error Message"
         *         }
         *       ]
         *     }
         *   ]
         * }
         */
        Components.Schemas.DecideRequestRequest;
        namespace Responses {
            export interface $200 {
                result: Components.Schemas.Request;
            }
            export type $401 = Components.Responses.Unauthorized;
            export type $403 = Components.Responses.Forbidden;
            export type $404 = Components.Responses.NotFound;
        }
    }
    namespace AcceptRelationshipChange {
        namespace Parameters {
            export type ChangeId = /**
             * The ID of a relationship change.
             * example:
             * RCH_________________
             */
            Components.Schemas.RelationshipChangeID /* RelationshipChangeID */;
            export type Id = /**
             * The ID of a relationship.
             * example:
             * REL_________________
             */
            Components.Schemas.RelationshipID /* RelationshipID */;
        }
        export interface PathParameters {
            id: Parameters.Id;
            changeId: Parameters.ChangeId;
        }
        export interface RequestBody {
            /**
             * example:
             * {
             *   "prop1": "value",
             *   "prop2": 1
             * }
             */
            content: {
                [key: string]: any;
            };
        }
        namespace Responses {
            export interface $200 {
                result: Components.Schemas.Relationship;
            }
            export type $400 = Components.Responses.BadRequest;
            export type $401 = Components.Responses.Unauthorized;
            export type $403 = Components.Responses.Forbidden;
            export type $404 = Components.Responses.NotFound;
        }
    }
    namespace CanAcceptIncomingRequest {
        namespace Parameters {
            export type Id = /**
             * The ID of a message.
             * example:
             * REQ_________________
             */
            Components.Schemas.RequestID /* RequestID */;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        export type RequestBody = /**
         * example:
         * {
         *   "items": [
         *     {
         *       "accept": true
         *     },
         *     {
         *       "accept": false,
         *       "code": "an.error.code",
         *       "message": "Error Message"
         *     },
         *     {
         *       "items": [
         *         {
         *           "accept": "true"
         *         },
         *         {
         *           "accept": false,
         *           "code": "an.error.code",
         *           "message": "Error Message"
         *         }
         *       ]
         *     }
         *   ]
         * }
         */
        Components.Schemas.DecideRequestRequest;
        namespace Responses {
            export interface $200 {
                result: Components.Schemas.RequestValidationResult;
            }
            export type $401 = Components.Responses.Unauthorized;
            export type $403 = Components.Responses.Forbidden;
            export type $404 = Components.Responses.NotFound;
        }
    }
    namespace CanRejectIncomingRequest {
        namespace Parameters {
            export type Id = /**
             * The ID of a message.
             * example:
             * REQ_________________
             */
            Components.Schemas.RequestID /* RequestID */;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        export type RequestBody = /**
         * example:
         * {
         *   "items": [
         *     {
         *       "accept": true
         *     },
         *     {
         *       "accept": false,
         *       "code": "an.error.code",
         *       "message": "Error Message"
         *     },
         *     {
         *       "items": [
         *         {
         *           "accept": "true"
         *         },
         *         {
         *           "accept": false,
         *           "code": "an.error.code",
         *           "message": "Error Message"
         *         }
         *       ]
         *     }
         *   ]
         * }
         */
        Components.Schemas.DecideRequestRequest;
        namespace Responses {
            export interface $200 {
                result: Components.Schemas.RequestValidationResult;
            }
            export type $401 = Components.Responses.Unauthorized;
            export type $403 = Components.Responses.Forbidden;
            export type $404 = Components.Responses.NotFound;
        }
    }
    namespace CreateChallenge {
        export type RequestBody = Components.Schemas.CreateRelationshipChallengeRequest | Components.Schemas.CreateIdentityChallengeRequest | Components.Schemas.CreateDeviceChallengeRequest;
        namespace Responses {
            export interface $201 {
                result: Components.Schemas.SignedChallenge;
            }
            export type $401 = Components.Responses.Unauthorized;
            export type $403 = Components.Responses.Forbidden;
        }
    }
    namespace CreateOutgoingRequest {
        export type RequestBody = Components.Schemas.CreateOutgoingRequestRequest;
        namespace Responses {
            export interface $201 {
                result: Components.Schemas.Request;
            }
            export type $401 = Components.Responses.Unauthorized;
            export type $403 = Components.Responses.Forbidden;
        }
    }
    namespace CreateOwnRelationshipTemplate {
        export interface RequestBody {
            /**
             * The maximum number identities that can allocate this template. Omitting this property leads to an infinite number of possible allocations.
             * example:
             * 1
             */
            maxNumberOfAllocations?: number | null; // int32
            /**
             * A timestamp that describes when this relationship template expires. Expired templates cannot be used to create relationship requests anymore.
             * example:
             * 2023-01-01T00:00:00.000Z
             */
            expiresAt: string; // date-time
            /**
             * example:
             * {
             *   "prop1": "value",
             *   "prop2": 1
             * }
             */
            content: {
                [key: string]: any;
            };
        }
        namespace Responses {
            export interface $201 {
                result: Components.Schemas.RelationshipTemplate;
            }
            export type $400 = Components.Responses.BadRequest;
            export type $401 = Components.Responses.Unauthorized;
            export type $403 = Components.Responses.Forbidden;
        }
    }
    namespace CreateOwnToken {
        export interface RequestBody {
            /**
             * The arbitrary JSON object which should be shared between creator of the Token and the recipient.
             * example:
             * {
             *   "prop1": "value",
             *   "prop2": 1
             * }
             */
            content: {
                [key: string]: any;
            };
            /**
             * A timestamp that describes when this token expires. An expired token cannot be fetched from the platform anymore. However it will still be available for auditing purposes.
             * example:
             * 2023-01-01T00:00:00.000Z
             */
            expiresAt: string; // date-time
            /**
             * If set to true the token will will not be cached in the database of the connector. Note that you will not be able to fetch this token unless you remember the id and secretKey of the token. Defaults to false.
             * example:
             * false
             */
            ephemeral?: boolean;
        }
        namespace Responses {
            export interface $201 {
                result: Components.Schemas.Token;
            }
            export type $400 = Components.Responses.BadRequest;
            export type $401 = Components.Responses.Unauthorized;
            export type $403 = Components.Responses.Forbidden;
        }
    }
    namespace CreateRelationship {
        export interface RequestBody {
            /**
             * The ID of a relationship template.
             * example:
             * RLT_________________
             */
            templateId: string; // RelationshipTemplateID
            /**
             * example:
             * {
             *   "prop1": "value",
             *   "prop2": 1
             * }
             */
            content: {
                [key: string]: any;
            };
        }
        namespace Responses {
            export interface $201 {
                result: Components.Schemas.Relationship;
            }
            export type $401 = Components.Responses.Unauthorized;
            export type $403 = Components.Responses.Forbidden;
        }
    }
    namespace CreateRepositoryAttribute {
        export interface RequestBody {
            content?: {
                "@type"?: "IdentityAttribute";
                owner?: /**
                 * example:
                 * id_________________________________
                 */
                Components.Schemas.Address /* Address */;
                value: Components.Schemas.AttributeValue;
                tags?: /**
                 * The tags of the attribute.
                 * example:
                 * [
                 *   "tag_1",
                 *   "tag_2"
                 * ]
                 */
                Components.Schemas.IdentityAttributeContentTags;
                validFrom?: /* The date and time when the attribute becomes valid. */ Components.Schemas.AttributeContentValidFrom /* date-time */;
                validTo?: /* The date and time when the attribute expires. */ Components.Schemas.AttributeContentValidTo /* date-time */;
            };
        }
        namespace Responses {
            export interface $201 {
                result: Components.Schemas.CreateRepositoryAttributeResponse;
            }
            export type $401 = Components.Responses.Unauthorized;
            export type $403 = Components.Responses.Forbidden;
        }
    }
    namespace CreateTokenForFile {
        namespace Parameters {
            export type Id = /**
             * The ID of a file.
             * example:
             * FIL_________________
             */
            Components.Schemas.FileID /* FileID */;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        export interface RequestBody {
            /**
             * The expiry of the token. Defaults to the expiry of the file.
             */
            expiresAt?: string; // date-time
            /**
             * If set to true the token will will not be cached in the database of the connector. Note that you will not be able to fetch this token unless you remember the id and secretKey of the token. Defaults to true. Will be ignored if Accept is set to image/png.
             */
            ephemeral?: boolean;
        }
        namespace Responses {
            export interface $201 {
                result: Components.Schemas.Token;
            }
            export type $401 = Components.Responses.Unauthorized;
            export type $403 = Components.Responses.Forbidden;
            export type $404 = Components.Responses.NotFound;
        }
    }
    namespace CreateTokenForTemplate {
        namespace Parameters {
            export type Id = /**
             * The ID of a relationship template.
             * example:
             * RLT_________________
             */
            Components.Schemas.RelationshipTemplateID /* RelationshipTemplateID */;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        export interface RequestBody {
            /**
             * The expiry of the token. Defaults to the expiry of the relationship template.
             */
            expiresAt?: string; // date-time
            /**
             * If set to true the token will will not be cached in the database of the connector. Note that you will not be able to fetch this token unless you remember the id and secretKey of the token. Defaults to true. Will be ignored if Accept is set to image/png.
             */
            ephemeral?: boolean;
        }
        namespace Responses {
            export interface $201 {
                result: Components.Schemas.Token;
            }
            export type $401 = Components.Responses.Unauthorized;
            export type $403 = Components.Responses.Forbidden;
            export type $404 = Components.Responses.NotFound;
        }
    }
    namespace DownloadAttachmentOfMessage {
        namespace Parameters {
            export type AttachmentId = /**
             * The ID of a file.
             * example:
             * FIL_________________
             */
            Components.Schemas.FileID /* FileID */;
            export type MessageId = /**
             * The ID of a message.
             * example:
             * MSG_________________
             */
            Components.Schemas.MessageID /* MessageID */;
        }
        export interface PathParameters {
            messageId: Parameters.MessageId;
            attachmentId: Parameters.AttachmentId;
        }
        namespace Responses {
            export type $200 = string; // binary
            export type $401 = Components.Responses.Unauthorized;
            export type $403 = Components.Responses.Forbidden;
            export type $404 = Components.Responses.NotFound;
        }
    }
    namespace DownloadFile {
        namespace Parameters {
            export type Id = /**
             * The ID of a file.
             * example:
             * FIL_________________
             */
            Components.Schemas.FileID /* FileID */;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        namespace Responses {
            /**
             * File Content
             * example:
             * binary
             */
            export type $200 = string; // binary
            export type $401 = Components.Responses.Unauthorized;
            export type $403 = Components.Responses.Forbidden;
            export type $404 = Components.Responses.NotFound;
        }
    }
    namespace ExecuteIQLQuery {
        export interface RequestBody {
            query?: {
                /**
                 * IQL Query String
                 * example:
                 * PhoneNumber && #emergency
                 */
                queryString?: string;
            };
        }
        namespace Responses {
            export interface $200 {
                result: Components.Schemas.Attribute[];
            }
            export type $401 = Components.Responses.Unauthorized;
            export type $403 = Components.Responses.Forbidden;
        }
    }
    namespace ExecuteIdentityQuery {
        export interface RequestBody {
            query: {
                /**
                 * The tags of the attributes that will be filtered.
                 */
                tags?: string[];
                validFrom?: /* The date and time when the attribute becomes valid. */ Components.Schemas.AttributeContentValidFrom /* date-time */;
                validTo?: /* The date and time when the attribute expires. */ Components.Schemas.AttributeContentValidTo /* date-time */;
                /**
                 * The valueType of the attribute.
                 */
                valueType: string;
            };
        }
        namespace Responses {
            export interface $201 {
                result: Components.Schemas.Attribute[];
            }
            export type $401 = Components.Responses.Unauthorized;
            export type $403 = Components.Responses.Forbidden;
        }
    }
    namespace ExecuteRelationshipQuery {
        export interface RequestBody {
            query: {
                /**
                 * The key of the relationship attribute.
                 */
                key: string;
                /**
                 * The owner of the relationship attribute.
                 */
                owner: string;
                validFrom?: /* The date and time when the attribute becomes valid. */ Components.Schemas.AttributeContentValidFrom /* date-time */;
                validTo?: /* The date and time when the attribute expires. */ Components.Schemas.AttributeContentValidTo /* date-time */;
                /**
                 * This describes how to create an attribute if it does not exist.
                 */
                attributeCreationHints: {
                    confidentiality: Components.Schemas.Confidentiality;
                    description?: string;
                    isTechnical?: boolean;
                    title: string;
                    /**
                     * The valueType of the attribute that will be created.
                     */
                    valueType: string;
                    valueHints?: {
                        "@type": string;
                        defaultValue?: string | number | boolean;
                        editHelp?: string;
                        max?: number;
                        min?: number;
                        pattern?: string;
                        values?: {
                            displayName: string;
                            key: string | number | boolean;
                        }[];
                    };
                };
            };
        }
        namespace Responses {
            export interface $201 {
                result: Components.Schemas.Attribute;
            }
            export type $401 = Components.Responses.Unauthorized;
            export type $403 = Components.Responses.Forbidden;
        }
    }
    namespace ExecuteThirdPartyRelationshipQuery {
        export interface RequestBody {
            query: {
                /**
                 * The key of the relationship attribute.
                 */
                key: string;
                /**
                 * The owner of the relationship attribute.
                 */
                owner: /**
                 * example:
                 * id_________________________________
                 */
                Components.Schemas.Address /* Address */;
                /**
                 * An array of third party addresses the relationship attribute should be searched in. If the given `key` is found in multiple relationships, the user can decide which one to send.
                 */
                thirdParty: /**
                 * example:
                 * id_________________________________
                 */
                Components.Schemas.Address /* Address */[];
                validFrom?: /* The date and time when the attribute becomes valid. */ Components.Schemas.AttributeContentValidFrom /* date-time */;
                validTo?: /* The date and time when the attribute expires. */ Components.Schemas.AttributeContentValidTo /* date-time */;
            };
        }
        namespace Responses {
            export interface $201 {
                result: Components.Schemas.Attribute[];
            }
            export type $401 = Components.Responses.Unauthorized;
            export type $403 = Components.Responses.Forbidden;
        }
    }
    namespace GetAllFileMetadata {
        namespace Parameters {
            export type CreatedAt = /**
             * <p>Filters for a date. In the background, a `DateFilter` compares dates based on their text value. Due to the order of ISO Date string characters though, this doesn't matter - as long as no timezones are used. We are looking for a better solution to this. For now you can convert your non-UTC dates to UTC before sending them in a query.</p> <p>The following operators are supported:</p> <table>
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>greater than</td>
             *     <td>?foo=>2020</td>
             *   </tr>
             *   <tr>
             *     <td>less than</td>
             *     <td>?foo=<2020</td>
             *   </tr>
             *   <tr>
             *     <td>greater than or equal to</td>
             *     <td>?foo=>=2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>less than or equal to</td>
             *     <td>?foo=<=2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>matches regex</td>
             *     <td>?foo=~.+01-01T.+</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=2020-01-01T00:00:00.000Z&foo=2021-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!2020-01-01T00:00:00.000Z&foo=!2021-01-01T00:00:00.000Z</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.DateFilter;
            export type CreatedBy = /**
             * <p>Filters for an ID. Basically a `TextFilter`, but with less useful operators</p> <p>The following operators are supported:</p> <table>
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=XXX_________________</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!XXX_________________</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=XXX_________________&foo=YYY_________________</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!XXX_________________&foo=!YYY_________________</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.IdFilter;
            export type CreatedByDevice = /**
             * <p>Filters for an ID. Basically a `TextFilter`, but with less useful operators</p> <p>The following operators are supported:</p> <table>
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=XXX_________________</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!XXX_________________</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=XXX_________________&foo=YYY_________________</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!XXX_________________&foo=!YYY_________________</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.IdFilter;
            export type Description = /**
             * <table class="query-examples">
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=bar</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!bar</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>starts with</td>
             *     <td>?foo=^bar</td>
             *   </tr>
             *   <tr>
             *     <td>ends with</td>
             *     <td>?foo=$bar</td>
             *   </tr>
             *   <tr>
             *     <td>matches regex</td>
             *     <td>?foo=~.+bar.+</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=bar&foo=baz</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!bar&foo=!baz</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.TextFilter;
            export type ExpiresAt = /**
             * <p>Filters for a date. In the background, a `DateFilter` compares dates based on their text value. Due to the order of ISO Date string characters though, this doesn't matter - as long as no timezones are used. We are looking for a better solution to this. For now you can convert your non-UTC dates to UTC before sending them in a query.</p> <p>The following operators are supported:</p> <table>
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>greater than</td>
             *     <td>?foo=>2020</td>
             *   </tr>
             *   <tr>
             *     <td>less than</td>
             *     <td>?foo=<2020</td>
             *   </tr>
             *   <tr>
             *     <td>greater than or equal to</td>
             *     <td>?foo=>=2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>less than or equal to</td>
             *     <td>?foo=<=2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>matches regex</td>
             *     <td>?foo=~.+01-01T.+</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=2020-01-01T00:00:00.000Z&foo=2021-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!2020-01-01T00:00:00.000Z&foo=!2021-01-01T00:00:00.000Z</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.DateFilter;
            export type Filename = /**
             * <table class="query-examples">
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=bar</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!bar</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>starts with</td>
             *     <td>?foo=^bar</td>
             *   </tr>
             *   <tr>
             *     <td>ends with</td>
             *     <td>?foo=$bar</td>
             *   </tr>
             *   <tr>
             *     <td>matches regex</td>
             *     <td>?foo=~.+bar.+</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=bar&foo=baz</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!bar&foo=!baz</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.TextFilter;
            export type Filesize = /**
             * <p>Filters for a number. <p>The following operators are supported:</p> <table>
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=bar</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!bar</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>greater than</td>
             *     <td>?foo=>5</td>
             *   </tr>
             *   <tr>
             *     <td>less than</td>
             *     <td>?foo=<5</td>
             *   </tr>
             *   <tr>
             *     <td>greater than or equal to</td>
             *     <td>?foo=>=5</td>
             *   </tr>
             *   <tr>
             *     <td>less than or equal to</td>
             *     <td>?foo=5</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=5&foo=6</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!5&foo=!6</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.NumberFilter;
            export type IsOwn = /**
             * <p>Filters for a boolean. <p>The following operators are supported:</p> <table>
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=true</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!true</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.BooleanFilter;
            export type Mimetype = /**
             * <table class="query-examples">
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=bar</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!bar</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>starts with</td>
             *     <td>?foo=^bar</td>
             *   </tr>
             *   <tr>
             *     <td>ends with</td>
             *     <td>?foo=$bar</td>
             *   </tr>
             *   <tr>
             *     <td>matches regex</td>
             *     <td>?foo=~.+bar.+</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=bar&foo=baz</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!bar&foo=!baz</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.TextFilter;
            export type Title = /**
             * <table class="query-examples">
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=bar</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!bar</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>starts with</td>
             *     <td>?foo=^bar</td>
             *   </tr>
             *   <tr>
             *     <td>ends with</td>
             *     <td>?foo=$bar</td>
             *   </tr>
             *   <tr>
             *     <td>matches regex</td>
             *     <td>?foo=~.+bar.+</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=bar&foo=baz</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!bar&foo=!baz</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.TextFilter;
        }
        export interface QueryParameters {
            createdAt?: Parameters.CreatedAt;
            createdBy?: Parameters.CreatedBy;
            createdByDevice?: Parameters.CreatedByDevice;
            description?: Parameters.Description;
            expiresAt?: Parameters.ExpiresAt;
            filename?: Parameters.Filename;
            filesize?: Parameters.Filesize;
            mimetype?: Parameters.Mimetype;
            title?: Parameters.Title;
            isOwn?: Parameters.IsOwn;
        }
        namespace Responses {
            export interface $200 {
                result: Components.Schemas.FileMetadata[];
            }
            export type $401 = Components.Responses.Unauthorized;
            export type $403 = Components.Responses.Forbidden;
        }
    }
    namespace GetAttribute {
        namespace Parameters {
            export type Id = /**
             * The ID of an attribute.
             * example:
             * ATT_________________
             */
            Components.Schemas.AttributeID /* AttributeID */;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        namespace Responses {
            export interface $200 {
                result: Components.Schemas.Attribute;
            }
            export type $401 = Components.Responses.Unauthorized;
            export type $403 = Components.Responses.Forbidden;
            export type $404 = Components.Responses.NotFound;
        }
    }
    namespace GetAttributes {
        namespace Parameters {
            export type ContentConfidentiality = /**
             * <table class="query-examples">
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=bar</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!bar</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>starts with</td>
             *     <td>?foo=^bar</td>
             *   </tr>
             *   <tr>
             *     <td>ends with</td>
             *     <td>?foo=$bar</td>
             *   </tr>
             *   <tr>
             *     <td>matches regex</td>
             *     <td>?foo=~.+bar.+</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=bar&foo=baz</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!bar&foo=!baz</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.TextFilter;
            export type ContentIsTechnical = /**
             * <p>Filters for a boolean. <p>The following operators are supported:</p> <table>
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=true</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!true</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.BooleanFilter;
            export type ContentKey = /**
             * <table class="query-examples">
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=bar</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!bar</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>starts with</td>
             *     <td>?foo=^bar</td>
             *   </tr>
             *   <tr>
             *     <td>ends with</td>
             *     <td>?foo=$bar</td>
             *   </tr>
             *   <tr>
             *     <td>matches regex</td>
             *     <td>?foo=~.+bar.+</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=bar&foo=baz</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!bar&foo=!baz</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.TextFilter;
            export type ContentOwner = /**
             * <table class="query-examples">
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=bar</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!bar</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>starts with</td>
             *     <td>?foo=^bar</td>
             *   </tr>
             *   <tr>
             *     <td>ends with</td>
             *     <td>?foo=$bar</td>
             *   </tr>
             *   <tr>
             *     <td>matches regex</td>
             *     <td>?foo=~.+bar.+</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=bar&foo=baz</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!bar&foo=!baz</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.TextFilter;
            export type ContentTags = /**
             * <table class="query-examples">
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=bar</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!bar</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>starts with</td>
             *     <td>?foo=^bar</td>
             *   </tr>
             *   <tr>
             *     <td>ends with</td>
             *     <td>?foo=$bar</td>
             *   </tr>
             *   <tr>
             *     <td>matches regex</td>
             *     <td>?foo=~.+bar.+</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=bar&foo=baz</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!bar&foo=!baz</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.TextFilter;
            export type ContentType = /**
             * <table class="query-examples">
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=bar</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!bar</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>starts with</td>
             *     <td>?foo=^bar</td>
             *   </tr>
             *   <tr>
             *     <td>ends with</td>
             *     <td>?foo=$bar</td>
             *   </tr>
             *   <tr>
             *     <td>matches regex</td>
             *     <td>?foo=~.+bar.+</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=bar&foo=baz</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!bar&foo=!baz</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.TextFilter;
            export type ContentValidFrom = /**
             * <p>Filters for a date. In the background, a `DateFilter` compares dates based on their text value. Due to the order of ISO Date string characters though, this doesn't matter - as long as no timezones are used. We are looking for a better solution to this. For now you can convert your non-UTC dates to UTC before sending them in a query.</p> <p>The following operators are supported:</p> <table>
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>greater than</td>
             *     <td>?foo=>2020</td>
             *   </tr>
             *   <tr>
             *     <td>less than</td>
             *     <td>?foo=<2020</td>
             *   </tr>
             *   <tr>
             *     <td>greater than or equal to</td>
             *     <td>?foo=>=2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>less than or equal to</td>
             *     <td>?foo=<=2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>matches regex</td>
             *     <td>?foo=~.+01-01T.+</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=2020-01-01T00:00:00.000Z&foo=2021-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!2020-01-01T00:00:00.000Z&foo=!2021-01-01T00:00:00.000Z</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.DateFilter;
            export type ContentValidTo = /**
             * <p>Filters for a date. In the background, a `DateFilter` compares dates based on their text value. Due to the order of ISO Date string characters though, this doesn't matter - as long as no timezones are used. We are looking for a better solution to this. For now you can convert your non-UTC dates to UTC before sending them in a query.</p> <p>The following operators are supported:</p> <table>
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>greater than</td>
             *     <td>?foo=>2020</td>
             *   </tr>
             *   <tr>
             *     <td>less than</td>
             *     <td>?foo=<2020</td>
             *   </tr>
             *   <tr>
             *     <td>greater than or equal to</td>
             *     <td>?foo=>=2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>less than or equal to</td>
             *     <td>?foo=<=2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>matches regex</td>
             *     <td>?foo=~.+01-01T.+</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=2020-01-01T00:00:00.000Z&foo=2021-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!2020-01-01T00:00:00.000Z&foo=!2021-01-01T00:00:00.000Z</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.DateFilter;
            export type ContentValueType = /**
             * <table class="query-examples">
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=bar</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!bar</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>starts with</td>
             *     <td>?foo=^bar</td>
             *   </tr>
             *   <tr>
             *     <td>ends with</td>
             *     <td>?foo=$bar</td>
             *   </tr>
             *   <tr>
             *     <td>matches regex</td>
             *     <td>?foo=~.+bar.+</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=bar&foo=baz</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!bar&foo=!baz</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.TextFilter;
            export type CreatedAt = /**
             * <p>Filters for a date. In the background, a `DateFilter` compares dates based on their text value. Due to the order of ISO Date string characters though, this doesn't matter - as long as no timezones are used. We are looking for a better solution to this. For now you can convert your non-UTC dates to UTC before sending them in a query.</p> <p>The following operators are supported:</p> <table>
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>greater than</td>
             *     <td>?foo=>2020</td>
             *   </tr>
             *   <tr>
             *     <td>less than</td>
             *     <td>?foo=<2020</td>
             *   </tr>
             *   <tr>
             *     <td>greater than or equal to</td>
             *     <td>?foo=>=2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>less than or equal to</td>
             *     <td>?foo=<=2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>matches regex</td>
             *     <td>?foo=~.+01-01T.+</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=2020-01-01T00:00:00.000Z&foo=2021-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!2020-01-01T00:00:00.000Z&foo=!2021-01-01T00:00:00.000Z</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.DateFilter;
            export type ShareInfoPeer = /**
             * <table class="query-examples">
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=bar</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!bar</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>starts with</td>
             *     <td>?foo=^bar</td>
             *   </tr>
             *   <tr>
             *     <td>ends with</td>
             *     <td>?foo=$bar</td>
             *   </tr>
             *   <tr>
             *     <td>matches regex</td>
             *     <td>?foo=~.+bar.+</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=bar&foo=baz</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!bar&foo=!baz</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.TextFilter;
            export type ShareInfoRequestReference = /**
             * <table class="query-examples">
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=bar</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!bar</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>starts with</td>
             *     <td>?foo=^bar</td>
             *   </tr>
             *   <tr>
             *     <td>ends with</td>
             *     <td>?foo=$bar</td>
             *   </tr>
             *   <tr>
             *     <td>matches regex</td>
             *     <td>?foo=~.+bar.+</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=bar&foo=baz</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!bar&foo=!baz</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.TextFilter;
            export type ShareInfoSourceAttribute = /**
             * <table class="query-examples">
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=bar</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!bar</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>starts with</td>
             *     <td>?foo=^bar</td>
             *   </tr>
             *   <tr>
             *     <td>ends with</td>
             *     <td>?foo=$bar</td>
             *   </tr>
             *   <tr>
             *     <td>matches regex</td>
             *     <td>?foo=~.+bar.+</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=bar&foo=baz</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!bar&foo=!baz</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.TextFilter;
            export type SucceededBy = /**
             * <table class="query-examples">
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=bar</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!bar</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>starts with</td>
             *     <td>?foo=^bar</td>
             *   </tr>
             *   <tr>
             *     <td>ends with</td>
             *     <td>?foo=$bar</td>
             *   </tr>
             *   <tr>
             *     <td>matches regex</td>
             *     <td>?foo=~.+bar.+</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=bar&foo=baz</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!bar&foo=!baz</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.TextFilter;
            export type Succeeds = /**
             * <table class="query-examples">
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=bar</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!bar</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>starts with</td>
             *     <td>?foo=^bar</td>
             *   </tr>
             *   <tr>
             *     <td>ends with</td>
             *     <td>?foo=$bar</td>
             *   </tr>
             *   <tr>
             *     <td>matches regex</td>
             *     <td>?foo=~.+bar.+</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=bar&foo=baz</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!bar&foo=!baz</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.TextFilter;
        }
        export interface QueryParameters {
            createdAt?: Parameters.CreatedAt;
            "content.@type"?: Parameters.ContentType;
            "content.tags"?: Parameters.ContentTags;
            "content.owner"?: Parameters.ContentOwner;
            "content.validFrom"?: Parameters.ContentValidFrom;
            "content.validTo"?: Parameters.ContentValidTo;
            "content.key"?: Parameters.ContentKey;
            "content.isTechnical"?: Parameters.ContentIsTechnical;
            "content.confidentiality"?: Parameters.ContentConfidentiality;
            "content.value.@type"?: Parameters.ContentValueType;
            succeeds?: Parameters.Succeeds;
            succeededBy?: Parameters.SucceededBy;
            "shareInfo.requestReference"?: Parameters.ShareInfoRequestReference;
            "shareInfo.peer"?: Parameters.ShareInfoPeer;
            "shareInfo.sourceAttribute"?: Parameters.ShareInfoSourceAttribute;
        }
        namespace Responses {
            export interface $200 {
                result: Components.Schemas.Attribute[];
            }
            export type $401 = Components.Responses.Unauthorized;
            export type $403 = Components.Responses.Forbidden;
        }
    }
    namespace GetAttributesForRelationship {
        namespace Parameters {
            export type Id = /**
             * The ID of a relationship.
             * example:
             * REL_________________
             */
            Components.Schemas.RelationshipID /* RelationshipID */;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        namespace Responses {
            export interface $200 {
                result: Components.Schemas.Attribute[];
            }
            export type $401 = Components.Responses.Unauthorized;
            export type $403 = Components.Responses.Forbidden;
        }
    }
    namespace GetFileMetadata {
        namespace Parameters {
            export type IdOrReference = /**
             * The ID of a file.
             * example:
             * FIL_________________
             */
            Components.Schemas.FileID /* FileID */ | Components.Schemas.FileReferenceTruncated;
        }
        export interface PathParameters {
            idOrReference: Parameters.IdOrReference;
        }
        namespace Responses {
            export interface $200 {
                result: Components.Schemas.FileMetadata;
            }
            export type $401 = Components.Responses.Unauthorized;
            export type $403 = Components.Responses.Forbidden;
            export type $404 = Components.Responses.NotFound;
        }
    }
    namespace GetHealth {
        namespace Responses {
            export type $200 = Components.Schemas.ConnectorHealth;
            export type $403 = Components.Responses.Forbidden;
        }
    }
    namespace GetIdentityInfo {
        namespace Responses {
            export interface $200 {
                result: Components.Schemas.IdentityInfo;
            }
            export type $401 = Components.Responses.Unauthorized;
            export type $403 = Components.Responses.Forbidden;
        }
    }
    namespace GetIncomingRequest {
        namespace Parameters {
            export type Id = /**
             * The ID of a message.
             * example:
             * REQ_________________
             */
            Components.Schemas.RequestID /* RequestID */;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        namespace Responses {
            export interface $200 {
                result: Components.Schemas.Request;
            }
            export type $401 = Components.Responses.Unauthorized;
            export type $403 = Components.Responses.Forbidden;
            export type $404 = Components.Responses.NotFound;
        }
    }
    namespace GetIncomingRequests {
        namespace Parameters {
            export type ContentExpiresAt = /**
             * <p>Filters for a date. In the background, a `DateFilter` compares dates based on their text value. Due to the order of ISO Date string characters though, this doesn't matter - as long as no timezones are used. We are looking for a better solution to this. For now you can convert your non-UTC dates to UTC before sending them in a query.</p> <p>The following operators are supported:</p> <table>
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>greater than</td>
             *     <td>?foo=>2020</td>
             *   </tr>
             *   <tr>
             *     <td>less than</td>
             *     <td>?foo=<2020</td>
             *   </tr>
             *   <tr>
             *     <td>greater than or equal to</td>
             *     <td>?foo=>=2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>less than or equal to</td>
             *     <td>?foo=<=2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>matches regex</td>
             *     <td>?foo=~.+01-01T.+</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=2020-01-01T00:00:00.000Z&foo=2021-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!2020-01-01T00:00:00.000Z&foo=!2021-01-01T00:00:00.000Z</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.DateFilter;
            export type ContentItemsItemsType = /**
             * <table class="query-examples">
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=bar</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!bar</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>starts with</td>
             *     <td>?foo=^bar</td>
             *   </tr>
             *   <tr>
             *     <td>ends with</td>
             *     <td>?foo=$bar</td>
             *   </tr>
             *   <tr>
             *     <td>matches regex</td>
             *     <td>?foo=~.+bar.+</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=bar&foo=baz</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!bar&foo=!baz</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.TextFilter;
            export type ContentItemsType = /**
             * <table class="query-examples">
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=bar</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!bar</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>starts with</td>
             *     <td>?foo=^bar</td>
             *   </tr>
             *   <tr>
             *     <td>ends with</td>
             *     <td>?foo=$bar</td>
             *   </tr>
             *   <tr>
             *     <td>matches regex</td>
             *     <td>?foo=~.+bar.+</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=bar&foo=baz</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!bar&foo=!baz</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.TextFilter;
            export type CreatedAt = /**
             * <p>Filters for a date. In the background, a `DateFilter` compares dates based on their text value. Due to the order of ISO Date string characters though, this doesn't matter - as long as no timezones are used. We are looking for a better solution to this. For now you can convert your non-UTC dates to UTC before sending them in a query.</p> <p>The following operators are supported:</p> <table>
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>greater than</td>
             *     <td>?foo=>2020</td>
             *   </tr>
             *   <tr>
             *     <td>less than</td>
             *     <td>?foo=<2020</td>
             *   </tr>
             *   <tr>
             *     <td>greater than or equal to</td>
             *     <td>?foo=>=2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>less than or equal to</td>
             *     <td>?foo=<=2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>matches regex</td>
             *     <td>?foo=~.+01-01T.+</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=2020-01-01T00:00:00.000Z&foo=2021-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!2020-01-01T00:00:00.000Z&foo=!2021-01-01T00:00:00.000Z</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.DateFilter;
            export type Id = /**
             * <p>Filters for an ID. Basically a `TextFilter`, but with less useful operators</p> <p>The following operators are supported:</p> <table>
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=XXX_________________</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!XXX_________________</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=XXX_________________&foo=YYY_________________</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!XXX_________________&foo=!YYY_________________</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.IdFilter;
            export type Peer = /**
             * <table class="query-examples">
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=bar</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!bar</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>starts with</td>
             *     <td>?foo=^bar</td>
             *   </tr>
             *   <tr>
             *     <td>ends with</td>
             *     <td>?foo=$bar</td>
             *   </tr>
             *   <tr>
             *     <td>matches regex</td>
             *     <td>?foo=~.+bar.+</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=bar&foo=baz</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!bar&foo=!baz</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.TextFilter;
            export type ResponseContentItemsItemsType = /**
             * <table class="query-examples">
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=bar</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!bar</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>starts with</td>
             *     <td>?foo=^bar</td>
             *   </tr>
             *   <tr>
             *     <td>ends with</td>
             *     <td>?foo=$bar</td>
             *   </tr>
             *   <tr>
             *     <td>matches regex</td>
             *     <td>?foo=~.+bar.+</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=bar&foo=baz</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!bar&foo=!baz</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.TextFilter;
            export type ResponseContentItemsType = /**
             * <table class="query-examples">
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=bar</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!bar</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>starts with</td>
             *     <td>?foo=^bar</td>
             *   </tr>
             *   <tr>
             *     <td>ends with</td>
             *     <td>?foo=$bar</td>
             *   </tr>
             *   <tr>
             *     <td>matches regex</td>
             *     <td>?foo=~.+bar.+</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=bar&foo=baz</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!bar&foo=!baz</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.TextFilter;
            export type ResponseContentResult = /**
             * <table class="query-examples">
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=bar</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!bar</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>starts with</td>
             *     <td>?foo=^bar</td>
             *   </tr>
             *   <tr>
             *     <td>ends with</td>
             *     <td>?foo=$bar</td>
             *   </tr>
             *   <tr>
             *     <td>matches regex</td>
             *     <td>?foo=~.+bar.+</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=bar&foo=baz</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!bar&foo=!baz</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.TextFilter;
            export type ResponseCreatedAt = /**
             * <p>Filters for a date. In the background, a `DateFilter` compares dates based on their text value. Due to the order of ISO Date string characters though, this doesn't matter - as long as no timezones are used. We are looking for a better solution to this. For now you can convert your non-UTC dates to UTC before sending them in a query.</p> <p>The following operators are supported:</p> <table>
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>greater than</td>
             *     <td>?foo=>2020</td>
             *   </tr>
             *   <tr>
             *     <td>less than</td>
             *     <td>?foo=<2020</td>
             *   </tr>
             *   <tr>
             *     <td>greater than or equal to</td>
             *     <td>?foo=>=2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>less than or equal to</td>
             *     <td>?foo=<=2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>matches regex</td>
             *     <td>?foo=~.+01-01T.+</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=2020-01-01T00:00:00.000Z&foo=2021-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!2020-01-01T00:00:00.000Z&foo=!2021-01-01T00:00:00.000Z</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.DateFilter;
            export type ResponseSourceReference = /**
             * <p>Filters for an ID. Basically a `TextFilter`, but with less useful operators</p> <p>The following operators are supported:</p> <table>
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=XXX_________________</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!XXX_________________</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=XXX_________________&foo=YYY_________________</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!XXX_________________&foo=!YYY_________________</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.IdFilter;
            export type ResponseSourceType = /**
             * <table class="query-examples">
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=bar</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!bar</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>starts with</td>
             *     <td>?foo=^bar</td>
             *   </tr>
             *   <tr>
             *     <td>ends with</td>
             *     <td>?foo=$bar</td>
             *   </tr>
             *   <tr>
             *     <td>matches regex</td>
             *     <td>?foo=~.+bar.+</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=bar&foo=baz</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!bar&foo=!baz</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.TextFilter;
            export type SourceReference = /**
             * <p>Filters for an ID. Basically a `TextFilter`, but with less useful operators</p> <p>The following operators are supported:</p> <table>
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=XXX_________________</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!XXX_________________</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=XXX_________________&foo=YYY_________________</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!XXX_________________&foo=!YYY_________________</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.IdFilter;
            export type SourceType = /**
             * <table class="query-examples">
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=bar</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!bar</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>starts with</td>
             *     <td>?foo=^bar</td>
             *   </tr>
             *   <tr>
             *     <td>ends with</td>
             *     <td>?foo=$bar</td>
             *   </tr>
             *   <tr>
             *     <td>matches regex</td>
             *     <td>?foo=~.+bar.+</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=bar&foo=baz</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!bar&foo=!baz</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.TextFilter;
            export type Status = /**
             * <table class="query-examples">
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=bar</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!bar</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>starts with</td>
             *     <td>?foo=^bar</td>
             *   </tr>
             *   <tr>
             *     <td>ends with</td>
             *     <td>?foo=$bar</td>
             *   </tr>
             *   <tr>
             *     <td>matches regex</td>
             *     <td>?foo=~.+bar.+</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=bar&foo=baz</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!bar&foo=!baz</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.TextFilter;
        }
        export interface QueryParameters {
            id?: Parameters.Id;
            peer?: Parameters.Peer;
            createdAt?: Parameters.CreatedAt;
            status?: Parameters.Status;
            "content.expiresAt"?: Parameters.ContentExpiresAt;
            "content.items.@type"?: Parameters.ContentItemsType;
            "content.items.items.@type"?: Parameters.ContentItemsItemsType;
            "source.type"?: Parameters.SourceType;
            "source.reference"?: Parameters.SourceReference;
            "response.createdAt"?: Parameters.ResponseCreatedAt;
            "response.source.type"?: Parameters.ResponseSourceType;
            "response.source.reference"?: Parameters.ResponseSourceReference;
            "response.content.result"?: Parameters.ResponseContentResult;
            "response.content.items.@type"?: Parameters.ResponseContentItemsType;
            "response.content.items.items.@type"?: Parameters.ResponseContentItemsItemsType;
        }
        namespace Responses {
            export interface $200 {
                result: Components.Schemas.Request[];
            }
            export type $401 = Components.Responses.Unauthorized;
            export type $403 = Components.Responses.Forbidden;
        }
    }
    namespace GetMessage {
        namespace Parameters {
            export type Id = /**
             * The ID of a message.
             * example:
             * MSG_________________
             */
            Components.Schemas.MessageID /* MessageID */;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        namespace Responses {
            export interface $200 {
                result: Components.Schemas.MessageWithAttachments;
            }
            export type $401 = Components.Responses.Unauthorized;
            export type $403 = Components.Responses.Forbidden;
            export type $404 = Components.Responses.NotFound;
        }
    }
    namespace GetMessages {
        namespace Parameters {
            export type Attachments = /**
             * <p>Filters for an ID. Basically a `TextFilter`, but with less useful operators</p> <p>The following operators are supported:</p> <table>
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=XXX_________________</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!XXX_________________</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=XXX_________________&foo=YYY_________________</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!XXX_________________&foo=!YYY_________________</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.IdFilter;
            export type ContentBody = /**
             * <table class="query-examples">
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=bar</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!bar</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>starts with</td>
             *     <td>?foo=^bar</td>
             *   </tr>
             *   <tr>
             *     <td>ends with</td>
             *     <td>?foo=$bar</td>
             *   </tr>
             *   <tr>
             *     <td>matches regex</td>
             *     <td>?foo=~.+bar.+</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=bar&foo=baz</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!bar&foo=!baz</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.TextFilter;
            export type ContentSubject = /**
             * <table class="query-examples">
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=bar</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!bar</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>starts with</td>
             *     <td>?foo=^bar</td>
             *   </tr>
             *   <tr>
             *     <td>ends with</td>
             *     <td>?foo=$bar</td>
             *   </tr>
             *   <tr>
             *     <td>matches regex</td>
             *     <td>?foo=~.+bar.+</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=bar&foo=baz</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!bar&foo=!baz</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.TextFilter;
            export type ContentType = /**
             * <table class="query-examples">
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=bar</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!bar</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>starts with</td>
             *     <td>?foo=^bar</td>
             *   </tr>
             *   <tr>
             *     <td>ends with</td>
             *     <td>?foo=$bar</td>
             *   </tr>
             *   <tr>
             *     <td>matches regex</td>
             *     <td>?foo=~.+bar.+</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=bar&foo=baz</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!bar&foo=!baz</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.TextFilter;
            export type CreatedAt = /**
             * <p>Filters for a date. In the background, a `DateFilter` compares dates based on their text value. Due to the order of ISO Date string characters though, this doesn't matter - as long as no timezones are used. We are looking for a better solution to this. For now you can convert your non-UTC dates to UTC before sending them in a query.</p> <p>The following operators are supported:</p> <table>
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>greater than</td>
             *     <td>?foo=>2020</td>
             *   </tr>
             *   <tr>
             *     <td>less than</td>
             *     <td>?foo=<2020</td>
             *   </tr>
             *   <tr>
             *     <td>greater than or equal to</td>
             *     <td>?foo=>=2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>less than or equal to</td>
             *     <td>?foo=<=2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>matches regex</td>
             *     <td>?foo=~.+01-01T.+</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=2020-01-01T00:00:00.000Z&foo=2021-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!2020-01-01T00:00:00.000Z&foo=!2021-01-01T00:00:00.000Z</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.DateFilter;
            export type CreatedBy = /**
             * <p>Filters for an ID. Basically a `TextFilter`, but with less useful operators</p> <p>The following operators are supported:</p> <table>
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=XXX_________________</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!XXX_________________</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=XXX_________________&foo=YYY_________________</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!XXX_________________&foo=!YYY_________________</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.IdFilter;
            export type CreatedByDevice = /**
             * <p>Filters for an ID. Basically a `TextFilter`, but with less useful operators</p> <p>The following operators are supported:</p> <table>
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=XXX_________________</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!XXX_________________</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=XXX_________________&foo=YYY_________________</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!XXX_________________&foo=!YYY_________________</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.IdFilter;
            export type Participant = /**
             * <p>Filters for an ID. Basically a `TextFilter`, but with less useful operators</p> <p>The following operators are supported:</p> <table>
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=XXX_________________</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!XXX_________________</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=XXX_________________&foo=YYY_________________</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!XXX_________________&foo=!YYY_________________</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.IdFilter;
            export type RecipientsAddress = /**
             * <p>Filters for an ID. Basically a `TextFilter`, but with less useful operators</p> <p>The following operators are supported:</p> <table>
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=XXX_________________</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!XXX_________________</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=XXX_________________&foo=YYY_________________</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!XXX_________________&foo=!YYY_________________</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.IdFilter;
            export type RecipientsRelationshipId = /**
             * <table class="query-examples">
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=bar</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!bar</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>starts with</td>
             *     <td>?foo=^bar</td>
             *   </tr>
             *   <tr>
             *     <td>ends with</td>
             *     <td>?foo=$bar</td>
             *   </tr>
             *   <tr>
             *     <td>matches regex</td>
             *     <td>?foo=~.+bar.+</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=bar&foo=baz</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!bar&foo=!baz</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.TextFilter;
        }
        export interface QueryParameters {
            createdBy?: Parameters.CreatedBy;
            createdByDevice?: Parameters.CreatedByDevice;
            createdAt?: Parameters.CreatedAt;
            "recipients.address"?: Parameters.RecipientsAddress;
            "recipients.relationshipId"?: Parameters.RecipientsRelationshipId;
            participant?: Parameters.Participant;
            attachments?: Parameters.Attachments;
            "content.@type"?: Parameters.ContentType;
            "content.subject"?: Parameters.ContentSubject;
            "content.body"?: Parameters.ContentBody;
        }
        namespace Responses {
            export interface $200 {
                result: Components.Schemas.Message[];
            }
            export type $400 = Components.Responses.BadRequest;
            export type $401 = Components.Responses.Unauthorized;
            export type $403 = Components.Responses.Forbidden;
        }
    }
    namespace GetMetadataOfMessageAttachment {
        namespace Parameters {
            export type AttachmentId = /**
             * The ID of a file.
             * example:
             * FIL_________________
             */
            Components.Schemas.FileID /* FileID */;
            export type MessageId = /**
             * The ID of a message.
             * example:
             * MSG_________________
             */
            Components.Schemas.MessageID /* MessageID */;
        }
        export interface PathParameters {
            messageId: Parameters.MessageId;
            attachmentId: Parameters.AttachmentId;
        }
        namespace Responses {
            export interface $200 {
                result: Components.Schemas.FileMetadata;
            }
            export type $401 = Components.Responses.Unauthorized;
            export type $403 = Components.Responses.Forbidden;
            export type $404 = Components.Responses.NotFound;
        }
    }
    namespace GetOutgoingRequest {
        namespace Parameters {
            export type Id = /**
             * The ID of a message.
             * example:
             * REQ_________________
             */
            Components.Schemas.RequestID /* RequestID */;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        namespace Responses {
            export interface $200 {
                result: Components.Schemas.Request;
            }
            export type $401 = Components.Responses.Unauthorized;
            export type $403 = Components.Responses.Forbidden;
            export type $404 = Components.Responses.NotFound;
        }
    }
    namespace GetOutgoingRequests {
        namespace Parameters {
            export type ContentExpiresAt = /**
             * <p>Filters for a date. In the background, a `DateFilter` compares dates based on their text value. Due to the order of ISO Date string characters though, this doesn't matter - as long as no timezones are used. We are looking for a better solution to this. For now you can convert your non-UTC dates to UTC before sending them in a query.</p> <p>The following operators are supported:</p> <table>
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>greater than</td>
             *     <td>?foo=>2020</td>
             *   </tr>
             *   <tr>
             *     <td>less than</td>
             *     <td>?foo=<2020</td>
             *   </tr>
             *   <tr>
             *     <td>greater than or equal to</td>
             *     <td>?foo=>=2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>less than or equal to</td>
             *     <td>?foo=<=2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>matches regex</td>
             *     <td>?foo=~.+01-01T.+</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=2020-01-01T00:00:00.000Z&foo=2021-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!2020-01-01T00:00:00.000Z&foo=!2021-01-01T00:00:00.000Z</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.DateFilter;
            export type ContentItemsItemsType = /**
             * <table class="query-examples">
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=bar</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!bar</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>starts with</td>
             *     <td>?foo=^bar</td>
             *   </tr>
             *   <tr>
             *     <td>ends with</td>
             *     <td>?foo=$bar</td>
             *   </tr>
             *   <tr>
             *     <td>matches regex</td>
             *     <td>?foo=~.+bar.+</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=bar&foo=baz</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!bar&foo=!baz</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.TextFilter;
            export type ContentItemsType = /**
             * <table class="query-examples">
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=bar</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!bar</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>starts with</td>
             *     <td>?foo=^bar</td>
             *   </tr>
             *   <tr>
             *     <td>ends with</td>
             *     <td>?foo=$bar</td>
             *   </tr>
             *   <tr>
             *     <td>matches regex</td>
             *     <td>?foo=~.+bar.+</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=bar&foo=baz</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!bar&foo=!baz</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.TextFilter;
            export type CreatedAt = /**
             * <p>Filters for a date. In the background, a `DateFilter` compares dates based on their text value. Due to the order of ISO Date string characters though, this doesn't matter - as long as no timezones are used. We are looking for a better solution to this. For now you can convert your non-UTC dates to UTC before sending them in a query.</p> <p>The following operators are supported:</p> <table>
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>greater than</td>
             *     <td>?foo=>2020</td>
             *   </tr>
             *   <tr>
             *     <td>less than</td>
             *     <td>?foo=<2020</td>
             *   </tr>
             *   <tr>
             *     <td>greater than or equal to</td>
             *     <td>?foo=>=2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>less than or equal to</td>
             *     <td>?foo=<=2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>matches regex</td>
             *     <td>?foo=~.+01-01T.+</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=2020-01-01T00:00:00.000Z&foo=2021-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!2020-01-01T00:00:00.000Z&foo=!2021-01-01T00:00:00.000Z</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.DateFilter;
            export type Id = /**
             * <p>Filters for an ID. Basically a `TextFilter`, but with less useful operators</p> <p>The following operators are supported:</p> <table>
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=XXX_________________</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!XXX_________________</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=XXX_________________&foo=YYY_________________</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!XXX_________________&foo=!YYY_________________</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.IdFilter;
            export type Peer = /**
             * <table class="query-examples">
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=bar</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!bar</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>starts with</td>
             *     <td>?foo=^bar</td>
             *   </tr>
             *   <tr>
             *     <td>ends with</td>
             *     <td>?foo=$bar</td>
             *   </tr>
             *   <tr>
             *     <td>matches regex</td>
             *     <td>?foo=~.+bar.+</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=bar&foo=baz</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!bar&foo=!baz</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.TextFilter;
            export type ResponseContentItemsItemsType = /**
             * <table class="query-examples">
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=bar</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!bar</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>starts with</td>
             *     <td>?foo=^bar</td>
             *   </tr>
             *   <tr>
             *     <td>ends with</td>
             *     <td>?foo=$bar</td>
             *   </tr>
             *   <tr>
             *     <td>matches regex</td>
             *     <td>?foo=~.+bar.+</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=bar&foo=baz</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!bar&foo=!baz</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.TextFilter;
            export type ResponseContentItemsType = /**
             * <table class="query-examples">
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=bar</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!bar</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>starts with</td>
             *     <td>?foo=^bar</td>
             *   </tr>
             *   <tr>
             *     <td>ends with</td>
             *     <td>?foo=$bar</td>
             *   </tr>
             *   <tr>
             *     <td>matches regex</td>
             *     <td>?foo=~.+bar.+</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=bar&foo=baz</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!bar&foo=!baz</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.TextFilter;
            export type ResponseContentResult = /**
             * <p>Filters for a boolean. <p>The following operators are supported:</p> <table>
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=true</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!true</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.BooleanFilter;
            export type ResponseCreatedAt = /**
             * <p>Filters for a date. In the background, a `DateFilter` compares dates based on their text value. Due to the order of ISO Date string characters though, this doesn't matter - as long as no timezones are used. We are looking for a better solution to this. For now you can convert your non-UTC dates to UTC before sending them in a query.</p> <p>The following operators are supported:</p> <table>
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>greater than</td>
             *     <td>?foo=>2020</td>
             *   </tr>
             *   <tr>
             *     <td>less than</td>
             *     <td>?foo=<2020</td>
             *   </tr>
             *   <tr>
             *     <td>greater than or equal to</td>
             *     <td>?foo=>=2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>less than or equal to</td>
             *     <td>?foo=<=2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>matches regex</td>
             *     <td>?foo=~.+01-01T.+</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=2020-01-01T00:00:00.000Z&foo=2021-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!2020-01-01T00:00:00.000Z&foo=!2021-01-01T00:00:00.000Z</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.DateFilter;
            export type ResponseSourceReference = /**
             * <p>Filters for an ID. Basically a `TextFilter`, but with less useful operators</p> <p>The following operators are supported:</p> <table>
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=XXX_________________</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!XXX_________________</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=XXX_________________&foo=YYY_________________</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!XXX_________________&foo=!YYY_________________</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.IdFilter;
            export type ResponseSourceType = /**
             * <table class="query-examples">
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=bar</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!bar</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>starts with</td>
             *     <td>?foo=^bar</td>
             *   </tr>
             *   <tr>
             *     <td>ends with</td>
             *     <td>?foo=$bar</td>
             *   </tr>
             *   <tr>
             *     <td>matches regex</td>
             *     <td>?foo=~.+bar.+</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=bar&foo=baz</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!bar&foo=!baz</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.TextFilter;
            export type SourceReference = /**
             * <p>Filters for an ID. Basically a `TextFilter`, but with less useful operators</p> <p>The following operators are supported:</p> <table>
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=XXX_________________</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!XXX_________________</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=XXX_________________&foo=YYY_________________</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!XXX_________________&foo=!YYY_________________</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.IdFilter;
            export type SourceType = /**
             * <table class="query-examples">
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=bar</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!bar</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>starts with</td>
             *     <td>?foo=^bar</td>
             *   </tr>
             *   <tr>
             *     <td>ends with</td>
             *     <td>?foo=$bar</td>
             *   </tr>
             *   <tr>
             *     <td>matches regex</td>
             *     <td>?foo=~.+bar.+</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=bar&foo=baz</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!bar&foo=!baz</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.TextFilter;
            export type Status = /**
             * <table class="query-examples">
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=bar</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!bar</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>starts with</td>
             *     <td>?foo=^bar</td>
             *   </tr>
             *   <tr>
             *     <td>ends with</td>
             *     <td>?foo=$bar</td>
             *   </tr>
             *   <tr>
             *     <td>matches regex</td>
             *     <td>?foo=~.+bar.+</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=bar&foo=baz</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!bar&foo=!baz</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.TextFilter;
        }
        export interface QueryParameters {
            id?: Parameters.Id;
            peer?: Parameters.Peer;
            createdAt?: Parameters.CreatedAt;
            status?: Parameters.Status;
            "content.expiresAt"?: Parameters.ContentExpiresAt;
            "content.items.@type"?: Parameters.ContentItemsType;
            "content.items.items.@type"?: Parameters.ContentItemsItemsType;
            "source.type"?: Parameters.SourceType;
            "source.reference"?: Parameters.SourceReference;
            "response.createdAt"?: Parameters.ResponseCreatedAt;
            "response.source.type"?: Parameters.ResponseSourceType;
            "response.source.reference"?: Parameters.ResponseSourceReference;
            "response.content.result"?: Parameters.ResponseContentResult;
            "response.content.items.@type"?: Parameters.ResponseContentItemsType;
            "response.content.items.items.@type"?: Parameters.ResponseContentItemsItemsType;
        }
        namespace Responses {
            export interface $200 {
                result: Components.Schemas.Request[];
            }
            export type $401 = Components.Responses.Unauthorized;
            export type $403 = Components.Responses.Forbidden;
        }
    }
    namespace GetOwnFiles {
        namespace Parameters {
            export type CreatedAt = /**
             * <p>Filters for a date. In the background, a `DateFilter` compares dates based on their text value. Due to the order of ISO Date string characters though, this doesn't matter - as long as no timezones are used. We are looking for a better solution to this. For now you can convert your non-UTC dates to UTC before sending them in a query.</p> <p>The following operators are supported:</p> <table>
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>greater than</td>
             *     <td>?foo=>2020</td>
             *   </tr>
             *   <tr>
             *     <td>less than</td>
             *     <td>?foo=<2020</td>
             *   </tr>
             *   <tr>
             *     <td>greater than or equal to</td>
             *     <td>?foo=>=2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>less than or equal to</td>
             *     <td>?foo=<=2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>matches regex</td>
             *     <td>?foo=~.+01-01T.+</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=2020-01-01T00:00:00.000Z&foo=2021-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!2020-01-01T00:00:00.000Z&foo=!2021-01-01T00:00:00.000Z</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.DateFilter;
            export type CreatedByDevice = /**
             * <p>Filters for an ID. Basically a `TextFilter`, but with less useful operators</p> <p>The following operators are supported:</p> <table>
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=XXX_________________</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!XXX_________________</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=XXX_________________&foo=YYY_________________</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!XXX_________________&foo=!YYY_________________</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.IdFilter;
            export type Description = /**
             * <table class="query-examples">
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=bar</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!bar</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>starts with</td>
             *     <td>?foo=^bar</td>
             *   </tr>
             *   <tr>
             *     <td>ends with</td>
             *     <td>?foo=$bar</td>
             *   </tr>
             *   <tr>
             *     <td>matches regex</td>
             *     <td>?foo=~.+bar.+</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=bar&foo=baz</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!bar&foo=!baz</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.TextFilter;
            export type ExpiresAt = /**
             * <p>Filters for a date. In the background, a `DateFilter` compares dates based on their text value. Due to the order of ISO Date string characters though, this doesn't matter - as long as no timezones are used. We are looking for a better solution to this. For now you can convert your non-UTC dates to UTC before sending them in a query.</p> <p>The following operators are supported:</p> <table>
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>greater than</td>
             *     <td>?foo=>2020</td>
             *   </tr>
             *   <tr>
             *     <td>less than</td>
             *     <td>?foo=<2020</td>
             *   </tr>
             *   <tr>
             *     <td>greater than or equal to</td>
             *     <td>?foo=>=2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>less than or equal to</td>
             *     <td>?foo=<=2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>matches regex</td>
             *     <td>?foo=~.+01-01T.+</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=2020-01-01T00:00:00.000Z&foo=2021-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!2020-01-01T00:00:00.000Z&foo=!2021-01-01T00:00:00.000Z</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.DateFilter;
            export type Filename = /**
             * <table class="query-examples">
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=bar</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!bar</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>starts with</td>
             *     <td>?foo=^bar</td>
             *   </tr>
             *   <tr>
             *     <td>ends with</td>
             *     <td>?foo=$bar</td>
             *   </tr>
             *   <tr>
             *     <td>matches regex</td>
             *     <td>?foo=~.+bar.+</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=bar&foo=baz</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!bar&foo=!baz</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.TextFilter;
            export type Filesize = /**
             * <p>Filters for a number. <p>The following operators are supported:</p> <table>
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=bar</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!bar</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>greater than</td>
             *     <td>?foo=>5</td>
             *   </tr>
             *   <tr>
             *     <td>less than</td>
             *     <td>?foo=<5</td>
             *   </tr>
             *   <tr>
             *     <td>greater than or equal to</td>
             *     <td>?foo=>=5</td>
             *   </tr>
             *   <tr>
             *     <td>less than or equal to</td>
             *     <td>?foo=5</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=5&foo=6</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!5&foo=!6</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.NumberFilter;
            export type Mimetype = /**
             * <table class="query-examples">
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=bar</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!bar</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>starts with</td>
             *     <td>?foo=^bar</td>
             *   </tr>
             *   <tr>
             *     <td>ends with</td>
             *     <td>?foo=$bar</td>
             *   </tr>
             *   <tr>
             *     <td>matches regex</td>
             *     <td>?foo=~.+bar.+</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=bar&foo=baz</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!bar&foo=!baz</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.TextFilter;
            export type Title = /**
             * <table class="query-examples">
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=bar</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!bar</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>starts with</td>
             *     <td>?foo=^bar</td>
             *   </tr>
             *   <tr>
             *     <td>ends with</td>
             *     <td>?foo=$bar</td>
             *   </tr>
             *   <tr>
             *     <td>matches regex</td>
             *     <td>?foo=~.+bar.+</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=bar&foo=baz</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!bar&foo=!baz</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.TextFilter;
        }
        export interface QueryParameters {
            createdAt?: Parameters.CreatedAt;
            createdByDevice?: Parameters.CreatedByDevice;
            description?: Parameters.Description;
            expiresAt?: Parameters.ExpiresAt;
            filename?: Parameters.Filename;
            filesize?: Parameters.Filesize;
            mimetype?: Parameters.Mimetype;
            title?: Parameters.Title;
        }
        namespace Responses {
            export interface $200 {
                result: Components.Schemas.FileMetadata[];
            }
            export type $401 = Components.Responses.Unauthorized;
            export type $403 = Components.Responses.Forbidden;
        }
    }
    namespace GetOwnRelationshipTemplates {
        namespace Parameters {
            export type CreatedAt = /**
             * <p>Filters for a date. In the background, a `DateFilter` compares dates based on their text value. Due to the order of ISO Date string characters though, this doesn't matter - as long as no timezones are used. We are looking for a better solution to this. For now you can convert your non-UTC dates to UTC before sending them in a query.</p> <p>The following operators are supported:</p> <table>
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>greater than</td>
             *     <td>?foo=>2020</td>
             *   </tr>
             *   <tr>
             *     <td>less than</td>
             *     <td>?foo=<2020</td>
             *   </tr>
             *   <tr>
             *     <td>greater than or equal to</td>
             *     <td>?foo=>=2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>less than or equal to</td>
             *     <td>?foo=<=2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>matches regex</td>
             *     <td>?foo=~.+01-01T.+</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=2020-01-01T00:00:00.000Z&foo=2021-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!2020-01-01T00:00:00.000Z&foo=!2021-01-01T00:00:00.000Z</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.DateFilter;
            export type CreatedByDevice = /**
             * <p>Filters for an ID. Basically a `TextFilter`, but with less useful operators</p> <p>The following operators are supported:</p> <table>
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=XXX_________________</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!XXX_________________</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=XXX_________________&foo=YYY_________________</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!XXX_________________&foo=!YYY_________________</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.IdFilter;
            export type ExpiresAt = /**
             * <p>Filters for a date. In the background, a `DateFilter` compares dates based on their text value. Due to the order of ISO Date string characters though, this doesn't matter - as long as no timezones are used. We are looking for a better solution to this. For now you can convert your non-UTC dates to UTC before sending them in a query.</p> <p>The following operators are supported:</p> <table>
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>greater than</td>
             *     <td>?foo=>2020</td>
             *   </tr>
             *   <tr>
             *     <td>less than</td>
             *     <td>?foo=<2020</td>
             *   </tr>
             *   <tr>
             *     <td>greater than or equal to</td>
             *     <td>?foo=>=2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>less than or equal to</td>
             *     <td>?foo=<=2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>matches regex</td>
             *     <td>?foo=~.+01-01T.+</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=2020-01-01T00:00:00.000Z&foo=2021-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!2020-01-01T00:00:00.000Z&foo=!2021-01-01T00:00:00.000Z</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.DateFilter;
            export type MaxNumberOfAllocations = /**
             * <p>Filters for a number. <p>The following operators are supported:</p> <table>
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=bar</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!bar</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>greater than</td>
             *     <td>?foo=>5</td>
             *   </tr>
             *   <tr>
             *     <td>less than</td>
             *     <td>?foo=<5</td>
             *   </tr>
             *   <tr>
             *     <td>greater than or equal to</td>
             *     <td>?foo=>=5</td>
             *   </tr>
             *   <tr>
             *     <td>less than or equal to</td>
             *     <td>?foo=5</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=5&foo=6</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!5&foo=!6</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.NumberFilter;
        }
        export interface QueryParameters {
            createdAt?: Parameters.CreatedAt;
            expiresAt?: Parameters.ExpiresAt;
            createdByDevice?: Parameters.CreatedByDevice;
            maxNumberOfAllocations?: Parameters.MaxNumberOfAllocations;
        }
        namespace Responses {
            export interface $200 {
                result: Components.Schemas.RelationshipTemplate[];
            }
            export type $401 = Components.Responses.Unauthorized;
            export type $403 = Components.Responses.Forbidden;
        }
    }
    namespace GetOwnTokens {
        namespace Parameters {
            export type CreatedAt = /**
             * <p>Filters for a date. In the background, a `DateFilter` compares dates based on their text value. Due to the order of ISO Date string characters though, this doesn't matter - as long as no timezones are used. We are looking for a better solution to this. For now you can convert your non-UTC dates to UTC before sending them in a query.</p> <p>The following operators are supported:</p> <table>
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>greater than</td>
             *     <td>?foo=>2020</td>
             *   </tr>
             *   <tr>
             *     <td>less than</td>
             *     <td>?foo=<2020</td>
             *   </tr>
             *   <tr>
             *     <td>greater than or equal to</td>
             *     <td>?foo=>=2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>less than or equal to</td>
             *     <td>?foo=<=2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>matches regex</td>
             *     <td>?foo=~.+01-01T.+</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=2020-01-01T00:00:00.000Z&foo=2021-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!2020-01-01T00:00:00.000Z&foo=!2021-01-01T00:00:00.000Z</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.DateFilter;
            export type CreatedByDevice = /**
             * <p>Filters for an ID. Basically a `TextFilter`, but with less useful operators</p> <p>The following operators are supported:</p> <table>
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=XXX_________________</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!XXX_________________</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=XXX_________________&foo=YYY_________________</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!XXX_________________&foo=!YYY_________________</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.IdFilter;
            export type ExpiresAt = /**
             * <p>Filters for a date. In the background, a `DateFilter` compares dates based on their text value. Due to the order of ISO Date string characters though, this doesn't matter - as long as no timezones are used. We are looking for a better solution to this. For now you can convert your non-UTC dates to UTC before sending them in a query.</p> <p>The following operators are supported:</p> <table>
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>greater than</td>
             *     <td>?foo=>2020</td>
             *   </tr>
             *   <tr>
             *     <td>less than</td>
             *     <td>?foo=<2020</td>
             *   </tr>
             *   <tr>
             *     <td>greater than or equal to</td>
             *     <td>?foo=>=2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>less than or equal to</td>
             *     <td>?foo=<=2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>matches regex</td>
             *     <td>?foo=~.+01-01T.+</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=2020-01-01T00:00:00.000Z&foo=2021-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!2020-01-01T00:00:00.000Z&foo=!2021-01-01T00:00:00.000Z</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.DateFilter;
        }
        export interface QueryParameters {
            createdAt?: Parameters.CreatedAt;
            createdByDevice?: Parameters.CreatedByDevice;
            expiresAt?: Parameters.ExpiresAt;
        }
        namespace Responses {
            export interface $200 {
                result: Components.Schemas.Token[];
            }
            export type $401 = Components.Responses.Unauthorized;
            export type $403 = Components.Responses.Forbidden;
        }
    }
    namespace GetPeerFiles {
        namespace Parameters {
            export type CreatedAt = /**
             * <p>Filters for a date. In the background, a `DateFilter` compares dates based on their text value. Due to the order of ISO Date string characters though, this doesn't matter - as long as no timezones are used. We are looking for a better solution to this. For now you can convert your non-UTC dates to UTC before sending them in a query.</p> <p>The following operators are supported:</p> <table>
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>greater than</td>
             *     <td>?foo=>2020</td>
             *   </tr>
             *   <tr>
             *     <td>less than</td>
             *     <td>?foo=<2020</td>
             *   </tr>
             *   <tr>
             *     <td>greater than or equal to</td>
             *     <td>?foo=>=2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>less than or equal to</td>
             *     <td>?foo=<=2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>matches regex</td>
             *     <td>?foo=~.+01-01T.+</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=2020-01-01T00:00:00.000Z&foo=2021-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!2020-01-01T00:00:00.000Z&foo=!2021-01-01T00:00:00.000Z</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.DateFilter;
            export type CreatedBy = /**
             * <p>Filters for an ID. Basically a `TextFilter`, but with less useful operators</p> <p>The following operators are supported:</p> <table>
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=XXX_________________</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!XXX_________________</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=XXX_________________&foo=YYY_________________</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!XXX_________________&foo=!YYY_________________</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.IdFilter;
            export type Description = /**
             * <table class="query-examples">
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=bar</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!bar</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>starts with</td>
             *     <td>?foo=^bar</td>
             *   </tr>
             *   <tr>
             *     <td>ends with</td>
             *     <td>?foo=$bar</td>
             *   </tr>
             *   <tr>
             *     <td>matches regex</td>
             *     <td>?foo=~.+bar.+</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=bar&foo=baz</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!bar&foo=!baz</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.TextFilter;
            export type ExpiresAt = /**
             * <p>Filters for a date. In the background, a `DateFilter` compares dates based on their text value. Due to the order of ISO Date string characters though, this doesn't matter - as long as no timezones are used. We are looking for a better solution to this. For now you can convert your non-UTC dates to UTC before sending them in a query.</p> <p>The following operators are supported:</p> <table>
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>greater than</td>
             *     <td>?foo=>2020</td>
             *   </tr>
             *   <tr>
             *     <td>less than</td>
             *     <td>?foo=<2020</td>
             *   </tr>
             *   <tr>
             *     <td>greater than or equal to</td>
             *     <td>?foo=>=2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>less than or equal to</td>
             *     <td>?foo=<=2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>matches regex</td>
             *     <td>?foo=~.+01-01T.+</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=2020-01-01T00:00:00.000Z&foo=2021-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!2020-01-01T00:00:00.000Z&foo=!2021-01-01T00:00:00.000Z</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.DateFilter;
            export type Filename = /**
             * <table class="query-examples">
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=bar</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!bar</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>starts with</td>
             *     <td>?foo=^bar</td>
             *   </tr>
             *   <tr>
             *     <td>ends with</td>
             *     <td>?foo=$bar</td>
             *   </tr>
             *   <tr>
             *     <td>matches regex</td>
             *     <td>?foo=~.+bar.+</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=bar&foo=baz</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!bar&foo=!baz</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.TextFilter;
            export type Filesize = /**
             * <p>Filters for a number. <p>The following operators are supported:</p> <table>
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=bar</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!bar</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>greater than</td>
             *     <td>?foo=>5</td>
             *   </tr>
             *   <tr>
             *     <td>less than</td>
             *     <td>?foo=<5</td>
             *   </tr>
             *   <tr>
             *     <td>greater than or equal to</td>
             *     <td>?foo=>=5</td>
             *   </tr>
             *   <tr>
             *     <td>less than or equal to</td>
             *     <td>?foo=5</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=5&foo=6</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!5&foo=!6</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.NumberFilter;
            export type Mimetype = /**
             * <table class="query-examples">
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=bar</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!bar</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>starts with</td>
             *     <td>?foo=^bar</td>
             *   </tr>
             *   <tr>
             *     <td>ends with</td>
             *     <td>?foo=$bar</td>
             *   </tr>
             *   <tr>
             *     <td>matches regex</td>
             *     <td>?foo=~.+bar.+</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=bar&foo=baz</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!bar&foo=!baz</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.TextFilter;
            export type Title = /**
             * <table class="query-examples">
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=bar</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!bar</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>starts with</td>
             *     <td>?foo=^bar</td>
             *   </tr>
             *   <tr>
             *     <td>ends with</td>
             *     <td>?foo=$bar</td>
             *   </tr>
             *   <tr>
             *     <td>matches regex</td>
             *     <td>?foo=~.+bar.+</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=bar&foo=baz</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!bar&foo=!baz</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.TextFilter;
        }
        export interface QueryParameters {
            createdAt?: Parameters.CreatedAt;
            createdBy?: Parameters.CreatedBy;
            description?: Parameters.Description;
            expiresAt?: Parameters.ExpiresAt;
            filename?: Parameters.Filename;
            filesize?: Parameters.Filesize;
            mimetype?: Parameters.Mimetype;
            title?: Parameters.Title;
        }
        namespace Responses {
            export interface $200 {
                result: Components.Schemas.FileMetadata[];
            }
            export type $401 = Components.Responses.Unauthorized;
            export type $403 = Components.Responses.Forbidden;
        }
    }
    namespace GetPeerRelationshipTemplates {
        namespace Parameters {
            export type CreatedAt = /**
             * <p>Filters for a date. In the background, a `DateFilter` compares dates based on their text value. Due to the order of ISO Date string characters though, this doesn't matter - as long as no timezones are used. We are looking for a better solution to this. For now you can convert your non-UTC dates to UTC before sending them in a query.</p> <p>The following operators are supported:</p> <table>
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>greater than</td>
             *     <td>?foo=>2020</td>
             *   </tr>
             *   <tr>
             *     <td>less than</td>
             *     <td>?foo=<2020</td>
             *   </tr>
             *   <tr>
             *     <td>greater than or equal to</td>
             *     <td>?foo=>=2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>less than or equal to</td>
             *     <td>?foo=<=2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>matches regex</td>
             *     <td>?foo=~.+01-01T.+</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=2020-01-01T00:00:00.000Z&foo=2021-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!2020-01-01T00:00:00.000Z&foo=!2021-01-01T00:00:00.000Z</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.DateFilter;
            export type CreatedBy = /**
             * <p>Filters for an ID. Basically a `TextFilter`, but with less useful operators</p> <p>The following operators are supported:</p> <table>
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=XXX_________________</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!XXX_________________</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=XXX_________________&foo=YYY_________________</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!XXX_________________&foo=!YYY_________________</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.IdFilter;
            export type ExpiresAt = /**
             * <p>Filters for a date. In the background, a `DateFilter` compares dates based on their text value. Due to the order of ISO Date string characters though, this doesn't matter - as long as no timezones are used. We are looking for a better solution to this. For now you can convert your non-UTC dates to UTC before sending them in a query.</p> <p>The following operators are supported:</p> <table>
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>greater than</td>
             *     <td>?foo=>2020</td>
             *   </tr>
             *   <tr>
             *     <td>less than</td>
             *     <td>?foo=<2020</td>
             *   </tr>
             *   <tr>
             *     <td>greater than or equal to</td>
             *     <td>?foo=>=2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>less than or equal to</td>
             *     <td>?foo=<=2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>matches regex</td>
             *     <td>?foo=~.+01-01T.+</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=2020-01-01T00:00:00.000Z&foo=2021-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!2020-01-01T00:00:00.000Z&foo=!2021-01-01T00:00:00.000Z</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.DateFilter;
            export type MaxNumberOfAllocations = /**
             * <p>Filters for a number. <p>The following operators are supported:</p> <table>
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=bar</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!bar</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>greater than</td>
             *     <td>?foo=>5</td>
             *   </tr>
             *   <tr>
             *     <td>less than</td>
             *     <td>?foo=<5</td>
             *   </tr>
             *   <tr>
             *     <td>greater than or equal to</td>
             *     <td>?foo=>=5</td>
             *   </tr>
             *   <tr>
             *     <td>less than or equal to</td>
             *     <td>?foo=5</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=5&foo=6</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!5&foo=!6</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.NumberFilter;
        }
        export interface QueryParameters {
            createdAt?: Parameters.CreatedAt;
            expiresAt?: Parameters.ExpiresAt;
            createdBy?: Parameters.CreatedBy;
            maxNumberOfAllocations?: Parameters.MaxNumberOfAllocations;
        }
        namespace Responses {
            export interface $200 {
                result: Components.Schemas.RelationshipTemplate[];
            }
            export type $401 = Components.Responses.Unauthorized;
            export type $403 = Components.Responses.Forbidden;
        }
    }
    namespace GetPeerTokens {
        namespace Parameters {
            export type CreatedAt = /**
             * <p>Filters for a date. In the background, a `DateFilter` compares dates based on their text value. Due to the order of ISO Date string characters though, this doesn't matter - as long as no timezones are used. We are looking for a better solution to this. For now you can convert your non-UTC dates to UTC before sending them in a query.</p> <p>The following operators are supported:</p> <table>
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>greater than</td>
             *     <td>?foo=>2020</td>
             *   </tr>
             *   <tr>
             *     <td>less than</td>
             *     <td>?foo=<2020</td>
             *   </tr>
             *   <tr>
             *     <td>greater than or equal to</td>
             *     <td>?foo=>=2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>less than or equal to</td>
             *     <td>?foo=<=2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>matches regex</td>
             *     <td>?foo=~.+01-01T.+</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=2020-01-01T00:00:00.000Z&foo=2021-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!2020-01-01T00:00:00.000Z&foo=!2021-01-01T00:00:00.000Z</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.DateFilter;
            export type CreatedBy = /**
             * <p>Filters for an ID. Basically a `TextFilter`, but with less useful operators</p> <p>The following operators are supported:</p> <table>
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=XXX_________________</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!XXX_________________</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=XXX_________________&foo=YYY_________________</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!XXX_________________&foo=!YYY_________________</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.IdFilter;
            export type ExpiresAt = /**
             * <p>Filters for a date. In the background, a `DateFilter` compares dates based on their text value. Due to the order of ISO Date string characters though, this doesn't matter - as long as no timezones are used. We are looking for a better solution to this. For now you can convert your non-UTC dates to UTC before sending them in a query.</p> <p>The following operators are supported:</p> <table>
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>greater than</td>
             *     <td>?foo=>2020</td>
             *   </tr>
             *   <tr>
             *     <td>less than</td>
             *     <td>?foo=<2020</td>
             *   </tr>
             *   <tr>
             *     <td>greater than or equal to</td>
             *     <td>?foo=>=2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>less than or equal to</td>
             *     <td>?foo=<=2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>matches regex</td>
             *     <td>?foo=~.+01-01T.+</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=2020-01-01T00:00:00.000Z&foo=2021-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!2020-01-01T00:00:00.000Z&foo=!2021-01-01T00:00:00.000Z</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.DateFilter;
        }
        export interface QueryParameters {
            createdAt?: Parameters.CreatedAt;
            createdBy?: Parameters.CreatedBy;
            expiresAt?: Parameters.ExpiresAt;
        }
        namespace Responses {
            export interface $200 {
                result: Components.Schemas.Token[];
            }
            export type $401 = Components.Responses.Unauthorized;
            export type $403 = Components.Responses.Forbidden;
        }
    }
    namespace GetRelationshipById {
        namespace Parameters {
            export type Id = /**
             * The ID of a relationship.
             * example:
             * REL_________________
             */
            Components.Schemas.RelationshipID /* RelationshipID */;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        namespace Responses {
            export interface $200 {
                result: Components.Schemas.Relationship;
            }
            export type $401 = Components.Responses.Unauthorized;
            export type $403 = Components.Responses.Forbidden;
        }
    }
    namespace GetRelationshipTemplate {
        namespace Parameters {
            export type Id = /**
             * The ID of a relationship template.
             * example:
             * RLT_________________
             */
            Components.Schemas.RelationshipTemplateID /* RelationshipTemplateID */;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        namespace Responses {
            export interface $200 {
                result: Components.Schemas.RelationshipTemplate;
            }
            export type $401 = Components.Responses.Unauthorized;
            export type $403 = Components.Responses.Forbidden;
            export type $404 = Components.Responses.NotFound;
        }
    }
    namespace GetRelationshipTemplates {
        namespace Parameters {
            export type CreatedAt = /**
             * <p>Filters for a date. In the background, a `DateFilter` compares dates based on their text value. Due to the order of ISO Date string characters though, this doesn't matter - as long as no timezones are used. We are looking for a better solution to this. For now you can convert your non-UTC dates to UTC before sending them in a query.</p> <p>The following operators are supported:</p> <table>
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>greater than</td>
             *     <td>?foo=>2020</td>
             *   </tr>
             *   <tr>
             *     <td>less than</td>
             *     <td>?foo=<2020</td>
             *   </tr>
             *   <tr>
             *     <td>greater than or equal to</td>
             *     <td>?foo=>=2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>less than or equal to</td>
             *     <td>?foo=<=2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>matches regex</td>
             *     <td>?foo=~.+01-01T.+</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=2020-01-01T00:00:00.000Z&foo=2021-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!2020-01-01T00:00:00.000Z&foo=!2021-01-01T00:00:00.000Z</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.DateFilter;
            export type CreatedBy = /**
             * <p>Filters for an ID. Basically a `TextFilter`, but with less useful operators</p> <p>The following operators are supported:</p> <table>
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=XXX_________________</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!XXX_________________</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=XXX_________________&foo=YYY_________________</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!XXX_________________&foo=!YYY_________________</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.IdFilter;
            export type CreatedByDevice = /**
             * <p>Filters for an ID. Basically a `TextFilter`, but with less useful operators</p> <p>The following operators are supported:</p> <table>
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=XXX_________________</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!XXX_________________</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=XXX_________________&foo=YYY_________________</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!XXX_________________&foo=!YYY_________________</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.IdFilter;
            export type ExpiresAt = /**
             * <p>Filters for a date. In the background, a `DateFilter` compares dates based on their text value. Due to the order of ISO Date string characters though, this doesn't matter - as long as no timezones are used. We are looking for a better solution to this. For now you can convert your non-UTC dates to UTC before sending them in a query.</p> <p>The following operators are supported:</p> <table>
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>greater than</td>
             *     <td>?foo=>2020</td>
             *   </tr>
             *   <tr>
             *     <td>less than</td>
             *     <td>?foo=<2020</td>
             *   </tr>
             *   <tr>
             *     <td>greater than or equal to</td>
             *     <td>?foo=>=2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>less than or equal to</td>
             *     <td>?foo=<=2020-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>matches regex</td>
             *     <td>?foo=~.+01-01T.+</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=2020-01-01T00:00:00.000Z&foo=2021-01-01T00:00:00.000Z</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!2020-01-01T00:00:00.000Z&foo=!2021-01-01T00:00:00.000Z</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.DateFilter;
            export type IsOwn = /**
             * <p>Filters for a boolean. <p>The following operators are supported:</p> <table>
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=true</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!true</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.BooleanFilter;
            export type MaxNumberOfAllocations = /**
             * <p>Filters for a number. <p>The following operators are supported:</p> <table>
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=bar</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!bar</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>greater than</td>
             *     <td>?foo=>5</td>
             *   </tr>
             *   <tr>
             *     <td>less than</td>
             *     <td>?foo=<5</td>
             *   </tr>
             *   <tr>
             *     <td>greater than or equal to</td>
             *     <td>?foo=>=5</td>
             *   </tr>
             *   <tr>
             *     <td>less than or equal to</td>
             *     <td>?foo=5</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=5&foo=6</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!5&foo=!6</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.NumberFilter;
        }
        export interface QueryParameters {
            createdAt?: Parameters.CreatedAt;
            expiresAt?: Parameters.ExpiresAt;
            createdBy?: Parameters.CreatedBy;
            createdByDevice?: Parameters.CreatedByDevice;
            maxNumberOfAllocations?: Parameters.MaxNumberOfAllocations;
            isOwn?: Parameters.IsOwn;
        }
        namespace Responses {
            export interface $200 {
                result: Components.Schemas.RelationshipTemplate[];
            }
            export type $401 = Components.Responses.Unauthorized;
            export type $403 = Components.Responses.Forbidden;
        }
    }
    namespace GetRelationships {
        namespace Parameters {
            export type Peer = /**
             * <p>Filters for an ID. Basically a `TextFilter`, but with less useful operators</p> <p>The following operators are supported:</p> <table>
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=XXX_________________</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!XXX_________________</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=XXX_________________&foo=YYY_________________</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!XXX_________________&foo=!YYY_________________</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.IdFilter;
            export type Status = /**
             * <table class="query-examples">
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=bar</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!bar</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>starts with</td>
             *     <td>?foo=^bar</td>
             *   </tr>
             *   <tr>
             *     <td>ends with</td>
             *     <td>?foo=$bar</td>
             *   </tr>
             *   <tr>
             *     <td>matches regex</td>
             *     <td>?foo=~.+bar.+</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=bar&foo=baz</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!bar&foo=!baz</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.TextFilter;
            export type TemplateId = /**
             * <p>Filters for an ID. Basically a `TextFilter`, but with less useful operators</p> <p>The following operators are supported:</p> <table>
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=XXX_________________</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!XXX_________________</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=XXX_________________&foo=YYY_________________</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!XXX_________________&foo=!YYY_________________</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.IdFilter;
        }
        export interface QueryParameters {
            "template.id"?: Parameters.TemplateId;
            peer?: Parameters.Peer;
            status?: Parameters.Status;
        }
        namespace Responses {
            export interface $200 {
                result: Components.Schemas.Relationship[];
            }
            export type $401 = Components.Responses.Unauthorized;
            export type $403 = Components.Responses.Forbidden;
        }
    }
    namespace GetRequests {
        namespace Responses {
            export interface $200 {
                /**
                 * The time since when the data was collected (typically this is the startup time of the Connector).
                 */
                since: string; // date-time
                /**
                 * The number of requests the Connector has processed.
                 * example:
                 * 507
                 */
                requestCount: number;
                /**
                 * example:
                 * {
                 *   "200": 500,
                 *   "401": 2,
                 *   "500": 5
                 * }
                 */
                requestCountByStatus?: {
                    [name: string]: number;
                };
            }
            export type $401 = Components.Responses.Unauthorized;
            export type $403 = Components.Responses.Forbidden;
        }
    }
    namespace GetSupportInfo {
        namespace Responses {
            export interface $200 {
                version?: Components.Schemas.ConnectorVersion;
                health?: Components.Schemas.ConnectorHealth;
                /**
                 * example:
                 * {
                 *   "database": {
                 *     "connectionString": "**********************************",
                 *     "dbName": "accountName"
                 *   },
                 *   "modules": {
                 *     "coreHttpApi": {
                 *       "enabled": true
                 *     }
                 *   }
                 * }
                 */
                configuration?: {
                    [key: string]: any;
                };
                identityInfo?: Components.Schemas.IdentityInfo;
            }
            export type $401 = Components.Responses.Unauthorized;
            export type $403 = Components.Responses.Forbidden;
        }
    }
    namespace GetSyncInfo {
        namespace Responses {
            export interface $200 {
                result: {
                    lastSyncRun?: {
                        completedAt?: string; // date-time
                    };
                };
            }
            export type $401 = Components.Responses.Unauthorized;
            export type $403 = Components.Responses.Forbidden;
        }
    }
    namespace GetToken {
        namespace Parameters {
            export type Id = /**
             * The ID of a message.
             * example:
             * TOK_________________
             */
            Components.Schemas.TokenID /* TokenID */;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        namespace Responses {
            export type $200 = string; // binary
            export type $401 = Components.Responses.Unauthorized;
            export type $403 = Components.Responses.Forbidden;
            export type $404 = Components.Responses.NotFound;
        }
    }
    namespace GetValidAttributes {
        namespace Parameters {
            export type ContentConfidentiality = /**
             * <table class="query-examples">
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=bar</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!bar</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>starts with</td>
             *     <td>?foo=^bar</td>
             *   </tr>
             *   <tr>
             *     <td>ends with</td>
             *     <td>?foo=$bar</td>
             *   </tr>
             *   <tr>
             *     <td>matches regex</td>
             *     <td>?foo=~.+bar.+</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=bar&foo=baz</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!bar&foo=!baz</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.TextFilter;
            export type ContentIsTechnical = /**
             * <p>Filters for a boolean. <p>The following operators are supported:</p> <table>
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=true</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!true</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.BooleanFilter;
            export type ContentKey = /**
             * <table class="query-examples">
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=bar</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!bar</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>starts with</td>
             *     <td>?foo=^bar</td>
             *   </tr>
             *   <tr>
             *     <td>ends with</td>
             *     <td>?foo=$bar</td>
             *   </tr>
             *   <tr>
             *     <td>matches regex</td>
             *     <td>?foo=~.+bar.+</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=bar&foo=baz</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!bar&foo=!baz</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.TextFilter;
            export type ContentOwner = /**
             * <table class="query-examples">
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=bar</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!bar</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>starts with</td>
             *     <td>?foo=^bar</td>
             *   </tr>
             *   <tr>
             *     <td>ends with</td>
             *     <td>?foo=$bar</td>
             *   </tr>
             *   <tr>
             *     <td>matches regex</td>
             *     <td>?foo=~.+bar.+</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=bar&foo=baz</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!bar&foo=!baz</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.TextFilter;
            export type ContentTags = /**
             * <table class="query-examples">
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=bar</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!bar</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>starts with</td>
             *     <td>?foo=^bar</td>
             *   </tr>
             *   <tr>
             *     <td>ends with</td>
             *     <td>?foo=$bar</td>
             *   </tr>
             *   <tr>
             *     <td>matches regex</td>
             *     <td>?foo=~.+bar.+</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=bar&foo=baz</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!bar&foo=!baz</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.TextFilter;
            export type ContentType = /**
             * <table class="query-examples">
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=bar</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!bar</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>starts with</td>
             *     <td>?foo=^bar</td>
             *   </tr>
             *   <tr>
             *     <td>ends with</td>
             *     <td>?foo=$bar</td>
             *   </tr>
             *   <tr>
             *     <td>matches regex</td>
             *     <td>?foo=~.+bar.+</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=bar&foo=baz</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!bar&foo=!baz</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.TextFilter;
            export type ContentValueType = /**
             * <table class="query-examples">
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=bar</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!bar</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>starts with</td>
             *     <td>?foo=^bar</td>
             *   </tr>
             *   <tr>
             *     <td>ends with</td>
             *     <td>?foo=$bar</td>
             *   </tr>
             *   <tr>
             *     <td>matches regex</td>
             *     <td>?foo=~.+bar.+</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=bar&foo=baz</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!bar&foo=!baz</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.TextFilter;
            export type ShareInfoPeer = /**
             * <table class="query-examples">
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=bar</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!bar</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>starts with</td>
             *     <td>?foo=^bar</td>
             *   </tr>
             *   <tr>
             *     <td>ends with</td>
             *     <td>?foo=$bar</td>
             *   </tr>
             *   <tr>
             *     <td>matches regex</td>
             *     <td>?foo=~.+bar.+</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=bar&foo=baz</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!bar&foo=!baz</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.TextFilter;
            export type ShareInfoRequestReference = /**
             * <table class="query-examples">
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=bar</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!bar</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>starts with</td>
             *     <td>?foo=^bar</td>
             *   </tr>
             *   <tr>
             *     <td>ends with</td>
             *     <td>?foo=$bar</td>
             *   </tr>
             *   <tr>
             *     <td>matches regex</td>
             *     <td>?foo=~.+bar.+</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=bar&foo=baz</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!bar&foo=!baz</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.TextFilter;
            export type ShareInfoSourceAttribute = /**
             * <table class="query-examples">
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=bar</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!bar</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>starts with</td>
             *     <td>?foo=^bar</td>
             *   </tr>
             *   <tr>
             *     <td>ends with</td>
             *     <td>?foo=$bar</td>
             *   </tr>
             *   <tr>
             *     <td>matches regex</td>
             *     <td>?foo=~.+bar.+</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=bar&foo=baz</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!bar&foo=!baz</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.TextFilter;
            export type SucceededBy = /**
             * <table class="query-examples">
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=bar</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!bar</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>starts with</td>
             *     <td>?foo=^bar</td>
             *   </tr>
             *   <tr>
             *     <td>ends with</td>
             *     <td>?foo=$bar</td>
             *   </tr>
             *   <tr>
             *     <td>matches regex</td>
             *     <td>?foo=~.+bar.+</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=bar&foo=baz</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!bar&foo=!baz</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.TextFilter;
            export type Succeeds = /**
             * <table class="query-examples">
             *   <tr>
             *     <th>Operation</th>
             *     <th>Example</th>
             *   </tr>
             *   <tr>
             *     <td>equal</td>
             *     <td>?foo=bar</td>
             *   </tr>
             *   <tr>
             *     <td>not equal</td>
             *     <td>?foo=!bar</td>
             *   </tr>
             *   <tr>
             *     <td>
             *       exists (=> not undefined)*
             *       <br/>
             *     </td>
             *     <td>?foo=</td>
             *   </tr>
             *   <tr>
             *     <td>not exists (=> undefined)</td>
             *     <td>?foo=!</td>
             *   </tr>
             *   <tr>
             *     <td>starts with</td>
             *     <td>?foo=^bar</td>
             *   </tr>
             *   <tr>
             *     <td>ends with</td>
             *     <td>?foo=$bar</td>
             *   </tr>
             *   <tr>
             *     <td>matches regex</td>
             *     <td>?foo=~.+bar.+</td>
             *   </tr>
             *   <tr>
             *     <td>in*</td>
             *     <td>?foo=bar&foo=baz</td>
             *   </tr>
             *   <tr>
             *     <td>not in*</td>
             *     <td>?foo=!bar&foo=!baz</td>
             *   </tr>
             * </table> <p>* Due to limitations of Swagger UI, this feature cannot be tested in Swagger UI. Use a REST Client instead (e.g. Postman).</p>
             *
             */
            Components.Schemas.TextFilter;
        }
        export interface QueryParameters {
            "content.@type"?: Parameters.ContentType;
            "content.tags"?: Parameters.ContentTags;
            "content.owner"?: Parameters.ContentOwner;
            "content.key"?: Parameters.ContentKey;
            "content.isTechnical"?: Parameters.ContentIsTechnical;
            "content.confidentiality"?: Parameters.ContentConfidentiality;
            "content.value.@type"?: Parameters.ContentValueType;
            succeeds?: Parameters.Succeeds;
            succeededBy?: Parameters.SucceededBy;
            "shareInfo.requestReference"?: Parameters.ShareInfoRequestReference;
            "shareInfo.peer"?: Parameters.ShareInfoPeer;
            "shareInfo.sourceAttribute"?: Parameters.ShareInfoSourceAttribute;
        }
        namespace Responses {
            export interface $200 {
                result: Components.Schemas.Attribute[];
            }
            export type $401 = Components.Responses.Unauthorized;
            export type $403 = Components.Responses.Forbidden;
        }
    }
    namespace GetVersion {
        namespace Responses {
            export type $200 = Components.Schemas.ConnectorVersion;
            export type $401 = Components.Responses.Unauthorized;
            export type $403 = Components.Responses.Forbidden;
        }
    }
    namespace LoadPeerFile {
        export type RequestBody = Components.Schemas.FileReference | Components.Schemas.FileReferenceTruncated | Components.Schemas.TokenReferenceTruncated;
        namespace Responses {
            export interface $201 {
                result: Components.Schemas.FileMetadata;
            }
            export type $400 = Components.Responses.BadRequest;
            export type $401 = Components.Responses.Unauthorized;
            export type $403 = Components.Responses.Forbidden;
        }
    }
    namespace LoadPeerRelationshipTemplate {
        export type RequestBody = Components.Schemas.RelationshipTemplateReference | Components.Schemas.RelationshipTemplateReferenceTruncated | Components.Schemas.TokenReferenceTruncated;
        namespace Responses {
            export interface $201 {
                result: Components.Schemas.RelationshipTemplate;
            }
            export type $400 = Components.Responses.BadRequest;
            export type $401 = Components.Responses.Unauthorized;
            export type $403 = Components.Responses.Forbidden;
        }
    }
    namespace LoadPeerToken {
        export type RequestBody = {
            /**
             * The ID of the received Token which should be fetched. This is usually shared over the side channel (QR-Code, Link).
             * example:
             * TOK_________________
             */
            id: string; // TokenID
            /**
             * The base64 encoded secret key which was used to encrypt the Token. This is usually shared over the side channel (QR-Code, Link).
             */
            secretKey: string; // byte
            /**
             * If set to true the token will will not be cached in the database of the connector. Note that you will not be able to fetch this token unless you remember the id and secretKey of the token. Defaults to false.
             */
            ephemeral?: boolean;
        } | {
            /**
             * The base64 encoded truncated reference of the token, which actually consists of the TokenId and the secretKey.
             */
            reference: string; // byte
            /**
             * If set to true the token will will not be cached in the database of the connector. Note that you will not be able to fetch this token unless you remember the id and secretKey of the token. Defaults to false.
             */
            ephemeral?: boolean;
        };
        namespace Responses {
            export interface $201 {
                result: Components.Schemas.Token;
            }
            export type $400 = Components.Responses.BadRequest;
            export type $401 = Components.Responses.Unauthorized;
            export type $403 = Components.Responses.Forbidden;
        }
    }
    namespace NotifyPeerAboutRepositoryAttributeSuccession {
        namespace Parameters {
            export type AttributeId = /**
             * The ID of an attribute.
             * example:
             * ATT_________________
             */
            Components.Schemas.AttributeID /* AttributeID */;
        }
        export interface PathParameters {
            attributeId: Parameters.AttributeId;
        }
        export interface RequestBody {
            peer?: /**
             * example:
             * id_________________________________
             */
            Components.Schemas.Address /* Address */;
        }
        namespace Responses {
            export interface $200 {
                result: {
                    predecessor: Components.Schemas.Attribute;
                    successor: Components.Schemas.Attribute;
                    notificationId?: /**
                     * The ID of a notification.
                     * example:
                     * NOT_________________
                     */
                    Components.Schemas.NotificationID /* NotificationID */;
                };
            }
            export type $401 = Components.Responses.Unauthorized;
            export type $403 = Components.Responses.Forbidden;
            export type $404 = Components.Responses.NotFound;
        }
    }
    namespace RejectIncomingRequest {
        namespace Parameters {
            export type Id = /**
             * The ID of a message.
             * example:
             * REQ_________________
             */
            Components.Schemas.RequestID /* RequestID */;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        export type RequestBody = /**
         * example:
         * {
         *   "items": [
         *     {
         *       "accept": true
         *     },
         *     {
         *       "accept": false,
         *       "code": "an.error.code",
         *       "message": "Error Message"
         *     },
         *     {
         *       "items": [
         *         {
         *           "accept": "true"
         *         },
         *         {
         *           "accept": false,
         *           "code": "an.error.code",
         *           "message": "Error Message"
         *         }
         *       ]
         *     }
         *   ]
         * }
         */
        Components.Schemas.DecideRequestRequest;
        namespace Responses {
            export interface $200 {
                result: Components.Schemas.Request;
            }
            export type $401 = Components.Responses.Unauthorized;
            export type $403 = Components.Responses.Forbidden;
            export type $404 = Components.Responses.NotFound;
        }
    }
    namespace RejectRelationshipChange {
        namespace Parameters {
            export type ChangeId = /**
             * The ID of a relationship change.
             * example:
             * RCH_________________
             */
            Components.Schemas.RelationshipChangeID /* RelationshipChangeID */;
            export type Id = /**
             * The ID of a relationship.
             * example:
             * REL_________________
             */
            Components.Schemas.RelationshipID /* RelationshipID */;
        }
        export interface PathParameters {
            id: Parameters.Id;
            changeId: Parameters.ChangeId;
        }
        export interface RequestBody {
            /**
             * example:
             * {
             *   "prop1": "value",
             *   "prop2": 1
             * }
             */
            content: {
                [key: string]: any;
            };
        }
        namespace Responses {
            export interface $200 {
                result: Components.Schemas.Relationship;
            }
            export type $400 = Components.Responses.BadRequest;
            export type $401 = Components.Responses.Unauthorized;
            export type $403 = Components.Responses.Forbidden;
            export type $404 = Components.Responses.NotFound;
        }
    }
    namespace SendMessage {
        /**
         * A message can theoretically consist of any content. But our end user apps can only interpret some specific content types.
         */
        export interface RequestBody {
            /**
             * Addresses of the recipients of this message.
             */
            recipients: /**
             * example:
             * id_________________________________
             */
            Components.Schemas.Address /* Address */[];
            /**
             * example:
             * {
             *   "@type": "Mail",
             *   "to": [
             *     "id_________________________________"
             *   ],
             *   "cc": [
             *     "id_________________________________"
             *   ],
             *   "subject": "Subject",
             *   "body": "Body"
             * }
             */
            content: {
                [key: string]: any;
            };
            attachments?: /**
             * The ID of a file.
             * example:
             * FIL_________________
             */
            Components.Schemas.FileID /* FileID */[] | null;
        }
        namespace Responses {
            export interface $201 {
                result: Components.Schemas.Message;
            }
            export type $400 = Components.Responses.BadRequest;
            export type $401 = Components.Responses.Unauthorized;
            export type $403 = Components.Responses.Forbidden;
        }
    }
    namespace SucceedAttribute {
        namespace Parameters {
            export type PredecessorId = /**
             * The ID of an attribute.
             * example:
             * ATT_________________
             */
            Components.Schemas.AttributeID /* AttributeID */;
        }
        export interface PathParameters {
            predecessorId: Parameters.PredecessorId;
        }
        export interface RequestBody {
            successorContent?: {
                value: Components.Schemas.AttributeValue;
                tags?: /**
                 * The tags of the attribute.
                 * example:
                 * [
                 *   "tag_1",
                 *   "tag_2"
                 * ]
                 */
                Components.Schemas.IdentityAttributeContentTags;
                validFrom?: /* The date and time when the attribute becomes valid. */ Components.Schemas.AttributeContentValidFrom /* date-time */;
                validTo?: /* The date and time when the attribute expires. */ Components.Schemas.AttributeContentValidTo /* date-time */;
            };
        }
        namespace Responses {
            export interface $200 {
                result: {
                    predecessor: Components.Schemas.Attribute;
                    successor: Components.Schemas.Attribute;
                    notificationId?: /**
                     * The ID of a notification.
                     * example:
                     * NOT_________________
                     */
                    Components.Schemas.NotificationID /* NotificationID */;
                };
            }
            export type $401 = Components.Responses.Unauthorized;
            export type $403 = Components.Responses.Forbidden;
            export type $404 = Components.Responses.NotFound;
        }
    }
    namespace Sync {
        namespace Responses {
            export interface $200 {
                result: {
                    relationships: Components.Schemas.Relationship[];
                    messages: Components.Schemas.Message[];
                };
            }
            export type $401 = Components.Responses.Unauthorized;
            export type $403 = Components.Responses.Forbidden;
        }
    }
    namespace UploadNewOwnFile {
        export interface RequestBody {
            /**
             * A user-friendly title for the file which is shown on the UI.
             * example:
             * Curriculum Vitae
             */
            title: string;
            /**
             * A description for the file which is shown on the UI.
             * example:
             * My curriculum vitae
             */
            description?: string;
            /**
             * A timestamp that describes when this file will expire.
             * example:
             * 2023-01-01T00:00:00.000Z
             */
            expiresAt: string; // date-time
            file: string; // binary
        }
        namespace Responses {
            export interface $201 {
                result: Components.Schemas.FileMetadata;
            }
            export type $400 = Components.Responses.BadRequest;
            export type $401 = Components.Responses.Unauthorized;
            export type $403 = Components.Responses.Forbidden;
        }
    }
    namespace ValidateChallenge {
        export interface RequestBody {
            /**
             * The signed challenge serialized as plaintext JSON string. You receive this together with the signature from the identity that signed the challenge.
             */
            challengeString?: string;
            /**
             * The signature that will be used to validate the challenge.
             */
            signature: string;
        }
        namespace Responses {
            export interface $200 {
                result: {
                    isValid: boolean;
                    challengeCreatedBy?: /**
                     * example:
                     * id_________________________________
                     */
                    Components.Schemas.Address /* Address */;
                };
            }
            export type $401 = Components.Responses.Unauthorized;
            export type $403 = Components.Responses.Forbidden;
        }
    }
    namespace ValidateIQLQuery {
        export interface RequestBody {
            query?: {
                /**
                 * IQL Query String
                 * example:
                 * PhoneNumber && #emergency
                 */
                queryString?: string;
            };
        }
        namespace Responses {
            export interface $200 {
                isValid?: boolean;
                error?: {
                    message?: string;
                    location?: {
                        start?: {
                            column?: number;
                            line?: number;
                            offset?: number;
                        };
                        end?: {
                            column?: number;
                            line?: number;
                            offset?: number;
                        };
                    };
                };
            }
            export type $401 = Components.Responses.Unauthorized;
            export type $403 = Components.Responses.Forbidden;
        }
    }
    namespace ValidateOutgoingRequest {
        export type RequestBody = Components.Schemas.CanCreateOutgoingRequestRequest;
        namespace Responses {
            export interface $201 {
                result: Components.Schemas.RequestValidationResult;
            }
            export type $401 = Components.Responses.Unauthorized;
            export type $403 = Components.Responses.Forbidden;
            export type $404 = Components.Responses.NotFound;
        }
    }
}

export interface OperationMethods {
  /**
   * getHealth - Show the service health.
   */
  'getHealth'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetHealth.Responses.$200>
  /**
   * getVersion - Show the Connector version information.
   */
  'getVersion'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetVersion.Responses.$200>
  /**
   * getRequests - Show the number of requests and the status codes that were returned by the Connector.
   */
  'getRequests'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetRequests.Responses.$200>
  /**
   * getSupportInfo - Show support Information.
   */
  'getSupportInfo'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetSupportInfo.Responses.$200>
  /**
   * getIdentityInfo - Shows the Account Information.
   */
  'getIdentityInfo'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetIdentityInfo.Responses.$200>
  /**
   * getSyncInfo - show information about the last completed sync run
   */
  'getSyncInfo'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetSyncInfo.Responses.$200>
  /**
   * sync - Syncs the Connector messages and relationships with the Backbone. Checks for new relationships as well as incoming changes of existing ones. Checks for new or updated Messages. Returns all affected relationships and messages.
   * 
   */
  'sync'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.Sync.Responses.$200>
  /**
   * getAttributes - Query Attributes
   */
  'getAttributes'(
    parameters?: Parameters<Paths.GetAttributes.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetAttributes.Responses.$200>
  /**
   * createRepositoryAttribute - Creates a Repository Attribute.
   */
  'createRepositoryAttribute'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.CreateRepositoryAttribute.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.CreateRepositoryAttribute.Responses.$201>
  /**
   * succeedAttribute - Succeeds either a Relationship Attribute or a Repository Attribute.
   */
  'succeedAttribute'(
    parameters?: Parameters<Paths.SucceedAttribute.PathParameters> | null,
    data?: Paths.SucceedAttribute.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.SucceedAttribute.Responses.$200>
  /**
   * notifyPeerAboutRepositoryAttributeSuccession - Notifies a peer about a succeeded and previously shared repository
   * attribute.
   * 
   */
  'notifyPeerAboutRepositoryAttributeSuccession'(
    parameters?: Parameters<Paths.NotifyPeerAboutRepositoryAttributeSuccession.PathParameters> | null,
    data?: Paths.NotifyPeerAboutRepositoryAttributeSuccession.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.NotifyPeerAboutRepositoryAttributeSuccession.Responses.$200>
  /**
   * getAttribute - Fetches the attribute with the given `id`.
   */
  'getAttribute'(
    parameters?: Parameters<Paths.GetAttribute.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetAttribute.Responses.$200>
  /**
   * getValidAttributes - List valid Attributes
   */
  'getValidAttributes'(
    parameters?: Parameters<Paths.GetValidAttributes.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetValidAttributes.Responses.$200>
  /**
   * executeIdentityQuery - Execute an IdentityAttributeQuery
   */
  'executeIdentityQuery'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.ExecuteIdentityQuery.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.ExecuteIdentityQuery.Responses.$201>
  /**
   * executeRelationshipQuery - Execute a RelationshipAttributeQuery
   */
  'executeRelationshipQuery'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.ExecuteRelationshipQuery.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.ExecuteRelationshipQuery.Responses.$201>
  /**
   * executeThirdPartyRelationshipQuery - Execute a ThirdPartyAttributeQuery
   */
  'executeThirdPartyRelationshipQuery'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.ExecuteThirdPartyRelationshipQuery.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.ExecuteThirdPartyRelationshipQuery.Responses.$201>
  /**
   * executeIQLQuery - Execute IQL Query
   */
  'executeIQLQuery'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.ExecuteIQLQuery.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.ExecuteIQLQuery.Responses.$200>
  /**
   * validateIQLQuery - Validate IQL Query
   */
  'validateIQLQuery'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.ValidateIQLQuery.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.ValidateIQLQuery.Responses.$200>
  /**
   * createChallenge - Create a signed challenge.
   */
  'createChallenge'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.CreateChallenge.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.CreateChallenge.Responses.$201>
  /**
   * validateChallenge - Validate a challenge.
   */
  'validateChallenge'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.ValidateChallenge.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.ValidateChallenge.Responses.$200>
  /**
   * getAllFileMetadata - Queries metadata of all files.
   */
  'getAllFileMetadata'(
    parameters?: Parameters<Paths.GetAllFileMetadata.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetAllFileMetadata.Responses.$200>
  /**
   * getOwnFiles - Queries metadata of files owned by this Connector.
   */
  'getOwnFiles'(
    parameters?: Parameters<Paths.GetOwnFiles.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetOwnFiles.Responses.$200>
  /**
   * uploadNewOwnFile - Uploads a new own file with metadata.
   */
  'uploadNewOwnFile'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.UploadNewOwnFile.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.UploadNewOwnFile.Responses.$201>
  /**
   * getPeerFiles - Queries metadata of files you obtained from other identities.
   */
  'getPeerFiles'(
    parameters?: Parameters<Paths.GetPeerFiles.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetPeerFiles.Responses.$200>
  /**
   * loadPeerFile - Loads a file of another identity. After it is loaded once, you can retrieve it without the need for the secret key by calling one of the GET-routes.
   */
  'loadPeerFile'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.LoadPeerFile.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.LoadPeerFile.Responses.$201>
  /**
   * getFileMetadata - Gets metadata for the file with the given `idOrReference` when the accept header is set to `application/json` or a QrCode containing the reference to the file if the accept header it set to `image/png`.
   * 
   * `idOrReference` can either be a FileId (starting with `FIL`) or a FileReference (starting with `RklM`).
   * 
   */
  'getFileMetadata'(
    parameters?: Parameters<Paths.GetFileMetadata.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetFileMetadata.Responses.$200>
  /**
   * downloadFile - Downloads the file with the given `id`.
   */
  'downloadFile'(
    parameters?: Parameters<Paths.DownloadFile.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DownloadFile.Responses.$200>
  /**
   * createTokenForFile - Creates a `Token` for the `File` with the given `id`.
   */
  'createTokenForFile'(
    parameters?: Parameters<Paths.CreateTokenForFile.PathParameters> | null,
    data?: Paths.CreateTokenForFile.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.CreateTokenForFile.Responses.$201>
  /**
   * getMessages - Queries messages.
   */
  'getMessages'(
    parameters?: Parameters<Paths.GetMessages.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetMessages.Responses.$200>
  /**
   * sendMessage - Sends a new message to the given recipient(s).
   * 
   */
  'sendMessage'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.SendMessage.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.SendMessage.Responses.$201>
  /**
   * getMessage - Fetches the message with the given `id`.
   */
  'getMessage'(
    parameters?: Parameters<Paths.GetMessage.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetMessage.Responses.$200>
  /**
   * getMetadataOfMessageAttachment - Returns the attachment's metadata of the given `attachmentId` of message with `messageId`.
   */
  'getMetadataOfMessageAttachment'(
    parameters?: Parameters<Paths.GetMetadataOfMessageAttachment.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetMetadataOfMessageAttachment.Responses.$200>
  /**
   * downloadAttachmentOfMessage - Downloads the file of the given `attachmentId` of message with `messageId`.
   */
  'downloadAttachmentOfMessage'(
    parameters?: Parameters<Paths.DownloadAttachmentOfMessage.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DownloadAttachmentOfMessage.Responses.$200>
  /**
   * getRelationships - Queries relationships.
   */
  'getRelationships'(
    parameters?: Parameters<Paths.GetRelationships.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetRelationships.Responses.$200>
  /**
   * createRelationship - Creates a `Relationship` to the creator of a given relationshipTemplateId. The `RelationshipTemplate` of the given `relationshipTemplateId` must come from another identity and must be loaded by `POST /RelationshipTemplates/Peer` first.
   */
  'createRelationship'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.CreateRelationship.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.CreateRelationship.Responses.$201>
  /**
   * getRelationshipById - Fetches the `Relationship` with the given `id`.
   */
  'getRelationshipById'(
    parameters?: Parameters<Paths.GetRelationshipById.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetRelationshipById.Responses.$200>
  /**
   * getAttributesForRelationship - Queries attributes that are related to the given relationship.
   */
  'getAttributesForRelationship'(
    parameters?: Parameters<Paths.GetAttributesForRelationship.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetAttributesForRelationship.Responses.$200>
  /**
   * acceptRelationshipChange - Accepts the change with the given `changeId`. If the change exists but belongs to another relationship, this call will fail and return status 404.
   */
  'acceptRelationshipChange'(
    parameters?: Parameters<Paths.AcceptRelationshipChange.PathParameters> | null,
    data?: Paths.AcceptRelationshipChange.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.AcceptRelationshipChange.Responses.$200>
  /**
   * rejectRelationshipChange - Rejects the change with the given `changeId`. If the change exists but belongs to another relationship, this call will fail and return status 404.
   */
  'rejectRelationshipChange'(
    parameters?: Parameters<Paths.RejectRelationshipChange.PathParameters> | null,
    data?: Paths.RejectRelationshipChange.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.RejectRelationshipChange.Responses.$200>
  /**
   * getRelationshipTemplates - Queries `RelationshipTemplates`.
   */
  'getRelationshipTemplates'(
    parameters?: Parameters<Paths.GetRelationshipTemplates.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetRelationshipTemplates.Responses.$200>
  /**
   * getOwnRelationshipTemplates - Queries own `RelationshipTemplates`.
   */
  'getOwnRelationshipTemplates'(
    parameters?: Parameters<Paths.GetOwnRelationshipTemplates.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetOwnRelationshipTemplates.Responses.$200>
  /**
   * createOwnRelationshipTemplate - Creates a new `RelationshipTemplate`.
   */
  'createOwnRelationshipTemplate'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.CreateOwnRelationshipTemplate.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.CreateOwnRelationshipTemplate.Responses.$201>
  /**
   * getPeerRelationshipTemplates - Queries `RelationshipTemplates` of other identities. The templates have to be loaded by calling `POST /RelationshipTemplates/Peer`.
   */
  'getPeerRelationshipTemplates'(
    parameters?: Parameters<Paths.GetPeerRelationshipTemplates.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetPeerRelationshipTemplates.Responses.$200>
  /**
   * loadPeerRelationshipTemplate - Loads a `RelationshipTemplate` created by others. This is a prerequisite for using the template while creating a new `Relationship`.
   */
  'loadPeerRelationshipTemplate'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.LoadPeerRelationshipTemplate.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.LoadPeerRelationshipTemplate.Responses.$201>
  /**
   * getRelationshipTemplate - Fetches the `RelationshipTemplate` with the given `id` when the accept header is set to `application/json` or a QrCode containing the reference to the RelationshipTemplate if the accept header it set to `image/png`.
   */
  'getRelationshipTemplate'(
    parameters?: Parameters<Paths.GetRelationshipTemplate.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetRelationshipTemplate.Responses.$200>
  /**
   * createTokenForTemplate - Creates a `Token` for the own `RelationshipTemplate` with the given `id`
   */
  'createTokenForTemplate'(
    parameters?: Parameters<Paths.CreateTokenForTemplate.PathParameters> | null,
    data?: Paths.CreateTokenForTemplate.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.CreateTokenForTemplate.Responses.$201>
  /**
   * getIncomingRequests - Queries incoming `Requests`.
   */
  'getIncomingRequests'(
    parameters?: Parameters<Paths.GetIncomingRequests.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetIncomingRequests.Responses.$200>
  /**
   * getIncomingRequest - Fetches the incoming `Request` with the given `id`.
   */
  'getIncomingRequest'(
    parameters?: Parameters<Paths.GetIncomingRequest.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetIncomingRequest.Responses.$200>
  /**
   * canAcceptIncomingRequest - Checks if the `Request` with the given `id` can be accepted.
   */
  'canAcceptIncomingRequest'(
    parameters?: Parameters<Paths.CanAcceptIncomingRequest.PathParameters> | null,
    data?: Paths.CanAcceptIncomingRequest.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.CanAcceptIncomingRequest.Responses.$200>
  /**
   * acceptIncomingRequest - Accepts the incoming `Request` with the given `id`.
   */
  'acceptIncomingRequest'(
    parameters?: Parameters<Paths.AcceptIncomingRequest.PathParameters> | null,
    data?: Paths.AcceptIncomingRequest.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.AcceptIncomingRequest.Responses.$200>
  /**
   * canRejectIncomingRequest - Checks if the `Request` with the given `id` can be rejected.
   */
  'canRejectIncomingRequest'(
    parameters?: Parameters<Paths.CanRejectIncomingRequest.PathParameters> | null,
    data?: Paths.CanRejectIncomingRequest.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.CanRejectIncomingRequest.Responses.$200>
  /**
   * rejectIncomingRequest - Rejects the incoming `Request` with the given `id`.
   */
  'rejectIncomingRequest'(
    parameters?: Parameters<Paths.RejectIncomingRequest.PathParameters> | null,
    data?: Paths.RejectIncomingRequest.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.RejectIncomingRequest.Responses.$200>
  /**
   * getOutgoingRequests - Queries outgoing `Requests`.
   */
  'getOutgoingRequests'(
    parameters?: Parameters<Paths.GetOutgoingRequests.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetOutgoingRequests.Responses.$200>
  /**
   * createOutgoingRequest - Creates a new outgoing `Request`.
   */
  'createOutgoingRequest'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.CreateOutgoingRequest.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.CreateOutgoingRequest.Responses.$201>
  /**
   * getOutgoingRequest - Fetches the `Request` with the given `id`.
   */
  'getOutgoingRequest'(
    parameters?: Parameters<Paths.GetOutgoingRequest.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetOutgoingRequest.Responses.$200>
  /**
   * validateOutgoingRequest - Validates the given `OutgoingRequest` before creating it via POST `/api/v2/Requests/Outgoing`.
   */
  'validateOutgoingRequest'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.ValidateOutgoingRequest.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.ValidateOutgoingRequest.Responses.$201>
  /**
   * getOwnTokens - Queries `Tokens`.
   */
  'getOwnTokens'(
    parameters?: Parameters<Paths.GetOwnTokens.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetOwnTokens.Responses.$200>
  /**
   * createOwnToken - Creates a new `Token` with the given content.
   */
  'createOwnToken'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.CreateOwnToken.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.CreateOwnToken.Responses.$201>
  /**
   * getPeerTokens - Queries `Tokens`.
   */
  'getPeerTokens'(
    parameters?: Parameters<Paths.GetPeerTokens.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetPeerTokens.Responses.$200>
  /**
   * loadPeerToken - Load a `Token` created by others.
   */
  'loadPeerToken'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.LoadPeerToken.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.LoadPeerToken.Responses.$201>
  /**
   * getToken - Fetches the `Token` with the given `id`.
   */
  'getToken'(
    parameters?: Parameters<Paths.GetToken.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetToken.Responses.$200>
}

export interface PathsDictionary {
  ['/health']: {
    /**
     * getHealth - Show the service health.
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetHealth.Responses.$200>
  }
  ['/Monitoring/Version']: {
    /**
     * getVersion - Show the Connector version information.
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetVersion.Responses.$200>
  }
  ['/Monitoring/Requests']: {
    /**
     * getRequests - Show the number of requests and the status codes that were returned by the Connector.
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetRequests.Responses.$200>
  }
  ['/Monitoring/Support']: {
    /**
     * getSupportInfo - Show support Information.
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetSupportInfo.Responses.$200>
  }
  ['/api/v2/Account/IdentityInfo']: {
    /**
     * getIdentityInfo - Shows the Account Information.
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetIdentityInfo.Responses.$200>
  }
  ['/api/v2/Account/SyncInfo']: {
    /**
     * getSyncInfo - show information about the last completed sync run
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetSyncInfo.Responses.$200>
  }
  ['/api/v2/Account/Sync']: {
    /**
     * sync - Syncs the Connector messages and relationships with the Backbone. Checks for new relationships as well as incoming changes of existing ones. Checks for new or updated Messages. Returns all affected relationships and messages.
     * 
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.Sync.Responses.$200>
  }
  ['/api/v2/Attributes']: {
    /**
     * createRepositoryAttribute - Creates a Repository Attribute.
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.CreateRepositoryAttribute.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.CreateRepositoryAttribute.Responses.$201>
    /**
     * getAttributes - Query Attributes
     */
    'get'(
      parameters?: Parameters<Paths.GetAttributes.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetAttributes.Responses.$200>
  }
  ['/api/v2/Attributes/{predecessorId}/Succeed']: {
    /**
     * succeedAttribute - Succeeds either a Relationship Attribute or a Repository Attribute.
     */
    'post'(
      parameters?: Parameters<Paths.SucceedAttribute.PathParameters> | null,
      data?: Paths.SucceedAttribute.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.SucceedAttribute.Responses.$200>
  }
  ['/api/v2/Attributes/{attributeId}/NotifyPeer']: {
    /**
     * notifyPeerAboutRepositoryAttributeSuccession - Notifies a peer about a succeeded and previously shared repository
     * attribute.
     * 
     */
    'post'(
      parameters?: Parameters<Paths.NotifyPeerAboutRepositoryAttributeSuccession.PathParameters> | null,
      data?: Paths.NotifyPeerAboutRepositoryAttributeSuccession.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.NotifyPeerAboutRepositoryAttributeSuccession.Responses.$200>
  }
  ['/api/v2/Attributes/{id}']: {
    /**
     * getAttribute - Fetches the attribute with the given `id`.
     */
    'get'(
      parameters?: Parameters<Paths.GetAttribute.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetAttribute.Responses.$200>
  }
  ['/api/v2/Attributes/Valid']: {
    /**
     * getValidAttributes - List valid Attributes
     */
    'get'(
      parameters?: Parameters<Paths.GetValidAttributes.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetValidAttributes.Responses.$200>
  }
  ['/api/v2/Attributes/ExecuteIdentityAttributeQuery']: {
    /**
     * executeIdentityQuery - Execute an IdentityAttributeQuery
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.ExecuteIdentityQuery.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.ExecuteIdentityQuery.Responses.$201>
  }
  ['/api/v2/Attributes/ExecuteRelationshipAttributeQuery']: {
    /**
     * executeRelationshipQuery - Execute a RelationshipAttributeQuery
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.ExecuteRelationshipQuery.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.ExecuteRelationshipQuery.Responses.$201>
  }
  ['/api/v2/Attributes/ExecuteThirdPartyRelationshipAttributeQuery']: {
    /**
     * executeThirdPartyRelationshipQuery - Execute a ThirdPartyAttributeQuery
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.ExecuteThirdPartyRelationshipQuery.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.ExecuteThirdPartyRelationshipQuery.Responses.$201>
  }
  ['/api/v2/Attributes/ExecuteIQLQuery']: {
    /**
     * executeIQLQuery - Execute IQL Query
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.ExecuteIQLQuery.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.ExecuteIQLQuery.Responses.$200>
  }
  ['/api/v2/Attributes/ValidateIQLQuery']: {
    /**
     * validateIQLQuery - Validate IQL Query
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.ValidateIQLQuery.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.ValidateIQLQuery.Responses.$200>
  }
  ['/api/v2/Challenges']: {
    /**
     * createChallenge - Create a signed challenge.
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.CreateChallenge.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.CreateChallenge.Responses.$201>
  }
  ['/api/v2/Challenges/Validate']: {
    /**
     * validateChallenge - Validate a challenge.
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.ValidateChallenge.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.ValidateChallenge.Responses.$200>
  }
  ['/api/v2/Files']: {
    /**
     * getAllFileMetadata - Queries metadata of all files.
     */
    'get'(
      parameters?: Parameters<Paths.GetAllFileMetadata.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetAllFileMetadata.Responses.$200>
  }
  ['/api/v2/Files/Own']: {
    /**
     * uploadNewOwnFile - Uploads a new own file with metadata.
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.UploadNewOwnFile.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.UploadNewOwnFile.Responses.$201>
    /**
     * getOwnFiles - Queries metadata of files owned by this Connector.
     */
    'get'(
      parameters?: Parameters<Paths.GetOwnFiles.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetOwnFiles.Responses.$200>
  }
  ['/api/v2/Files/Peer']: {
    /**
     * loadPeerFile - Loads a file of another identity. After it is loaded once, you can retrieve it without the need for the secret key by calling one of the GET-routes.
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.LoadPeerFile.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.LoadPeerFile.Responses.$201>
    /**
     * getPeerFiles - Queries metadata of files you obtained from other identities.
     */
    'get'(
      parameters?: Parameters<Paths.GetPeerFiles.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetPeerFiles.Responses.$200>
  }
  ['/api/v2/Files/{idOrReference}']: {
    /**
     * getFileMetadata - Gets metadata for the file with the given `idOrReference` when the accept header is set to `application/json` or a QrCode containing the reference to the file if the accept header it set to `image/png`.
     * 
     * `idOrReference` can either be a FileId (starting with `FIL`) or a FileReference (starting with `RklM`).
     * 
     */
    'get'(
      parameters?: Parameters<Paths.GetFileMetadata.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetFileMetadata.Responses.$200>
  }
  ['/api/v2/Files/{id}/Download']: {
    /**
     * downloadFile - Downloads the file with the given `id`.
     */
    'get'(
      parameters?: Parameters<Paths.DownloadFile.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DownloadFile.Responses.$200>
  }
  ['/api/v2/Files/{id}/Token']: {
    /**
     * createTokenForFile - Creates a `Token` for the `File` with the given `id`.
     */
    'post'(
      parameters?: Parameters<Paths.CreateTokenForFile.PathParameters> | null,
      data?: Paths.CreateTokenForFile.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.CreateTokenForFile.Responses.$201>
  }
  ['/api/v2/Messages']: {
    /**
     * sendMessage - Sends a new message to the given recipient(s).
     * 
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.SendMessage.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.SendMessage.Responses.$201>
    /**
     * getMessages - Queries messages.
     */
    'get'(
      parameters?: Parameters<Paths.GetMessages.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetMessages.Responses.$200>
  }
  ['/api/v2/Messages/{id}']: {
    /**
     * getMessage - Fetches the message with the given `id`.
     */
    'get'(
      parameters?: Parameters<Paths.GetMessage.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetMessage.Responses.$200>
  }
  ['/api/v2/Messages/{messageId}/Attachments/{attachmentId}']: {
    /**
     * getMetadataOfMessageAttachment - Returns the attachment's metadata of the given `attachmentId` of message with `messageId`.
     */
    'get'(
      parameters?: Parameters<Paths.GetMetadataOfMessageAttachment.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetMetadataOfMessageAttachment.Responses.$200>
  }
  ['/api/v2/Messages/{messageId}/Attachments/{attachmentId}/Download']: {
    /**
     * downloadAttachmentOfMessage - Downloads the file of the given `attachmentId` of message with `messageId`.
     */
    'get'(
      parameters?: Parameters<Paths.DownloadAttachmentOfMessage.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DownloadAttachmentOfMessage.Responses.$200>
  }
  ['/api/v2/Relationships']: {
    /**
     * createRelationship - Creates a `Relationship` to the creator of a given relationshipTemplateId. The `RelationshipTemplate` of the given `relationshipTemplateId` must come from another identity and must be loaded by `POST /RelationshipTemplates/Peer` first.
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.CreateRelationship.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.CreateRelationship.Responses.$201>
    /**
     * getRelationships - Queries relationships.
     */
    'get'(
      parameters?: Parameters<Paths.GetRelationships.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetRelationships.Responses.$200>
  }
  ['/api/v2/Relationships/{id}']: {
    /**
     * getRelationshipById - Fetches the `Relationship` with the given `id`.
     */
    'get'(
      parameters?: Parameters<Paths.GetRelationshipById.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetRelationshipById.Responses.$200>
  }
  ['/api/v2/Relationships/{id}/Attributes']: {
    /**
     * getAttributesForRelationship - Queries attributes that are related to the given relationship.
     */
    'get'(
      parameters?: Parameters<Paths.GetAttributesForRelationship.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetAttributesForRelationship.Responses.$200>
  }
  ['/api/v2/Relationships/{id}/Changes/{changeId}/Accept']: {
    /**
     * acceptRelationshipChange - Accepts the change with the given `changeId`. If the change exists but belongs to another relationship, this call will fail and return status 404.
     */
    'put'(
      parameters?: Parameters<Paths.AcceptRelationshipChange.PathParameters> | null,
      data?: Paths.AcceptRelationshipChange.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.AcceptRelationshipChange.Responses.$200>
  }
  ['/api/v2/Relationships/{id}/Changes/{changeId}/Reject']: {
    /**
     * rejectRelationshipChange - Rejects the change with the given `changeId`. If the change exists but belongs to another relationship, this call will fail and return status 404.
     */
    'put'(
      parameters?: Parameters<Paths.RejectRelationshipChange.PathParameters> | null,
      data?: Paths.RejectRelationshipChange.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.RejectRelationshipChange.Responses.$200>
  }
  ['/api/v2/RelationshipTemplates']: {
    /**
     * getRelationshipTemplates - Queries `RelationshipTemplates`.
     */
    'get'(
      parameters?: Parameters<Paths.GetRelationshipTemplates.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetRelationshipTemplates.Responses.$200>
  }
  ['/api/v2/RelationshipTemplates/Own']: {
    /**
     * createOwnRelationshipTemplate - Creates a new `RelationshipTemplate`.
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.CreateOwnRelationshipTemplate.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.CreateOwnRelationshipTemplate.Responses.$201>
    /**
     * getOwnRelationshipTemplates - Queries own `RelationshipTemplates`.
     */
    'get'(
      parameters?: Parameters<Paths.GetOwnRelationshipTemplates.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetOwnRelationshipTemplates.Responses.$200>
  }
  ['/api/v2/RelationshipTemplates/Peer']: {
    /**
     * loadPeerRelationshipTemplate - Loads a `RelationshipTemplate` created by others. This is a prerequisite for using the template while creating a new `Relationship`.
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.LoadPeerRelationshipTemplate.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.LoadPeerRelationshipTemplate.Responses.$201>
    /**
     * getPeerRelationshipTemplates - Queries `RelationshipTemplates` of other identities. The templates have to be loaded by calling `POST /RelationshipTemplates/Peer`.
     */
    'get'(
      parameters?: Parameters<Paths.GetPeerRelationshipTemplates.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetPeerRelationshipTemplates.Responses.$200>
  }
  ['/api/v2/RelationshipTemplates/{id}']: {
    /**
     * getRelationshipTemplate - Fetches the `RelationshipTemplate` with the given `id` when the accept header is set to `application/json` or a QrCode containing the reference to the RelationshipTemplate if the accept header it set to `image/png`.
     */
    'get'(
      parameters?: Parameters<Paths.GetRelationshipTemplate.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetRelationshipTemplate.Responses.$200>
  }
  ['/api/v2/RelationshipTemplates/Own/{id}/Token']: {
    /**
     * createTokenForTemplate - Creates a `Token` for the own `RelationshipTemplate` with the given `id`
     */
    'post'(
      parameters?: Parameters<Paths.CreateTokenForTemplate.PathParameters> | null,
      data?: Paths.CreateTokenForTemplate.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.CreateTokenForTemplate.Responses.$201>
  }
  ['/api/v2/Requests/Incoming']: {
    /**
     * getIncomingRequests - Queries incoming `Requests`.
     */
    'get'(
      parameters?: Parameters<Paths.GetIncomingRequests.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetIncomingRequests.Responses.$200>
  }
  ['/api/v2/Requests/Incoming/{id}']: {
    /**
     * getIncomingRequest - Fetches the incoming `Request` with the given `id`.
     */
    'get'(
      parameters?: Parameters<Paths.GetIncomingRequest.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetIncomingRequest.Responses.$200>
  }
  ['/api/v2/Requests/Incoming/{id}/CanAccept']: {
    /**
     * canAcceptIncomingRequest - Checks if the `Request` with the given `id` can be accepted.
     */
    'put'(
      parameters?: Parameters<Paths.CanAcceptIncomingRequest.PathParameters> | null,
      data?: Paths.CanAcceptIncomingRequest.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.CanAcceptIncomingRequest.Responses.$200>
  }
  ['/api/v2/Requests/Incoming/{id}/Accept']: {
    /**
     * acceptIncomingRequest - Accepts the incoming `Request` with the given `id`.
     */
    'put'(
      parameters?: Parameters<Paths.AcceptIncomingRequest.PathParameters> | null,
      data?: Paths.AcceptIncomingRequest.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.AcceptIncomingRequest.Responses.$200>
  }
  ['/api/v2/Requests/Incoming/{id}/CanReject']: {
    /**
     * canRejectIncomingRequest - Checks if the `Request` with the given `id` can be rejected.
     */
    'put'(
      parameters?: Parameters<Paths.CanRejectIncomingRequest.PathParameters> | null,
      data?: Paths.CanRejectIncomingRequest.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.CanRejectIncomingRequest.Responses.$200>
  }
  ['/api/v2/Requests/Incoming/{id}/Reject']: {
    /**
     * rejectIncomingRequest - Rejects the incoming `Request` with the given `id`.
     */
    'put'(
      parameters?: Parameters<Paths.RejectIncomingRequest.PathParameters> | null,
      data?: Paths.RejectIncomingRequest.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.RejectIncomingRequest.Responses.$200>
  }
  ['/api/v2/Requests/Outgoing']: {
    /**
     * getOutgoingRequests - Queries outgoing `Requests`.
     */
    'get'(
      parameters?: Parameters<Paths.GetOutgoingRequests.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetOutgoingRequests.Responses.$200>
    /**
     * createOutgoingRequest - Creates a new outgoing `Request`.
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.CreateOutgoingRequest.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.CreateOutgoingRequest.Responses.$201>
  }
  ['/api/v2/Requests/Outgoing/{id}']: {
    /**
     * getOutgoingRequest - Fetches the `Request` with the given `id`.
     */
    'get'(
      parameters?: Parameters<Paths.GetOutgoingRequest.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetOutgoingRequest.Responses.$200>
  }
  ['/api/v2/Requests/Outgoing/Validate']: {
    /**
     * validateOutgoingRequest - Validates the given `OutgoingRequest` before creating it via POST `/api/v2/Requests/Outgoing`.
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.ValidateOutgoingRequest.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.ValidateOutgoingRequest.Responses.$201>
  }
  ['/api/v2/Tokens/Own']: {
    /**
     * createOwnToken - Creates a new `Token` with the given content.
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.CreateOwnToken.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.CreateOwnToken.Responses.$201>
    /**
     * getOwnTokens - Queries `Tokens`.
     */
    'get'(
      parameters?: Parameters<Paths.GetOwnTokens.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetOwnTokens.Responses.$200>
  }
  ['/api/v2/Tokens/Peer']: {
    /**
     * loadPeerToken - Load a `Token` created by others.
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.LoadPeerToken.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.LoadPeerToken.Responses.$201>
    /**
     * getPeerTokens - Queries `Tokens`.
     */
    'get'(
      parameters?: Parameters<Paths.GetPeerTokens.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetPeerTokens.Responses.$200>
  }
  ['/api/v2/Tokens/{id}']: {
    /**
     * getToken - Fetches the `Token` with the given `id`.
     */
    'get'(
      parameters?: Parameters<Paths.GetToken.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetToken.Responses.$200>
  }
}

export type Client = OpenAPIClient<OperationMethods, PathsDictionary>
