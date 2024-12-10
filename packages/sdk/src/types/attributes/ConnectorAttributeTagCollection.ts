export interface ConnectorAttributeTagCollection {
    supportedLanguages: string[];
    tagsForAttributeValueTypes: Record<string, Record<string, ConnectorAttributeTag>>;
}

export interface ConnectorAttributeTag {
    displayNames: Record<string, string>;
    children?: Record<string, ConnectorAttributeTag>;
}
