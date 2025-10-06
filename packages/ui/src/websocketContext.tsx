"use client";

import { createContext, useContext, useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";

type WSContextType = {
  socket: WebSocket | null;
  send: (type: string, payload: any) => void;
};

const WSContext = createContext<WSContextType | null>(null);

export const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();

  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [listeners, setListeners] = useState<((data: any) => void)[]>([]);

  const retryRef = useRef(0);
  const retryTimeout = useRef<NodeJS.Timeout | null>(null);

  const connect = () => {
    const token = session?.user?.token;
    if (!token) return;

    const ws = new WebSocket(`https://chat-app-sparkling-pond-3900.fly.dev/?token=${token}`);

    ws.onopen = () => {
      console.log("WebSocket connected");
      setSocket(ws);
      retryRef.current = 0;
      if (retryTimeout.current) {
        clearTimeout(retryTimeout.current);
        retryTimeout.current = null;
      }
    };

    ws.onclose = (e) => {
      console.warn("WebSocket closed", e.reason);
      attemptReconnect();
    };

    ws.onerror = (e) => {
      console.error("WebSocket error", e);
      ws.close(); 
    };
  };

  const attemptReconnect = () => {
    if (retryTimeout.current) return;

    retryRef.current += 1;
    const delay = Math.min(1000 * 2 ** retryRef.current, 30000); 

    retryTimeout.current = setTimeout(() => {
      retryTimeout.current = null;
      console.log(`🔄 Reconnecting... attempt ${retryRef.current}`);
      connect();
    }, delay);
  };

  useEffect(() => {
    if (!session?.user?.token) return;
    connect();

    return () => {
      if (retryTimeout.current) clearTimeout(retryTimeout.current);
      if (socket) socket.close();
    };

  }, [session?.user?.token]);

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (event: MessageEvent) => {
      let data;
      try {
        data = JSON.parse(event.data);
      } catch {
        console.error("Invalid WS message:", event.data);
        return;
      }

      // Notify all subscribers
      listeners.forEach((fn) => fn(data));
    };

    socket.addEventListener("message", handleMessage);
    return () => socket.removeEventListener("message", handleMessage);
  }, [socket, listeners]);

  const send = (event: string, payload: any) => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.warn("🚫 WebSocket not connected, dropping message", { event, payload });
      return;
    }
    socket.send(JSON.stringify({ event, payload }));
  };

  return (
    <WSContext.Provider value={{ socket, send }}>
      {children}
    </WSContext.Provider>
  );
};

export const useSocket = () => {
  const ctx = useContext(WSContext);
  if (!ctx) throw new Error("useSocket must be used inside WebSocketProvider");
  return ctx;
};
