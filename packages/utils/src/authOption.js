import { prismaAdapter } from './prismaAdaptor';
import { providers } from "./provider";
import { callbacks } from "./callback";
import jwt from 'jsonwebtoken';
export const authOption = {
    adapter: prismaAdapter(),
    providers,
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60,
        updateAge: 24 * 60 * 60,
    },
    jwt: {
        encode: async ({ token, secret, maxAge }) => {
            const fullToken = {
                sub: token?.sub,
                accessToken: token?.accessToken ?? "",
                name: token?.name ?? token?.username ?? "User",
                email: token?.email ?? "",
                picture: token?.picture ?? "",
                username: token?.username ?? ""
            };
            return jwt.sign(fullToken, secret, {
                algorithm: "HS256",
                expiresIn: maxAge,
            });
        },
        decode: async ({ token, secret }) => {
            if (!token)
                return null;
            try {
                const decoded = jwt.verify(token, secret);
                return {
                    ...decoded,
                    // @ts-ignore
                    name: decoded.name ?? decoded.username ?? "User",
                    email: decoded.email ?? "",
                    picture: decoded.picture ?? "",
                };
            }
            catch (err) {
                console.error("JWT decode error:", err);
                return null;
            }
        }
    },
    callbacks,
    pages: {
        signIn: "/login",
    },
    secret: process.env.NEXTAUTH_SECRET
};
