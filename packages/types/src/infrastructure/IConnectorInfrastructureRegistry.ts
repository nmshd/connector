import { ConnectorInfrastructure } from "./ConnectorInfrastructure";
import { IHttpServer } from "./httpServer";

export interface IConnectorInfrastructureRegistry {
    readonly httpServer: IHttpServer;

    getByName<T extends ConnectorInfrastructure>(name: string): T;
    add(infrastructure: ConnectorInfrastructure): void;
}
