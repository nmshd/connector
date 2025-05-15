import { BaseController, Envelope } from "@nmshd/connector-types";
import { LanguageISO639 } from "@nmshd/core-types";
import { TransportServices } from "@nmshd/runtime";
import { Inject } from "@nmshd/typescript-ioc";
import { Accept, GET, Path, QueryParam } from "@nmshd/typescript-rest";

@Path("/api/v2/Announcements")
export class AnnouncementsController extends BaseController {
    public constructor(@Inject private readonly transportServices: TransportServices) {
        super();
    }

    @GET
    @Accept("application/json")
    public async getAnnouncements(@QueryParam("language") language: LanguageISO639): Promise<Envelope> {
        const result = await this.transportServices.announcements.getAnnouncements({ language: language });
        return this.ok(result);
    }
}
