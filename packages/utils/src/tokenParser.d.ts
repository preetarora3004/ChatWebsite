import { JWT } from 'next-auth/jwt';
import { NextRequest } from 'next/server';
export declare const convert: (req: NextRequest) => Promise<JWT | Response | null>;
