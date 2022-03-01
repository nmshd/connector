import { ApplicationError } from "@js-soft/ts-utils";

export class WebhooksApplicationErrors {
    public static invalidTargetReference(targetName: string): ApplicationError {
        return new ApplicationError("error.runtime.modules.invalidTargetReference", `Invalid configuration. target ${targetName} not found!`);
    }
}
