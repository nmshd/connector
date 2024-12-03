export interface GetOwnTemplatesRequest {
    createdAt?: string | string[];
    expiresAt?: string | string[];
    createdByDevice?: string | string[];
    maxNumberOfAllocations?: number | number[];
    forIdentity?: string | string[];
    password?: string | string[];
    passwordIsPin?: "true" | "!";
}
