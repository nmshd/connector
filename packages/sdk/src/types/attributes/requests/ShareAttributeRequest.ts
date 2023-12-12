import { NotifyPeerAboutIdentityAttributeSuccessionRequest } from "./NotifyPeerAboutIdentityAttributeSuccessionRequest";
import { ShareIdentityAttributeRequest } from "./ShareIdentityAttributeRequest";

export type ShareAttributeRequest = (ShareIdentityAttributeRequest & { "@type": "Share" }) | (NotifyPeerAboutIdentityAttributeSuccessionRequest & { "@type": "Notify" });
