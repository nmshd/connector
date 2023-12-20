import { ConsumptionServices, TransportServices } from "@nmshd/runtime";
import { Inject } from "typescript-ioc";
import { Accept, Context, GET, POST, Path, PathParam, Return, ServiceContext } from "typescript-rest";
import { Envelope } from "../../../infrastructure";
import { BaseController } from "../common/BaseController";

@Path("/api/v2/Attributes")
export class AttributesController extends BaseController {
    public constructor(
        @Inject private readonly transportServices: TransportServices,
        @Inject private readonly consumptionServices: ConsumptionServices
    ) {
        super();
    }

    @POST
    @Accept("application/json")
    public async createAttribute(request: any): Promise<Return.NewResource<Envelope>> {
        /* We left 'owner' and '@type' optional in the openapi spec for
         * backwards compatibility. If set, they have to be removed here or the runtime
         * use case will throw an error. */
        if (typeof request.content.owner !== "undefined") delete request.content.owner;
        if (request.content["@type"] === "IdentityAttribute") delete request.content["@type"];

        const result = await this.consumptionServices.attributes.createIdentityAttribute(request);
        return this.created(result);
    }

    @POST
    @Path("/CreateIdentityAttribute")
    @Accept("application/json")
    public async createIdentityAttribute(request: any): Promise<Return.NewResource<Envelope>> {
        const result = await this.consumptionServices.attributes.createIdentityAttribute(request);
        return this.created(result);
    }

    @POST
    @Path("/CreateAndShareRelationshipAttribute")
    @Accept("application/json")
    public async createAndShareRelationshipAttribute(request: any): Promise<Return.NewResource<Envelope>> {
        const result = await this.consumptionServices.attributes.createAndShareRelationshipAttribute(request);
        return this.created(result);
    }

    @POST
    @Path("/SucceedIdentityAttribute")
    @Accept("application/json")
    public async succeedIdentityAttribute(request: any): Promise<Return.NewResource<Envelope>> {
        const result = await this.consumptionServices.attributes.succeedIdentityAttribute(request);
        return this.created(result);
    }

    // TODO: delete succeedAttribute?
    @POST
    @Path("/SucceedAttribute")
    @Accept("application/json")
    public async succeedAttribute(request: any): Promise<Return.NewResource<Envelope>> {
        const predecessorResult = await this.consumptionServices.attributes.getAttribute(request.predecessorId);
        const predecessor = predecessorResult.value;
        let result: any;
        if (predecessor["content"]["@type"] === "IdentityAttribute") {
            result = await this.consumptionServices.attributes.succeedIdentityAttribute(request);
        } else {
            result = await this.consumptionServices.attributes.succeedRelationshipAttributeAndNotifyPeer(request);
        }
        return this.created(result);
    }

    @POST
    @Path("/SucceedRelationshipAttributeAndNotifyPeer")
    @Accept("application/json")
    public async succeedRelationshipAttributeAndNotifyPeer(request: any): Promise<Return.NewResource<Envelope>> {
        const result = await this.consumptionServices.attributes.succeedRelationshipAttributeAndNotifyPeer(request);
        return this.created(result);
    }

    @POST
    @Path("/ShareIdentityAttribute")
    @Accept("application/json")
    public async shareIdentityAttribute(request: any): Promise<Return.NewResource<Envelope>> {
        const result = await this.consumptionServices.attributes.shareIdentityAttribute(request);
        return this.created(result);
    }

    @POST
    @Path("/NotifyPeerAboutIdentityAttributeSuccession")
    @Accept("application/json")
    public async notifyPeerAboutIdentityAttributeSuccession(request: any): Promise<Return.NewResource<Envelope>> {
        const result = await this.consumptionServices.attributes.notifyPeerAboutIdentityAttributeSuccession(request);
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
