import { LocalAttributeDTO } from "@nmshd/runtime-types";

export interface NotifyPeerAboutOwnIdentityAttributeSuccessionResponse {
    predecessor: LocalAttributeDTO;
    successor: LocalAttributeDTO;
    notificationId: string;
}
