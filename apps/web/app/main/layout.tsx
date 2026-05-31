import { WebSocketProvider } from "@repo/ui/websocketContext";
import { Chat } from "../../compoenents/list";
import { getServerSession } from "next-auth";
import { authOption } from "@repo/utils/src/authOption";
import { chats } from "@repo/utils/src/service";

export default async function mainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOption);

    if (!session || !session.user.id) return;
    const list = await chats(session.user.id);

    return (
        <div className="main-layout">
            <WebSocketProvider>
                <div className="w-screen h-screen fixed inset-0 flex justify-center items-center bg-background text-foreground">
                    <div className="w-screen h-screen overflow-hidden flex flex-col md:flex-row">
                        <Chat list={list} />
                        {children}
                    </div>
                </div>
            </WebSocketProvider>
        </div>
    );
}
