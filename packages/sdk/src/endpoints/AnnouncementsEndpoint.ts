import { ConnectorHttpResponse } from "../types";
import { ConnectorAnnouncements, GetAnnouncementsRequest } from "../types/announcements";
import { Endpoint } from "./Endpoint";

export class AnnouncementsEndpoint extends Endpoint {
    public async getAnnouncements(request: GetAnnouncementsRequest): Promise<ConnectorHttpResponse<ConnectorAnnouncements>> {
        return await this.get("/api/v2/Announcements", request);
    }
}
