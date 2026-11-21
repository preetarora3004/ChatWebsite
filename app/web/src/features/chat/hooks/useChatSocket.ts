import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";

import {
    ChatSocket,
    type SocketStatus,
} from "../services/chatSocket";

type UseChatSocketOptions = {
    url: string;

    enabled: boolean;

    onMessage: (
        data: unknown,
    ) => void;
};

export function useChatSocket({
    url,
    enabled,
    onMessage,
}: UseChatSocketOptions) {
    const socketRef = useRef<ChatSocket | null>(null);

    const messageHandlerRef = useRef(onMessage);

    const [status, setStatus] =
        useState<SocketStatus>("disconnected");

    useEffect(() => {
        messageHandlerRef.current = onMessage;
    }, [onMessage]);

    useEffect(() => {
        if (!enabled) {
            setStatus("disconnected");

            return;
        }

        const socket = new ChatSocket({
            url,

            onStatusChange: setStatus,

            onMessage: (data) => {
                messageHandlerRef.current(data);
            },
        });

        socketRef.current = socket;

        socket.connect();

        return () => {
            socket.disconnect();

            if (socketRef.current === socket) {
                socketRef.current = null;
            }
        };
    }, [url, enabled]);

    const send = useCallback(
        (data: unknown): boolean => {
            return socketRef.current?.send(data) ?? false;
        },
        [],
    );

    const disconnect = useCallback(() => {
        socketRef.current?.disconnect();
    }, []);

    return {
        status,
        send,
        disconnect,
    };
}
