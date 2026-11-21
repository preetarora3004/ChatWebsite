import { SuccessCode } from "@workspace/http";
import type { Response, Request } from "express";
import type { LoginService } from "../../application/service/login-service";

export class UserLoginController {
    constructor(private readonly loginService: LoginService) { }

    public async login(req: Request, res: Response) {
        const { username, password } = req.body;

        const session = await this.loginService.login(username, password);

        res.cookie("sessionToken", session.Token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            expires: new Date(session.expiredAt),
            path: "/",
        });

        return res.status(SuccessCode.OK.statusCode).json({
            success: true,
            body: SuccessCode.OK.code,
        });
    }
}
