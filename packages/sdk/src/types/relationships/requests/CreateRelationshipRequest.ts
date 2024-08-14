import { ConnectorRelationshipCreationContentDerivation } from "../ConnectorRelationshipCreationContentDerivation";

export interface CreateRelationshipRequest {
    templateId: string;
    creationContent: ConnectorRelationshipCreationContentDerivation;
}
