import { IQLQuery } from "../IQLQuery";

export interface ExecuteIQLQueryRequest {
    query: Omit<IQLQuery, "@type"> & { "@type"?: string };
}
