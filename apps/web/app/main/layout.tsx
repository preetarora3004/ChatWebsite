import { WebSocketProvider } from "@repo/ui/websocketContext"

export default function mainLayout({
    children,
} : {
  children : React.ReactNode
}){
    return (
        <div className="main-layout">
            <WebSocketProvider>
                {children}
            </WebSocketProvider>
        </div>
    )
}