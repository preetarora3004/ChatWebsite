import { asyncHandler } from "@workspace/http";
import { authMiddleware } from "@workspace/server/auth/presentation/middleware/user-middleware";
import { Router } from "express";
import { userLoginController } from "../../user-composition";
import { userRegisterController } from "../../user-composition";
import { getDashboardController } from "../../user-composition";

const router = Router();

router.post(
    "/register",
    asyncHandler(
        userRegisterController.createAccount.bind(userRegisterController),
    ),
);
router.post(
    "/login",
    asyncHandler(userLoginController.login.bind(userLoginController)),
);

router.get(
    "/dashboard",
    authMiddleware,
    asyncHandler(getDashboardController.dashBoard.bind(getDashboardController)),
);

export default router;
