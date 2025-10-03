import {client} from '@repo/db'
import { getServerSession } from 'next-auth'
import { authOption } from '@repo/utils'

export async function GET(req : Request, {params} : {params : {userId : string}}){

    const session = await getServerSession(authOption);
    const id = (await params).userId

    console.log("Here", id);

    if(!session || !session.user) return Response.json({msg : "Not able to find"}, {status : 400});

    try{
        const lastSeen = await client.lastSeen.findFirst({
            where : {
                userId : id,
            },
            orderBy : {id : "desc"}
        })

        console.log(lastSeen);

        if(!lastSeen){
            return Response.json({msg : "User not present"}, {status : 411});
        }

        return Response.json(lastSeen);
    }
    catch(e){
        return Response.json({msg : "Unable to find"}, {status : 400});
    }

}