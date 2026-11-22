import { ApiError } from "@workspace/http";
import type { AppEvent } from "../../shared/types/appEvents";
import { ErrorCode } from "@workspace/http";

export type eventHandler<T> = (payload: T) => void | Promise<void>;

export class EventBus<K extends keyof AppEvent> {
    private readonly listeners = new Map<K, Set<eventHandler<AppEvent[K]>>>();

    subscribe(event: K, callback: eventHandler<AppEvent[K]>): () => void {
        const handlers = this.listeners.get(event) ?? new Set();

        handlers.add(callback);
        this.listeners.set(event, handlers);

        return () => {
            handlers.delete(callback);

            if (handlers.size === 0) {
                this.listeners.delete(event);
            }
        };
    }

    async publish(event: K, payload: AppEvent[K]) {
        const handlers = this.listeners.get(event);

        if (!handlers || handlers.size === 0)
            throw new ApiError(
                "No handler is subscribed to this event",
                ErrorCode.NOT_FOUND.code,
                ErrorCode.NOT_FOUND.statusCode,
            );

        await Promise.all([...handlers].map((handler) => handler(payload)));
    }
}
