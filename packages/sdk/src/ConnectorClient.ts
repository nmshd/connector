import axios from "axios";
import { ApiKeyAuthenticator } from "./authentication";
import { ConnectorClientConfig } from "./ConnectorClientConfig";
import {
    AccountEndpoint,
    AnnouncementsEndpoint,
    AttributesEndpoint,
    BackboneNotificationsEndpoint,
    ChallengesEndpoint,
    FilesEndpoint,
    IdentityMetadataEndpoint,
    IncomingRequestsEndpoint,
    MessagesEndpoint,
    MonitoringEndpoint,
    OutgoingRequestsEndpoint,
    RelationshipsEndpoint,
    RelationshipTemplatesEndpoint,
    TokensEndpoint
} from "./endpoints";

export class ConnectorClient {
    #correlationId: string | null = null;
    public withCorrelationId(correlationId: string): this {
        this.#correlationId = correlationId;

        return this;
    }

    public readonly account: AccountEndpoint;
    public readonly announcements: AnnouncementsEndpoint;
    public readonly backboneNotifications: BackboneNotificationsEndpoint;
    public readonly attributes: AttributesEndpoint;
    public readonly challenges: ChallengesEndpoint;
    public readonly files: FilesEndpoint;
    public readonly identityMetadata: IdentityMetadataEndpoint;
    public readonly incomingRequests: IncomingRequestsEndpoint;
    public readonly messages: MessagesEndpoint;
    public readonly monitoring: MonitoringEndpoint;
    public readonly outgoingRequests: OutgoingRequestsEndpoint;
    public readonly relationships: RelationshipsEndpoint;
    public readonly relationshipTemplates: RelationshipTemplatesEndpoint;
    public readonly tokens: TokensEndpoint;

    protected constructor(config: ConnectorClientConfig) {
        const axiosInstance = axios.create({
            baseURL: config.baseUrl,
            httpAgent: config.httpAgent,
            httpsAgent: config.httpsAgent,
            validateStatus: (_) => true,
            paramsSerializer: { dots: true, indexes: null }
        });

        const authenticator = "authenticator" in config ? config.authenticator : "apiKey" in config ? new ApiKeyAuthenticator(config.apiKey) : null;

        if (!authenticator) throw new Error("No authenticator provided. Please provide an authenticator or an API key.");
        axiosInstance.interceptors.request.use(async (requestConfig) => await authenticator.authenticate(requestConfig));

        axiosInstance.interceptors.request.use((config) => {
            const correlationId = this.#correlationId;
            if (correlationId) {
                config.headers["x-correlation-id"] = correlationId;
                this.#correlationId = null;
            }

            return config;
        });

        this.account = new AccountEndpoint(axiosInstance);
        this.announcements = new AnnouncementsEndpoint(axiosInstance);
        this.backboneNotifications = new BackboneNotificationsEndpoint(axiosInstance);
        this.attributes = new AttributesEndpoint(axiosInstance);
        this.challenges = new ChallengesEndpoint(axiosInstance);
        this.files = new FilesEndpoint(axiosInstance);
        this.identityMetadata = new IdentityMetadataEndpoint(axiosInstance);
        this.incomingRequests = new IncomingRequestsEndpoint(axiosInstance);
        this.messages = new MessagesEndpoint(axiosInstance);
        this.monitoring = new MonitoringEndpoint(axiosInstance);
        this.outgoingRequests = new OutgoingRequestsEndpoint(axiosInstance);
        this.relationships = new RelationshipsEndpoint(axiosInstance);
        this.relationshipTemplates = new RelationshipTemplatesEndpoint(axiosInstance);
        this.tokens = new TokensEndpoint(axiosInstance);
    }

    public static create(config: ConnectorClientConfig): ConnectorClient {
        return new ConnectorClient(config);
    }
}
