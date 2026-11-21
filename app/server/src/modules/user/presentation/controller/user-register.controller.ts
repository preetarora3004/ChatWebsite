import { SuccessCode } from "@workspace/http";
import type { RegisterAccountService } from "../../application/service/register-service";
import type { Request, Response } from "express";

export class UserRegisterController {
    constructor(private readonly registerUserService: RegisterAccountService) { }

    public async createAccount(req: Request, res: Response) {
        const { username, email, password } = req.body;

        const session = await this.registerUserService.register(
            username,
            email,
            password,
        );

        res.cookie("sessionToken", session.Token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            expires: new Date(session.expiredAt),
        });

        return res.status(SuccessCode.CREATED.statusCode).json({
            success: true,
            body: SuccessCode.CREATED.code,
        });
    }
}
