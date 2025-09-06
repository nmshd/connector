import { TokenDTO } from "@nmshd/runtime-types";
import { AxiosInstance } from "axios";
import { ConnectorHttpResponse, CreateOwnTokenRequest, GetOwnTokensRequest, GetPeerTokensRequest, LoadPeerTokenRequest } from "../types";
import { Endpoint } from "./Endpoint";

export class TokensEndpoint extends Endpoint {
    public constructor(httpClient: AxiosInstance) {
        super(httpClient);
    }

    public async getToken(tokenId: string): Promise<ConnectorHttpResponse<TokenDTO>> {
        return await this.get(`/api/core/v1/Tokens/${tokenId}`);
    }

    public async getQrCodeForToken(tokenId: string): Promise<ConnectorHttpResponse<ArrayBuffer>> {
        return await this.downloadQrCode("GET", `/api/core/v1/Tokens/${tokenId}`);
    }

    public async getOwnTokens(request?: GetOwnTokensRequest): Promise<ConnectorHttpResponse<TokenDTO[]>> {
        return await this.get("/api/core/v1/Tokens/Own", request);
    }

    public async createOwnToken(request: CreateOwnTokenRequest): Promise<ConnectorHttpResponse<TokenDTO>> {
        return await this.post("/api/core/v1/Tokens/Own", request);
    }

    public async getPeerTokens(request?: GetPeerTokensRequest): Promise<ConnectorHttpResponse<TokenDTO[]>> {
        return await this.get("/api/core/v1/Tokens/Peer", request);
    }

    public async loadPeerToken(request: LoadPeerTokenRequest): Promise<ConnectorHttpResponse<TokenDTO>> {
        return await this.post("/api/core/v1/Tokens/Peer", request);
    }
}
