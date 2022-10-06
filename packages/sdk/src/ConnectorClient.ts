import axios from "axios";
import { ConnectorConfig } from "./ConnectorConfig";
import {
    AccountEndpoint,
    AttributesEndpoint,
    ChallengesEndpoint,
    FilesEndpoint,
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
    public readonly incomingRequests: IncomingRequestsEndpoint;
    public readonly messages: MessagesEndpoint;
    public readonly monitoring: MonitoringEndpoint;
    public readonly outgoingRequests: OutgoingRequestsEndpoint;
    public readonly relationships: RelationshipsEndpoint;
    public readonly relationshipTemplates: RelationshipTemplatesEndpoint;
    public readonly tokens: TokensEndpoint;

    private constructor(config: ConnectorConfig) {
        const axiosInstance = axios.create({
            baseURL: config.baseUrl,
            headers: {
                "X-API-KEY": config.apiKey // eslint-disable-line @typescript-eslint/naming-convention
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
        this.incomingRequests = new IncomingRequestsEndpoint(axiosInstance);
        this.messages = new MessagesEndpoint(axiosInstance);
        this.monitoring = new MonitoringEndpoint(axiosInstance);
        this.outgoingRequests = new OutgoingRequestsEndpoint(axiosInstance);
        this.relationships = new RelationshipsEndpoint(axiosInstance);
        this.relationshipTemplates = new RelationshipTemplatesEndpoint(axiosInstance);
        this.tokens = new TokensEndpoint(axiosInstance);
    }

    public static create(config: ConnectorConfig): ConnectorClient {
        return new ConnectorClient(config);
    }
}
