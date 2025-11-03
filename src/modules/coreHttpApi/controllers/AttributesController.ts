import { BaseController, Envelope } from "@nmshd/connector-types";
import { ConsumptionServices, RuntimeErrors } from "@nmshd/runtime";
import { Inject } from "@nmshd/typescript-ioc";
import { Accept, Context, DELETE, GET, POST, PUT, Path, PathParam, QueryParam, Return, Security, ServiceContext } from "@nmshd/typescript-rest";

@Security("core:attributes")
@Path("/api/core/v1/Attributes")
export class AttributesController extends BaseController {
    public constructor(@Inject private readonly consumptionServices: ConsumptionServices) {
        super();
    }

    @PUT
    @Path("CanCreate")
    @Accept("application/json")
    public async canCreateOwnIdentityAttribute(request: any): Promise<Envelope> {
        const result = await this.consumptionServices.attributes.canCreateOwnIdentityAttribute(request);
        return this.ok(result);
    }

    @POST
    @Accept("application/json")
    public async createOwnIdentityAttribute(request: any): Promise<Return.NewResource<Envelope>> {
        const result = await this.consumptionServices.attributes.createOwnIdentityAttribute(request);
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
            const result = await this.consumptionServices.attributes.succeedOwnIdentityAttribute({
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
    @Path("/:id/NotifyPeer")
    @Accept("application/json")
    public async notifyPeerAboutOwnIdentityAttributeSuccession(@PathParam("id") attributeId: string, request: any): Promise<Return.NewResource<Envelope>> {
        const result = await this.consumptionServices.attributes.notifyPeerAboutOwnIdentityAttributeSuccession({ attributeId: attributeId, peer: request.peer });
        return this.created(result);
    }

    @GET
    @Accept("application/json")
    public async getAttributes(@Context context: ServiceContext): Promise<Envelope> {
        const result = await this.consumptionServices.attributes.getAttributes({ query: context.request.query });
        return this.ok(result);
    }

    @GET
    @Path("/Own/Identity")
    @Accept("application/json")
    public async getOwnIdentityAttributes(@Context context: ServiceContext, @QueryParam("onlyLatestVersions") onlyLatestVersions?: boolean): Promise<Envelope> {
        const query: Record<string, any> = this.extractQuery(context.request.query, ["onlyLatestVersions"]);
        const result = await this.consumptionServices.attributes.getOwnIdentityAttributes({ onlyLatestVersions, query });
        return this.ok(result);
    }

    @GET
    @Path("/Own/Shared/:peer")
    @Accept("application/json")
    public async getOwnAttributesSharedWithPeer(
        @Context context: ServiceContext,
        @PathParam("peer") peer: string,
        @QueryParam("onlyLatestVersions") onlyLatestVersions?: boolean,
        @QueryParam("hideTechnical") hideTechnical?: boolean
    ): Promise<Envelope> {
        const query: Record<string, any> = this.extractQuery(context.request.query, ["onlyLatestVersions", "hideTechnical"]);
        const result = await this.consumptionServices.attributes.getOwnAttributesSharedWithPeer({ peer, onlyLatestVersions, hideTechnical, query });
        return this.ok(result);
    }

    @GET
    @Path("/Peer/:peer")
    @Accept("application/json")
    public async getPeerAttributes(
        @Context context: ServiceContext,
        @PathParam("peer") peer: string,
        @QueryParam("onlyLatestVersions") onlyLatestVersions?: boolean,
        @QueryParam("hideTechnical") hideTechnical?: boolean
    ): Promise<Envelope> {
        const query: Record<string, any> = this.extractQuery(context.request.query, ["onlyLatestVersions", "hideTechnical"]);
        const result = await this.consumptionServices.attributes.getPeerAttributes({ peer, onlyLatestVersions, hideTechnical, query });
        return this.ok(result);
    }

    @GET
    @Path("/:id/ForwardingDetails")
    @Accept("application/json")
    public async getForwardingDetailsForAttribute(@Context context: ServiceContext, @PathParam("id") attributeId: string): Promise<Envelope> {
        const result = await this.consumptionServices.attributes.getForwardingDetailsForAttribute({ attributeId, query: context.request.query });
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
    public async getVersionsOfAttributeSharedWithPeer(
        @PathParam("id") attributeId: string,
        @QueryParam("peer") peer: string,
        @QueryParam("onlyLatestVersions") onlyLatestVersions?: boolean
    ): Promise<Envelope> {
        const result = await this.consumptionServices.attributes.getVersionsOfAttributeSharedWithPeer({ attributeId, onlyLatestVersions, peer });
        return this.ok(result);
    }

    @GET
    @Path("/TagCollection")
    @Accept("application/json")
    public async getAttributeTagCollection(): Promise<Envelope> {
        const result = await this.consumptionServices.attributes.getAttributeTagCollection();
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
    @Path(":id")
    public async deleteAttributeAndNotify(@PathParam("id") attributeId: string): Promise<Envelope> {
        const result = await this.consumptionServices.attributes.deleteAttributeAndNotify({ attributeId });
        return this.ok(result);
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
