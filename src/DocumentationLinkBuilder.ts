export class DocumentationLinkBuilder {
    private readonly baseUrl: string = "https://enmeshed.eu/";
    private site = "";
    private subSite = "";

    public build(anchor: string): string {
        if (!this.site) throw new Error("site not set");
        if (!this.subSite) throw new Error("subSite not set");

        return `${this.baseUrl}/${this.site}/${this.subSite}#${anchor}`;
    }

    public integrate(): this {
        this.site = "integrate";
        return this;
    }

    public errorCodes(): this {
        this.subSite = "error-codes";
        return this;
    }

    public configuration(): this {
        this.subSite = "connector-configuration";
        return this;
    }
}
