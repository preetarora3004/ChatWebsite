import type {
    SessionVerifyResponse,
} from "@workspace/contracts";
import { ApiError, ErrorCode } from "@workspace/http";

export class AuthClient {
    constructor(
        private readonly baseUrl: string = "http://localhost:3000/api/v1/auth",
    ) { }

    public async verifySession(token: string) {
        const res = await fetch(`${this.baseUrl}/verify`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!res.ok) {
            throw new ApiError(
                "Unauthorized access",
                ErrorCode.UNAUTHORIZED.code,
                ErrorCode.UNAUTHORIZED.statusCode,
            );
        }

        const data = (await res.json()) as SessionVerifyResponse;

        return data.userId;
    }
}
