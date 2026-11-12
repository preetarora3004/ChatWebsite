import { asyncHandler } from "@workspace/http";
import { authMiddleware } from "./user-middleware";
import { Router } from "express";
import { controller } from "./user-dependency";

const router = Router();

router.get(
    "/dashboard",
    authMiddleware,
    asyncHandler(controller.dashBoard.bind(controller)),
);

export default router;
