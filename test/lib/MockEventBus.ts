import { Event, EventEmitter2EventBus, getEventNamespaceFromObject } from "@js-soft/ts-utils";
import { waitForEvent } from "./testUtils";

export class MockEventBus extends EventEmitter2EventBus {
    public publishedEvents: Event[] = [];

    private publishPromises: Promise<any>[] = [];

    public constructor() {
        super((e) => console.log(e)); // eslint-disable-line no-console
    }

    public override publish(event: Event): void {
        this.publishedEvents.push(event);

        const namespace = getEventNamespaceFromObject(event);

        if (!namespace) {
            throw Error("The event needs a namespace. Use the EventNamespace-decorator in order to define a namespace for a event.");
        }

        this.publishPromises.push(this.emitter.emitAsync(namespace, event));
    }

    public async waitForEvent<TEvent extends Event>(subscriptionTarget: string, predicate?: (event: TEvent) => boolean): Promise<TEvent> {
        const alreadyTriggeredEvents = this.publishedEvents.find((e) => e.namespace === subscriptionTarget && (!predicate || predicate(e as TEvent))) as TEvent | undefined;
        if (alreadyTriggeredEvents) {
            return alreadyTriggeredEvents;
        }

        const event = await waitForEvent(this, subscriptionTarget, predicate);
        return event;
    }

    public async waitForRunningEventHandlers(): Promise<void> {
        await Promise.all(this.publishPromises);
    }

    public reset(): void {
        this.publishedEvents = [];
        this.publishPromises = [];
    }
}
