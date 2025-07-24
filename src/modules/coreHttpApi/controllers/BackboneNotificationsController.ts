import { BaseController, HttpServerRole } from "@nmshd/connector-types";
import { TransportServices } from "@nmshd/runtime";
import { Inject } from "@nmshd/typescript-ioc";
import { Accept, Path, POST, Security } from "@nmshd/typescript-rest";

@Security([HttpServerRole.ADMIN, "core:*", "core:backboneNotifications"])
@Path("/api/v2/BackboneNotifications")
export class BackboneNotificationsController extends BaseController {
    public constructor(@Inject private readonly transportServices: TransportServices) {
        super();
    }

    @POST
    @Accept("application/json")
    public async sendBackboneNotification(payload: any): Promise<void> {
        const result = await this.transportServices.backboneNotifications.sendBackboneNotification(payload);
        return this.noContent(result);
    }
}
