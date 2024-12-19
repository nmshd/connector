import { AxiosInstance } from "axios";
import { ConnectorHttpResponse, ConnectorToken, ConnectorTokens, CreateOwnTokenRequest, GetOwnTokensRequest, GetPeerTokensRequest, LoadPeerTokenRequest } from "../types";
import { CorrelationID, Endpoint } from "./Endpoint";

export class TokensEndpoint extends Endpoint {
    public constructor(httpClient: AxiosInstance) {
        super(httpClient);
    }

    public async getToken(tokenId: string, correlationId?: CorrelationID): Promise<ConnectorHttpResponse<ConnectorToken>> {
        return await this.get(`/api/v2/Tokens/${tokenId}`, undefined, correlationId);
    }

    public async getQrCodeForToken(tokenId: string, correlationId?: CorrelationID): Promise<ConnectorHttpResponse<ArrayBuffer>> {
        return await this.downloadQrCode("GET", `/api/v2/Tokens/${tokenId}`, undefined, correlationId);
    }

    public async getOwnTokens(request?: GetOwnTokensRequest, correlationId?: CorrelationID): Promise<ConnectorHttpResponse<ConnectorTokens>> {
        return await this.get("/api/v2/Tokens/Own", request, correlationId);
    }

    public async createOwnToken(request: CreateOwnTokenRequest, correlationId?: CorrelationID): Promise<ConnectorHttpResponse<ConnectorToken>> {
        return await this.post("/api/v2/Tokens/Own", request, undefined, undefined, correlationId);
    }

    public async getPeerTokens(request?: GetPeerTokensRequest, correlationId?: CorrelationID): Promise<ConnectorHttpResponse<ConnectorTokens>> {
        return await this.get("/api/v2/Tokens/Peer", request, correlationId);
    }

    public async loadPeerToken(request: LoadPeerTokenRequest, correlationId?: CorrelationID): Promise<ConnectorHttpResponse<ConnectorToken>> {
        return await this.post("/api/v2/Tokens/Peer", request, undefined, undefined, correlationId);
    }
}
