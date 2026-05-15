import NextAuth from "next-auth";
import {authOption} from '@repo/utils/src/authOption'

const handler = NextAuth(authOption);

export {handler as GET , handler as POST};

