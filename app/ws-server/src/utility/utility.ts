import { userMap } from "../repository/repository";
import type { WebSocketEventMap } from "../types/types";

export function returnParams<const K extends readonly string[]>(
    url: string,
    base: string,
    ...args: K
): { [I in keyof K]: string | null } {
    const params = new URL(url, base).searchParams;

    return args.map((key) => params.get(key)) as {
        [I in keyof K]: string | null;
    };
}

export function notify<K extends keyof WebSocketEventMap>(
    event: K,
    payload: WebSocketEventMap[K],
) {
    const message = JSON.stringify(payload);

    switch (event) {
        case "presence":
            userMap.forEach((value) => {
                value.ws.send(message);
            });
            break;

        case "typing":
    }
}
