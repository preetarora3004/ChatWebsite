import { client } from "@repo/db";

export async function POST(req : Request){

    const body = await req.json();

    const {username,password} = body;

    const verification = await client.user.findFirst({
        where : {
            username : username
        }
    })
    
    console.log(`Here is the ${username}, ${password}`);

    if(verification){
        return Response.json({
            msg : "User Already Exist"
        }, {status : 400})
    }

    const user = await client.user.create({
        data : {
            username : body.username,
            hashedPassword : body.password
        }
    })

    return Response.json({msg : "User Created", user}, {status : 201})

}