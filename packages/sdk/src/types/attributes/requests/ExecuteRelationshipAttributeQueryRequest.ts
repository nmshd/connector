import { RelationshipAttributeQueryJSON } from "@nmshd/content";

export interface ExecuteRelationshipAttributeQueryRequest {
    query: Omit<RelationshipAttributeQueryJSON, "@type"> & { "@type"?: string };
}
