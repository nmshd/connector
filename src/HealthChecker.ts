import { MongoDbConnection } from "@js-soft/docdb-access-mongo";
import { ILogger } from "@js-soft/logging-abstractions";
import { CoreDate } from "@nmshd/core-types";
import { RuntimeHealth } from "@nmshd/runtime";
import { AbstractAuthenticator } from "@nmshd/transport";
import { AxiosInstance } from "axios";

export class HealthChecker {
    private constructor(
        private readonly dbConnection: MongoDbConnection | undefined,
        private readonly axiosInstance: AxiosInstance,
        private readonly authenticator: AbstractAuthenticator,
        private readonly logger: ILogger
    ) {}

    public static create(dbConnection: MongoDbConnection | undefined, axiosInstance: AxiosInstance, authenticator: AbstractAuthenticator, logger: ILogger): HealthChecker {
        const healthCheck = new HealthChecker(dbConnection, axiosInstance, authenticator, logger);

        return healthCheck;
    }

    private reportPromise?: Promise<RuntimeHealth>;
    public async getReport(): Promise<RuntimeHealth> {
        if (this.reportPromise) return await this.reportPromise;

        this.reportPromise = this._getReport();
        const result = await this.reportPromise;

        this.reportPromise = undefined;
        return result;
    }

    private async _getReport(): Promise<RuntimeHealth> {
        const database = await this.checkDatabaseConnection();
        const backboneConnection = await this.checkBackboneConnection();
        const backboneAuthentication = await this.checkBackboneAuthentication();

        return {
            isHealthy: database && backboneConnection && backboneAuthentication,
            services: {
                database: this.boolToHealth(database),
                backboneConnection: this.boolToHealth(backboneConnection),
                backboneAuthentication: this.boolToHealth(backboneAuthentication)
            }
        };
    }

    private async checkBackboneConnection(): Promise<boolean> {
        try {
            await this.axiosInstance.get("/health");
            return true;
        } catch (e) {
            this.logger.warn("An error occured during the Backbone connection health check: ", e);
            return false;
        }
    }

    private isAuthenticatedUntil?: CoreDate;
    private async checkBackboneAuthentication() {
        if (this.isAuthenticatedUntil?.isAfter(CoreDate.utc())) return true;

        const authenticatorClone = Object.assign(Object.create(Object.getPrototypeOf(this.authenticator)), this.authenticator) as AbstractAuthenticator;

        try {
            authenticatorClone.clear();
            await authenticatorClone.getToken();
            this.isAuthenticatedUntil = CoreDate.utc().add({ minutes: 5 });
            return true;
        } catch (_) {
            return false;
        }
    }

    private async checkDatabaseConnection(): Promise<boolean> {
        if (!this.dbConnection) return true;

        try {
            await this.dbConnection.connect();
            return true;
        } catch (_) {
            return false;
        } finally {
            await this.dbConnection.close();
        }
    }

    private boolToHealth(value: boolean) {
        return value ? "healthy" : "unhealthy";
    }
}
