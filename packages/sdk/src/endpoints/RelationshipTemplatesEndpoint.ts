import { RelationshipTemplateDTO, TokenDTO } from "@nmshd/runtime-types";
import { AxiosInstance } from "axios";
import {
    ConnectorHttpResponse,
    CreateOwnRelationshipTemplateRequest,
    CreateTokenForOwnRelationshipTemplateRequest,
    CreateTokenQrCodeForOwnRelationshipTemplateRequest,
    GetOwnTemplatesRequest as GetOwnRelationshipTemplatesRequest,
    GetPeerRelationshipTemplatesRequest,
    GetRelationshipTemplatesRequest,
    LoadPeerRelationshipTemplateRequest
} from "../types";
import { Endpoint } from "./Endpoint";

export class RelationshipTemplatesEndpoint extends Endpoint {
    public constructor(httpClient: AxiosInstance) {
        super(httpClient);
    }

    public async getRelationshipTemplates(request?: GetRelationshipTemplatesRequest): Promise<ConnectorHttpResponse<RelationshipTemplateDTO[]>> {
        return await this.get("/api/core/v1/RelationshipTemplates", request);
    }

    public async getRelationshipTemplate(id: string): Promise<ConnectorHttpResponse<RelationshipTemplateDTO>> {
        return await this.get(`/api/core/v1/RelationshipTemplates/${id}`);
    }

    public async getOwnRelationshipTemplates(request?: GetOwnRelationshipTemplatesRequest): Promise<ConnectorHttpResponse<RelationshipTemplateDTO[]>> {
        return await this.get("/api/core/v1/RelationshipTemplates/Own", request);
    }

    public async createOwnRelationshipTemplate(request: CreateOwnRelationshipTemplateRequest): Promise<ConnectorHttpResponse<RelationshipTemplateDTO>> {
        return await this.post("/api/core/v1/RelationshipTemplates/Own", request);
    }

    public async getQrCodeForOwnRelationshipTemplate(id: string): Promise<ConnectorHttpResponse<ArrayBuffer>> {
        return await this.downloadQrCode("GET", `/api/core/v1/RelationshipTemplates/${id}`);
    }

    public async createTokenForOwnRelationshipTemplate(id: string, request?: CreateTokenForOwnRelationshipTemplateRequest): Promise<ConnectorHttpResponse<TokenDTO>> {
        return await this.post(`/api/core/v1/RelationshipTemplates/Own/${id}/Token`, request, undefined);
    }

    public async createTokenQrCodeForOwnRelationshipTemplate(
        id: string,
        request?: CreateTokenQrCodeForOwnRelationshipTemplateRequest
    ): Promise<ConnectorHttpResponse<ArrayBuffer>> {
        return await this.downloadQrCode("POST", `/api/core/v1/RelationshipTemplates/Own/${id}/Token`, request);
    }

    public async getPeerRelationshipTemplates(request?: GetPeerRelationshipTemplatesRequest): Promise<ConnectorHttpResponse<RelationshipTemplateDTO[]>> {
        return await this.get("/api/core/v1/RelationshipTemplates/Peer", request);
    }

    public async loadPeerRelationshipTemplate(request: LoadPeerRelationshipTemplateRequest): Promise<ConnectorHttpResponse<RelationshipTemplateDTO>> {
        return await this.post("/api/core/v1/RelationshipTemplates/Peer", request);
    }

    public async deleteRelationshipTemplate(id: string): Promise<ConnectorHttpResponse<void>> {
        return await this.delete(`/api/core/v1/RelationshipTemplates/${id}`, undefined, 204);
    }
}
