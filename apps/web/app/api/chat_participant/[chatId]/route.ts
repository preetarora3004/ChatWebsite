import {client} from '@repo/db';
import { getServerSession } from 'next-auth';
import { authOption } from '@repo/utils';

export async function POST(req : Request , {params} : {params : {chatId : string}}){
    
    const body = await req.json();
    const {username} : {username : string} = body;
    const chatId = (await params).chatId;
    const session = await getServerSession(authOption);

    if(!session || !session?.user){ return Response.json({msg : "Unauthorized User"}, {status : 401})};

    try{
        const participant = await client.user.findUnique({
            where : {
                username : username
            }
        })

        if(!participant?.id) return Response.json({msg : "Unable to find user"}, {status : 400});

        const addParticipant = await client.chatParticipant.create({
            data : {
                userId : participant.id,
                chatId : chatId
            }
        })

        return Response.json({msg : "Participant Created",addParticipant});

    }
    catch(error){
        return Response.json({msg : "Unable to create chat", error}, {status : 400});
    }

}