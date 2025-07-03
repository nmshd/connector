import { IQLQueryJSON } from "@nmshd/content";

export interface ExecuteIQLQueryRequest {
    query: Omit<IQLQueryJSON, "@type"> & { "@type"?: string };
}
