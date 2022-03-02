import { ApplicationError } from "@js-soft/ts-utils";

export class WebhooksModuleApplicationErrors {
    public static invalidTargetReference(targetName: string): ApplicationError {
        return new ApplicationError("error.runtime.modules.webhooksV2.invalidTargetReference", `Invalid configuration. target ${targetName} not found!`);
    }

    public static invalidUrlFormat(url: string): ApplicationError {
        return new ApplicationError("error.runtime.modules.webhooksV2.invalidUrlFormat", `'${url}' is not a valid URL.`);
    }
}
