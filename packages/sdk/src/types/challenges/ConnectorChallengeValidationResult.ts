import { ConnectorRelationship } from "../relationships/ConnectorRelationship";

export interface ConnectorChallengeValidationResult {
    isValid: boolean;
    correspondingRelationship?: ConnectorRelationship;
}
