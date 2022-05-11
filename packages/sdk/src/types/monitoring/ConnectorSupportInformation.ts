import { IdentityInfo } from "../account/IdentityInfo";
import { ConnectorHealth } from "./ConnectorHealth";
import { ConnectorVersionInfo } from "./VersionInfo";

export interface ConnectorSupportInformation {
    version: ConnectorVersionInfo;
    health: ConnectorHealth;
    configuration: Record<string, string | number | object | unknown[] | boolean | null>;
    identityInfo: IdentityInfo;
}
