import { LocalAttributeDTO } from "@nmshd/runtime-types";

export interface NotifyPeerAboutRepositoryAttributeSuccessionResponse {
    predecessor: LocalAttributeDTO;
    successor: LocalAttributeDTO;
    notificationId: string;
}
