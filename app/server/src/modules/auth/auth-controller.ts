import { ApiError, ErrorCode, SuccessCode } from "@workspace/http";
import type { AuthService } from "./auth-service";
import type { Response, Request } from "express";
import type { SessionResult } from "@workspace/contracts";

export class AuthController {
    constructor(private readonly service: AuthService) { }

    public async verifySession(req: Request, res: Response) {
        const token = req.headers.authorization?.split(" ")[1];

        console.log(token);

        if (!token) {
            throw new ApiError(
                "Unauthorized access",
                ErrorCode.UNAUTHORIZED.code,
                ErrorCode.UNAUTHORIZED.statusCode,
            );
        }

        console.log("enter");

        const isAuthenticated = await this.service.verifySession(token);

        if (!isAuthenticated) {
            throw new ApiError(
                "Unauthorized access",
                ErrorCode.UNAUTHORIZED.code,
                ErrorCode.UNAUTHORIZED.statusCode,
            );
        }

        console.log("auth passed");

        return res.status(SuccessCode.OK.statusCode).json({
            success: true,
            userId: isAuthenticated,
        });
    }

    public async createAccount(req: Request, res: Response) {
        const { username, email, password } = req.body;

        const token = await this.service.createAccount({
            username: username,
            email: email,
            password: password,
        });

        if (!token || !(token satisfies SessionResult)) {
            throw new ApiError(
                "Unable to generate session",
                ErrorCode.INTERNAL_SERVER_ERROR.code,
                ErrorCode.INTERNAL_SERVER_ERROR.statusCode,
            );
        }

        res.cookie("sessionToken", token.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            expires: token.expiredAt,
        });

        return res.status(SuccessCode.CREATED.statusCode).json({
            success: true,
            body: SuccessCode.CREATED.code,
        });
    }

    public async login(req: Request, res: Response) {
        const { username, password } = req.body;

        console.log("1");

        const token = await this.service.login({
            username: username,
            password: password,
        });

        console.log("15");

        console.log(token);

        if (!token || !(token satisfies SessionResult)) {
            throw new ApiError(
                "Unable to generate session",
                ErrorCode.INTERNAL_SERVER_ERROR.code,
                ErrorCode.INTERNAL_SERVER_ERROR.statusCode,
            );
        }

        console.log("16");
        // console.log(token.expiredAt);
        // try {
        //     res.cookie("sessionToken", token.token, {
        //         httpOnly: true,
        //         secure: process.env.NODE_ENV === "production",
        //         sameSite: "lax",
        //         expires: new Date(String(token.expiredAt)),
        //         path: "/",
        //     });
        //
        //     console.log("17");
        // } catch (error) {
        //     console.error("Cookie serialization failed:", error);
        // }

        res.cookie("sessionToken", token.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            expires: new Date(String(token.expiredAt)),
            path: "/",
        });

        console.log("17");

        return res.status(SuccessCode.OK.statusCode).json({
            success: true,
            body: SuccessCode.OK.code,
        });
    }
}
