export interface DecideRequest {
    items: (DecideRequestItem | DecideRequestItemGroup)[];
}

export interface DecideRequestItemGroup {
    items: DecideRequestItem[];
}

export declare type DecideRequestItem = AcceptRequestItem | RejectRequestItem;

export interface AcceptRequestItem {
    accept: true;
}

export interface RejectRequestItem {
    accept: false;
    code?: string;
    message?: string;
}
