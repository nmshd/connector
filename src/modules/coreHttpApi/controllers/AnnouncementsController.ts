import { BaseController, Envelope, HttpServerRole } from "@nmshd/connector-types";
import { AnnouncementDTO, TransportServices } from "@nmshd/runtime";
import { Inject } from "@nmshd/typescript-ioc";
import { Accept, GET, Path, QueryParam, Security } from "@nmshd/typescript-rest";

@Security([HttpServerRole.ADMIN, "core:*", "core:announcements"])
@Path("/api/v2/Announcements")
export class AnnouncementsController extends BaseController {
    public constructor(@Inject private readonly transportServices: TransportServices) {
        super();
    }

    @GET
    @Accept("application/json")
    public async getAnnouncements(@QueryParam("language") language: string): Promise<Envelope<AnnouncementDTO[]>> {
        const result = await this.transportServices.announcements.getAnnouncements({ language: language as any });
        return this.ok(result);
    }
}
