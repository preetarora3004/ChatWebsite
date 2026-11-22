import { ApiError, ErrorCode } from "@workspace/http";
import type { Request, Response } from "express";
import type { GetDashboardServicePort } from "../../application/interface/inbound/dashboard-service.port";

export class GetDashboardController {
    constructor(private readonly getDashboard: GetDashboardServicePort) { }

    public async dashBoard(req: Request, res: Response) {
        const userId = req.userId;

        if (!userId) {
            throw new ApiError(
                "Unauthorized access",
                ErrorCode.UNAUTHORIZED.code,
                ErrorCode.UNAUTHORIZED.statusCode,
            );
        }

        const dashboard = await this.getDashboard.getDashboard(userId);

        return res.status(200).json({
            success: true,
            body: dashboard,
        });
    }
}
