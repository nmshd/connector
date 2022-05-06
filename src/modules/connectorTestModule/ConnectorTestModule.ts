import { type } from "@js-soft/ts-serval";
import { ConsumptionController, GenericRequestItemProcessor, RequestItemProcessorRegistry } from "@nmshd/consumption";
import { IRequestItem, RequestItem } from "@nmshd/content";
import { ConnectorRuntimeModule } from "../../ConnectorRuntimeModule";

export interface ITestRequestItem extends IRequestItem {}

@type("TestRequestItem")
export class TestRequestItem extends RequestItem implements ITestRequestItem {
    public static from(value: ITestRequestItem): TestRequestItem {
        return this.fromAny(value);
    }
}

export default class ConnectorTestModule extends ConnectorRuntimeModule {
    public init(): void {
        // noop
    }

    public start(): void {
        const consumptionController = this.runtime["_consumptionController"] as ConsumptionController;
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        const processorRegistry = consumptionController.outgoingRequests["processorRegistry"] as RequestItemProcessorRegistry;
        processorRegistry.registerProcessor(GenericRequestItemProcessor, TestRequestItem);
    }

    public stop(): void {
        // noop
    }
}
