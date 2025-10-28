export interface GetForwardingDetailsForAttributeRequest {
    attributeId: string;
    query?: GetForwardingDetailsForAttributeRequestQuery;
}

export interface GetForwardingDetailsForAttributeRequestQuery {
    peer: string | string[];
    sourceReference?: string | string[];
    sharedAt?: string | string[];
    deletionInfo?: string | string[];
    "deletionInfo.deletionStatus"?: string | string[];
    "deletionInfo.deletionDate"?: string | string[];
}
