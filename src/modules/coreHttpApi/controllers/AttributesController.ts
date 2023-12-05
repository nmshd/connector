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
    @Path("/IdentityAttribute")
    @Accept("application/json")
    public async createIdentityAttribute(request: any): Promise<Return.NewResource<Envelope>> {
        const result = await this.consumptionServices.attributes.createIdentityAttribute({ content: request });
        return this.created(result);
    }

    @POST
    @Path("/RelationshipAttribute")
    @Accept("application/json")
    public async createRelationshipAttribute(request: any): Promise<Return.NewResource<Envelope>> {
        const result = await this.consumptionServices.attributes.createAndShareRelationshipAttribute(request);
        return this.created(result);
    }

    @POST
    @Path("/succeedIdentityAttribute/:id")
    @Accept("application/json")
    public async succeedIdentityAttribute(@PathParam("id") id: string, content: any): Promise<Return.NewResource<Envelope>> {
        const result = await this.consumptionServices.attributes.succeedIdentityAttribute({ predecessorId: id, successorContent: content });
        return this.created(result);
    }

    @POST
    @Path("/succeedRelationshipAttribute/:id")
    @Accept("application/json")
    public async succeedRelationshipAttributeAndNotifyPeer(@PathParam("id") id: string, content: any): Promise<Return.NewResource<Envelope>> {
        const result = await this.consumptionServices.attributes.succeedRelationshipAttributeAndNotifyPeer({ predecessorId: id, successorContent: content });
        return this.created(result);
    }

    @POST
    @Path("/notifyPeerAboutIdentityAttributeSuccession")
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
