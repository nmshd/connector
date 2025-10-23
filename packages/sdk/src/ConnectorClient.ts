import axios, { AxiosInstance } from "axios";
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
    readonly #axiosInstance: AxiosInstance;

    protected get axiosInstance(): AxiosInstance {
        return this.#axiosInstance;
    }

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
        this.#axiosInstance = axios.create({
            baseURL: config.baseUrl,
            httpAgent: config.httpAgent,
            httpsAgent: config.httpsAgent,
            validateStatus: (_) => true,
            paramsSerializer: { dots: true, indexes: null }
        });

        this.axiosInstance.interceptors.request.use(async (requestConfig) => await config.authenticator.authenticate(requestConfig));

        this.axiosInstance.interceptors.request.use((config) => {
            const correlationId = this.#correlationId;
            if (correlationId) {
                config.headers["x-correlation-id"] = correlationId;
                this.#correlationId = null;
            }

            return config;
        });

        this.account = new AccountEndpoint(this.axiosInstance);
        this.announcements = new AnnouncementsEndpoint(this.axiosInstance);
        this.backboneNotifications = new BackboneNotificationsEndpoint(this.axiosInstance);
        this.attributes = new AttributesEndpoint(this.axiosInstance);
        this.challenges = new ChallengesEndpoint(this.axiosInstance);
        this.files = new FilesEndpoint(this.axiosInstance);
        this.identityMetadata = new IdentityMetadataEndpoint(this.axiosInstance);
        this.incomingRequests = new IncomingRequestsEndpoint(this.axiosInstance);
        this.messages = new MessagesEndpoint(this.axiosInstance);
        this.monitoring = new MonitoringEndpoint(this.axiosInstance);
        this.outgoingRequests = new OutgoingRequestsEndpoint(this.axiosInstance);
        this.relationships = new RelationshipsEndpoint(this.axiosInstance);
        this.relationshipTemplates = new RelationshipTemplatesEndpoint(this.axiosInstance);
        this.tokens = new TokensEndpoint(this.axiosInstance);
    }

    public static create(config: ConnectorClientConfig): ConnectorClient {
        return new ConnectorClient(config);
    }
}
