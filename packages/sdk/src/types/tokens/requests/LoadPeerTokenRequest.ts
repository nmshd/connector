export interface LoadPeerTokenByTruncatedReferenceRequest {
    reference: string;
    ephemeral?: boolean;
}

export interface LoadPeerTokenByReferenceRequest {
    id: string;
    secretKey: string;
    ephemeral?: boolean;
}

export type LoadPeerTokenRequest = LoadPeerTokenByReferenceRequest | LoadPeerTokenByTruncatedReferenceRequest;
