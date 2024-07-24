/* eslint-disable @typescript-eslint/naming-convention */
export class DocumentationLink {
    private static readonly baseUrl: string = "https://enmeshed.eu";

    public static integrate__errorCodes(anchor?: string): string {
        return this.build_errorCodes("integrate", "error-codes", anchor);
    }

    public static operate__configuration(anchor?: string): string {
        return this.build("operate", "configuration", anchor);
    }

    private static build(site: string, subSite: string, anchor = "") {
        return `${DocumentationLink.baseUrl}/${site}/${subSite}#${anchor.toLowerCase()}`;
    }

    private static build_errorCodes(site: string, subSite: string, anchor = "") {
        return `${DocumentationLink.baseUrl}/${site}/${subSite}#${anchor.toString()}`;
    }
}
