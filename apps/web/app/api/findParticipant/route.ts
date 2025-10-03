import { client } from '@repo/db'
import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOption } from '@repo/utils';

export async function GET(req: NextRequest) {
    const userId = req.headers.get('userId'); 
    const session = await getServerSession(authOption);

    if (!session?.user?.id) {
        return Response.json({ msg: "Unauthorized" }, { status: 401 });
    }

    if (!userId) {
        return Response.json({ msg: "Missing userId in headers" }, { status: 400 });
    }

    try {
        
        const chat = await client.chat.findFirst({
            where: {
                participants: {
                    some: { userId: session.user.id }
                },
                AND: {
                    participants: {
                        some: { userId: userId }
                    }
                }
            },
            include: {
                participants: true
            }
        });

        if (chat) {
            return Response.json(chat.participants);
        } else {
            return Response.json({ msg: "No chat found" }, { status: 404 });
        }
    } catch (e) {
        console.error(e);
        return Response.json({ msg: "Unable to fetch user" }, { status: 500 });
    }
}