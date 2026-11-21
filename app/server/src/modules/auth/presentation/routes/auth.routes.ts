import { Router } from "express";
import { asyncHandler } from "@workspace/http";
import { sessionVerifyController } from "../../auth-compsition";

const router = Router();

router.get(
    "/verify",
    asyncHandler(
        sessionVerifyController.verifySession.bind(sessionVerifyController),
    ),
);

export default router;
