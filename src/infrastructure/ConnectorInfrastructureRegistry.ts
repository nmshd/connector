import { ConnectorInfrastructure, DocumentationLink, IConnectorInfrastructure, IConnectorInfrastructureRegistry } from "@nmshd/connector-types";
import { HttpServer } from "./httpServer";

export class ConnectorInfrastructureRegistry implements IConnectorInfrastructureRegistry {
    private readonly infrastructure: Record<string, IConnectorInfrastructure | undefined> = {};

    public get httpServer(): HttpServer {
        const httpServer = this.getByName<HttpServer>("httpServer");
        return httpServer;
    }

    public getByName<T extends IConnectorInfrastructure>(name: string): T {
        const infrastructure = this.infrastructure[name.toLowerCase()];
        if (!infrastructure) {
            const docLink = DocumentationLink.operate__configuration(name);
            throw new Error(`The infrastructure '${name}' is not available. Visit the docs '${docLink}'' to learn how to enable it.`);
        }

        return infrastructure as T;
    }

    public add(infrastructure: ConnectorInfrastructure): void {
        if (this.infrastructure[infrastructure.name.toLowerCase()]) {
            throw new Error(`The infrastructure '${infrastructure.name}' is already registered.`);
        }

        this.infrastructure[infrastructure.name.toLowerCase()] = infrastructure;
    }

    public [Symbol.iterator](): IterableIterator<ConnectorInfrastructure> {
        return (Object.values(this.infrastructure) as ConnectorInfrastructure[])[Symbol.iterator]();
    }
}
