import { IConnectorInfrastructure } from "./ConnectorInfrastructure";
import { IHttpServer } from "./httpServer";

export interface IConnectorInfrastructureRegistry {
    readonly httpServer: IHttpServer;

    getByName<T extends IConnectorInfrastructure>(name: string): T;
    add(infrastructure: IConnectorInfrastructure): void;
}
