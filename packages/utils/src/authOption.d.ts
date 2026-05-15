import { JWT } from "next-auth/jwt";
export declare const authOption: {
    adapter: {
        createUser?: FutureAdapter | ((user: Omit<import("next-auth/adapters").AdapterUser, "id">) => import("next-auth").Awaitable<import("next-auth/adapters").AdapterUser>);
        getUser?: (id: string) => import("next-auth").Awaitable<import("next-auth/adapters").AdapterUser | null>;
        getUserByEmail?: (email: string) => import("next-auth").Awaitable<import("next-auth/adapters").AdapterUser | null>;
        getUserByAccount?: (providerAccountId: Pick<import("next-auth/adapters").AdapterAccount, "provider" | "providerAccountId">) => import("next-auth").Awaitable<import("next-auth/adapters").AdapterUser | null>;
        updateUser?: (user: Partial<import("next-auth/adapters").AdapterUser> & Pick<import("next-auth/adapters").AdapterUser, "id">) => import("next-auth").Awaitable<import("next-auth/adapters").AdapterUser>;
        deleteUser?: (userId: string) => Promise<void> | import("next-auth").Awaitable<import("next-auth/adapters").AdapterUser | null | undefined>;
        linkAccount?: FutureAdapter | ((account: import("next-auth/adapters").AdapterAccount) => Promise<void> | import("next-auth").Awaitable<import("next-auth/adapters").AdapterAccount | null | undefined>);
        unlinkAccount?: FutureAdapter | ((providerAccountId: Pick<import("next-auth/adapters").AdapterAccount, "provider" | "providerAccountId">) => Promise<void> | import("next-auth").Awaitable<import("next-auth/adapters").AdapterAccount | undefined>);
        createSession?: (session: {
            sessionToken: string;
            userId: string;
            expires: Date;
        }) => import("next-auth").Awaitable<import("next-auth/adapters").AdapterSession>;
        getSessionAndUser?: (sessionToken: string) => import("next-auth").Awaitable<{
            session: import("next-auth/adapters").AdapterSession;
            user: import("next-auth/adapters").AdapterUser;
        } | null>;
        updateSession?: (session: Partial<import("next-auth/adapters").AdapterSession> & Pick<import("next-auth/adapters").AdapterSession, "sessionToken">) => import("next-auth").Awaitable<import("next-auth/adapters").AdapterSession | null | undefined>;
        deleteSession?: (sessionToken: string) => Promise<void> | import("next-auth").Awaitable<import("next-auth/adapters").AdapterSession | null | undefined>;
        createVerificationToken?: (verificationToken: import("next-auth/adapters").VerificationToken) => import("next-auth").Awaitable<import("next-auth/adapters").VerificationToken | null | undefined>;
        useVerificationToken?: (params: {
            identifier: string;
            token: string;
        }) => import("next-auth").Awaitable<import("next-auth/adapters").VerificationToken | null>;
    };
    providers: import("next-auth/providers/credentials").CredentialsConfig<{
        username: {
            label: string;
            type: string;
            placeholder: string;
        };
        password: {
            label: string;
            type: string;
            placeholder: string;
        };
    }>[];
    session: {
        strategy: "jwt";
        maxAge: number;
        updateAge: number;
    };
    jwt: {
        encode: ({ token, secret, maxAge }: import("next-auth/jwt").JWTEncodeParams) => Promise<string>;
        decode: ({ token, secret }: import("next-auth/jwt").JWTDecodeParams) => Promise<JWT | null>;
    };
    callbacks: Partial<import("next-auth").CallbacksOptions<import("next-auth").Profile, import("next-auth").Account>>;
    pages: {
        signIn: string;
    };
    secret: string | undefined;
};
