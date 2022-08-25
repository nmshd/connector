import { CreateOutgoingRequestRequest } from "./CreateOutgoingRequestRequest";

export interface CanCreateOutgoingRequestRequest extends Omit<CreateOutgoingRequestRequest, "peer"> {
    peer?: string;
}
