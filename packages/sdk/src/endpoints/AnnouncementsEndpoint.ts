import { AnnouncementDTO } from "@nmshd/runtime-types";
import { ConnectorHttpResponse } from "../types";
import { GetAnnouncementsRequest } from "../types/announcements";
import { Endpoint } from "./Endpoint";

export class AnnouncementsEndpoint extends Endpoint {
    public async getAnnouncements(request: GetAnnouncementsRequest): Promise<ConnectorHttpResponse<AnnouncementDTO[]>> {
        return await this.get("/api/core/v1/Announcements", request);
    }
}
