import { AxiosInstance } from "axios";
import {
    ConnectorResponse,
    ConnectorToken,
    ConnectorTokens,
    CreateOwnTokenRequest,
    GetOwnTokensRequest,
    GetPeerTokensRequest,
    LoadPeerTokenByReferenceRequest,
    LoadPeerTokenByTruncatedReferenceRequest,
    LoadPeerTokenRequest
} from "../types";
import { Endpoint } from "./Endpoint";

export class TokensEndpoint extends Endpoint {
    public constructor(httpClient: AxiosInstance) {
        super(httpClient);
    }

    public async getToken(tokenId: string): Promise<ConnectorResponse<ConnectorToken>> {
        return await this.get(`/api/v2/Tokens/${tokenId}`);
    }

    public async getQrCodeForToken(tokenId: string): Promise<ConnectorResponse<ArrayBuffer>> {
        return await this.downloadQrCode("GET", `/api/v2/Tokens/${tokenId}`);
    }

    public async getOwnTokens(request?: GetOwnTokensRequest): Promise<ConnectorResponse<ConnectorTokens>> {
        return await this.get("/api/v2/Tokens/Own", request);
    }

    public async createOwnToken(request: CreateOwnTokenRequest): Promise<ConnectorResponse<ConnectorToken>> {
        return await this.post("/api/v2/Tokens/Own", request);
    }

    public async getPeerTokens(request?: GetPeerTokensRequest): Promise<ConnectorResponse<ConnectorTokens>> {
        return await this.get("/api/v2/Tokens/Peer", request);
    }

    public async loadPeerToken(request: LoadPeerTokenByReferenceRequest): Promise<ConnectorResponse<ConnectorToken>>;
    public async loadPeerToken(request: LoadPeerTokenByTruncatedReferenceRequest): Promise<ConnectorResponse<ConnectorToken>>;
    public async loadPeerToken(request: LoadPeerTokenRequest): Promise<ConnectorResponse<ConnectorToken>> {
        return await this.post("/api/v2/Tokens/Peer", request);
    }
}
