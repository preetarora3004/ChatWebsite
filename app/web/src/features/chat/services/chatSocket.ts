export type SocketStatus =
    | "connecting"
    | "connected"
    | "disconnected";

export type SocketOptions = {
    url: string;

    onStatusChange: (
        status: SocketStatus,
    ) => void;

    onMessage: (
        data: unknown,
    ) => void;
};

export class ChatSocket {
    private socket: WebSocket | null = null;

    private reconnectTimer: ReturnType<typeof setTimeout> | null = null;

    private reconnectAttempts = 0;

    private manuallyClosed = false;

    private readonly baseReconnectDelay = 1000;

    private readonly maxReconnectDelay = 30_000;

    constructor(
        private readonly options: SocketOptions,
    ) {}

    connect(): void {
        if (this.manuallyClosed) {
            return;
        }

        if (
            this.socket?.readyState === WebSocket.OPEN ||
            this.socket?.readyState === WebSocket.CONNECTING
        ) {
            return;
        }

        this.clearReconnectTimer();

        this.options.onStatusChange("connecting");

        const socket = new WebSocket(this.options.url);

        this.socket = socket;

        socket.onopen = () => {
            if (
                this.socket !== socket ||
                this.manuallyClosed
            ) {
                return;
            }

            this.reconnectAttempts = 0;

            this.options.onStatusChange("connected");

            console.log("WebSocket connected");
        };

        socket.onmessage = (
            event: MessageEvent<string>,
        ) => {
            if (this.socket !== socket) {
                return;
            }

            if (event.data === "ping") {
                return;
            }

            try {
                const data: unknown = JSON.parse(event.data);

                this.options.onMessage(data);
            } catch (error) {
                console.error(
                    "Invalid WebSocket message:",
                    error,
                );
            }
        };

        socket.onerror = (error) => {
            console.error(
                "WebSocket error:",
                error,
            );

            if (
                this.socket === socket &&
                socket.readyState !== WebSocket.CLOSED
            ) {
                socket.close();
            }
        };

        socket.onclose = () => {
            if (this.socket !== socket) {
                return;
            }

            this.socket = null;

            this.options.onStatusChange("disconnected");

            if (!this.manuallyClosed) {
                this.scheduleReconnect();
            }
        };
    }

    send(data: unknown): boolean {
        if (
            this.socket?.readyState !== WebSocket.OPEN
        ) {
            return false;
        }

        try {
            this.socket.send(
                JSON.stringify(data),
            );

            return true;
        } catch (error) {
            console.error(
                "WebSocket send failed:",
                error,
            );

            return false;
        }
    }

    private scheduleReconnect(): void {
        if (
            this.manuallyClosed ||
            this.reconnectTimer
        ) {
            return;
        }

        const exponentialDelay = Math.min(
            this.baseReconnectDelay *
                2 ** this.reconnectAttempts,
            this.maxReconnectDelay,
        );

        const jitter = Math.random() * 1000;

        const delay = exponentialDelay + jitter;

        this.reconnectAttempts++;

        console.log(
            `Reconnecting in ${Math.round(delay)}ms`,
        );

        this.reconnectTimer = setTimeout(() => {
            this.reconnectTimer = null;

            this.connect();
        }, delay);
    }

    private clearReconnectTimer(): void {
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);

            this.reconnectTimer = null;
        }
    }

    disconnect(): void {
        this.manuallyClosed = true;

        this.clearReconnectTimer();

        const socket = this.socket;

        this.socket = null;

        if (
            socket &&
            socket.readyState !== WebSocket.CLOSED
        ) {
            socket.close(
                1000,
                "Client disconnected",
            );
        }

        this.options.onStatusChange("disconnected");
    }
}
