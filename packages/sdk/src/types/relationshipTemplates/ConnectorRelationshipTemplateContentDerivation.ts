import { ConnectorRequestContent } from "../requests/ConnectorRequestContent";

export type ConnectorRelationshipTemplateContentDerivation = ConnectorRelationshipTemplateContent | ArbitraryRelationshipTemplateContent;

export interface ConnectorRelationshipTemplateContent {
    "@type": "RelationshipTemplateContent";
    title?: string;
    metadata?: object;
    onNewRelationship: Omit<ConnectorRequestContent, "@type"> & { "@type"?: "Request" };
    onExistingRelationship?: Omit<ConnectorRequestContent, "@type"> & { "@type"?: "Request" };
}

export interface ArbitraryRelationshipTemplateContent {
    "@type": "ArbitraryRelationshipTemplateContent";
    value: any;
}
