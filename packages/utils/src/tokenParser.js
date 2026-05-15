import { getToken } from 'next-auth/jwt';
export const convert = async (req) => {
    try {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        return token;
    }
    catch (e) {
        return Response.json({ msg: "error" + e });
    }
};
