import { TokenDTO } from "@nmshd/runtime-types";
import { AxiosInstance } from "axios";
import { ConnectorHttpResponse, CreateOwnTokenRequest, GetOwnTokensRequest, GetPeerTokensRequest, LoadPeerTokenRequest } from "../types";
import { Endpoint } from "./Endpoint";

export class TokensEndpoint extends Endpoint {
    public constructor(httpClient: AxiosInstance) {
        super(httpClient);
    }

    public async getToken(tokenId: string): Promise<ConnectorHttpResponse<TokenDTO>> {
        return await this.get(`/api/v2/Tokens/${tokenId}`);
    }

    public async getQrCodeForToken(tokenId: string, newQRCodeFormat?: boolean): Promise<ConnectorHttpResponse<ArrayBuffer>> {
        return await this.downloadQrCode("GET", `/api/v2/Tokens/${tokenId}`, { newQRCodeFormat: newQRCodeFormat ? "true" : undefined });
    }

    public async getOwnTokens(request?: GetOwnTokensRequest): Promise<ConnectorHttpResponse<TokenDTO[]>> {
        return await this.get("/api/v2/Tokens/Own", request);
    }

    public async createOwnToken(request: CreateOwnTokenRequest): Promise<ConnectorHttpResponse<TokenDTO>> {
        return await this.post("/api/v2/Tokens/Own", request);
    }

    public async getPeerTokens(request?: GetPeerTokensRequest): Promise<ConnectorHttpResponse<TokenDTO[]>> {
        return await this.get("/api/v2/Tokens/Peer", request);
    }

    public async loadPeerToken(request: LoadPeerTokenRequest): Promise<ConnectorHttpResponse<TokenDTO>> {
        return await this.post("/api/v2/Tokens/Peer", request);
    }
}
