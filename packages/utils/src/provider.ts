import CredentialsProvider from "next-auth/providers/credentials";
import { client } from "@repo/db";
import jwt from 'jsonwebtoken';

export const providers = [

    CredentialsProvider({
        id : "credentials",
        name : "Credentials",

        credentials : {
            username :  {label : "Username", type : "text", placeholder : "@gmail.com"},
            password : {label : "Password", type : "password", placeholder : "****"}
        },

        async authorize(credentials : Record<string,string> | undefined){
            
            const {username, password} = credentials ?? {};

            if(!username || !password) return null;

            const user = await client.user.findUnique({
                where : {
                    username : username,
                }
            });

            if(!user || password !== user?.hashedPassword) return null;

            const token = jwt.sign(
                {
                    id : user.id,
                    username : user.username
                },
                process.env.NEXTAUTH_SECRET!,
                { expiresIn : "1h"}
            );

            return{
                id : user.id,
                username : user.username,
                token
            }
        },
    })

]