import jwt from 'jsonwebtoken'
import { getToken, JWT } from 'next-auth/jwt';
import { NextRequest } from 'next/server';

export const convert = async(req : NextRequest) => {

    try{
        const token = await getToken({req, secret : process.env.NEXTAUTH_SECRET});
        return token;
    }catch(e){
        return Response.json({msg: "error" + e})
    }

}