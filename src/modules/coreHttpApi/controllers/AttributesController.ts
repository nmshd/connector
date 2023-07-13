import { Result } from "@js-soft/ts-utils";
import { validate as validateIQL } from "@nmshd/iql";
import { ConsumptionServices, TransportServices } from "@nmshd/runtime";
import { Inject } from "typescript-ioc";
import { Accept, Context, GET, POST, Path, PathParam, Return, ServiceContext } from "typescript-rest";
import { Envelope } from "../../../infrastructure";
import { BaseController } from "../common/BaseController";

@Path("/api/v2/Attributes")
export class AttributesController extends BaseController {
    public constructor(@Inject private readonly transportServices: TransportServices, @Inject private readonly consumptionServices: ConsumptionServices) {
        super();
    }

    @POST
    @Accept("application/json")
    public async createAttribute(request: any): Promise<Return.NewResource<Envelope>> {
        const selfAddress = (await this.transportServices.account.getIdentityInfo()).value.address;
        if (request?.content?.owner !== selfAddress) throw new Error("You are not allowed to create an attribute that is not owned by yourself");

        const result = await this.consumptionServices.attributes.createAttribute(request);
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
        return this.ok(await this.consumptionServices.attributes.executeIQLQuery({ query: { queryString: request.query.queryString } }));
    }

    @POST
    @Path("/ValidateIQLQuery")
    @Accept("application/json")
    public validateIQLQuery(request: any): Envelope {
        const result = validateIQL(request.query.queryString);
        // ???: @jonas: What's the point of the 'Result' wrapper here?
        //              Why not just return this.ok(result)?
        return this.ok(Result.ok(result));
    }

    @GET
    @Path("/:id")
    @Accept("application/json")
    public async getAttribute(@PathParam("id") id: string): Promise<Envelope> {
        const result = await this.consumptionServices.attributes.getAttribute({ id });
        return this.ok(result);
    }
}
