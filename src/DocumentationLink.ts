/* eslint-disable @typescript-eslint/naming-convention */
export class DocumentationLink {
    private static readonly baseUrl: string = "https://enmeshed.eu";

    public static integrate__errorCodes(anchor?: string): string {
        return this.build("integrate", "errorCodes", anchor);
    }

    public static integrate__configuration(anchor?: string): string {
        return this.build("integrate", "connector-configuration", anchor);
    }

    private static build(site: string, subSite: string, anchor = "") {
        return `${DocumentationLink.baseUrl}/${site}/${subSite}#${anchor.toLowerCase()}`;
    }
}
