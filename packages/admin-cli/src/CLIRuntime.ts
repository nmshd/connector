import { IDatabaseConnection } from "@js-soft/docdb-access-abstractions";
import { ConsumptionServices, DataViewExpander, ModuleConfiguration, Runtime, RuntimeHealth, RuntimeServices, TransportServices } from "@nmshd/runtime";
import { BaseCommand } from "./BaseCommand";
import { ConnectorRuntimeConfig } from "./connector";

export class CLIRuntime extends Runtime<ConnectorRuntimeConfig> {
    private readonly _transportServices: TransportServices;
    private readonly _consumptionServices: ConsumptionServices;
    private readonly _dataViewExpander: DataViewExpander;
    private readonly connectorConfig: ConnectorRuntimeConfig;
    private getServices(): RuntimeServices {
        return {
            transportServices: this._transportServices,
            consumptionServices: this._consumptionServices,
            dataViewExpander: this._dataViewExpander
        };
    }
    protected createDatabaseConnection(): Promise<IDatabaseConnection> {
        return BaseCommand.createDBConnection(this.connectorConfig);
    }
    protected initAccount(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    getHealth(): Promise<RuntimeHealth> {
        throw new Error("Method not implemented.");
    }
    protected loadModule(moduleConfiguration: ModuleConfiguration): Promise<void> {
        throw new Error("Method not implemented.");
    }
}
