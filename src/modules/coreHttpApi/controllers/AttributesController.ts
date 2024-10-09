import { ConsumptionServices, RuntimeErrors, TransportServices } from "@nmshd/runtime";
import { Inject } from "typescript-ioc";
import { Accept, Context, DELETE, GET, POST, Path, PathParam, QueryParam, Return, ServiceContext } from "typescript-rest";
import { Envelope } from "../../../infrastructure";
import { BaseController } from "../common/BaseController";

@Path("/api/v2/Attributes")
export class AttributesController extends BaseController {
    public constructor(
        @Inject private readonly consumptionServices: ConsumptionServices,
        @Inject private readonly transportServices: TransportServices
    ) {
        super();
    }

    @POST
    @Accept("application/json")
    public async createRepositoryAttribute(request: any): Promise<Return.NewResource<Envelope>> {
        const result = await this.consumptionServices.attributes.createRepositoryAttribute(request);
        return this.created(result);
    }

    @POST
    @Path("/:predecessorId/Succeed")
    @Accept("application/json")
    public async succeedAttribute(@PathParam("predecessorId") predecessorId: string, request: any): Promise<Return.NewResource<Envelope>> {
        const result = await this.consumptionServices.attributes.getAttribute({ id: predecessorId });
        if (result.isError) {
            throw RuntimeErrors.general.recordNotFoundWithMessage(`Predecessor attribute '${predecessorId}' not found.`);
        }

        const predecessor = result.value;

        if (predecessor.content["@type"] === "IdentityAttribute") {
            const result = await this.consumptionServices.attributes.succeedRepositoryAttribute({
                predecessorId: predecessorId,
                ...request
            });
            return this.created(result);
        }

        const successionResult = await this.consumptionServices.attributes.succeedRelationshipAttributeAndNotifyPeer({
            predecessorId: predecessorId,
            ...request
        });
        return this.created(successionResult);
    }

    @POST
    @Path("/:attributeId/NotifyPeer")
    @Accept("application/json")
    public async notifyPeerAboutRepositoryAttributeSuccession(@PathParam("attributeId") attributeId: string, request: any): Promise<Return.NewResource<Envelope>> {
        const result = await this.consumptionServices.attributes.notifyPeerAboutRepositoryAttributeSuccession({ attributeId: attributeId, peer: request.peer });
        return this.created(result);
    }

    @GET
    @Accept("application/json")
    public async getAttributes(@Context context: ServiceContext): Promise<Envelope> {
        const result = await this.consumptionServices.attributes.getAttributes({ query: context.request.query });
        return this.ok(result);
    }

    @GET
    @Path("/Own/Repository")
    @Accept("application/json")
    public async getOwnRepositoryAttributes(@Context context: ServiceContext, @QueryParam("onlyLatestVersions") onlyLatestVersions?: string): Promise<Envelope> {
        const query: Record<string, any> = this.extractQuery(context.request.query, ["onlyLatestVersions"]);
        const result = await this.consumptionServices.attributes.getRepositoryAttributes({
            onlyLatestVersions: this.stringToBoolean(onlyLatestVersions),
            query
        });
        return this.ok(result);
    }

    @GET
    @Path("/Own/Shared/Identity")
    @Accept("application/json")
    public async getOwnSharedIdentityAttributes(
        @Context context: ServiceContext,
        @QueryParam("peer") peer: string,
        @QueryParam("hideTechnical") hideTechnical?: string,
        @QueryParam("onlyLatestVersions") onlyLatestVersions?: string,
        @QueryParam("onlyValid") onlyValid?: string
    ): Promise<Envelope> {
        const query: Record<string, any> = this.extractQuery(context.request.query, ["peer", "hideTechnical", "onlyLatestVersions", "onlyValid"]);

        const result = await this.consumptionServices.attributes.getOwnSharedAttributes({
            peer,
            hideTechnical: this.stringToBoolean(hideTechnical),
            query,
            onlyLatestVersions: this.stringToBoolean(onlyLatestVersions),
            onlyValid: this.stringToBoolean(onlyValid)
        });
        return this.ok(result);
    }

    @GET
    @Path("/Peer/Shared/Identity")
    @Accept("application/json")
    public async getPeerSharedIdentityAttributes(
        @Context context: ServiceContext,
        @QueryParam("peer") peer: string,
        @QueryParam("hideTechnical") hideTechnical?: string,
        @QueryParam("onlyLatestVersions") onlyLatestVersions?: string,
        @QueryParam("onlyValid") onlyValid?: string
    ): Promise<Envelope> {
        const query: Record<string, any> = this.extractQuery(context.request.query, ["peer", "hideTechnical", "onlyLatestVersions", "onlyValid"]);

        const result = await this.consumptionServices.attributes.getPeerSharedAttributes({
            peer,
            hideTechnical: this.stringToBoolean(hideTechnical),
            query,
            onlyLatestVersions: this.stringToBoolean(onlyLatestVersions),
            onlyValid: this.stringToBoolean(onlyValid)
        });
        return this.ok(result);
    }

    @GET
    @Path("/:id/Versions")
    @Accept("application/json")
    public async getVersionsOfAttribute(@PathParam("id") attributeId: string): Promise<Envelope> {
        const result = await this.consumptionServices.attributes.getVersionsOfAttribute({
            attributeId
        });
        return this.ok(result);
    }

    @GET
    @Path("/:id/Versions/Shared")
    @Accept("application/json")
    public async getSharedVersionsOfAttribute(
        @PathParam("id") attributeId: string,
        @QueryParam("peers") peers?: string | string[],
        @QueryParam("onlyLatestVersions") onlyLatestVersions?: string
    ): Promise<Envelope> {
        if (typeof peers === "string") {
            peers = [peers];
        }

        const result = await this.consumptionServices.attributes.getSharedVersionsOfAttribute({
            attributeId,
            onlyLatestVersions: this.stringToBoolean(onlyLatestVersions),
            peers
        });
        return this.ok(result);
    }

    @GET
    @Path("/Valid")
    @Accept("application/json")
    public async getValidAttributes(@Context context: ServiceContext): Promise<Envelope> {
        const result = await this.consumptionServices.attributes.getAttributes({ query: context.request.query, onlyValid: true });
        return this.ok(result);
    }

    @POST
    @Path("/ExecuteIdentityAttributeQuery")
    @Accept("application/json")
    public async executeIdentityAttributeQuery(request: any): Promise<Envelope> {
        const result = await this.consumptionServices.attributes.executeIdentityAttributeQuery(request);
        return this.ok(result);
    }

    @POST
    @Path("/ExecuteRelationshipAttributeQuery")
    @Accept("application/json")
    public async executeRelationshipAttributeQuery(request: any): Promise<Envelope> {
        const result = await this.consumptionServices.attributes.executeRelationshipAttributeQuery(request);
        return this.ok(result);
    }

    @POST
    @Path("/ExecuteThirdPartyRelationshipAttributeQuery")
    @Accept("application/json")
    public async executeThirdPartyRelationshipAttributeQuery(request: any): Promise<Envelope> {
        const result = await this.consumptionServices.attributes.executeThirdPartyRelationshipAttributeQuery(request);
        return this.ok(result);
    }

    @POST
    @Path("/ExecuteIQLQuery")
    @Accept("application/json")
    public async executeIQLQuery(request: any): Promise<Envelope> {
        const result = await this.consumptionServices.attributes.executeIQLQuery(request);
        return this.ok(result);
    }

    @POST
    @Path("/ValidateIQLQuery")
    @Accept("application/json")
    public async validateIQLQuery(request: any): Promise<Envelope> {
        const result = await this.consumptionServices.attributes.validateIQLQuery(request);
        return this.ok(result);
    }

    @GET
    @Path("/:id")
    @Accept("application/json")
    public async getAttribute(@PathParam("id") id: string): Promise<Envelope> {
        const result = await this.consumptionServices.attributes.getAttribute({ id });
        return this.ok(result);
    }

    @DELETE
    @Path("/Own/Shared/:id")
    public async deleteOwnSharedAttributeAndNotifyPeer(@PathParam("id") attributeId: string): Promise<Envelope> {
        const result = await this.consumptionServices.attributes.deleteOwnSharedAttributeAndNotifyPeer({ attributeId });
        return this.ok(result);
    }

    @DELETE
    @Path("/Peer/Shared/:id")
    public async deletePeerSharedAttributeAndNotifyOwner(@PathParam("id") attributeId: string): Promise<Envelope> {
        const result = await this.consumptionServices.attributes.deletePeerSharedAttributeAndNotifyOwner({ attributeId });
        return this.ok(result);
    }

    @DELETE
    @Path("/ThirdParty/:id")
    public async deleteThirdPartyOwnedRelationshipAttributeAndNotifyPeer(@PathParam("id") attributeId: string): Promise<Envelope> {
        const result = await this.consumptionServices.attributes.deleteThirdPartyOwnedRelationshipAttributeAndNotifyPeer({ attributeId });
        return this.ok(result);
    }

    @DELETE
    @Path("/:id")
    public async deleteRepositoryAttribute(@PathParam("id") attributeId: string): Promise<void> {
        const result = await this.consumptionServices.attributes.deleteRepositoryAttribute({ attributeId });
        return this.noContent(result);
    }

    private stringToBoolean(value: string | undefined): boolean | undefined {
        if (value === undefined) {
            return undefined;
        }

        return value.toLowerCase() === "true";
    }

    private extractQuery(query: ServiceContext["request"]["query"], nonQueryParams: string[]): Record<string, any> {
        return Object.entries(query)
            .filter(([key, _]) => !nonQueryParams.includes(key))
            .reduce<Record<string, any>>((previous, [key, value]) => {
                previous[key] = value as string | string[];
                return previous;
            }, {});
    }
}
