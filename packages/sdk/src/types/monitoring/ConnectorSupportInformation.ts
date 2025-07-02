import { RuntimeHealth } from "@nmshd/runtime-types";
import { IdentityInfo } from "../account/IdentityInfo";
import { ConnectorVersionInfo } from "./VersionInfo";

export interface ConnectorSupportInformation {
    version: ConnectorVersionInfo;
    health: RuntimeHealth;
    configuration: Record<string, string | number | object | unknown[] | boolean | null>;
    identityInfo: IdentityInfo;
}
