import { IdentityAttributeQueryJSON } from "@nmshd/content";

export interface ExecuteIdentityAttributeQueryRequest {
    query: Omit<IdentityAttributeQueryJSON, "@type"> & { "@type"?: string };
}
