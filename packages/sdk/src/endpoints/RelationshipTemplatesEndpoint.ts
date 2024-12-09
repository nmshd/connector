import { AxiosInstance } from "axios";
import {
    ConnectorHttpResponse,
    ConnectorRelationshipTemplate,
    ConnectorRelationshipTemplates,
    ConnectorToken,
    CreateOwnRelationshipTemplateRequest,
    CreateTokenForOwnRelationshipTemplateRequest,
    CreateTokenQrCodeForOwnRelationshipTemplateRequest,
    GetOwnTemplatesRequest as GetOwnRelationshipTemplatesRequest,
    GetPeerRelationshipTemplatesRequest,
    GetRelationshipTemplatesRequest,
    LoadPeerRelationshipTemplateRequest
} from "../types";
import { CorrelationID, Endpoint } from "./Endpoint";

export class RelationshipTemplatesEndpoint extends Endpoint {
    public constructor(httpClient: AxiosInstance) {
        super(httpClient);
    }

    public async getRelationshipTemplates(
        request?: GetRelationshipTemplatesRequest,
        correlationId?: CorrelationID
    ): Promise<ConnectorHttpResponse<ConnectorRelationshipTemplates>> {
        return await this.get("/api/v2/RelationshipTemplates", request, correlationId);
    }

    public async getRelationshipTemplate(id: string, correlationId?: CorrelationID): Promise<ConnectorHttpResponse<ConnectorRelationshipTemplate>> {
        return await this.get(`/api/v2/RelationshipTemplates/${id}`, undefined, correlationId);
    }

    public async getOwnRelationshipTemplates(
        request?: GetOwnRelationshipTemplatesRequest,
        correlationId?: CorrelationID
    ): Promise<ConnectorHttpResponse<ConnectorRelationshipTemplates>> {
        return await this.get("/api/v2/RelationshipTemplates/Own", request, correlationId);
    }

    public async createOwnRelationshipTemplate(
        request: CreateOwnRelationshipTemplateRequest,
        correlationId?: CorrelationID
    ): Promise<ConnectorHttpResponse<ConnectorRelationshipTemplate>> {
        return await this.post("/api/v2/RelationshipTemplates/Own", request, undefined, undefined, correlationId);
    }

    public async getQrCodeForOwnRelationshipTemplate(id: string, correlationId?: CorrelationID): Promise<ConnectorHttpResponse<ArrayBuffer>> {
        return await this.downloadQrCode("GET", `/api/v2/RelationshipTemplates/${id}`, undefined, correlationId);
    }

    public async createTokenForOwnRelationshipTemplate(
        id: string,
        request?: CreateTokenForOwnRelationshipTemplateRequest,
        correlationId?: CorrelationID
    ): Promise<ConnectorHttpResponse<ConnectorToken>> {
        return await this.post(`/api/v2/RelationshipTemplates/Own/${id}/Token`, request, undefined, undefined, correlationId);
    }

    public async createTokenQrCodeForOwnRelationshipTemplate(
        id: string,
        request?: CreateTokenQrCodeForOwnRelationshipTemplateRequest,
        correlationId?: CorrelationID
    ): Promise<ConnectorHttpResponse<ArrayBuffer>> {
        return await this.downloadQrCode("POST", `/api/v2/RelationshipTemplates/Own/${id}/Token`, request, correlationId);
    }

    public async getPeerRelationshipTemplates(
        request?: GetPeerRelationshipTemplatesRequest,
        correlationId?: CorrelationID
    ): Promise<ConnectorHttpResponse<ConnectorRelationshipTemplates>> {
        return await this.get("/api/v2/RelationshipTemplates/Peer", request, correlationId);
    }

    public async loadPeerRelationshipTemplate(
        request: LoadPeerRelationshipTemplateRequest,
        correlationId?: CorrelationID
    ): Promise<ConnectorHttpResponse<ConnectorRelationshipTemplate>> {
        return await this.post("/api/v2/RelationshipTemplates/Peer", request, undefined, undefined, correlationId);
    }
}
