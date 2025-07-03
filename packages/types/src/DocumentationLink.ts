/* eslint-disable @typescript-eslint/naming-convention */
export class DocumentationLink {
    private static readonly baseUrl: string = "https://enmeshed.eu";

    public static integrate__errorCodes(anchor?: string): string {
        return this.build("integrate", "error-codes", anchor);
    }

    public static operate__configuration(anchor = ""): string {
        return this.build("operate", "configuration", anchor.toLocaleLowerCase());
    }

    private static build(site: string, subSite: string, anchor = "") {
        return `${DocumentationLink.baseUrl}/${site}/${subSite}#${anchor}`;
    }
}
