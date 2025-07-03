import { LocalAttributeDTO } from "@nmshd/runtime-types";

export interface SucceedAttributeResponse {
    predecessor: LocalAttributeDTO;
    successor: LocalAttributeDTO;
}
