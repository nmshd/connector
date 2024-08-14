import { ConnectorRequestContent } from "../requests/ConnectorRequestContent";

export type RelationshipTemplateContentDerivation = ConnectorRelationshipTemplateContent | ArbitraryRelationshipTemplateContent;

export interface ConnectorRelationshipTemplateContent {
    "@type": "RelationshipTemplateContent";
    title?: string;
    metadata?: object;
    onNewRelationship: ConnectorRequestContent;
    onExistingRelationship?: ConnectorRequestContent;
}

export interface ArbitraryRelationshipTemplateContent {
    "@type": "ArbitraryRelationshipTemplateContent";
    value: any;
}
