import { ApiError, ErrorCode } from "@workspace/http";
import { GetDashboardService } from "../../application/service/get-dashboard.service";
import type { Request, Response } from "express";

export class GetDashboardController {
    constructor(private readonly getDashboard: GetDashboardService) { }

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
