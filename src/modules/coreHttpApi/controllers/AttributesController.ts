import { ConsumptionServices } from "@nmshd/runtime";
import { Inject } from "typescript-ioc";
import { Accept, Context, Errors, GET, POST, Path, PathParam, Return, ServiceContext } from "typescript-rest";
import { Envelope } from "../../../infrastructure";
import { BaseController } from "../common/BaseController";

@Path("/api/v2/Attributes")
export class AttributesController extends BaseController {
    public constructor(@Inject private readonly consumptionServices: ConsumptionServices) {
        super();
    }

    @POST
    @Accept("application/json")
    public async createRepositoryAttribute(request: any): Promise<Return.NewResource<Envelope>> {
        /* We left 'owner' and '@type' optional in the openapi spec for
         * backwards compatibility. If set, they have to be removed here or the runtime
         * use case will throw an error. */
        // TODO: ???: Sollen .@type und .owner behalten werden?
        //            Wenn nicht, auch in openapi.yml löschen.
        if (typeof request?.content?.owner !== "undefined") delete request.content.owner;
        if (request?.content?.["@type"] === "IdentityAttribute") delete request.content["@type"];

        const result = await this.consumptionServices.attributes.createIdentityAttribute(request);
        return this.created(result); // TODO: ???: was does created() do?
    }

    @POST
    @Path("/:predecessorId/Succeed")
    @Accept("application/json")
    public async succeedAttribute(@PathParam("predecessorId") predecessorId: string, request: any): Promise<Return.NewResource<Envelope>> {
        const result = await this.consumptionServices.attributes.getAttribute({ id: predecessorId });
        if (result.isError) {
            throw new Errors.NotFoundError(`Predecessor attribute '${predecessorId}' not found.`);
        }
        const predecessor = result.value;

        if (predecessor.content["@type"] === "IdentityAttribute") {
            const result = await this.consumptionServices.attributes.succeedIdentityAttribute({
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
    public async notifyPeerAboutIdentityAttributeSuccession(@PathParam("attributeId") attributeId: string, request: any): Promise<Return.NewResource<Envelope>> {
        const result = await this.consumptionServices.attributes.notifyPeerAboutIdentityAttributeSuccession({ attributeId: attributeId, peer: request.peer });
        return this.created(result);
    }

    @GET
    @Accept("application/json")
    public async getAttributes(@Context context: ServiceContext): Promise<Envelope> {
        const result = await this.consumptionServices.attributes.getAttributes({ query: context.request.query });
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
}
