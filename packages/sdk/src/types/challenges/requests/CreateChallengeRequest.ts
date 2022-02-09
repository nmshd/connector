export interface CreateRelationshipChallengeRequest {
    challengeType: "Relationship";
    relationship: string;
}

export interface CreateIdentityChallengeRequest {
    challengeType: "Identity";
}

export interface CreateDeviceChallengeRequest {
    challengeType: "Device";
}

export type CreateChallengeRequest = CreateRelationshipChallengeRequest | CreateIdentityChallengeRequest | CreateDeviceChallengeRequest;
