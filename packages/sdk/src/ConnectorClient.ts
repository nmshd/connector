import axios from "axios";
import { ConnectorClientConfig } from "./ConnectorClientConfig";
import {
    AccountEndpoint,
    AnnouncementsEndpoint,
    AttributesEndpoint,
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

        axiosInstance.interceptors.request.use(async (requestConfig) => await config.authenticator.authenticate(requestConfig));

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
