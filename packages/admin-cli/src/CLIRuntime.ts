import { IDatabaseConnection } from "@js-soft/docdb-access-abstractions";
import { ApplicationError } from "@js-soft/ts-utils";
import { ConsumptionController } from "@nmshd/consumption";
import { ConsumptionServices, DataViewExpander, Runtime, RuntimeHealth, RuntimeServices, TransportServices } from "@nmshd/runtime";
import { AccountController, CoreErrors as TransportCoreErrors } from "@nmshd/transport";
import { BaseCommand } from "./BaseCommand";
import { ConnectorRuntimeConfig } from "./connector";

export class CLIRuntime extends Runtime<ConnectorRuntimeConfig> {
    private _transportServices: TransportServices;
    private _consumptionServices: ConsumptionServices;
    private _dataViewExpander: DataViewExpander;
    private accountController: AccountController;

    public getServices(): RuntimeServices {
        return {
            transportServices: this._transportServices,
            consumptionServices: this._consumptionServices,
            dataViewExpander: this._dataViewExpander
        };
    }
    protected createDatabaseConnection(): Promise<IDatabaseConnection> {
        return BaseCommand.createDBConnection(this.runtimeConfig);
    }
    protected async initAccount(): Promise<void> {
        const db = await this.transport.createDatabase(`${this.runtimeConfig.database.dbNamePrefix}${this.runtimeConfig.database.dbName}`);

        this.accountController = await new AccountController(this.transport, db, this.transport.config).init().catch((e) => {
            if (e instanceof ApplicationError && e.code === "error.transport.general.platformClientInvalid") {
                this.logger.error(TransportCoreErrors.general.platformClientInvalid().message);
                process.exit(1);
            }

            throw e;
        });
        const consumptionController = await new ConsumptionController(this.transport, this.accountController).init();

        await this.checkDeviceCredentials(this.accountController);

        ({
            transportServices: this._transportServices,
            consumptionServices: this._consumptionServices,
            dataViewExpander: this._dataViewExpander
        } = await this.login(this.accountController, consumptionController));
    }

    private async checkDeviceCredentials(accountController: AccountController) {
        try {
            await accountController.authenticator.getToken();
        } catch (e) {
            if (e instanceof ApplicationError && e.code === "error.transport.request.noAuthGrant") {
                this.logger.error(TransportCoreErrors.general.platformClientInvalid().message);
                process.exit(1);
            }
        }
    }

    public getHealth(): Promise<RuntimeHealth> {
        return Promise.resolve({
            isHealthy: true,
            services: {
                transport: "healthy"
            }
        });
    }

    protected loadModule(): Promise<void> {
        return Promise.resolve();
    }
    public async stop(): Promise<void> {
        await super.stop();
    }
}
