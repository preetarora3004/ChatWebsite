import { client } from "@repo/db"
import { getServerSession } from "next-auth";
import { authOption } from "@repo/utils";

export async function POST(req: Request, { params }: { params: { chatId: string } }) {

    const session = await getServerSession(authOption);

    if (!session || !session.user) return Response.json({ msg: "Invalid User" }, { status: 400 })

    const body = await req.json();
    const { content }: { content: string } = body;
    const id = (await params).chatId;

    try {

        const sender = await client.user.findFirst({
            where: {
                username: session.user.username
            }
        })

        if (!sender) return Response.json({ msg: "Unauthorized User" }, { status: 401 })

        const message = await client.message.create({
            data: {
                content: content,
                chatId: id,
                senderId: sender.id
            }
        })

        return Response.json(message);
    }
    catch (error) {
        return Response.json({ msg: `Unable to send message ${error}` }, { status: 400 });
    }
}

export async function GET(req : Request, { params }: { params: { chatId: string } }) {

    const session = await getServerSession(authOption);
    const id = (await params).chatId;

    if (!session || !session.user || !id) { return Response.json({ msg: "Unauthorized User" }, { status: 401 }) }

    try {
        const messages = await client.message.findMany({
            where: {
                chatId: id
            },
            orderBy: { createdAt: "desc" },
            take: 50
        })

        return Response.json(messages);
    } catch (err) {
        return Response.json({ msg: `Unable to find chat ${err}` }, { status: 400 });
    }

}
