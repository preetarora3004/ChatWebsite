import { SuccessCode } from "@workspace/http";
import type { Request, Response } from "express";
import type { RegisterAccountServicePort } from "../../application/interface/inbound/register-service.port";

export class UserRegisterController {
    constructor(private readonly registerUserService: RegisterAccountServicePort) { }

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
