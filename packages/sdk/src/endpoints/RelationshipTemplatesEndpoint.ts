import { AxiosInstance } from "axios";
import { RelationshipTemplateReference } from "..";
import {
    ConnectorRelationshipTemplate,
    ConnectorRelationshipTemplates,
    ConnectorResponse,
    ConnectorToken,
    CreateOwnRelationshipTemplateRequest,
    CreateTokenForOwnRelationshipTemplateRequest,
    CreateTokenQrCodeForOwnRelationshipTemplateRequest,
    GetOwnTemplatesRequest as GetOwnRelationshipTemplatesRequest,
    GetPeerRelationshipTemplatesRequest,
    GetRelationshipTemplatesRequest,
    LoadPeerRelationshipTemplateRequest,
    TruncatedRelationshipTemplateReference
} from "../types";
import { Endpoint } from "./Endpoint";

export class RelationshipTemplatesEndpoint extends Endpoint {
    public constructor(httpClient: AxiosInstance) {
        super(httpClient);
    }

    public async getRelationshipTemplates(request?: GetRelationshipTemplatesRequest): Promise<ConnectorResponse<ConnectorRelationshipTemplates>> {
        return await this.get("/api/v1/RelationshipTemplates", request);
    }

    public async getRelationshipTemplate(id: string): Promise<ConnectorResponse<ConnectorRelationshipTemplate>> {
        return await this.get(`/api/v1/RelationshipTemplates/${id}`);
    }

    public async getOwnRelationshipTemplates(request?: GetOwnRelationshipTemplatesRequest): Promise<ConnectorResponse<ConnectorRelationshipTemplates>> {
        return await this.get("/api/v1/RelationshipTemplates/Own", request);
    }

    public async createOwnRelationshipTemplate(request: CreateOwnRelationshipTemplateRequest): Promise<ConnectorResponse<ConnectorRelationshipTemplate>> {
        return await this.post("/api/v1/RelationshipTemplates/Own", request);
    }

    public async getQrCodeForRelationshipTemplate(id: string): Promise<ConnectorResponse<ArrayBuffer>> {
        return await this.downloadQrCode("GET", `/api/v1/Files/${id}/QrCode`);
    }

    public async createTokenForOwnRelationshipTemplate(id: string, request?: CreateTokenForOwnRelationshipTemplateRequest): Promise<ConnectorResponse<ConnectorToken>> {
        return await this.post(`/api/v1/RelationshipTemplates/Own/${id}/Token`, request, undefined);
    }

    public async createTokenQrCodeForOwnRelationshipTemplate(id: string, request?: CreateTokenQrCodeForOwnRelationshipTemplateRequest): Promise<ConnectorResponse<ArrayBuffer>> {
        return await this.downloadQrCode("POST", `/api/v1/RelationshipTemplates/Own/${id}/Token`, request);
    }

    public async getPeerRelationshipTemplates(request?: GetPeerRelationshipTemplatesRequest): Promise<ConnectorResponse<ConnectorRelationshipTemplates>> {
        return await this.get("/api/v1/RelationshipTemplates/Peer", request);
    }

    public async loadPeerRelationshipTemplate(request: TruncatedRelationshipTemplateReference): Promise<ConnectorResponse<ConnectorRelationshipTemplate>>;
    public async loadPeerRelationshipTemplate(request: RelationshipTemplateReference): Promise<ConnectorResponse<ConnectorRelationshipTemplate>>;
    public async loadPeerRelationshipTemplate(request: LoadPeerRelationshipTemplateRequest): Promise<ConnectorResponse<ConnectorRelationshipTemplate>> {
        return await this.post("/api/v1/RelationshipTemplates/Peer", request);
    }
}
