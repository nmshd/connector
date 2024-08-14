import { ConnectorResponse } from "../requests";

export type ConnectorRelationshipCreationContentDerivation = ConnectorRelationshipCreationContent | ConnectorArbitraryRelationshipCreationContent;

export interface ConnectorRelationshipCreationContent {
    "@type": "RelationshipCreationContent";
    response: ConnectorResponse;
}

export interface ConnectorArbitraryRelationshipCreationContent {
    "@type": "ArbitraryRelationshipCreationContent";
    value: any;
}
