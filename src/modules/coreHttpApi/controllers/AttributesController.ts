import { ApplicationError } from "@js-soft/ts-utils";
import { ConsumptionServices, RuntimeErrors, TransportServices } from "@nmshd/runtime";
import { Inject } from "typescript-ioc";
import { Accept, GET, POST, Path, PathParam, QueryParam, Return } from "typescript-rest";
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
        const selfAddress = (await this.transportServices.account.getIdentityInfo()).value.address;
        if (request?.content?.owner && request?.content?.owner !== selfAddress) {
            throw new ApplicationError(
                "error.connector.attributes.cannotCreateNotSelfOwnedRepositoryAttribute",
                "You are not allowed to create an attribute that is not owned by yourself"
            );
        }
        /* We left 'owner' and '@type' optional in the openapi spec for
         * backwards compatibility. If set, they have to be removed here or the runtime
         * use case will throw an error. */
        if (typeof request?.content?.owner !== "undefined") delete request.content.owner;
        if (request?.content?.["@type"] === "IdentityAttribute") delete request.content["@type"];

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
    public async notifyPeerAboutIdentityAttributeSuccession(@PathParam("attributeId") attributeId: string, request: any): Promise<Return.NewResource<Envelope>> {
        const result = await this.consumptionServices.attributes.notifyPeerAboutRepositoryAttributeSuccession({ attributeId: attributeId, peer: request.peer });
        return this.created(result);
    }

    @GET
    @Accept("application/json")
    public async getAttributes(): Promise<Envelope> {
        const result = await this.consumptionServices.attributes.getAttributes({ query: this.context.request.query });
        return this.ok(result);
    }

    @GET
    @Path("/Own/Repository")
    @Accept("application/json")
    public async getOwnRepositoryAttributes(@QueryParam("onlyLatestVersions") onlyLatestVersions: string): Promise<Envelope> {
        const result = await this.consumptionServices.attributes.getRepositoryAttributes({
            onlyLatestVersions: onlyLatestVersions === "true"
        });
        return this.ok(result);
    }

    @GET
    @Path("/Own/Shared/Identity")
    @Accept("application/json")
    public async getOwnSharedIdentityAttributes(
        @QueryParam("peer") peer: string,
        @QueryParam("hideTechnical") hideTechnical: string,
        @QueryParam("onlyLatestVersions") onlyLatestVersions: string,
        @QueryParam("onlyValid") onlyValid: string
    ): Promise<Envelope> {
        const query: Record<string, any> = {};

        Object.entries(this.context.request.query).forEach(([key, value]) => {
            if (key.startsWith("query.")) {
                query[key.replace("query.", "")] = typeof value === "string" ? value : "";
            }
        });

        const result = await this.consumptionServices.attributes.getOwnSharedAttributes({
            peer,
            hideTechnical: hideTechnical.toLocaleLowerCase() === "true",
            query: query,
            onlyLatestVersions: onlyLatestVersions.toLocaleLowerCase() === "true",
            onlyValid: onlyValid === "true"
        });
        return this.ok(result);
    }

    @GET
    @Path("/Peer/Shared/Identity")
    @Accept("application/json")
    public async getPeerSharedIdentityAttributes(
        @QueryParam("peer") peer: string,
        @QueryParam("hideTechnical") hideTechnical: string,
        @QueryParam("onlyLatestVersions") onlyLatestVersions: string,
        @QueryParam("onlyValid") onlyValid: string
    ): Promise<Envelope> {
        const query: Record<string, any> = {};

        Object.entries(this.context.request.query).forEach(([key, value]) => {
            if (key.startsWith("query.")) {
                query[key.replace("query.", "")] = typeof value === "string" ? value : "";
            }
        });

        const result = await this.consumptionServices.attributes.getPeerSharedAttributes({
            peer,
            hideTechnical: hideTechnical.toLocaleLowerCase() === "true",
            query: query,
            onlyLatestVersions: onlyLatestVersions.toLocaleLowerCase() === "true",
            onlyValid: onlyValid.toLocaleLowerCase() === "true"
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
    public async getSharedVersionsOfRepositoryAttribute(
        @PathParam("id") attributeId: string,
        @QueryParam("peers") peers: string | string[] | undefined,
        @QueryParam("onlyLatestVersions") onlyLatestVersions?: string
    ): Promise<Envelope> {
        if (typeof peers === "string") {
            peers = [peers];
        }

        const result = await this.consumptionServices.attributes.getSharedVersionsOfRepositoryAttribute({
            attributeId,
            onlyLatestVersions: onlyLatestVersions ? onlyLatestVersions === "true" : undefined,
            peers
        });
        return this.ok(result);
    }

    @GET
    @Path("/Valid")
    @Accept("application/json")
    public async getValidAttributes(): Promise<Envelope> {
        const result = await this.consumptionServices.attributes.getAttributes({ query: this.context.request.query, onlyValid: true });
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
