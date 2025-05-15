import { BaseController, Envelope } from "@nmshd/connector-types";
import { TransportServices } from "@nmshd/runtime";
import { Inject } from "@nmshd/typescript-ioc";
import { Accept, Context, GET, Path, ServiceContext } from "@nmshd/typescript-rest";

@Path("/api/v2/Announcements")
export class AnnouncementsController extends BaseController {
    public constructor(@Inject private readonly transportServices: TransportServices) {
        super();
    }

    @GET
    @Accept("application/json")
    public async getAnnouncements(@Context context: ServiceContext): Promise<Envelope> {
        const result = await this.transportServices.announcements.getAnnouncements(context.request.query as any);
        return this.ok(result);
    }
}
