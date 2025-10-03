import {client} from '@repo/db'
import {authOption} from '@repo/utils'
import { getServerSession } from 'next-auth'

export async function POST(req : Request){

    const session = await getServerSession(authOption);
    if(!session || !session.user) return Response.json({msg : "User unauthorized"}, {status : 411});


    const body = await req.json().catch(()=> ({}));
    const name : string | undefined = body?.name;

    try{
        const chat = await client.chat.create({
            data : {
                ...(name ?  {name} : {})
            }
        })

        return Response.json({chat});
    }
    catch(error){
        return Response.json({msg : "Unable to create chat"}, {status : 400});
    }
}