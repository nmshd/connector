export interface DecideRequest {
    items: (DecideRequestItem | DecideRequestItemGroup)[];
}

export interface DecideRequestItemGroup {
    items: DecideRequestItem[];
}

export type DecideRequestItem = AcceptRequestItem | RejectRequestItem;

export interface AcceptRequestItem {
    accept: true;
    [key: string]: any;
}

export interface RejectRequestItem {
    accept: false;
    code?: string;
    message?: string;
}
