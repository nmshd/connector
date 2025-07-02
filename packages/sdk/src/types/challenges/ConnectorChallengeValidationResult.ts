import { RelationshipDTO } from "@nmshd/runtime-types";

export interface ConnectorChallengeValidationResult {
    isValid: boolean;
    correspondingRelationship?: RelationshipDTO;
}
