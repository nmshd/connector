import { AxiosInstance } from "axios";
import {
    ConnectorRelationshipTemplate,
    ConnectorRelationshipTemplates,
    ConnectorToken,
    CreateOwnRelationshipTemplateRequest,
    CreateTokenForOwnRelationshipTemplateRequest,
    CreateTokenQrCodeForOwnRelationshipTemplateRequest,
    GetOwnTemplatesRequest as GetOwnRelationshipTemplatesRequest,
    GetPeerRelationshipTemplatesRequest,
    GetRelationshipTemplatesRequest,
    LoadPeerRelationshipTemplateRequest,
    RelationshipTemplateReference,
    Response,
    TruncatedRelationshipTemplateReference
} from "../types";
import { Endpoint } from "./Endpoint";

export class RelationshipTemplatesEndpoint extends Endpoint {
    public constructor(httpClient: AxiosInstance) {
        super(httpClient);
    }

    public async getRelationshipTemplates(request?: GetRelationshipTemplatesRequest): Promise<Response<ConnectorRelationshipTemplates>> {
        return await this.get("/api/v2/RelationshipTemplates", request);
    }

    public async getRelationshipTemplate(id: string): Promise<Response<ConnectorRelationshipTemplate>> {
        return await this.get(`/api/v2/RelationshipTemplates/${id}`);
    }

    public async getOwnRelationshipTemplates(request?: GetOwnRelationshipTemplatesRequest): Promise<Response<ConnectorRelationshipTemplates>> {
        return await this.get("/api/v2/RelationshipTemplates/Own", request);
    }

    public async createOwnRelationshipTemplate(request: CreateOwnRelationshipTemplateRequest): Promise<Response<ConnectorRelationshipTemplate>> {
        return await this.post("/api/v2/RelationshipTemplates/Own", request);
    }

    public async getQrCodeForOwnRelationshipTemplate(id: string): Promise<Response<ArrayBuffer>> {
        return await this.downloadQrCode("GET", `/api/v2/RelationshipTemplates/${id}`);
    }

    public async createTokenForOwnRelationshipTemplate(id: string, request?: CreateTokenForOwnRelationshipTemplateRequest): Promise<Response<ConnectorToken>> {
        return await this.post(`/api/v2/RelationshipTemplates/Own/${id}/Token`, request, undefined);
    }

    public async createTokenQrCodeForOwnRelationshipTemplate(id: string, request?: CreateTokenQrCodeForOwnRelationshipTemplateRequest): Promise<Response<ArrayBuffer>> {
        return await this.downloadQrCode("POST", `/api/v2/RelationshipTemplates/Own/${id}/Token`, request);
    }

    public async getPeerRelationshipTemplates(request?: GetPeerRelationshipTemplatesRequest): Promise<Response<ConnectorRelationshipTemplates>> {
        return await this.get("/api/v2/RelationshipTemplates/Peer", request);
    }

    public async loadPeerRelationshipTemplate(request: TruncatedRelationshipTemplateReference): Promise<Response<ConnectorRelationshipTemplate>>;
    public async loadPeerRelationshipTemplate(request: RelationshipTemplateReference): Promise<Response<ConnectorRelationshipTemplate>>;
    public async loadPeerRelationshipTemplate(request: LoadPeerRelationshipTemplateRequest): Promise<Response<ConnectorRelationshipTemplate>> {
        return await this.post("/api/v2/RelationshipTemplates/Peer", request);
    }
}
