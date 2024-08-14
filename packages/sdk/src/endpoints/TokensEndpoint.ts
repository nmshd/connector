import { AxiosInstance } from "axios";
import {
    ConnectorToken,
    ConnectorTokens,
    CreateOwnTokenRequest,
    GetOwnTokensRequest,
    GetPeerTokensRequest,
    LoadPeerTokenByReferenceRequest,
    LoadPeerTokenByTruncatedReferenceRequest,
    LoadPeerTokenRequest,
    Response
} from "../types";
import { Endpoint } from "./Endpoint";

export class TokensEndpoint extends Endpoint {
    public constructor(httpClient: AxiosInstance) {
        super(httpClient);
    }

    public async getToken(tokenId: string): Promise<Response<ConnectorToken>> {
        return await this.get(`/api/v2/Tokens/${tokenId}`);
    }

    public async getQrCodeForToken(tokenId: string): Promise<Response<ArrayBuffer>> {
        return await this.downloadQrCode("GET", `/api/v2/Tokens/${tokenId}`);
    }

    public async getOwnTokens(request?: GetOwnTokensRequest): Promise<Response<ConnectorTokens>> {
        return await this.get("/api/v2/Tokens/Own", request);
    }

    public async createOwnToken(request: CreateOwnTokenRequest): Promise<Response<ConnectorToken>> {
        return await this.post("/api/v2/Tokens/Own", request);
    }

    public async getPeerTokens(request?: GetPeerTokensRequest): Promise<Response<ConnectorTokens>> {
        return await this.get("/api/v2/Tokens/Peer", request);
    }

    public async loadPeerToken(request: LoadPeerTokenByReferenceRequest): Promise<Response<ConnectorToken>>;
    public async loadPeerToken(request: LoadPeerTokenByTruncatedReferenceRequest): Promise<Response<ConnectorToken>>;
    public async loadPeerToken(request: LoadPeerTokenRequest): Promise<Response<ConnectorToken>> {
        return await this.post("/api/v2/Tokens/Peer", request);
    }
}
