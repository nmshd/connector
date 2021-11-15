import { MongoDbConnection } from "@js-soft/docdb-access-mongo";
import { ILogger } from "@js-soft/logging-abstractions";
import { RuntimeHealth } from "@nmshd/runtime";
import { Authenticator } from "@nmshd/transport/dist/core/backbone/Authenticator";
import { AxiosInstance } from "axios";

export class HealthChecker {
    private constructor(
        private readonly dbConnection: MongoDbConnection,
        private readonly axiosInstance: AxiosInstance,
        private readonly authenticator: Authenticator,
        private readonly logger: ILogger
    ) {}

    public static create(dbConnection: MongoDbConnection, axiosInstance: AxiosInstance, authenticator: Authenticator, logger: ILogger): HealthChecker {
        const healthCheck = new HealthChecker(dbConnection, axiosInstance, authenticator, logger);

        return healthCheck;
    }

    private async checkBackboneConnection(): Promise<boolean> {
        try {
            await this.axiosInstance.get("/.well-known/openid-configuration");
            return true;
        } catch (e) {
            this.logger.warn("An error occured during the backbone connection health check: ", e);
            return false;
        }
    }

    private async checkBackboneAuthentication() {
        const authenticatorClone = Object.assign(Object.create(Object.getPrototypeOf(this.authenticator)), this.authenticator) as Authenticator;

        try {
            authenticatorClone.clear();
            await authenticatorClone.getToken();
            return true;
        } catch (e) {
            return false;
        }
    }

    private async checkDatabaseConnection(): Promise<boolean> {
        try {
            await this.dbConnection.connect();
            return true;
        } catch (e) {
            return false;
        } finally {
            await this.dbConnection.close();
        }
    }

    private boolToHealth(value: boolean) {
        return value ? "healthy" : "unhealthy";
    }

    public async getReport(): Promise<RuntimeHealth> {
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
}
