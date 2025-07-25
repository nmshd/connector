import { ConnectorHttpResponse } from "../types";
import { Endpoint } from "./Endpoint";

export class BackboneNotificationsEndpoint extends Endpoint {
    public async sendBackboneNotification(request: { recipients: string[]; code: string }): Promise<ConnectorHttpResponse<void>> {
        return await this.post("/api/v2/BackboneNotifications", request, 204);
    }
}
