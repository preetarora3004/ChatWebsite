export declare const signUp: (username: string, password: string) => Promise<Response | {
    ok: boolean;
    url: string;
} | {
    ok: boolean;
    url?: undefined;
} | undefined>;
