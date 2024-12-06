import axios from "axios";
import correlator from "correlation-id";
import { randomUUID, UUID } from "crypto";
import { ConnectorConfig } from "./ConnectorConfig";
import {
    AccountEndpoint,
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
    public readonly account: AccountEndpoint;
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
    public readonly startCorrelation: (id: string, fn: () => void) => void;
    public readonly createCorrelationId: () => UUID;

    private constructor(config: ConnectorConfig) {
        const axiosInstance = axios.create({
            baseURL: config.baseUrl,
            headers: {
                "X-API-KEY": config.apiKey
            },
            httpAgent: config.httpAgent,
            httpsAgent: config.httpsAgent,
            validateStatus: (_) => true,
            paramsSerializer: { dots: true, indexes: null }
        });

        this.account = new AccountEndpoint(axiosInstance);
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
        this.startCorrelation = (id: string, fn: () => void) => {
            if (id) {
                correlator.withId(id, fn);
            } else {
                correlator.withId(fn);
            }
        };
        this.createCorrelationId = randomUUID;

        axiosInstance.interceptors.request.use((config) => {
            const correlationId = correlator.getId();
            config.headers["x-correlation-id"] = correlationId;
            return config;
        });
    }

    public static create(config: ConnectorConfig): ConnectorClient {
        return new ConnectorClient(config);
    }
}
